import { cn } from "@/lib/utils";

export function BudgetProgress({ spent, limit }: { spent: number; limit: number }) {
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOver = limit > 0 && spent >= limit;
  const isWarning = !isOver && percentage >= 80;

  const barColor = isOver
    ? "bg-expense"
    : isWarning
      ? "bg-warning"
      : "bg-income";

  return (
    <div className="space-y-1.5">
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isOver ? (
        <p className="text-xs font-semibold text-expense">Limite superado</p>
      ) : isWarning ? (
        <p className="text-xs font-medium text-warning">Cerca del limite</p>
      ) : null}
    </div>
  );
}
