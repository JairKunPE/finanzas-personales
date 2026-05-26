const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const sampleMonthlySpending = [65, 72, 55, 81, 48, 63, 45];

type MonthlyBarsProps = {
  currentMonthIndex: number;
};

export function MonthlyBars({ currentMonthIndex }: MonthlyBarsProps) {
  const maxVal = Math.max(...sampleMonthlySpending, 1);

  return (
    <div className="flex items-end justify-between gap-1" style={{ height: 100 }}>
      {sampleMonthlySpending.map((val, i) => {
        const monthLabel = MONTHS[(currentMonthIndex - 6 + i + 12) % 12];
        const isCurrent = i === sampleMonthlySpending.length - 1;
        const heightPct = (val / maxVal) * 100;

        return (
          <div key={i} className="relative flex flex-1 flex-col items-center justify-end">
            {isCurrent && (
              <div className="mb-1 h-0 w-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-primary" />
            )}
            <div
              className={`w-full rounded-t-md transition-all ${
                isCurrent ? "bg-primary" : "bg-muted"
              }`}
              style={{ height: `${heightPct}%` }}
            />
            <span
              className={`mt-1.5 text-[10px] font-medium ${
                isCurrent ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {monthLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
