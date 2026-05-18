"use client";

import { useState } from "react";

import { BudgetCard } from "@/components/budgets/budget-card";
import { BudgetForm } from "@/components/budgets/budget-form";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useBudgets, upsertBudget } from "@/lib/api/budgets";
import { currentMonthKey } from "@/lib/formats";

export default function BudgetsPage() {
  const [month, setMonth] = useState(currentMonthKey());
  const { data: budgets, error, isLoading, mutate } = useBudgets(month);
  const [editing, setEditing] = useState<{ categoryId: number; categoryName: string; limitAmount: number } | null>(null);

  function handlePrevMonth() {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 2, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  function handleNextMonth() {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  async function handleSave(categoryId: number, _month: string, limitAmount: number) {
    await upsertBudget(categoryId, _month, limitAmount);
    setEditing(null);
    mutate();
  }

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <p className="text-sm text-muted-foreground">Establece limites de gasto mensual por categoria</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="flex h-9 w-9 items-center justify-center rounded-xl border bg-card text-sm hover:bg-muted"
        >
          &larr;
        </button>
        <span className="min-w-[7rem] text-center font-semibold">
          {new Date(month + "-01").toLocaleDateString("es", { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-xl border bg-card text-sm hover:bg-muted"
        >
          &rarr;
        </button>
      </div>

      {!budgets || budgets.length === 0 ? (
        <EmptyState title="Sin categorias" description="Crea categorias para asignar presupuestos." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => (
            <BudgetCard
              key={b.categoryId}
              budget={b}
              onSetBudget={() => setEditing({ categoryId: b.categoryId, categoryName: b.categoryName, limitAmount: b.limitAmount })}
            />
          ))}
        </div>
      )}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
            <BudgetForm
              initialAmount={editing.limitAmount > 0 ? editing.limitAmount : undefined}
              categoryName={editing.categoryName}
              onSave={(limitAmount) => handleSave(editing.categoryId, month, limitAmount)}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
