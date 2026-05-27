"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { TransactionForm } from "@/components/transactions/transaction-form";

export default function NewTransactionPage() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Atras"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold">Nueva transaccion</h2>
      </div>
      <p className="text-center text-sm text-muted-foreground">La fecha se completa con el dia actual por defecto.</p>
      <TransactionForm />
    </div>
  );
}
