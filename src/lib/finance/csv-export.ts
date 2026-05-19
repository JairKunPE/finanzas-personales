import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { listFixedExpenses, allTransactionsWithCategories, type TransactionRow } from "@/lib/db/transactions";
import { billingCycleLabels } from "@/lib/finance/fixed-expenses";
import { toCsv } from "@/lib/finance/csv";
import type { TransactionQuery } from "@/lib/validation";

const typeLabels: Record<string, string> = { income: "Ingreso", expense: "Gasto" };
const currencyLabels: Record<string, string> = { PEN: "Soles", USD: "Dolares" };

function formatDateSpanish(dateStr: string) {
  try {
    return format(parseISO(dateStr), "d MMM yyyy", { locale: es });
  } catch {
    return dateStr;
  }
}

export async function exportableTransactions(query: TransactionQuery) {
  const all = await allTransactionsWithCategories();
  const filtered = filterTransactionsInMemory(all, query);

  return filtered.map((t) => ({
    Fecha: formatDateSpanish(t.date),
    Tipo: typeLabels[t.type] ?? t.type,
    Descripcion: t.description,
    Categoria: t.categoryName,
    "Monto Original": t.originalAmount,
    Moneda: currencyLabels[t.currency] ?? t.currency,
    "Tipo Cambio": t.exchangeRate,
    "Monto Soles": t.amountPen,
    Fijo: t.isRecurring ? "Si" : "No",
    "Ciclo Facturacion": t.billingCycle ? (billingCycleLabels[t.billingCycle] ?? t.billingCycle) : "",
    "Proxima Factura": t.nextBillingDate ? formatDateSpanish(t.nextBillingDate) : "",
  }));
}

function filterTransactionsInMemory(transactions: TransactionRow[], query: TransactionQuery) {
  return transactions.filter((t) => {
    if (query.type && t.type !== query.type) return false;
    if (query.categoryId && t.categoryId !== query.categoryId) return false;
    if (query.fixed && !t.isRecurring) return false;
    if (query.from && t.date < query.from) return false;
    if (query.to && t.date > query.to) return false;
    return true;
  });
}

export async function exportableFixedExpenses() {
  const { items } = await listFixedExpenses();

  return items.map((e) => ({
    Descripcion: e.description,
    Categoria: e.categoryName,
    "Monto por Ciclo": e.originalAmount,
    Moneda: currencyLabels[e.currency] ?? e.currency,
    "Monto Soles": e.amountPen,
    "Ciclo Facturacion": billingCycleLabels[e.billingCycle] ?? e.billingCycle,
    "Equivalente Mensual Soles": e.monthlyEquivalentPen,
    "Proximo Cobro": formatDateSpanish(e.nextBillingDate),
    Grupo: e.group,
    "Vence Pronto": e.dueSoon ? "Si" : "No",
  }));
}

export async function generateTransactionsCsv(query: TransactionQuery) {
  const rows = await exportableTransactions(query);
  return toCsv(rows);
}

export async function generateFixedExpensesCsv() {
  const rows = await exportableFixedExpenses();
  return toCsv(rows);
}
