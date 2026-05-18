import { asc, count, eq, isNull } from "drizzle-orm";

import { db, nowISO } from "@/lib/db";
import { categories, transactions } from "@/lib/db/schema";
import { seedDefaultCategories } from "@/lib/db/seed";

export async function listActiveCategories() {
  await seedDefaultCategories();
  return db.select().from(categories).where(isNull(categories.deletedAt)).orderBy(asc(categories.name));
}

export async function getCategory(id: number) {
  await seedDefaultCategories();
  const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return rows[0];
}

export async function createCategory(input: { name: string; icon: string; color: string }) {
  await seedDefaultCategories();
  const [cat] = await db.insert(categories).values({ ...input, isDefault: false, createdAt: nowISO() }).returning();
  return cat;
}

export async function updateCategory(id: number, input: { name: string; icon: string; color: string }) {
  await seedDefaultCategories();
  const [cat] = await db.update(categories).set({ ...input, updatedAt: nowISO() }).where(eq(categories.id, id)).returning();
  return cat;
}

export async function transactionsCount(categoryId: number) {
  const rows = await db.select({ value: count() }).from(transactions).where(eq(transactions.categoryId, categoryId)).limit(1);
  return rows[0]?.value ?? 0;
}

export async function reassignTransactions(fromCategoryId: number, toCategoryId: number) {
  await db.update(transactions).set({ categoryId: toCategoryId }).where(eq(transactions.categoryId, fromCategoryId));
}

export async function deleteTransactionsByCategory(categoryId: number) {
  await db.delete(transactions).where(eq(transactions.categoryId, categoryId));
}

export async function softDeleteCategory(id: number) {
  await db.update(categories).set({ deletedAt: nowISO() }).where(eq(categories.id, id));
}
