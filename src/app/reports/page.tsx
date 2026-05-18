"use client";

import { useState } from "react";

import { IncomeExpenseLineChart } from "@/components/charts/income-expense-line-chart";
import { CategoryBreakdown } from "@/components/reports/category-breakdown";
import { FixedVsVariableChart } from "@/components/reports/fixed-variable-chart";
import { MonthlyBalanceTable } from "@/components/reports/monthly-balance";
import { ReportSummaryCards } from "@/components/reports/summary-cards";
import { TopCategories } from "@/components/reports/top-categories";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { useFullReport } from "@/lib/api/reports";

const periodOptions = [
  { value: "monthly", label: "Mensual" },
  { value: "quarterly", label: "Trimestral" },
  { value: "semiannual", label: "Semestral" },
  { value: "annual", label: "Anual" },
] as const;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1).padStart(2, "0"), label: new Date(0, i).toLocaleDateString("es", { month: "long" }) }));

export default function ReportsPage() {
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(String(currentYear));
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7).split("-")[1]);

  const { data, error, isLoading } = useFullReport(period, year, period === "monthly" ? month : undefined);

  function handleExport() {
    const params = new URLSearchParams({ period, year });
    if (period === "monthly") params.set("month", month);
    window.open(`/api/reports/export?${params.toString()}`, "_blank");
  }

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reportes y Estadisticas</h1>
          <p className="text-sm text-muted-foreground">Analiza tus finanzas por periodo</p>
        </div>
        <Button type="button" variant="secondary" onClick={handleExport}>Exportar Reporte como CSV</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          className="min-h-10 rounded-xl border bg-background px-3 text-sm"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          {periodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          className="min-h-10 rounded-xl border bg-background px-3 text-sm"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {period === "monthly" ? (
          <select
            className="min-h-10 rounded-xl border bg-background px-3 text-sm capitalize"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        ) : null}
      </div>

      {data ? (
        <>
          <ReportSummaryCards summary={data.summary} />

          <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <IncomeExpenseLineChart data={data.evolution} />
            <FixedVsVariableChart data={data.fixedVariable} />
          </div>

          <CategoryBreakdown data={data.breakdown} />

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <TopCategories data={data.topCategories} />
            <MonthlyBalanceTable data={data.monthlyBalance} />
          </div>
        </>
      ) : null}
    </div>
  );
}
