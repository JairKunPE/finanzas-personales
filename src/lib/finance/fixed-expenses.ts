import { addMonths, differenceInCalendarDays, format, parseISO } from "date-fns";

export type BillingCycle = "monthly" | "quarterly" | "semiannual" | "annual";

export const billingCycleLabels: Record<BillingCycle, string> = {
  monthly: "Mensual",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  annual: "Anual",
};

export function billingCycleMonths(cycle: BillingCycle) {
  return { monthly: 1, quarterly: 3, semiannual: 6, annual: 12 }[cycle];
}

export function calculateMonthlyEquivalent(amountPen: number, cycle: BillingCycle) {
  return amountPen / billingCycleMonths(cycle);
}

export function calculateNextBillingDate(lastPaymentDate: string, cycle: BillingCycle) {
  return format(addMonths(parseISO(lastPaymentDate), billingCycleMonths(cycle)), "yyyy-MM-dd");
}

export function isDueSoon(nextBillingDate: string, today = new Date()) {
  const days = differenceInCalendarDays(parseISO(nextBillingDate), today);
  return days >= 0 && days <= 7;
}

export function cycleProgress(lastPaymentDate: string, nextBillingDate: string, today = new Date()) {
  const start = parseISO(lastPaymentDate);
  const end = parseISO(nextBillingDate);
  const total = Math.max(1, differenceInCalendarDays(end, start));
  const elapsed = Math.min(total, Math.max(0, differenceInCalendarDays(today, start)));
  return Math.round((elapsed / total) * 100);
}
