"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { IconSelector } from "@/components/categories/icon-selector";
import { ColorSelector } from "@/components/categories/color-selector";

export type CategoryFormValues = {
  name: string;
  icon: string;
  color: string;
};

export function CategoryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CategoryFormValues;
  onSave: (values: CategoryFormValues) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "CircleEllipsis");
  const [color, setColor] = useState(initial?.color ?? "#64748b");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setIcon(initial.icon);
      setColor(initial.color);
    }
  }, [initial]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("El nombre es obligatorio");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave({ name: trimmed, icon, color });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="grid gap-2 text-sm font-medium">
        Nombre
        <input
          className="min-h-11 rounded-xl border bg-background px-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la categoria"
          autoFocus
        />
        {error ? <span className="text-xs text-expense">{error}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Icono
        <IconSelector value={icon} onChange={setIcon} />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Color
        <ColorSelector value={color} onChange={setColor} />
      </label>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={saving}>{initial ? "Guardar cambios" : "Crear categoria"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
