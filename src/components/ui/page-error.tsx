"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function PageError({ error, reset }: PageErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-expense/10">
          <AlertTriangle className="h-7 w-7 text-expense" />
        </div>
        <h2 className="text-xl font-bold">No se ha podido cargar esta pagina</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Ocurrio un error inesperado. Intenta nuevamente."}
        </p>
        {error.digest ? (
          <p className="mt-1 text-xs text-muted-foreground">Ref: {error.digest}</p>
        ) : null}
        <div className="mt-6">
          <Button onClick={reset}>Reintentar</Button>
        </div>
      </div>
    </div>
  );
}
