"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formats";
import type { FixedVsVariableDto } from "@/lib/api/reports";

export function FixedVsVariableChart({ data }: { data: FixedVsVariableDto }) {
  const chartData = [
    { name: "Fijos", total: data.fixed, fill: "#8b5cf6" },
    { name: "Variables", total: data.variable, fill: "#f97316" },
  ];

  const hasData = data.fixed > 0 || data.variable > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos fijos vs variables</CardTitle>
      </CardHeader>
      {!hasData ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Sin gastos en el periodo</p>
      ) : (
        <>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `S/${v.toFixed(0)}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="total" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Gastos fijos</p>
               <p className="text-lg font-bold text-purple-500">{formatCurrency(data.fixed)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Gastos variables</p>
               <p className="text-lg font-bold text-orange-500">{formatCurrency(data.variable)}</p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
