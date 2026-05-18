"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formats";

type DataPoint = { month: string; income: number; expenses: number };

export function IncomeExpenseLineChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0 || data.every((d) => d.income === 0 && d.expenses === 0)) {
    return <EmptyState title="Sin datos" description="No hay transacciones en el periodo seleccionado." />;
  }

  const chartData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.month + "-01"), "MMM yyyy", { locale: es }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolucion mensual</CardTitle>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `S/${v.toFixed(0)}`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Line type="monotone" dataKey="income" name="Ingresos" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="expenses" name="Gastos" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
