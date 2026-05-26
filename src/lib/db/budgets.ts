import { and, asc, eq, gte, isNull, lte, sql } from "drizzle-orm";

import { db, nowISO } from "@/lib/db";
import { budgets, categories, transactions } from "@/lib/db/schema";
import { seedDefaultCategories } from "@/lib/db/seed";

export type BudgetWithSpent = {
  id: number | null;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  month: string;
  limitAmount: number;
  spent: number;
  status: "safe" | "warning" | "over" | "no-budget";
};

export async function getBudgetForMonth(categoryId: number, month: string) {
  const rows = await db.select().from(budgets).where(and(eq(budgets.categoryId, categoryId), eq(budgets.month, month))).limit(1);
  return rows[0];
}

export async function upsertBudget(categoryId: number, month: string, limitAmount: number) {
  const existing = await getBudgetForMonth(categoryId, month);
  if (existing) {
    await db.update(budgets).set({ limitAmount, updatedAt: nowISO() }).where(eq(budgets.id, existing.id));
    return { ...existing, limitAmount } as const;
  }
  const [budget] = await db.insert(budgets).values({ categoryId, month, limitAmount, createdAt: nowISO() }).returning();
  return budget;
}

export async function ensureMonthBudgets(month: string) {
  const prevMonth = getPreviousMonth(month);
  const prevBudgets = await db.select().from(budgets).where(eq(budgets.month, prevMonth));
  for (const b of prevBudgets) {
    const existing = await getBudgetForMonth(b.categoryId, month);
    if (!existing) {
      await db.insert(budgets).values({ categoryId: b.categoryId, month, limitAmount: b.limitAmount, createdAt: nowISO() });
    }
  }
}

function getPreviousMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function listBudgetsWithSpent(month: string) {
  await seedDefaultCategories();
  await ensureMonthBudgets(month);

  const start = `${month}-01`;
  const end = `${month}-31`;

  const spentSubquery = db
    .select({
      categoryId: transactions.categoryId,
      total: sql<number>`coalesce(sum(${transactions.amountPen}), 0)`.as("total"),
    })
    .from(transactions)
    .where(and(eq(transactions.type, "expense"), gte(transactions.date, start), lte(transactions.date, end)))
    .groupBy(transactions.categoryId)
    .as("spent");

  const rows = await db
    .select({
      budgetId: budgets.id,
      categoryId: categories.id,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
      limitAmount: sql<number>`coalesce(${budgets.limitAmount}, 0)`,
      spent: sql<number>`coalesce(${spentSubquery.total}, 0)`,
    })
    .from(categories)
    .leftJoin(budgets, and(eq(categories.id, budgets.categoryId), eq(budgets.month, month)))
    .leftJoin(spentSubquery, eq(categories.id, spentSubquery.categoryId))
    .where(isNull(categories.deletedAt))
    .orderBy(asc(categories.name));

  return rows.map((row) => {
    let status: BudgetWithSpent["status"] = "no-budget";
    if (row.budgetId !== null) {
      if (row.spent >= row.limitAmount) status = "over";
      else if (row.spent >= row.limitAmount * 0.8) status = "warning";
      else status = "safe";
    }
    return {
      id: row.budgetId,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      categoryIcon: row.categoryIcon,
      categoryColor: row.categoryColor,
      month,
      limitAmount: row.limitAmount,
      spent: row.spent,
      status,
    };
  });
}

export async function countBudgetCategoriesNeedingAttention() {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const budgetsWithSpent = await listBudgetsWithSpent(month);
  return budgetsWithSpent.filter((b) => b.status === "warning" || b.status === "over").length;
}
