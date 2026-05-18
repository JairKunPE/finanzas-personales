import Link from "next/link";
import { Suspense } from "react";

import { TransactionExportButton } from "@/components/export/transaction-export-button";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionList } from "@/components/transactions/transaction-list";
import { CurrencySettingsCard } from "@/components/transactions/currency-settings-card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Transacciones</h2>
          <p className="text-sm text-muted-foreground">Registra, filtra, edita y elimina movimientos locales.</p>
        </div>
        <div className="flex gap-2">
          <Suspense fallback={null}>
            <TransactionExportButton />
          </Suspense>
          <Link href="/transactions/new"><Button>Nueva transaccion</Button></Link>
        </div>
      </div>
      <CurrencySettingsCard />
      <Suspense fallback={<LoadingState label="Preparando filtros..." />}>
        <TransactionFilters />
        <TransactionList />
      </Suspense>
    </div>
  );
}
