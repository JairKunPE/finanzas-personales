"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { BudgetDetailCard } from "@/components/budgets/budget-detail-card";
import { BudgetForm } from "@/components/budgets/budget-form";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useBudgets, upsertBudget } from "@/lib/api/budgets";
import { currentMonthKey } from "@/lib/formats";

export default function BudgetsPage() {
  const router = useRouter();
  const [month, setMonth] = useState(currentMonthKey());
  const { data: budgets, error, isLoading, mutate } = useBudgets(month);
  const [editing, setEditing] = useState<{ categoryId: number; categoryName: string; limitAmount: number } | null>(null);

  const [year, monthNum] = month.split("-").map(Number);
  const currentMonthIndex = monthNum - 1;

  const monthLabel = new Date(year, monthNum - 1, 1).toLocaleDateString("es", { month: "long", year: "numeric" });

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
    toast.success("Presupuesto guardado");
    setEditing(null);
    await mutate();
  }

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={() => mutate()} />;

  return (
    <div className="space-y-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Atras"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold">Metas de ahorro</h2>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handlePrevMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[8rem] text-center text-sm font-semibold capitalize">{monthLabel}</span>
        <button
          onClick={handleNextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {!budgets || budgets.length === 0 ? (
        <EmptyState title="Sin categorias" description="Crea categorias para asignar presupuestos." />
      ) : (
        <div className="space-y-4">
          {budgets.map((b) => (
            <BudgetDetailCard
              key={b.categoryId}
              budget={b}
              currentMonthIndex={currentMonthIndex}
              onSetBudget={() =>
                setEditing({ categoryId: b.categoryId, categoryName: b.categoryName, limitAmount: b.limitAmount })
              }
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
