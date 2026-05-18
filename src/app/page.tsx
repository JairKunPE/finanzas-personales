import Link from "next/link";
import { Suspense } from "react";

import { BudgetStatusIndicator } from "@/components/dashboard/budget-status-indicator";
import { DashboardMonthSelector } from "@/components/dashboard/dashboard-month-selector";
import { FixedVariableIndicator } from "@/components/dashboard/fixed-variable-indicator";
import { LatestTransactions } from "@/components/dashboard/latest-transactions";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseDonutChart } from "@/components/charts/expense-donut-chart";
import { Button } from "@/components/ui/button";
import { getDashboardSummary } from "@/lib/finance/dashboard";
import { currentMonthKey } from "@/lib/formats";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const selectedMonth = params.month ?? currentMonthKey();
  const summary = await getDashboardSummary(selectedMonth);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Resumen local de tu salud financiera.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <Suspense fallback={null}>
            <DashboardMonthSelector selectedMonth={selectedMonth} />
          </Suspense>
          <Link href="/transactions/new"><Button>Registrar movimiento</Button></Link>
        </div>
      </div>
      <SummaryCards balance={summary.balance} monthlyIncome={summary.monthlyIncome} monthlyExpenses={summary.monthlyExpenses} />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ExpenseDonutChart data={summary.expenseDistribution} />
        <div className="grid content-start gap-4">
          <BudgetStatusIndicator count={summary.budgetAttentionCount} />
          <FixedVariableIndicator fixedExpenses={summary.fixedExpenses} variableExpenses={summary.variableExpenses} />
          <LatestTransactions transactions={summary.latestTransactions} />
        </div>
      </div>
    </div>
  );
}
