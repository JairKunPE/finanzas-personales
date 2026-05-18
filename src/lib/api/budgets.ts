import useSWR, { mutate } from "swr";

import { sendJson } from "@/lib/api/fetcher";

export type BudgetWithSpentDto = {
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

export function useBudgets(month: string) {
  return useSWR<BudgetWithSpentDto[]>(`/api/budgets?month=${month}`);
}

export async function upsertBudget(categoryId: number, month: string, limitAmount: number) {
  const result = await sendJson<BudgetWithSpentDto>("/api/budgets", "POST", { categoryId, month, limitAmount });
  await mutate((key) => typeof key === "string" && (key.startsWith("/api/budgets") || key === "/api/dashboard"));
  return result;
}
