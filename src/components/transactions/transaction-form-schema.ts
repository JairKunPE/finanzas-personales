import { todayISODate } from "@/lib/formats";
import type { TransactionInput } from "@/lib/validation";
import { transactionInputSchema } from "@/lib/validation";

export { transactionInputSchema };

export const transactionDefaults: TransactionInput = {
  type: "expense",
  amount: 0,
  currency: "PEN",
  exchangeRate: 1,
  description: "",
  categoryId: 0,
  creditCardId: null,
  date: todayISODate(),
  isRecurring: false,
  billingCycle: undefined,
};
