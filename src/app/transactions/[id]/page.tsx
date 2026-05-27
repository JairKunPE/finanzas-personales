"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { TransactionForm } from "@/components/transactions/transaction-form";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTransaction } from "@/lib/api/transactions";

export default function EditTransactionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, error, isLoading } = useTransaction(params.id);

  if (isLoading) return <LoadingState label="Cargando transaccion..." />;
  if (error || !data) return <ErrorState message="No se pudo cargar la transaccion." />;

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
        <h2 className="text-lg font-bold">Editar transaccion</h2>
      </div>
      <TransactionForm transaction={data} />
    </div>
  );
}
