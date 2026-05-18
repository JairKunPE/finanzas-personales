"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formats";
import type { ReportSummaryDto } from "@/lib/api/reports";

export function ReportSummaryCards({ summary }: { summary: ReportSummaryDto }) {
  const { current, previous, savingsRate, incomeChange, expenseChange } = summary;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <p className="text-sm text-muted-foreground">Ingresos</p>
        <p className="mt-1 text-2xl font-bold text-income">{formatCurrency(current.income)}</p>
        <ComparisonBadge change={incomeChange} inverse={false} />
      </Card>
      <Card>
        <p className="text-sm text-muted-foreground">Gastos</p>
        <p className="mt-1 text-2xl font-bold text-expense">{formatCurrency(current.expenses)}</p>
        <ComparisonBadge change={expenseChange} inverse={true} />
      </Card>
      <Card>
        <p className="text-sm text-muted-foreground">Balance</p>
        <p className={`mt-1 text-2xl font-bold ${current.balance >= 0 ? "text-income" : "text-expense"}`}>
          {formatCurrency(current.balance)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {savingsRate >= 0 ? "Ahorro:" : "Perdida:"} {Math.abs(savingsRate).toFixed(1)}%
        </p>
      </Card>
      <Card>
        <p className="text-sm text-muted-foreground">Periodo anterior</p>
        <p className="mt-1 text-lg font-semibold">{formatCurrency(previous.balance)}</p>
        <p className="text-xs text-muted-foreground">
          I: {formatCurrency(previous.income)} / G: {formatCurrency(previous.expenses)}
        </p>
      </Card>
    </div>
  );
}

function ComparisonBadge({ change, inverse }: { change: number; inverse: boolean }) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const good = inverse ? !isPositive : isPositive;
  const color = good ? "text-income" : "text-expense";
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : null;

  if (change === 0) return <p className="mt-1 text-xs text-muted-foreground">Sin cambios</p>;

  return (
    <p className={`mt-1 flex items-center gap-1 text-xs ${color}`}>
      {Icon ? <Icon className="h-3 w-3" /> : null}
      {Math.abs(change).toFixed(1)}% respecto al periodo anterior
    </p>
  );
}
