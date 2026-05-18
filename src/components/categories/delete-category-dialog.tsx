"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { CategoryCardDto } from "@/components/categories/category-card";
import { useCategories } from "@/lib/api/categories";

export function DeleteCategoryDialog({
  category,
  transactionsCount,
  onReassign,
  onDeleteTransactions,
  onCancel,
}: {
  category: CategoryCardDto;
  transactionsCount: number;
  onReassign: (targetCategoryId: number) => void;
  onDeleteTransactions: () => void;
  onCancel: () => void;
}) {
  const { data: allCategories = [] } = useCategories();
  const [mode, setMode] = useState<"reassign" | "delete-transactions" | null>(null);
  const [targetId, setTargetId] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const otherCategories = allCategories.filter((c) => c.id !== category.id);

  async function handleConfirm() {
    setSaving(true);
    try {
      if (mode === "reassign" && targetId) {
        await onReassign(targetId);
      } else if (mode === "delete-transactions") {
        await onDeleteTransactions();
      }
    } finally {
      setSaving(false);
    }
  }

  const canConfirm = mode === "delete-transactions" || (mode === "reassign" && targetId > 0);

  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold">Eliminar categoria</p>
        <p className="mt-1 text-sm text-muted-foreground">
          La categoria <strong>{category.name}</strong> tiene <strong>{transactionsCount}</strong> transaccion{transactionsCount !== 1 ? "es" : ""} asociada{transactionsCount !== 1 ? "s" : ""}.
          Que deseas hacer?
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-3 rounded-xl border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <input
            type="radio"
            name="delete-mode"
            className="mt-0.5"
            checked={mode === "reassign"}
            onChange={() => setMode("reassign")}
          />
          <div>
            <p className="text-sm font-medium">Reasignar transacciones</p>
            <p className="text-xs text-muted-foreground">Mover las transacciones a otra categoria</p>
            {mode === "reassign" ? (
              <select
                className="mt-2 min-h-10 w-full rounded-xl border bg-background px-3 text-sm"
                value={targetId}
                onChange={(e) => setTargetId(Number(e.target.value))}
              >
                <option value="">Selecciona categoria</option>
                {otherCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            ) : null}
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-xl border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <input
            type="radio"
            name="delete-mode"
            className="mt-0.5"
            checked={mode === "delete-transactions"}
            onChange={() => setMode("delete-transactions")}
          />
          <div>
            <p className="text-sm font-medium">Eliminar transacciones</p>
            <p className="text-xs text-muted-foreground">Eliminar todas las transacciones de esta categoria</p>
          </div>
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="danger" disabled={!canConfirm || saving} onClick={handleConfirm}>
          {saving ? "Eliminando..." : "Eliminar categoria"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>Cancelar</Button>
      </div>
    </div>
  );
}
