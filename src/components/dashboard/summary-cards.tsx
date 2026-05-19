import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formats";

export function SummaryCards({ balance, monthlyIncome, monthlyExpenses }: { balance: number; monthlyIncome: number; monthlyExpenses: number }) {
  const cards = [
    { label: "Saldo actual", value: balance, icon: Wallet, className: balance < 0 ? "text-expense" : "text-income" },
    { label: "Ingresos del mes", value: monthlyIncome, icon: ArrowUpRight, className: "text-income" },
    { label: "Gastos del mes", value: monthlyExpenses, icon: ArrowDownRight, className: "text-expense" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className={`mt-2 text-2xl font-bold ${card.label === "Saldo actual" ? card.className : ""}`}>{formatCurrency(card.value)}</p>
            </div>
            <card.icon className={`h-6 w-6 ${card.className}`} />
          </div>
        </Card>
      ))}
    </div>
  );
}
