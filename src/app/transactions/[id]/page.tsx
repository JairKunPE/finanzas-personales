"use client";

import { useParams } from "next/navigation";

import { TransactionForm } from "@/components/transactions/transaction-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTransaction } from "@/lib/api/transactions";

export default function EditTransactionPage() {
  const params = useParams<{ id: string }>();
  const { data, error, isLoading } = useTransaction(params.id);

  if (isLoading) return <LoadingState label="Cargando transaccion..." />;
  if (error || !data) return <ErrorState message="No se pudo cargar la transaccion." />;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Editar transaccion</CardTitle>
      </CardHeader>
      <TransactionForm transaction={data} />
    </Card>
  );
}
