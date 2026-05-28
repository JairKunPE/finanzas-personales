"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@/lib/forms";
import { creditCardInsertSchema } from "@/lib/validation";
import type { z } from "zod";

export type CardFormValues = z.infer<typeof creditCardInsertSchema>;

const cardColors = [
  { value: "#00C2A8", label: "Teal" },
  { value: "#F5A623", label: "Naranja" },
  { value: "#E84545", label: "Rojo" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#8b5cf6", label: "Morado" },
  { value: "#64748b", label: "Gris" },
];

export function CreditCardForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CardFormValues;
  onSave: (values: CardFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<CardFormValues>({
    resolver: zodResolver(creditCardInsertSchema),
    defaultValues: {
      name: initial?.name ?? "",
      limitAmount: initial?.limitAmount ?? (undefined as unknown as number),
      statementDay: initial?.statementDay ?? 1,
      paymentDay: initial?.paymentDay ?? 1,
      color: initial?.color ?? "#00C2A8",
    },
  });

  const errors = form.formState.errors;

  async function handleSubmit(values: CardFormValues) {
    try {
      await onSave(values);
    } catch {
      // errors handled by parent
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <label className="grid gap-2 text-sm font-medium">
        Nombre
        <input
          className="min-h-11 rounded-xl border bg-background px-3"
          {...form.register("name")}
          placeholder="ej. Visa BCP, Interbank Platinum"
          autoFocus
        />
        {errors.name ? <span className="text-xs text-expense">{errors.name.message}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Limite de credito (PEN)
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">S/</span>
          <input
            className="min-h-11 w-full rounded-xl border bg-background pl-9 pr-3 text-sm"
            type="number"
            step="0.01"
            min="0.01"
            {...form.register("limitAmount", { valueAsNumber: true })}
            placeholder="0.00"
          />
        </div>
        {errors.limitAmount ? <span className="text-xs text-expense">{errors.limitAmount.message}</span> : null}
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-2 text-sm font-medium">
          Dia de corte
          <input
            className="min-h-11 rounded-xl border bg-background px-3"
            type="number"
            min="1"
            max="31"
            {...form.register("statementDay", { valueAsNumber: true })}
          />
          {errors.statementDay ? <span className="text-xs text-expense">{errors.statementDay.message}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Dia de pago
          <input
            className="min-h-11 rounded-xl border bg-background px-3"
            type="number"
            min="1"
            max="31"
            {...form.register("paymentDay", { valueAsNumber: true })}
          />
          {errors.paymentDay ? <span className="text-xs text-expense">{errors.paymentDay.message}</span> : null}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium">
        Color
        <div className="flex flex-wrap gap-2">
          {cardColors.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => form.setValue("color", c.value, { shouldValidate: true })}
              className={`h-8 w-8 rounded-full border-2 transition ${
                form.watch("color") === c.value ? "border-foreground scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c.value }}
              aria-label={c.label}
            />
          ))}
        </div>
        {errors.color ? <span className="text-xs text-expense">{errors.color.message}</span> : null}
      </label>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>{initial ? "Guardar cambios" : "Crear tarjeta"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
