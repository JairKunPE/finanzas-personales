"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@/lib/forms";

const limitAmountFormSchema = z.object({
  limitAmount: z.number({ message: "Ingresa un monto valido" }).positive("El monto debe ser mayor a 0"),
});

type BudgetFormValues = z.infer<typeof limitAmountFormSchema>;

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
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(limitAmountFormSchema),
    defaultValues: { limitAmount: initialAmount ?? (undefined as unknown as number) },
  });

  const errors = form.formState.errors;

  async function handleSubmit(values: BudgetFormValues) {
    try {
      await onSave(values.limitAmount);
    } catch {
      // errors handled by parent
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            {...form.register("limitAmount", { valueAsNumber: true })}
            placeholder="0.00"
            autoFocus
          />
        </div>
        {errors.limitAmount ? <span className="text-xs text-expense">{errors.limitAmount.message}</span> : null}
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>{initialAmount ? "Guardar" : "Asignar"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
