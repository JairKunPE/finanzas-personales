import Link from "next/link";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CategoryBadge } from "@/components/transactions/category-select";
import { formatCurrency, formatDate, formatOriginalCurrency } from "@/lib/formats";
import type { TransactionDto } from "@/lib/api/transactions";

export function LatestTransactions({ transactions }: { transactions: TransactionDto[] }) {
  if (transactions.length === 0) {
    return <EmptyState title="Aun no hay movimientos" description="Crea una transaccion para comenzar tu historial." />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Ultimas transacciones</CardTitle>
          <Link href="/transactions" className="text-sm font-semibold text-primary">Ver todas</Link>
        </div>
      </CardHeader>
      <div className="grid gap-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-3">
            <div className="min-w-0">
              <p className="font-medium truncate">{transaction.description}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <CategoryBadge icon={transaction.categoryIcon} color={transaction.categoryColor} name={transaction.categoryName} />
                <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
              </div>
              {transaction.currency === "USD" ? (
                <p className="mt-1 text-xs text-muted-foreground">{formatOriginalCurrency(transaction.originalAmount, "USD")} = {formatCurrency(transaction.amountPen)}</p>
              ) : null}
            </div>
            <p className={transaction.type === "income" ? "shrink-0 font-bold text-income" : "shrink-0 font-bold text-expense"}>
              {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amountPen)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
