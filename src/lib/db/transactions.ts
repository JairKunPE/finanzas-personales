import { and, asc, count, desc, eq, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db, nowISO } from "@/lib/db";
import { categories, transactions } from "@/lib/db/schema";
import { convertToPen } from "@/lib/db/settings";
import { calculateMonthlyEquivalent, calculateNextBillingDate, cycleProgress, isDueSoon, type BillingCycle } from "@/lib/finance/fixed-expenses";
import type { TransactionInput, TransactionQuery } from "@/lib/validation";

export type TransactionRow = typeof transactions.$inferSelect & {
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
};

function resolvePeriod(query: Partial<TransactionQuery>) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const iso = (date: Date) => date.toISOString().slice(0, 10);

  if (query.period === "current-month") {
    return { from: iso(new Date(year, month, 1)), to: iso(new Date(year, month + 1, 0)) };
  }
  if (query.period === "previous-month") {
    return { from: iso(new Date(year, month - 1, 1)), to: iso(new Date(year, month, 0)) };
  }
  if (query.period === "last-3-months") {
    return { from: iso(new Date(year, month - 2, 1)), to: iso(new Date(year, month + 1, 0)) };
  }
  if (query.period === "last-year") {
    return { from: iso(new Date(year - 1, month, now.getDate())), to: iso(now) };
  }
  if (query.year && query.month) {
    const monthIndex = Number(query.month) - 1;
    return { from: iso(new Date(Number(query.year), monthIndex, 1)), to: iso(new Date(Number(query.year), monthIndex + 1, 0)) };
  }
  return { from: query.from, to: query.to };
}

function filters(query: Partial<TransactionQuery>) {
  const period = resolvePeriod(query);
  return and(
    query.type ? eq(transactions.type, query.type) : undefined,
    query.categoryId ? eq(transactions.categoryId, query.categoryId) : undefined,
    period.from ? gte(transactions.date, period.from) : undefined,
    period.to ? lte(transactions.date, period.to) : undefined,
  );
}

export function listTransactions(query: TransactionQuery) {
  const where = filters(query);
  const offset = (query.page - 1) * query.pageSize;
  const items = db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      originalAmount: transactions.originalAmount,
      currency: transactions.currency,
      exchangeRate: transactions.exchangeRate,
      amountPen: transactions.amountPen,
      description: transactions.description,
      categoryId: transactions.categoryId,
      date: transactions.date,
      isRecurring: transactions.isRecurring,
      billingCycle: transactions.billingCycle,
      nextBillingDate: transactions.nextBillingDate,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(where)
    .orderBy(desc(transactions.date), desc(transactions.id))
    .limit(query.pageSize)
    .offset(offset)
    .all();

  const total = db.select({ value: count() }).from(transactions).where(where).get()?.value ?? 0;
  return { items, page: query.page, pageSize: query.pageSize, total };
}

export function getTransaction(id: number) {
  return db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      originalAmount: transactions.originalAmount,
      currency: transactions.currency,
      exchangeRate: transactions.exchangeRate,
      amountPen: transactions.amountPen,
      description: transactions.description,
      categoryId: transactions.categoryId,
      date: transactions.date,
      isRecurring: transactions.isRecurring,
      billingCycle: transactions.billingCycle,
      nextBillingDate: transactions.nextBillingDate,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.id, id))
    .get();
}

export function createTransaction(input: TransactionInput) {
  const exchangeRate = input.currency === "USD" ? (input.exchangeRate ?? 1) : 1;
  const amountPen = convertToPen(input.amount, input.currency, exchangeRate);
  const nextBillingDate = input.isRecurring && input.billingCycle ? calculateNextBillingDate(input.date, input.billingCycle) : null;
  const result = db.insert(transactions).values({ ...input, originalAmount: input.amount, exchangeRate, amountPen, nextBillingDate, createdAt: nowISO() }).run();
  return getTransaction(Number(result.lastInsertRowid));
}

export function updateTransaction(id: number, input: TransactionInput) {
  const exchangeRate = input.currency === "USD" ? (input.exchangeRate ?? 1) : 1;
  const amountPen = convertToPen(input.amount, input.currency, exchangeRate);
  const nextBillingDate = input.isRecurring && input.billingCycle ? calculateNextBillingDate(input.date, input.billingCycle) : null;
  db.update(transactions).set({ ...input, originalAmount: input.amount, exchangeRate, amountPen, nextBillingDate, updatedAt: nowISO() }).where(eq(transactions.id, id)).run();
  return getTransaction(id);
}

export function deleteTransaction(id: number) {
  return db.delete(transactions).where(eq(transactions.id, id)).run().changes > 0;
}

export function recentTransactions(limit = 5) {
  return db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      originalAmount: transactions.originalAmount,
      currency: transactions.currency,
      exchangeRate: transactions.exchangeRate,
      amountPen: transactions.amountPen,
      description: transactions.description,
      categoryId: transactions.categoryId,
      date: transactions.date,
      isRecurring: transactions.isRecurring,
      billingCycle: transactions.billingCycle,
      nextBillingDate: transactions.nextBillingDate,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .orderBy(desc(transactions.date), desc(transactions.id))
    .limit(limit)
    .all();
}

export function allTransactionsAscending() {
  return db.select().from(transactions).orderBy(asc(transactions.date)).all();
}

export function allTransactionsWithCategories() {
  return db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      originalAmount: transactions.originalAmount,
      currency: transactions.currency,
      exchangeRate: transactions.exchangeRate,
      amountPen: transactions.amountPen,
      description: transactions.description,
      categoryId: transactions.categoryId,
      date: transactions.date,
      isRecurring: transactions.isRecurring,
      billingCycle: transactions.billingCycle,
      nextBillingDate: transactions.nextBillingDate,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .orderBy(asc(transactions.date))
    .all();
}

export function listFixedExpenses() {
  const rows = db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      originalAmount: transactions.originalAmount,
      currency: transactions.currency,
      exchangeRate: transactions.exchangeRate,
      amountPen: transactions.amountPen,
      description: transactions.description,
      categoryId: transactions.categoryId,
      date: transactions.date,
      isRecurring: transactions.isRecurring,
      billingCycle: transactions.billingCycle,
      nextBillingDate: transactions.nextBillingDate,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(eq(transactions.type, "expense"), eq(transactions.isRecurring, true), isNotNull(transactions.billingCycle)))
    .orderBy(asc(transactions.nextBillingDate), asc(transactions.description))
    .all();

  const items = rows.map((row) => {
    const billingCycle = row.billingCycle as BillingCycle;
    const nextBillingDate = row.nextBillingDate ?? calculateNextBillingDate(row.date, billingCycle);
    return {
      ...row,
      billingCycle,
      nextBillingDate,
      monthlyEquivalentPen: calculateMonthlyEquivalent(row.amountPen, billingCycle),
      dueSoon: isDueSoon(nextBillingDate),
      cycleProgress: cycleProgress(row.date, nextBillingDate),
      group: categorizeFixedExpense(row.categoryName, row.description),
    };
  });

  const totalMonthlyPen = items.reduce((total, item) => total + item.monthlyEquivalentPen, 0);
  const dueSoonCount = items.filter((item) => item.dueSoon).length;
  return { items, totalMonthlyPen, dueSoonCount };
}

function categorizeFixedExpense(categoryName: string, description: string): "Servicios" | "Suscripciones digitales" | "Otros" {
  const text = `${categoryName} ${description}`.toLowerCase();
  if (text.includes("netflix") || text.includes("spotify") || text.includes("prime") || text.includes("disney")) return "Suscripciones digitales";
  if (text.includes("servicio") || text.includes("internet") || text.includes("luz") || text.includes("agua") || categoryName === "Servicios") return "Servicios";
  return "Otros";
}

export function currentMonthTotals(month: string) {
  const start = `${month}-01`;
  const end = `${month}-31`;
  return db
    .select({ type: transactions.type, total: sql<number>`coalesce(sum(${transactions.amountPen}), 0)` })
    .from(transactions)
    .where(and(gte(transactions.date, start), lte(transactions.date, end)))
    .groupBy(transactions.type)
    .all();
}

export function currentMonthFixedVariableTotals(month: string) {
  const start = `${month}-01`;
  const end = `${month}-31`;
  const rows = db
    .select({ isRecurring: transactions.isRecurring, total: sql<number>`coalesce(sum(${transactions.amountPen}), 0)` })
    .from(transactions)
    .where(and(eq(transactions.type, "expense"), gte(transactions.date, start), lte(transactions.date, end)))
    .groupBy(transactions.isRecurring)
    .all();
  return {
    fixed: rows.find((row) => row.isRecurring)?.total ?? 0,
    variable: rows.find((row) => !row.isRecurring)?.total ?? 0,
  };
}

export function expenseDistribution(month: string) {
  const start = `${month}-01`;
  const end = `${month}-31`;
  return db
    .select({ categoryName: categories.name, categoryColor: categories.color, total: sql<number>`coalesce(sum(${transactions.amountPen}), 0)` })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(eq(transactions.type, "expense"), gte(transactions.date, start), lte(transactions.date, end)))
    .groupBy(categories.id)
    .all();
}
