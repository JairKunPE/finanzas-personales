import useSWR from "swr";

import type { TransactionDto } from "@/lib/api/transactions";
import type { BillingCycle } from "@/lib/finance/fixed-expenses";

export type FixedExpenseDto = TransactionDto & {
  billingCycle: BillingCycle;
  nextBillingDate: string;
  monthlyEquivalentPen: number;
  dueSoon: boolean;
  cycleProgress: number;
  group: "Servicios" | "Suscripciones digitales" | "Otros";
};

export type FixedExpensesResponse = {
  items: FixedExpenseDto[];
  totalMonthlyPen: number;
  dueSoonCount: number;
};

export function useFixedExpenses() {
  return useSWR<FixedExpensesResponse>("/api/fixed-expenses");
}
