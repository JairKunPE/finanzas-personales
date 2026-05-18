"use client";

import { cn } from "@/lib/utils";

const palette = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#06b6d4",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e",
  "#64748b", "#78716c", "#020617", "#1e293b", "#475569", "#94a3b8",
];

export function ColorSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {palette.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() => onChange(color)}
            className={cn(
              "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
              value === color ? "border-foreground scale-110" : "border-transparent",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <label className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">Personalizado:</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded border bg-transparent"
        />
        <code className="text-xs text-muted-foreground">{value}</code>
      </label>
    </div>
  );
}
