"use client";

import * as LucideIcons from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formats";
import type { CategoryBreakdownItem } from "@/lib/api/reports";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;

export function CategoryBreakdown({ data }: { data: CategoryBreakdownItem[] }) {
  if (data.length === 0) {
    return <EmptyState title="Sin gastos" description="No hay gastos en el periodo seleccionado." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribucion de gastos por categoria</CardTitle>
      </CardHeader>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="total" nameKey="categoryName" innerRadius={56} outerRadius={92} paddingAngle={3}>
                {data.map((entry) => <Cell key={entry.categoryName} fill={entry.categoryColor} />)}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map((item) => {
            const Icon = iconMap[item.categoryIcon] || LucideIcons.CircleEllipsis;
            return (
              <div key={item.categoryName} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${item.categoryColor}20` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: item.categoryColor }} />
                  </div>
                  <span className="text-sm font-medium">{item.categoryName}</span>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">{formatCurrency(item.total)}</p>
                  <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
