"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";

import { iconGroups } from "@/lib/finance/icons";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;

export function IconSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [search, setSearch] = useState("");

  const filtered = iconGroups
    .map((group) => ({
      ...group,
      icons: group.icons.filter((name) => name.toLowerCase().includes(search.toLowerCase())),
    }))
    .filter((group) => group.icons.length > 0);

  function handleSelect(iconName: string) {
    onChange(iconName);
  }

  return (
    <div className="space-y-3">
      <input
        className="min-h-10 w-full rounded-xl border bg-background px-3 text-sm"
        placeholder="Buscar icono..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-80 overflow-y-auto space-y-3">
        {filtered.map((group) => (
          <div key={group.label}>
            <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.icons.map((iconName) => {
                const Icon = iconMap[iconName];
                if (!Icon) return null;
                const isSelected = value === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    title={iconName}
                    onClick={() => handleSelect(iconName)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                      isSelected ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-muted/50 text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 ? <p className="text-sm text-muted-foreground">Sin resultados</p> : null}
      </div>
    </div>
  );
}
