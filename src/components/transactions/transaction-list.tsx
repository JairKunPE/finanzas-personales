"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { formatCurrency, formatDate, formatOriginalCurrency } from "@/lib/formats";
import { useTransactions } from "@/lib/api/transactions";

export function TransactionList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const query = params.toString() ? `?${params.toString()}` : "";
  const { data, error, isLoading, mutate } = useTransactions(query);

  if (isLoading) return <LoadingState label="Cargando transacciones..." />;
  if (error) return <ErrorState message={error.message} onRetry={() => mutate()} />;
  if (!data || data.items.length === 0) return <EmptyState title="Sin transacciones" description="Agrega tu primer ingreso o gasto, o limpia los filtros activos." />;

  function goToPage(page: number) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(page));
    router.push(`/transactions?${next.toString()}`);
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {data.items.map((transaction) => (
          <Card key={transaction.id} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{transaction.description}</span>
                <span className="rounded-full px-2 py-1 text-xs" style={{ backgroundColor: `${transaction.categoryColor}22`, color: transaction.categoryColor }}>{transaction.categoryName}</span>
              </div>
              <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
              {transaction.currency === "USD" ? (
                <p className="text-xs text-muted-foreground">
                  Original: {formatOriginalCurrency(transaction.originalAmount, "USD")} x {transaction.exchangeRate.toFixed(3)}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className={transaction.type === "income" ? "font-bold text-income" : "font-bold text-expense"}>
                {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amountPen)}
              </span>
              <Button type="button" variant="secondary" onClick={() => router.push(`/transactions/${transaction.id}`)}>Editar</Button>
              <DeleteTransactionDialog id={transaction.id} />
            </div>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="secondary" disabled={data.page <= 1} onClick={() => goToPage(data.page - 1)}>Anterior</Button>
        <span className="text-sm text-muted-foreground">Pagina {data.page} de {totalPages}</span>
        <Button type="button" variant="secondary" disabled={data.page >= totalPages} onClick={() => goToPage(data.page + 1)}>Siguiente</Button>
      </div>
      <Link className="inline-flex text-sm font-semibold text-primary" href="/transactions/new">Registrar nueva transaccion</Link>
    </div>
  );
}
