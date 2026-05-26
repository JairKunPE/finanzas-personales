import { currentMonthKey } from "@/lib/formats";
import { calculateMonthlyTotals } from "@/lib/finance/calculations";
import { countBudgetCategoriesNeedingAttention } from "@/lib/db/budgets";
import { currentMonthFixedVariableTotals, currentMonthTotals, expenseDistribution, getAllTimeBalance, recentTransactions } from "@/lib/db/transactions";

export async function getDashboardSummary(month = currentMonthKey()) {
  const allTime = await getAllTimeBalance();
  const monthlyTotals = await currentMonthTotals(month);
  const monthly = calculateMonthlyTotals(monthlyTotals);
  const fixedVariable = await currentMonthFixedVariableTotals(month);
  return {
    month,
    balance: allTime.balance,
    monthlyIncome: monthly.income,
    monthlyExpenses: monthly.expenses,
    fixedExpenses: fixedVariable.fixed,
    variableExpenses: fixedVariable.variable,
    expenseDistribution: await expenseDistribution(month),
    latestTransactions: await recentTransactions(5),
    budgetAttentionCount: await countBudgetCategoriesNeedingAttention(),
  };
}
