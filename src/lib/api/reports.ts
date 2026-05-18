import useSWR from "swr";

export type ReportSummaryDto = {
  range: { startDate: string; endDate: string; prevStartDate: string; prevEndDate: string };
  current: { income: number; expenses: number; balance: number };
  previous: { income: number; expenses: number; balance: number };
  savingsRate: number;
  incomeChange: number;
  expenseChange: number;
};

export type MonthlyEvolutionDto = Array<{ month: string; income: number; expenses: number }>;
export type CategoryBreakdownItem = { categoryId: number; categoryName: string; categoryIcon: string; categoryColor: string; total: number; percentage: number };
export type FixedVsVariableDto = { fixed: number; variable: number };
export type MonthlyBalanceItem = { month: string; income: number; expenses: number; balance: number; savingsRate: number };

export type FullReportDto = {
  summary: ReportSummaryDto;
  evolution: MonthlyEvolutionDto;
  breakdown: CategoryBreakdownItem[];
  topCategories: CategoryBreakdownItem[];
  fixedVariable: FixedVsVariableDto;
  monthlyBalance: MonthlyBalanceItem[];
};

export function useFullReport(period: string, year: string, month?: string) {
  const params = new URLSearchParams({ period, year });
  if (month) params.set("month", month);
  return useSWR<FullReportDto>(`/api/reports/summary?${params.toString()}`);
}
