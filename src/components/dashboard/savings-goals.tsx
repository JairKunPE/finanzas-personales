"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";

import type { BudgetWithSpent } from "@/lib/db/budgets";
import { formatCurrency } from "@/lib/formats";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;

type SavingsGoalsProps = {
  budgets: BudgetWithSpent[];
};

function progressColor(status: BudgetWithSpent["status"]) {
  if (status === "over") return "bg-expense";
  if (status === "warning") return "bg-warning";
  return "bg-income";
}

export function SavingsGoals({ budgets }: SavingsGoalsProps) {
  const goals = budgets.filter((b) => b.limitAmount > 0).slice(0, 4);

  if (goals.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold">Metas de ahorro</h3>
        <Link href="/budgets" className="text-sm font-semibold text-primary">
          Ver mas
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => {
          const Icon = iconMap[goal.categoryIcon] || LucideIcons.CircleEllipsis;
          const pct = goal.limitAmount > 0 ? Math.min((goal.spent / goal.limitAmount) * 100, 100) : 0;

          return (
            <div key={goal.categoryId} className="rounded-2xl bg-surface p-4 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted" style={{ color: goal.categoryColor }}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold truncate">{goal.categoryName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatCurrency(goal.spent)} / {formatCurrency(goal.limitAmount)}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${progressColor(goal.status)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
