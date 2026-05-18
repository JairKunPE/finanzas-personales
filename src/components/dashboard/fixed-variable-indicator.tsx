import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formats";

export function FixedVariableIndicator({ fixedExpenses, variableExpenses }: { fixedExpenses: number; variableExpenses: number }) {
  const total = fixedExpenses + variableExpenses;
  const fixedPercent = total > 0 ? Math.round((fixedExpenses / total) * 100) : 0;
  const variablePercent = total > 0 ? 100 - fixedPercent : 0;

  return (
    <Card>
      <p className="font-semibold">Gastos del mes</p>
      <div className="mt-4 grid gap-3">
        <div>
          <div className="flex justify-between text-sm"><span>Fijos</span><span>{formatCurrency(fixedExpenses)} ({fixedPercent}%)</span></div>
          <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${fixedPercent}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-sm"><span>Variables</span><span>{formatCurrency(variableExpenses)} ({variablePercent}%)</span></div>
          <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-expense" style={{ width: `${variablePercent}%` }} /></div>
        </div>
      </div>
    </Card>
  );
}
