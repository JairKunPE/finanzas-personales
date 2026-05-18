import useSWR, { mutate } from "swr";

import { sendJson } from "@/lib/api/fetcher";

export type CurrencySettingsDto = {
  baseCurrency: "PEN";
  usdToPen: number;
  updatedAt: string;
};

export function useCurrencySettings() {
  return useSWR<CurrencySettingsDto>("/api/settings/currency");
}

export async function updateUsdToPen(usdToPen: number) {
  const result = await sendJson<CurrencySettingsDto>("/api/settings/currency", "PATCH", { usdToPen });
  await mutate("/api/settings/currency", result, false);
  return result;
}
