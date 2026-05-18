import useSWR, { mutate } from "swr";

import { sendJson } from "@/lib/api/fetcher";

export type CategoryDto = {
  id: number;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
};

export function useCategories() {
  return useSWR<CategoryDto[]>("/api/categories");
}

export async function createCategory(input: { name: string; icon: string; color: string }) {
  const result = await sendJson<CategoryDto>("/api/categories", "POST", input);
  await mutate("/api/categories");
  return result;
}

export async function updateCategory(id: number, input: { name: string; icon: string; color: string }) {
  const result = await sendJson<CategoryDto>(`/api/categories/${id}`, "PATCH", input);
  await mutate("/api/categories");
  return result;
}

export async function removeCategory(id: number) {
  await sendJson<void>(`/api/categories/${id}`, "DELETE", null);
  await mutate("/api/categories");
}

export async function deleteCategoryWithReassign(id: number, targetCategoryId: number) {
  await sendJson<void>(`/api/categories/${id}`, "DELETE", { reassignTo: targetCategoryId });
  await mutate("/api/categories");
}

export async function deleteCategoryWithTransactions(id: number) {
  await sendJson<void>(`/api/categories/${id}`, "DELETE", { deleteTransactions: true });
  await mutate("/api/categories");
}
