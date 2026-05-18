import Link from "next/link";

import { CsvDownloadButton } from "@/components/export/csv-download-button";
import { FixedExpenseCard } from "@/components/fixed-expenses/fixed-expense-card";
import { FixedExpensesSummary } from "@/components/fixed-expenses/fixed-expenses-summary";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { listFixedExpenses } from "@/lib/db/transactions";

export const dynamic = "force-dynamic";

export default function FixedExpensesPage() {
  const data = listFixedExpenses();
  const groups = ["Servicios", "Suscripciones digitales", "Otros"] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Gastos Fijos</h2>
          <p className="text-sm text-muted-foreground">Suscripciones, servicios, rentas y otros cobros recurrentes.</p>
        </div>
        <div className="flex gap-2">
          <CsvDownloadButton label="Exportar CSV" url="/api/export/fixed-expenses" method="POST" />
          <Link href="/transactions/new"><Button>Anadir suscripcion</Button></Link>
        </div>
      </div>
      <FixedExpensesSummary totalMonthlyPen={data.totalMonthlyPen} dueSoonCount={data.dueSoonCount} />
      {data.items.length === 0 ? <EmptyState title="Sin gastos fijos" description="Marca un gasto como fijo para verlo en esta seccion." /> : null}
      {groups.map((group) => {
        const items = data.items.filter((item) => item.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group} className="space-y-3">
            <h3 className="text-lg font-semibold">{group}</h3>
            <div className="grid gap-4 xl:grid-cols-2">
              {items.map((expense) => <FixedExpenseCard key={expense.id} expense={expense} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
