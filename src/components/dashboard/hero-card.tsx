import { formatCurrency, formatDate, todayISODate } from "@/lib/formats";

type HeroCardProps = {
  balance: number;
};

export function HeroCard({ balance }: HeroCardProps) {
  const today = todayISODate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-orange-400 to-amber-500 p-6 text-primary-foreground shadow-lg">
      <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/10" />
      <div className="absolute bottom-0 right-0 h-24 w-24 translate-x-4 translate-y-4 rounded-full bg-white/5" />

      <div className="relative z-10">
        <p className="text-sm text-white/80">
          Saldo
        </p>
        <p className="mt-0.5 text-xs text-white/60">
          {formatDate(today)}
        </p>
        <p className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {formatCurrency(balance)}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <div />
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">
            Finanzas
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-center gap-1.5">
        <span className="h-1.5 w-6 rounded-full bg-white/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
      </div>
    </div>
  );
}
