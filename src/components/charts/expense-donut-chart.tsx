"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formats";

type Slice = { categoryName: string; categoryColor: string; total: number };

export function ExpenseDonutChart({ data }: { data: Slice[] }) {
  if (data.length === 0) {
    return <EmptyState title="Sin gastos este mes" description="Registra gastos para ver su distribucion por categoria." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoria</CardTitle>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="categoryName" innerRadius={64} outerRadius={104} paddingAngle={3}>
              {data.map((entry) => <Cell key={entry.categoryName} fill={entry.categoryColor} />)}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {data.map((entry) => (
          <div key={entry.categoryName} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.categoryColor }} />{entry.categoryName}</span>
            <span className="font-semibold">{formatCurrency(entry.total)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
