import { AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";

export function BudgetStatusIndicator({ count }: { count: number }) {
  return (
    <Card className="flex items-center gap-3">
      <div className="rounded-2xl bg-warning/15 p-3 text-warning">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold">Presupuestos en alerta</p>
        <p className="text-sm text-muted-foreground">{count === 0 ? "Sin categorias cerca del limite" : `${count} categorias requieren atencion`}</p>
      </div>
    </Card>
  );
}
