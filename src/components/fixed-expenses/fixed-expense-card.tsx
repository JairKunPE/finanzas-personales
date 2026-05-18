import Link from "next/link";

import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FixedExpenseDto } from "@/lib/api/fixed-expenses";
import { billingCycleLabels } from "@/lib/finance/fixed-expenses";
import { formatCurrency, formatDate, formatOriginalCurrency } from "@/lib/formats";

export function FixedExpenseCard({ expense }: { expense: FixedExpenseDto }) {
  return (
    <Card className={expense.dueSoon ? "border-warning/70" : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{expense.description}</h3>
            {expense.dueSoon ? <span className="rounded-full bg-warning/15 px-2 py-1 text-xs font-semibold text-warning">Proximo vencimiento</span> : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{expense.categoryName} - {billingCycleLabels[expense.billingCycle]}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{formatCurrency(expense.monthlyEquivalentPen)} / mes</p>
          <p className="text-sm text-muted-foreground">
            {formatOriginalCurrency(expense.originalAmount, expense.currency)} por ciclo
            {expense.currency === "USD" ? ` = ${formatCurrency(expense.amountPen)}` : ""}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Ultimo pago: {formatDate(expense.date)}</span>
          <span>Proximo cobro: {formatDate(expense.nextBillingDate)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${expense.cycleProgress}%` }} />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/transactions/${expense.id}`}><Button type="button" variant="secondary">Editar</Button></Link>
        <DeleteTransactionDialog id={expense.id} />
        <Link href="/transactions"><Button type="button" variant="ghost">Ver transacciones</Button></Link>
      </div>
    </Card>
  );
}
