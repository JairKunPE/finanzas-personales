import { AlertTriangle, Repeat } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formats";

export function FixedExpensesSummary({ totalMonthlyPen, dueSoonCount }: { totalMonthlyPen: number; dueSoonCount: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="flex items-center gap-4">
        <div className="rounded-2xl bg-primary/15 p-3 text-primary"><Repeat className="h-6 w-6" /></div>
        <div>
          <p className="text-sm text-muted-foreground">Total mensual fijo</p>
          <p className="text-3xl font-bold">{formatCurrency(totalMonthlyPen)}</p>
        </div>
      </Card>
      <Card className="flex items-center gap-4">
        <div className="rounded-2xl bg-warning/15 p-3 text-warning"><AlertTriangle className="h-6 w-6" /></div>
        <div>
          <p className="text-sm text-muted-foreground">Proximos 7 dias</p>
          <p className="text-3xl font-bold">{dueSoonCount}</p>
        </div>
      </Card>
    </div>
  );
}
