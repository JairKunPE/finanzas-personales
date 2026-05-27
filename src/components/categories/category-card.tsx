"use client";

import { iconMap, CircleEllipsis, Pencil, Trash2 } from "@/lib/finance/icon-map";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type CategoryCardDto = {
  id: number;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
};

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryCardDto;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = iconMap[category.icon] || CircleEllipsis;

  return (
    <div className="group relative rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <Icon className="h-7 w-7" style={{ color: category.color }} />
        </div>
        <div>
          <p className="font-semibold">{category.name}</p>
          {category.isDefault ? (
            <Badge variant="secondary" className="mt-1">Por defecto</Badge>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button type="button" variant="ghost" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        {!category.isDefault ? (
          <Button type="button" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-expense" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
