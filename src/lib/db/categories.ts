import { asc, count, eq, isNull } from "drizzle-orm";

import { db, nowISO } from "@/lib/db";
import { categories, transactions } from "@/lib/db/schema";
import { seedDefaultCategories } from "@/lib/db/seed";

export function listActiveCategories() {
  seedDefaultCategories();
  return db.select().from(categories).where(isNull(categories.deletedAt)).orderBy(asc(categories.name)).all();
}

export function getCategory(id: number) {
  seedDefaultCategories();
  return db.select().from(categories).where(eq(categories.id, id)).get();
}

export function createCategory(input: { name: string; icon: string; color: string }) {
  seedDefaultCategories();
  const result = db.insert(categories).values({ ...input, isDefault: false, createdAt: nowISO() }).run();
  return getCategory(Number(result.lastInsertRowid));
}

export function updateCategory(id: number, input: { name: string; icon: string; color: string }) {
  seedDefaultCategories();
  db.update(categories).set({ ...input, updatedAt: nowISO() }).where(eq(categories.id, id)).run();
  return getCategory(id);
}

export function transactionsCount(categoryId: number) {
  return db.select({ value: count() }).from(transactions).where(eq(transactions.categoryId, categoryId)).get()?.value ?? 0;
}

export function reassignTransactions(fromCategoryId: number, toCategoryId: number) {
  db.update(transactions).set({ categoryId: toCategoryId }).where(eq(transactions.categoryId, fromCategoryId)).run();
}

export function deleteTransactionsByCategory(categoryId: number) {
  db.delete(transactions).where(eq(transactions.categoryId, categoryId)).run();
}

export function softDeleteCategory(id: number) {
  db.update(categories).set({ deletedAt: nowISO() }).where(eq(categories.id, id)).run();
}
