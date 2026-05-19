export async function fetcher<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(url, { signal: controller.signal, cache: "no-store" });
  } catch (error) {
    throw new Error(error instanceof DOMException && error.name === "AbortError" ? "La solicitud tardo demasiado. Intenta nuevamente." : "No se pudo conectar con el servidor.");
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Error inesperado" }));
    throw new Error(body.message ?? "Error inesperado");
  }
  return response.json().catch(() => {
    throw new Error("La respuesta del servidor no es JSON valido.");
  }) as Promise<T>;
}

export async function sendJson<T>(url: string, method: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Error inesperado" }));
    throw new Error(payload.message ?? "Error inesperado");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
