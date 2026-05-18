"use client";

import * as LucideIcons from "lucide-react";

import { BudgetProgress } from "@/components/budgets/budget-progress";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formats";
import type { BudgetWithSpentDto } from "@/lib/api/budgets";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;

export function BudgetCard({
  budget,
  onSetBudget,
}: {
  budget: BudgetWithSpentDto;
  onSetBudget: () => void;
}) {
  const Icon = iconMap[budget.categoryIcon] || LucideIcons.CircleEllipsis;
  const remaining = budget.limitAmount - budget.spent;
  const hasBudget = budget.status !== "no-budget";

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${budget.categoryColor}20` }}
          >
            <Icon className="h-5 w-5" style={{ color: budget.categoryColor }} />
          </div>
          <div>
            <p className="font-semibold">{budget.categoryName}</p>
            {hasBudget ? (
              <p className="text-sm text-muted-foreground">Limite: {formatCurrency(budget.limitAmount)}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Sin presupuesto</p>
            )}
          </div>
        </div>
        <Button type="button" variant="ghost" onClick={onSetBudget}>
          {hasBudget ? <LucideIcons.Pencil className="h-4 w-4" /> : <LucideIcons.Plus className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Gastado: {formatCurrency(budget.spent)}</span>
          {hasBudget ? (
            <span className={remaining >= 0 ? "text-income" : "text-expense"}>
              {remaining >= 0 ? `Restan ${formatCurrency(remaining)}` : `Excede ${formatCurrency(Math.abs(remaining))}`}
            </span>
          ) : null}
        </div>
        {hasBudget ? <BudgetProgress spent={budget.spent} limit={budget.limitAmount} /> : null}
      </div>
    </div>
  );
}
