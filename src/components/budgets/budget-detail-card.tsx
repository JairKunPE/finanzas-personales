"use client";

import * as LucideIcons from "lucide-react";

import { RingProgress } from "@/components/budgets/ring-progress";
import { MonthlyBars } from "@/components/budgets/monthly-bars";
import { formatCurrency } from "@/lib/formats";
import type { BudgetWithSpentDto } from "@/lib/api/budgets";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;

type BudgetDetailCardProps = {
  budget: BudgetWithSpentDto;
  onSetBudget: () => void;
  currentMonthIndex: number;
  prevSpent?: number;
};

function progressColor(status: string) {
  if (status === "over") return "#E84545";
  if (status === "warning") return "#F5A623";
  return "#00C2A8";
}

function computeChange(current: number, previous: number): string | null {
  if (previous <= 0) return null;
  const pct = Math.round(Math.abs((current - previous) / previous) * 100);
  if (pct === 0) return "Sin cambio vs mes pasado";
  const dir = current > previous ? "↑" : "↓";
  return `${dir} ${pct}% que el mes pasado`;
}

export function BudgetDetailCard({ budget, onSetBudget, currentMonthIndex, prevSpent }: BudgetDetailCardProps) {
  const Icon = iconMap[budget.categoryIcon] || LucideIcons.CircleEllipsis;
  const hasBudget = budget.status !== "no-budget";
  const pct = hasBudget && budget.limitAmount > 0 ? Math.min((budget.spent / budget.limitAmount) * 100, 100) : 0;
  const change = prevSpent !== undefined ? computeChange(budget.spent, prevSpent) : null;

  if (!hasBudget) {
    return (
      <button
        onClick={onSetBudget}
        className="w-full rounded-2xl border-2 border-dashed border-muted-foreground/30 p-5 text-left transition hover:border-primary hover:text-primary"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${budget.categoryColor}18` }}
          >
            <Icon className="h-5 w-5" style={{ color: budget.categoryColor }} />
          </div>
          <div>
            <p className="font-semibold">{budget.categoryName}</p>
            <p className="text-sm text-muted-foreground">Asignar presupuesto</p>
          </div>
          <div className="ml-auto">
            <LucideIcons.Plus className="h-5 w-5" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-surface shadow-sm">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${budget.categoryColor}18` }}
            >
              <Icon className="h-6 w-6" style={{ color: budget.categoryColor }} />
            </div>
            <div>
              <p className="text-lg font-bold">{budget.categoryName}</p>
              <p className="text-xs text-muted-foreground">Presupuesto mensual</p>
            </div>
          </div>
          <RingProgress percentage={pct} color={progressColor(budget.status)} />
        </div>

        <div className="mt-4 flex items-center gap-6">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Ahorro actual</p>
            <p className="text-xl font-extrabold text-expense">{formatCurrency(budget.spent)}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Meta</p>
            <p className="text-xl font-extrabold text-primary">{formatCurrency(budget.limitAmount)}</p>
          </div>
          <button
            onClick={onSetBudget}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Editar meta"
          >
            <LucideIcons.Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-5">
          <MonthlyBars currentMonthIndex={currentMonthIndex} />
        </div>

        {change && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
