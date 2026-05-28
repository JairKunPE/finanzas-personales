"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/transactions/category-select";
import { transactionDefaults, transactionInputSchema } from "@/components/transactions/transaction-form-schema";
import { zodResolver } from "@/lib/forms";
import { createTransaction, updateTransaction, type TransactionDto } from "@/lib/api/transactions";
import { useCards } from "@/lib/api/cards";
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
  const creditCardId = form.watch("creditCardId");
  const { data: cards } = useCards();
  const selectedCard = cards?.find((c) => c.id === creditCardId);

  useEffect(() => {
    if (!transaction && currency === "USD" && currencySettings?.usdToPen) {
      form.setValue("exchangeRate", currencySettings.usdToPen, { shouldValidate: true });
    }
    if (currency === "PEN") {
      form.setValue("exchangeRate", 1, { shouldValidate: true });
    }
    if (type === "income") {
      if (isRecurring) {
        form.setValue("isRecurring", false, { shouldValidate: true });
        form.setValue("billingCycle", undefined, { shouldValidate: true });
      }
      if (form.watch("creditCardId") !== null) {
        form.setValue("creditCardId", null, { shouldValidate: true });
      }
    }
  }, [currency, currencySettings?.usdToPen, form, isRecurring, transaction, type]);

  async function onSubmit(input: TransactionInput) {
    try {
      const normalizedInput = { ...input, exchangeRate: input.currency === "USD" ? input.exchangeRate : 1 };
      if (transaction) {
        await updateTransaction(transaction.id, normalizedInput);
        toast.success("Transaccion actualizada");
      } else {
        await createTransaction(normalizedInput);
        toast.success("Transaccion creada");
      }
      router.push("/transactions");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la transaccion");
    }
  }

  const errors = form.formState.errors;

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="rounded-3xl border bg-card p-5 space-y-5">
        <label className="grid gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Tipo</span>
          <select className="min-h-11 rounded-xl border bg-background px-3" {...form.register("type")}>
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
          {errors.type ? <span className="text-xs text-expense">{errors.type.message}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Monto</span>
          <input className="min-h-11 rounded-xl border bg-background px-3" type="number" step="0.01" min="0.01" {...form.register("amount", { valueAsNumber: true })} />
          {errors.amount ? <span className="text-xs text-expense">{errors.amount.message}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Descripcion</span>
          <input className="min-h-11 rounded-xl border bg-background px-3" {...form.register("description")} />
          {errors.description ? <span className="text-xs text-expense">{errors.description.message}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Categoria</span>
          <CategorySelect value={form.watch("categoryId")} onChange={(value) => form.setValue("categoryId", value, { shouldValidate: true })} />
          {errors.categoryId ? <span className="text-xs text-expense">{errors.categoryId.message}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Fecha</span>
          <input className="min-h-11 rounded-xl border bg-background px-3" type="date" {...form.register("date")} />
          {errors.date ? <span className="text-xs text-expense">{errors.date.message}</span> : null}
        </label>

        {type === "expense" ? (
          <label className="grid gap-2 text-sm font-medium">
            <span className="text-muted-foreground">Metodo de pago</span>
            <select
              className="min-h-11 rounded-xl border bg-background px-3"
              value={creditCardId ? "card" : "cash"}
              onChange={(e) => form.setValue("creditCardId", e.target.value === "card" ? (cards?.[0]?.id ?? null) : null, { shouldValidate: true })}
            >
              <option value="cash">Contado / Debito</option>
              <option value="card">Tarjeta de credito</option>
            </select>
            {creditCardId && cards && cards.length > 0 ? (
              <select
                className="min-h-11 rounded-xl border bg-background px-3"
                value={creditCardId ?? ""}
                onChange={(e) => form.setValue("creditCardId", e.target.value ? Number(e.target.value) : null, { shouldValidate: true })}
              >
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name} (Limite: S/ {card.limitAmount.toLocaleString("es-PE")})
                  </option>
                ))}
              </select>
            ) : creditCardId ? (
              <p className="text-xs text-muted-foreground">No hay tarjetas registradas</p>
            ) : null}
            {selectedCard ? (
              <div className="rounded-xl bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                Corte: dia {selectedCard.statementDay} | Pago: dia {selectedCard.paymentDay}
              </div>
            ) : null}
          </label>
        ) : null}
      </div>

      <details className="rounded-3xl border bg-card p-5">
        <summary className="cursor-pointer text-sm font-semibold">Opciones avanzadas: moneda y gasto fijo</summary>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              <span className="text-muted-foreground">Moneda</span>
              <select className="min-h-11 rounded-xl border bg-background px-3" {...form.register("currency")}>
                <option value="PEN">Soles (PEN)</option>
                <option value="USD">Dolares (USD)</option>
              </select>
              {errors.currency ? <span className="text-xs text-expense">{errors.currency.message}</span> : null}
            </label>
            {currency === "USD" ? (
              <label className="grid gap-2 text-sm font-medium">
                <span className="text-muted-foreground">Tipo de cambio USD a PEN (opcional)</span>
                <input className="min-h-11 rounded-xl border bg-background px-3" type="number" step="0.001" min="0.001" placeholder={String(currencySettings?.usdToPen ?? 3.75)} {...form.register("exchangeRate", { setValueAs: (value) => value === "" ? undefined : Number(value) })} />
              {errors.exchangeRate ? <span className="text-xs text-expense">{errors.exchangeRate.message}</span> : null}
              </label>
            ) : null}
          </div>
          {currency === "USD" ? (
            <div className="rounded-xl bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              {formatOriginalCurrency(amount, "USD")} equivale a <strong className="text-foreground">{formatCurrency(amount * exchangeRate)}</strong>
            </div>
          ) : null}
          <div className="rounded-2xl bg-muted/20 p-4">
            <label className="flex items-center gap-3 text-sm font-medium">
              <input type="checkbox" className="h-4 w-4" disabled={type === "income"} {...form.register("isRecurring")} />
              Marcar como gasto fijo / suscripcion
            </label>
            {errors.isRecurring ? <p className="mt-1 text-xs text-expense">{errors.isRecurring.message}</p> : null}
            {type === "income" ? <p className="mt-2 text-xs text-muted-foreground">Solo los gastos pueden marcarse como fijos.</p> : null}
            {isRecurring ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  <span className="text-muted-foreground">Ciclo de facturacion</span>
                  <select className="min-h-11 rounded-xl border bg-background px-3" {...form.register("billingCycle")}>
                    <option value="">Selecciona ciclo</option>
                    {Object.entries(billingCycleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  {errors.billingCycle ? <span className="text-xs text-expense">{errors.billingCycle.message}</span> : null}
                </label>
                <div className="rounded-xl bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                  <p>Equivalente mensual</p>
                  <p className="font-semibold text-foreground">{billingCycle ? formatCurrency((currency === "USD" ? amount * exchangeRate : amount) / ({ monthly: 1, quarterly: 3, semiannual: 6, annual: 12 }[billingCycle] ?? 1)) : "Selecciona ciclo"}</p>
                  <p className="mt-1">Proximo cobro: {billingCycle && date ? calculateNextBillingDate(date, billingCycle) : "pendiente"}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </details>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1 rounded-full" disabled={form.formState.isSubmitting}>{transaction ? "Guardar cambios" : "Crear transaccion"}</Button>
        <Button type="button" variant="secondary" className="rounded-full" onClick={() => router.push("/transactions")}>Cancelar</Button>
      </div>
    </form>
  );
}
