export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Error inesperado" }));
    throw new Error(body.message ?? "Error inesperado");
  }
  return response.json() as Promise<T>;
}

export async function sendJson<T>(url: string, method: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Error inesperado" }));
    throw new Error(payload.message ?? "Error inesperado");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
