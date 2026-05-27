"use client";

import { iconMap, CircleEllipsis } from "@/lib/finance/icon-map";

import { useCategories } from "@/lib/api/categories";

export function CategorySelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { data: categories = [], error, isLoading } = useCategories();

  return (
    <select
      className="min-h-11 rounded-xl border bg-background px-3 text-sm"
      value={value || ""}
      onChange={(event) => onChange(Number(event.target.value))}
      disabled={isLoading || Boolean(error)}
      required
    >
      <option value="">{error ? "Error cargando categorias" : isLoading ? "Cargando categorias..." : "Selecciona categoria"}</option>
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || CircleEllipsis;
        return (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        );
      })}
    </select>
  );
}

export function CategoryBadge({ icon, color, name, size = "sm" }: { icon: string; color: string; name: string; size?: "sm" | "md" }) {
  const Icon = iconMap[icon] || CircleEllipsis;
  const iconSize = size === "md" ? "h-4 w-4" : "h-3 w-3";
  const textSize = size === "md" ? "text-sm" : "text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium ${textSize}`} style={{ backgroundColor: `${color}20`, color }}>
      <Icon className={iconSize} />
      {name}
    </span>
  );
}
