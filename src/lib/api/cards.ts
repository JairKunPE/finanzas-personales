import useSWR, { mutate } from "swr";

import { sendJson } from "@/lib/api/fetcher";
import type { CreditCardInsert } from "@/lib/validation";
import type { CreditCard } from "@/lib/db/schema";

export type CardDto = CreditCard;

export function useCards() {
  return useSWR<CardDto[]>("/api/cards");
}

export async function createCard(input: CreditCardInsert) {
  const result = await sendJson<CardDto>("/api/cards", "POST", input);
  await mutate("/api/cards");
  return result;
}

export async function updateCard(id: number, input: CreditCardInsert) {
  const result = await sendJson<CardDto>(`/api/cards/${id}`, "PATCH", input);
  await mutate("/api/cards");
  return result;
}

export async function removeCard(id: number, deleteTransactions: boolean) {
  await sendJson<void>(`/api/cards/${id}`, "DELETE", { deleteTransactions });
  await mutate("/api/cards");
}
