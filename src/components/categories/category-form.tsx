"use client";

import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { IconSelector } from "@/components/categories/icon-selector";
import { ColorSelector } from "@/components/categories/color-selector";
import { zodResolver } from "@/lib/forms";
import { categoryInputSchema } from "@/lib/validation";

export type CategoryFormValues = z.infer<typeof categoryInputSchema>;

export function CategoryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CategoryFormValues;
  onSave: (values: CategoryFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryInputSchema),
    defaultValues: {
      name: initial?.name ?? "",
      icon: initial?.icon ?? "CircleEllipsis",
      color: initial?.color ?? "#64748b",
    },
  });

  const errors = form.formState.errors;

  async function handleSubmit(values: CategoryFormValues) {
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
          placeholder="Nombre de la categoria"
          autoFocus
        />
        {errors.name ? <span className="text-xs text-expense">{errors.name.message}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Icono
        <IconSelector value={form.watch("icon")} onChange={(value) => form.setValue("icon", value, { shouldValidate: true })} />
        {errors.icon ? <span className="text-xs text-expense">{errors.icon.message}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Color
        <ColorSelector value={form.watch("color")} onChange={(value) => form.setValue("color", value, { shouldValidate: true })} />
        {errors.color ? <span className="text-xs text-expense">{errors.color.message}</span> : null}
      </label>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>{initial ? "Guardar cambios" : "Crear categoria"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
