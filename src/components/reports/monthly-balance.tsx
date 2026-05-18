"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formats";
import type { MonthlyBalanceItem } from "@/lib/api/reports";

export function MonthlyBalanceTable({ data }: { data: MonthlyBalanceItem[] }) {
  if (data.length === 0) {
    return <EmptyState title="Sin datos" description="No hay transacciones en el periodo." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance mensual detallado</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">Mes</th>
              <th className="pb-2 pr-4 font-medium text-income">Ingresos</th>
              <th className="pb-2 pr-4 font-medium text-expense">Gastos</th>
              <th className="pb-2 pr-4 font-medium">Balance</th>
              <th className="pb-2 font-medium">% Ahorro</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const date = parseISO(row.month + "-01");
              const label = format(date, "MMM yyyy", { locale: es });
              return (
                <tr key={row.month} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium capitalize">{label}</td>
                  <td className="py-2 pr-4 text-income">{formatCurrency(row.income)}</td>
                  <td className="py-2 pr-4 text-expense">{formatCurrency(row.expenses)}</td>
                  <td className={`py-2 pr-4 font-semibold ${row.balance >= 0 ? "text-income" : "text-expense"}`}>
                    {formatCurrency(row.balance)}
                  </td>
                  <td className={`py-2 ${row.savingsRate >= 0 ? "text-income" : "text-expense"}`}>
                    {row.savingsRate.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
