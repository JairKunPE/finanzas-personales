import { getDashboardSummary } from "@/lib/finance/dashboard";
import { listBudgetsWithSpent } from "@/lib/db/budgets";
import { currentMonthKey } from "@/lib/formats";

import { HeroCard } from "@/components/dashboard/hero-card";
import { FlowSummary } from "@/components/dashboard/flow-summary";
import { SavingsGoals } from "@/components/dashboard/savings-goals";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";

export const revalidate = 60;

export default async function DashboardPage() {
  const month = currentMonthKey();
  const summary = await getDashboardSummary(month);
  const budgets = await listBudgetsWithSpent(month);

  return (
    <div className="space-y-5">
      <HeroCard balance={summary.balance} />
      <FlowSummary income={summary.monthlyIncome} expenses={summary.monthlyExpenses} />
      <SavingsGoals budgets={budgets} />
      <RecentTransactions transactions={summary.latestTransactions} />
    </div>
  );
}
