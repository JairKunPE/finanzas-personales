import type { TransactionRow } from "@/lib/db/transactions";

export function calculateMonthlyTotals(totals: Array<{ type: "income" | "expense"; total: number }>) {
  const income = totals.find((item) => item.type === "income")?.total ?? 0;
  const expenses = totals.find((item) => item.type === "expense")?.total ?? 0;
  return { income, expenses, balance: income - expenses };
}

export function normalizeTransactionAmount(transaction: Pick<TransactionRow, "type" | "amount">) {
  return transaction.type === "income" ? transaction.amount : -transaction.amount;
}
