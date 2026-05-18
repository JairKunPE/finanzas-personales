"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { removeTransaction } from "@/lib/api/transactions";

export function DeleteTransactionDialog({ id }: { id: number }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <ConfirmDialog
        title="Eliminar transaccion"
        description="Esta accion quitara el movimiento de tus totales y reportes."
        onCancel={() => setConfirming(false)}
        onConfirm={async () => {
          await removeTransaction(id);
          setConfirming(false);
        }}
      />
    );
  }

  return <Button type="button" variant="danger" onClick={() => setConfirming(true)}>Eliminar</Button>;
}
