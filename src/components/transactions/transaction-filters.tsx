"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { useCategories } from "@/lib/api/categories";

export function TransactionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories = [] } = useCategories();

  const values = useMemo(() => ({
    type: searchParams.get("type") ?? "",
    fixed: searchParams.get("fixed") ?? "",
    categoryId: searchParams.get("categoryId") ?? "",
    period: searchParams.get("period") ?? "",
    month: searchParams.get("month") ?? "",
    year: searchParams.get("year") ?? "",
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
  }), [searchParams]);

  function update(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value); else params.delete(name);
    if (name === "period" && value !== "custom") {
      params.delete("from");
      params.delete("to");
    }
    if (name === "type") params.delete("fixed");
    if ((name === "month" || name === "year") && value) {
      params.delete("period");
      params.delete("from");
      params.delete("to");
    }
    params.delete("page");
    router.push(`/transactions?${params.toString()}`);
  }

  function setQuickFilter(next: "" | "income" | "expense" | "fixed") {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("type");
    params.delete("fixed");
    if (next === "fixed") {
      params.set("type", "expense");
      params.set("fixed", "1");
    } else if (next) {
      params.set("type", next);
    }
    router.push(`/transactions?${params.toString()}`);
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4">
      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: "Todos" },
          { value: "income", label: "Ingresos" },
          { value: "expense", label: "Gastos" },
          { value: "fixed", label: "Gastos fijos" },
        ].map((item) => {
          const active = item.value === "fixed" ? values.fixed : values.type === item.value && !values.fixed;
          return (
            <Button key={item.value || "all"} type="button" variant={active ? "primary" : "secondary"} onClick={() => setQuickFilter(item.value as "" | "income" | "expense" | "fixed")}>
              {item.label}
            </Button>
          );
        })}
      </div>
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
      <select className="min-h-10 rounded-xl border bg-background px-3 text-sm" value={values.type} onChange={(event) => update("type", event.target.value)}>
        <option value="">Todos</option>
        <option value="income">Ingresos</option>
        <option value="expense">Gastos</option>
      </select>
      <select className="min-h-10 rounded-xl border bg-background px-3 text-sm" value={values.categoryId} onChange={(event) => update("categoryId", event.target.value)}>
        <option value="">Categorias</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <select className="min-h-10 rounded-xl border bg-background px-3 text-sm" value={values.period} onChange={(event) => update("period", event.target.value)}>
        <option value="">Periodo rapido</option>
        <option value="current-month">Mes actual</option>
        <option value="previous-month">Mes anterior</option>
        <option value="last-3-months">Ultimos 3 meses</option>
        <option value="last-year">Ultimo ano</option>
        <option value="custom">Personalizado</option>
      </select>
      <select className="min-h-10 rounded-xl border bg-background px-3 text-sm" value={values.month} onChange={(event) => update("month", event.target.value)}>
        <option value="">Mes</option>
        {Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0")).map((month) => <option key={month} value={month}>{month}</option>)}
      </select>
      <select className="min-h-10 rounded-xl border bg-background px-3 text-sm" value={values.year} onChange={(event) => update("year", event.target.value)}>
        <option value="">Ano</option>
        {Array.from({ length: 6 }, (_, index) => currentYear - index).map((year) => <option key={year} value={year}>{year}</option>)}
      </select>
      <input className="min-h-10 rounded-xl border bg-background px-3 text-sm" type="date" value={values.from} onChange={(event) => update("from", event.target.value)} />
      <input className="min-h-10 rounded-xl border bg-background px-3 text-sm" type="date" value={values.to} onChange={(event) => update("to", event.target.value)} />
      <Button type="button" variant="secondary" onClick={() => router.push("/transactions")}>Limpiar</Button>
      </div>
    </div>
  );
}
