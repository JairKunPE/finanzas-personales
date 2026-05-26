"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;

type CardData = {
  id: string;
  name: string;
  maskedNumber: string;
  icon: string;
  iconColor: string;
  type: "fisica" | "virtual";
  category: "debito" | "credito";
};

const sampleCards: CardData[] = [
  { id: "1", name: "Juan Perez", maskedNumber: "****4673", icon: "CreditCard", iconColor: "#00C2A8", type: "fisica", category: "debito" },
  { id: "2", name: "Juan Perez", maskedNumber: "****8912", icon: "Landmark", iconColor: "#F5A623", type: "virtual", category: "debito" },
  { id: "3", name: "Juan Perez", maskedNumber: "****2547", icon: "CreditCard", iconColor: "#E84545", type: "fisica", category: "credito" },
];

export default function CardsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"debito" | "credito">("debito");

  const filtered = sampleCards.filter((c) => c.category === activeTab);
  const fisicas = filtered.filter((c) => c.type === "fisica");
  const virtuales = filtered.filter((c) => c.type === "virtual");

  function renderCardSection(title: string, items: CardData[]) {
    if (items.length === 0) return null;
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold">{title}</h3>
          <button className="text-sm font-semibold text-primary">Agregar +</button>
        </div>
        <div className="space-y-3">
          {items.map((card) => {
            const Icon = iconMap[card.icon] || LucideIcons.CreditCard;
            return (
              <div
                key={card.id}
                className="flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-sm"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${card.iconColor}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color: card.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{card.name}</p>
                  <p className="text-xs text-muted-foreground">{card.maskedNumber}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Atras"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold">Mis Tarjetas</h2>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl bg-muted p-1">
          <button
            onClick={() => setActiveTab("debito")}
            className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${
              activeTab === "debito"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Debito
          </button>
          <button
            onClick={() => setActiveTab("credito")}
            className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${
              activeTab === "credito"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Credito
          </button>
        </div>
      </div>

      {renderCardSection("Tarjeta Fisica", fisicas)}
      {renderCardSection("Tarjeta Virtual", virtuales)}
    </div>
  );
}
