"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-expense/10">
          <AlertTriangle className="h-7 w-7 text-expense" />
        </div>
        <h1 className="text-xl font-bold text-card-foreground">Algo salio mal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocurrio un error inesperado al cargar esta pagina. Intenta nuevamente.
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-muted-foreground">
            Ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={reset}>Reintentar</Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
