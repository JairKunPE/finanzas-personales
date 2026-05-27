"use client";

import { TransactionForm } from "@/components/transactions/transaction-form";

export default function NewTransactionPage() {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-center">Nueva transaccion</h2>
      <p className="text-center text-sm text-muted-foreground">La fecha se completa con el dia actual por defecto.</p>
      <TransactionForm />
    </div>
  );
}
