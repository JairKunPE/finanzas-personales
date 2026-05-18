"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/transactions/category-select";
import { transactionDefaults, transactionInputSchema } from "@/components/transactions/transaction-form-schema";
import { zodResolver } from "@/lib/forms";
import { createTransaction, updateTransaction, type TransactionDto } from "@/lib/api/transactions";
import { useCurrencySettings } from "@/lib/api/settings";
import { formatCurrency, formatOriginalCurrency } from "@/lib/formats";
import { billingCycleLabels, calculateNextBillingDate } from "@/lib/finance/fixed-expenses";
import type { TransactionInput } from "@/lib/validation";

export function TransactionForm({ transaction }: { transaction?: TransactionDto }) {
  const router = useRouter();
  const { data: currencySettings } = useCurrencySettings();
  const defaultValues = useMemo<TransactionInput>(() => {
    if (!transaction) return transactionDefaults;
    return { ...transaction, billingCycle: transaction.billingCycle ?? undefined };
  }, [transaction]);
  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionInputSchema),
    defaultValues,
  });

  const currency = form.watch("currency");
  const type = form.watch("type");
  const isRecurring = form.watch("isRecurring");
  const billingCycle = form.watch("billingCycle");
  const date = form.watch("date");
  const amount = form.watch("amount") || 0;
  const exchangeRate = form.watch("exchangeRate") || currencySettings?.usdToPen || 1;

  useEffect(() => {
    if (!transaction && currency === "USD" && currencySettings?.usdToPen) {
      form.setValue("exchangeRate", currencySettings.usdToPen, { shouldValidate: true });
    }
    if (currency === "PEN") {
      form.setValue("exchangeRate", 1, { shouldValidate: true });
    }
    if (type === "income" && isRecurring) {
      form.setValue("isRecurring", false, { shouldValidate: true });
      form.setValue("billingCycle", undefined, { shouldValidate: true });
    }
  }, [currency, currencySettings?.usdToPen, form, isRecurring, transaction, type]);

  async function onSubmit(input: TransactionInput) {
    const normalizedInput = { ...input, exchangeRate: input.currency === "USD" ? input.exchangeRate : 1 };
    if (transaction) {
      await updateTransaction(transaction.id, normalizedInput);
    } else {
      await createTransaction(normalizedInput);
    }
    router.push("/transactions");
    router.refresh();
  }

  const errors = form.formState.errors;

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <label className="grid gap-2 text-sm font-medium">
        Tipo
        <select className="min-h-11 rounded-xl border bg-background px-3" {...form.register("type")}>
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Monto
        <input className="min-h-11 rounded-xl border bg-background px-3" type="number" step="0.01" min="0.01" {...form.register("amount", { valueAsNumber: true })} />
        {errors.amount ? <span className="text-xs text-expense">{errors.amount.message}</span> : null}
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Moneda
          <select className="min-h-11 rounded-xl border bg-background px-3" {...form.register("currency")}>
            <option value="PEN">Soles (PEN)</option>
            <option value="USD">Dolares (USD)</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Tipo de cambio USD a PEN
          <input className="min-h-11 rounded-xl border bg-background px-3" type="number" step="0.001" min="0.001" disabled={currency === "PEN"} {...form.register("exchangeRate", { valueAsNumber: true })} />
        </label>
      </div>
      {currency === "USD" ? (
        <div className="rounded-xl border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {formatOriginalCurrency(amount, "USD")} equivale a <strong className="text-foreground">{formatCurrency(amount * exchangeRate)}</strong>
        </div>
      ) : null}
      <div className="rounded-2xl border bg-muted/20 p-4">
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            className="h-4 w-4"
            disabled={type === "income"}
            {...form.register("isRecurring")}
          />
          Marcar como gasto fijo / suscripcion
        </label>
        {type === "income" ? <p className="mt-2 text-xs text-muted-foreground">Solo los gastos pueden marcarse como fijos.</p> : null}
        {isRecurring ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Ciclo de facturacion
              <select className="min-h-11 rounded-xl border bg-background px-3" {...form.register("billingCycle")}>
                <option value="">Selecciona ciclo</option>
                {Object.entries(billingCycleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              {errors.billingCycle ? <span className="text-xs text-expense">{errors.billingCycle.message}</span> : null}
            </label>
            <div className="rounded-xl border bg-background px-3 py-2 text-sm text-muted-foreground">
              <p>Equivalente mensual</p>
              <p className="font-semibold text-foreground">{billingCycle ? formatCurrency((currency === "USD" ? amount * exchangeRate : amount) / ({ monthly: 1, quarterly: 3, semiannual: 6, annual: 12 }[billingCycle] ?? 1)) : "Selecciona ciclo"}</p>
              <p className="mt-1">Proximo cobro: {billingCycle && date ? calculateNextBillingDate(date, billingCycle) : "pendiente"}</p>
            </div>
          </div>
        ) : null}
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Descripcion
        <input className="min-h-11 rounded-xl border bg-background px-3" {...form.register("description")} />
        {errors.description ? <span className="text-xs text-expense">{errors.description.message}</span> : null}
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Categoria
        <CategorySelect value={form.watch("categoryId")} onChange={(value) => form.setValue("categoryId", value, { shouldValidate: true })} />
        {errors.categoryId ? <span className="text-xs text-expense">{errors.categoryId.message}</span> : null}
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Fecha
        <input className="min-h-11 rounded-xl border bg-background px-3" type="date" {...form.register("date")} />
        {errors.date ? <span className="text-xs text-expense">{errors.date.message}</span> : null}
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>{transaction ? "Guardar cambios" : "Crear transaccion"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/transactions")}>Cancelar</Button>
      </div>
    </form>
  );
}
