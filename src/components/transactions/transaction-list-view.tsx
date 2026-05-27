"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { iconMap, CircleEllipsis, Search } from "@/lib/finance/icon-map";

import type { TransactionRow } from "@/lib/db/transactions";
import { formatCurrency, formatDate, formatOriginalCurrency } from "@/lib/formats";

type TransactionListViewProps = {
  transactions: TransactionRow[];
};

export function TransactionListView({ transactions }: TransactionListViewProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(q) ||
        tx.categoryName.toLowerCase().includes(q),
    );
  }, [transactions, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, TransactionRow[]>();
    for (const tx of filtered) {
      const key = tx.date;
      const list = map.get(key) ?? [];
      list.push(tx);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  function labelForDate(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.getTime() === today.getTime()) return "Hoy";
    if (d.getTime() === yesterday.getTime()) return "Ayer";
    return formatDate(dateStr);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar movimientos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl bg-muted py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {grouped.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {search ? "No se encontraron movimientos" : "No hay movimientos registrados"}
          </p>
        </div>
      ) : (
        grouped.map(([dateKey, txs]) => (
          <div key={dateKey}>
            <p className="mb-2 ml-1 text-xs font-semibold text-muted-foreground">
              {labelForDate(dateKey)}
            </p>
            <div className="overflow-hidden rounded-3xl bg-surface shadow-sm">
              <div className="divide-y divide-border">
                {txs.map((tx) => {
                  const Icon = iconMap[tx.categoryIcon] || CircleEllipsis;
                  const isIncome = tx.type === "income";

                  return (
                    <Link
                      key={tx.id}
                      href={`/transactions/${tx.id}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition"
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${tx.categoryColor}18`,
                          color: tx.categoryColor,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {tx.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.categoryName}
                          {tx.isRecurring && " · Fijo"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className={`text-sm font-bold ${isIncome ? "text-income" : ""}`}>
                          {isIncome ? "+" : "-"}
                          {tx.currency === "USD"
                            ? formatOriginalCurrency(tx.amount, "USD")
                            : formatCurrency(tx.amount)}
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
            </div>
          </div>
        ))
      )}
    </div>
  );
}
