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

export async function getCurrencySettings(): Promise<CurrencySettings> {
  const rows = await db.select().from(settings).where(eq(settings.key, USD_TO_PEN_KEY)).limit(1);
  const row = rows[0];
  if (!row) {
    return setUsdToPen(DEFAULT_USD_TO_PEN);
  }
  return { baseCurrency: "PEN", usdToPen: Number(row.value), updatedAt: row.updatedAt };
}

export async function setUsdToPen(rate: number): Promise<CurrencySettings> {
  const updatedAt = nowISO();
  await db.insert(settings)
    .values({ key: USD_TO_PEN_KEY, value: String(rate), updatedAt })
    .onConflictDoUpdate({ target: settings.key, set: { value: String(rate), updatedAt } });
  return { baseCurrency: "PEN", usdToPen: rate, updatedAt };
}

export function convertToPen(amount: number, currency: "PEN" | "USD", exchangeRate: number) {
  return currency === "USD" ? amount * exchangeRate : amount;
}
