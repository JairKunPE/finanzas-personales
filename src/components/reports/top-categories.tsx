"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { iconMap, CircleEllipsis } from "@/lib/finance/icon-map";
import { formatCurrency } from "@/lib/formats";
import type { CategoryBreakdownItem } from "@/lib/api/reports";

export function TopCategories({ data }: { data: CategoryBreakdownItem[] }) {
  if (data.length === 0) {
    return <EmptyState title="Sin datos" description="No hay gastos para mostrar." />;
  }

  const maxTotal = Math.max(...data.map((d) => d.total));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top categorias de gasto</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        {data.map((item, index) => {
          const Icon = iconMap[item.categoryIcon] || CircleEllipsis;
          const barWidth = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
          return (
            <div key={item.categoryName}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <Icon className="h-4 w-4" style={{ color: item.categoryColor }} />
                  <span className="font-medium">{item.categoryName}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{formatCurrency(item.total)}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{item.percentage}%</span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${barWidth}%`, backgroundColor: item.categoryColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
