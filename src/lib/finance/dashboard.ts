import { currentMonthKey } from "@/lib/formats";
import { calculateBalancePen, calculateMonthlyTotals } from "@/lib/finance/calculations";
import { countBudgetCategoriesNeedingAttention } from "@/lib/db/budgets";
import { allTransactionsAscending, currentMonthFixedVariableTotals, currentMonthTotals, expenseDistribution, recentTransactions } from "@/lib/db/transactions";

export function getDashboardSummary(month = currentMonthKey()) {
  const allTransactions = allTransactionsAscending();
  const monthly = calculateMonthlyTotals(currentMonthTotals(month));
  const fixedVariable = currentMonthFixedVariableTotals(month);
  return {
    month,
    balance: calculateBalancePen(allTransactions),
    monthlyIncome: monthly.income,
    monthlyExpenses: monthly.expenses,
    fixedExpenses: fixedVariable.fixed,
    variableExpenses: fixedVariable.variable,
    expenseDistribution: expenseDistribution(month),
    latestTransactions: recentTransactions(5),
    budgetAttentionCount: countBudgetCategoriesNeedingAttention(),
  };
}
