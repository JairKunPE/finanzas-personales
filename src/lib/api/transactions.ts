import useSWR, { mutate } from "swr";

import { sendJson } from "@/lib/api/fetcher";
import type { TransactionInput } from "@/lib/validation";

export type TransactionDto = Omit<TransactionInput, "billingCycle"> & {
  id: number;
  originalAmount: number;
  currency: "PEN" | "USD";
  exchangeRate: number;
  amountPen: number;
  isRecurring: boolean;
  billingCycle?: "monthly" | "quarterly" | "semiannual" | "annual" | null;
  nextBillingDate?: string | null;
  creditCardId?: number | null;
  createdAt: string;
  updatedAt: string | null;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
};

export type TransactionPageDto = {
  items: TransactionDto[];
  page: number;
  pageSize: number;
  total: number;
};

export function useTransactions(query: string) {
  return useSWR<TransactionPageDto>(`/api/transactions${query}`);
}

export function useTransaction(id?: string) {
  return useSWR<TransactionDto>(id ? `/api/transactions/${id}` : null);
}

export async function createTransaction(input: TransactionInput) {
  const result = await sendJson<TransactionDto>("/api/transactions", "POST", input);
  await mutate((key) => typeof key === "string" && (key.startsWith("/api/transactions") || key === "/api/dashboard"));
  return result;
}

export async function updateTransaction(id: number, input: TransactionInput) {
  const result = await sendJson<TransactionDto>(`/api/transactions/${id}`, "PATCH", input);
  await mutate((key) => typeof key === "string" && (key.startsWith("/api/transactions") || key === "/api/dashboard"));
  return result;
}

export async function removeTransaction(id: number) {
  await sendJson<void>(`/api/transactions/${id}`, "DELETE", null);
  await mutate((key) => typeof key === "string" && (key.startsWith("/api/transactions") || key === "/api/dashboard"));
}
