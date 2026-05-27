"use client";

import Link from "next/link";
import { iconMap, CircleEllipsis } from "@/lib/finance/icon-map";

import type { TransactionRow } from "@/lib/db/transactions";
import { formatCurrency, formatDate, formatOriginalCurrency } from "@/lib/formats";

type RecentTransactionsProps = {
  transactions: TransactionRow[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-3xl bg-surface shadow-sm">
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-lg font-bold">Movimientos</h3>
        <Link href="/transactions" className="text-sm font-semibold text-primary">
          Ver mas
        </Link>
      </div>

      <div className="mt-3 divide-y divide-border">
        {transactions.map((tx) => {
          const Icon = iconMap[tx.categoryIcon] || CircleEllipsis;
          const isIncome = tx.type === "income";

          return (
            <Link key={tx.id} href={`/transactions/${tx.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${tx.categoryColor}18`, color: tx.categoryColor }}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.categoryName} · {formatDate(tx.date)}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className={`text-sm font-bold ${isIncome ? "text-income" : ""}`}>
                  {isIncome ? "+" : "-"}
                  {tx.currency === "USD" ? formatOriginalCurrency(tx.amount, "USD") : formatCurrency(tx.amount)}
                </p>
                {tx.currency === "USD" && (
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(tx.amountPen)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
