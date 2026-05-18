"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function BudgetForm({
  initialAmount,
  categoryName,
  onSave,
  onCancel,
}: {
  initialAmount?: number;
  categoryName: string;
  onSave: (limitAmount: number) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = Number.parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) {
      setError("Ingresa un monto valido mayor a 0");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="font-semibold">{initialAmount ? "Editar presupuesto" : "Asignar presupuesto"}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Categoria: <strong>{categoryName}</strong>
        </p>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Limite mensual (PEN)
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">S/</span>
          <input
            className="min-h-11 w-full rounded-xl border bg-background pl-9 pr-3 text-sm"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            autoFocus
          />
        </div>
        {error ? <span className="text-xs text-expense">{error}</span> : null}
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{initialAmount ? "Guardar" : "Asignar"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
