"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { removeTransaction } from "@/lib/api/transactions";

export function DeleteTransactionDialog({ id }: { id: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <ConfirmDialog
        title="Eliminar transaccion"
        description="Esta accion quitara el movimiento de tus totales y reportes."
        onCancel={() => setConfirming(false)}
        onConfirm={async () => {
          try {
            await removeTransaction(id);
            toast.success("Transaccion eliminada");
            setConfirming(false);
            router.refresh();
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo eliminar la transaccion");
          }
        }}
      />
    );
  }

  return <Button type="button" variant="danger" onClick={() => setConfirming(true)}>Eliminar</Button>;
}
