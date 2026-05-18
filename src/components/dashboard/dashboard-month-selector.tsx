"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function DashboardMonthSelector({ selectedMonth }: { selectedMonth: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(month: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    router.push(`/?${params.toString()}`);
  }

  return (
    <label className="grid gap-2 text-sm font-medium">
      Mes del dashboard
      <input
        aria-label="Mes del dashboard"
        className="min-h-10 rounded-xl border bg-background px-3"
        type="month"
        value={selectedMonth}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
