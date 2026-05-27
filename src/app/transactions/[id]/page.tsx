"use client";

import { useParams } from "next/navigation";

import { TransactionForm } from "@/components/transactions/transaction-form";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTransaction } from "@/lib/api/transactions";

export default function EditTransactionPage() {
  const params = useParams<{ id: string }>();
  const { data, error, isLoading } = useTransaction(params.id);

  if (isLoading) return <LoadingState label="Cargando transaccion..." />;
  if (error || !data) return <ErrorState message="No se pudo cargar la transaccion." />;

  return (
    <div className="space-y-5">
      <TransactionForm transaction={data} />
    </div>
  );
}
