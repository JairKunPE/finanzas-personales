import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/formats";

type FlowSummaryProps = {
  income: number;
  expenses: number;
};

export function FlowSummary({ income, expenses }: FlowSummaryProps) {
  return (
    <div className="flex rounded-3xl bg-surface shadow-sm">
      <div className="flex flex-1 items-center justify-center gap-3 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-income/10">
          <ArrowDownRight className="h-5 w-5 text-income" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Ingresos</p>
          <p className="text-base font-bold text-income">{formatCurrency(income)}</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="h-10 w-px bg-border" />
      </div>

      <div className="flex flex-1 items-center justify-center gap-3 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-expense/10">
          <ArrowUpRight className="h-5 w-5 text-expense" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Egresos</p>
          <p className="text-base font-bold text-expense">{formatCurrency(expenses)}</p>
        </div>
      </div>
    </div>
  );
}
