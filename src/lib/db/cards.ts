import { count, eq, isNull } from "drizzle-orm";

import { db, nowISO } from "@/lib/db";
import { creditCards, transactions } from "@/lib/db/schema";

export async function listActiveCards() {
  return db.select().from(creditCards).where(isNull(creditCards.deletedAt)).orderBy(creditCards.name);
}

export async function getCard(id: number) {
  const rows = await db.select().from(creditCards).where(eq(creditCards.id, id)).limit(1);
  return rows[0];
}

export async function createCard(input: { name: string; limitAmount: number; statementDay: number; paymentDay: number; color: string }) {
  const [card] = await db.insert(creditCards).values({ ...input, createdAt: nowISO() }).returning();
  return card;
}

export async function updateCard(id: number, input: { name: string; limitAmount: number; statementDay: number; paymentDay: number; color: string }) {
  const [card] = await db.update(creditCards).set({ ...input, updatedAt: nowISO() }).where(eq(creditCards.id, id)).returning();
  return card;
}

export async function softDeleteCard(id: number) {
  await db.update(creditCards).set({ deletedAt: nowISO() }).where(eq(creditCards.id, id));
}

export async function transactionsCountForCard(creditCardId: number) {
  const rows = await db.select({ value: count() }).from(transactions).where(eq(transactions.creditCardId, creditCardId)).limit(1);
  return rows[0]?.value ?? 0;
}

export async function unlinkTransactionsForCard(creditCardId: number) {
  await db.update(transactions).set({ creditCardId: null }).where(eq(transactions.creditCardId, creditCardId));
}
