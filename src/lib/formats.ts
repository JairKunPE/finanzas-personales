import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "PEN",
});

export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatOriginalCurrency(value: number, currency: "PEN" | "USD") {
  return currency === "USD" ? usdFormatter.format(value) : currencyFormatter.format(value);
}

export function formatDate(value: string) {
  return format(parseISO(value), "d MMM yyyy", { locale: es });
}

export function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

export function currentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}
