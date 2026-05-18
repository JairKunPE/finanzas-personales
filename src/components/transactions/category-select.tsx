"use client";

import * as LucideIcons from "lucide-react";

import { useCategories } from "@/lib/api/categories";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;

export function CategorySelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { data: categories = [] } = useCategories();

  return (
    <select
      className="min-h-11 rounded-xl border bg-background px-3 text-sm"
      value={value || ""}
      onChange={(event) => onChange(Number(event.target.value))}
      required
    >
      <option value="">Selecciona categoria</option>
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || LucideIcons.CircleEllipsis;
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
  const Icon = iconMap[icon] || LucideIcons.CircleEllipsis;
  const iconSize = size === "md" ? "h-4 w-4" : "h-3 w-3";
  const textSize = size === "md" ? "text-sm" : "text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium ${textSize}`} style={{ backgroundColor: `${color}20`, color }}>
      <Icon className={iconSize} />
      {name}
    </span>
  );
}
