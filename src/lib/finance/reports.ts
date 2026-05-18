import { and, asc, eq, gte, lte, sql } from "drizzle-orm";
import { addMonths, endOfMonth, format as dateFnsFormat, startOfMonth, subMonths } from "date-fns";

import { db } from "@/lib/db";
import { categories, transactions } from "@/lib/db/schema";
import { seedDefaultCategories } from "@/lib/db/seed";

export type PeriodType = "monthly" | "quarterly" | "semiannual" | "annual";

export type PeriodRange = {
  startDate: string;
  endDate: string;
  prevStartDate: string;
  prevEndDate: string;
};

export function getPeriodRange(period: PeriodType, year: number, month?: number): PeriodRange {
  let start: Date;
  let end: Date;

  if (period === "monthly") {
    start = startOfMonth(new Date(year, (month ?? 1) - 1, 1));
    end = endOfMonth(start);
  } else {
    const monthsCount = { quarterly: 3, semiannual: 6, annual: 12 }[period];
    const endMonth = month ?? 12;
    end = endOfMonth(new Date(year, endMonth - 1, 1));
    start = startOfMonth(addMonths(end, -(monthsCount - 1)));
  }

  const prevEnd = subMonths(start, 1);
  const durationMs = end.getTime() - start.getTime();
  const prevStart = new Date(prevEnd.getTime() - durationMs);

  const fmt = (d: Date) => dateFnsFormat(d, "yyyy-MM-dd");

  return {
    startDate: fmt(start),
    endDate: fmt(end),
    prevStartDate: fmt(prevStart),
    prevEndDate: fmt(prevEnd),
  };
}

function periodTotals(startDate: string, endDate: string) {
  const rows = db
    .select({ type: transactions.type, total: sql<number>`coalesce(sum(${transactions.amountPen}), 0)` })
    .from(transactions)
    .where(and(gte(transactions.date, startDate), lte(transactions.date, endDate)))
    .groupBy(transactions.type)
    .all();
  const income = rows.find((r) => r.type === "income")?.total ?? 0;
  const expenses = rows.find((r) => r.type === "expense")?.total ?? 0;
  return { income, expenses, balance: income - expenses };
}

export function getReportSummary(period: PeriodType, year: number, month?: number) {
  const range = getPeriodRange(period, year, month);
  const current = periodTotals(range.startDate, range.endDate);
  const previous = periodTotals(range.prevStartDate, range.prevEndDate);

  const savingsRate = current.income > 0 ? (current.balance / current.income) * 100 : 0;
  const incomeChange = previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : 0;
  const expenseChange = previous.expenses > 0 ? ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0;

  return {
    range,
    current,
    previous,
    savingsRate: Math.round(savingsRate * 100) / 100,
    incomeChange: Math.round(incomeChange * 100) / 100,
    expenseChange: Math.round(expenseChange * 100) / 100,
  };
}

export function getMonthlyEvolution(startDate: string, endDate: string) {
  const rows = db
    .select({
      date: transactions.date,
      type: transactions.type,
      amountPen: transactions.amountPen,
    })
    .from(transactions)
    .where(and(gte(transactions.date, startDate), lte(transactions.date, endDate)))
    .orderBy(asc(transactions.date))
    .all();

  const monthMap = new Map<string, { income: number; expenses: number }>();

  for (const row of rows) {
    const monthKey = row.date.slice(0, 7);
    const entry = monthMap.get(monthKey) ?? { income: 0, expenses: 0 };
    if (row.type === "income") entry.income += row.amountPen;
    else entry.expenses += row.amountPen;
    monthMap.set(monthKey, entry);
  }

  let cursor = startDate.slice(0, 7);
  const endKey = endDate.slice(0, 7);
  const result: Array<{ month: string; income: number; expenses: number }> = [];

  while (cursor <= endKey) {
    const entry = monthMap.get(cursor) ?? { income: 0, expenses: 0 };
    result.push({ month: cursor, ...entry });
    const [y, m] = cursor.split("-").map(Number);
    const next = new Date(y, m, 1);
    cursor = dateFnsFormat(addMonths(next, 1), "yyyy-MM");
  }

  return result;
}

export function getCategoryBreakdown(startDate: string, endDate: string) {
  seedDefaultCategories();
  const rows = db
    .select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
      total: sql<number>`coalesce(sum(${transactions.amountPen}), 0)`,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(eq(transactions.type, "expense"), gte(transactions.date, startDate), lte(transactions.date, endDate)))
    .groupBy(transactions.categoryId)
    .orderBy(sql`coalesce(sum(${transactions.amountPen}), 0) desc`)
    .all();

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);
  return rows.map((r) => ({
    ...r,
    percentage: grandTotal > 0 ? Math.round((r.total / grandTotal) * 10000) / 100 : 0,
  }));
}

export function getTopCategories(startDate: string, endDate: string) {
  return getCategoryBreakdown(startDate, endDate).slice(0, 5);
}

export function getFixedVsVariable(startDate: string, endDate: string) {
  const rows = db
    .select({
      isRecurring: transactions.isRecurring,
      total: sql<number>`coalesce(sum(${transactions.amountPen}), 0)`,
    })
    .from(transactions)
    .where(and(eq(transactions.type, "expense"), gte(transactions.date, startDate), lte(transactions.date, endDate)))
    .groupBy(transactions.isRecurring)
    .all();
  return {
    fixed: rows.find((r) => r.isRecurring)?.total ?? 0,
    variable: rows.find((r) => !r.isRecurring)?.total ?? 0,
  };
}

export function getMonthlyBalance(startDate: string, endDate: string) {
  const evolution = getMonthlyEvolution(startDate, endDate);
  return evolution.map((m) => ({
    month: m.month,
    income: m.income,
    expenses: m.expenses,
    balance: m.income - m.expenses,
    savingsRate: m.income > 0 ? Math.round(((m.income - m.expenses) / m.income) * 10000) / 100 : 0,
  }));
}

export function generateReportCsv(period: PeriodType, year: number, month?: number) {
  const range = getPeriodRange(period, year, month);
  const monthlyBalance = getMonthlyBalance(range.startDate, range.endDate);
  const breakdown = getCategoryBreakdown(range.startDate, range.endDate);
  const summary = getReportSummary(period, year, month);
  const fixedVariable = getFixedVsVariable(range.startDate, range.endDate);

  const lines: string[] = [];

  lines.push("--- RESUMEN DEL PERIODO ---");
  lines.push(`"Periodo","${range.startDate} a ${range.endDate}"`);
  lines.push(`"Ingresos","${summary.current.income}"`);
  lines.push(`"Gastos","${summary.current.expenses}"`);
  lines.push(`"Balance","${summary.current.balance}"`);
  lines.push(`"% Ahorro","${summary.savingsRate}%"`);
  lines.push(`"Cambio Ingresos","${summary.incomeChange}%"`);
  lines.push(`"Cambio Gastos","${summary.expenseChange}%"`);
  lines.push("");

  lines.push("--- GASTOS FIJOS VS VARIABLES ---");
  lines.push(`"Fijos","${fixedVariable.fixed}"`);
  lines.push(`"Variables","${fixedVariable.variable}"`);
  lines.push("");

  lines.push("--- BALANCE MENSUAL ---");
  lines.push("Mes,Ingresos,Gastos,Balance,% Ahorro");
  for (const m of monthlyBalance) {
    lines.push(`"${m.month}",${m.income},${m.expenses},${m.balance},${m.savingsRate}`);
  }
  lines.push("");

  lines.push("--- GASTOS POR CATEGORIA ---");
  lines.push("Categoria,Total,Porcentaje");
  for (const c of breakdown) {
    lines.push(`"${c.categoryName}",${c.total},${c.percentage}%`);
  }

  return lines.join("\n");
}
