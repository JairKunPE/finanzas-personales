import { eq } from "drizzle-orm";

import { db, nowISO } from "@/lib/db";
import { settings } from "@/lib/db/schema";

const USD_TO_PEN_KEY = "usdToPen";
const DEFAULT_USD_TO_PEN = 3.75;

export type CurrencySettings = {
  baseCurrency: "PEN";
  usdToPen: number;
  updatedAt: string;
};

export function getCurrencySettings(): CurrencySettings {
  const row = db.select().from(settings).where(eq(settings.key, USD_TO_PEN_KEY)).get();
  if (!row) {
    return setUsdToPen(DEFAULT_USD_TO_PEN);
  }
  return { baseCurrency: "PEN", usdToPen: Number(row.value), updatedAt: row.updatedAt };
}

export function setUsdToPen(rate: number): CurrencySettings {
  const updatedAt = nowISO();
  db.insert(settings)
    .values({ key: USD_TO_PEN_KEY, value: String(rate), updatedAt })
    .onConflictDoUpdate({ target: settings.key, set: { value: String(rate), updatedAt } })
    .run();
  return { baseCurrency: "PEN", usdToPen: rate, updatedAt };
}

export function convertToPen(amount: number, currency: "PEN" | "USD", exchangeRate: number) {
  return currency === "USD" ? amount * exchangeRate : amount;
}
