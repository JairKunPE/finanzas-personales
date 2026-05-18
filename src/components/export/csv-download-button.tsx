"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function CsvDownloadButton({
  label = "Exportar CSV",
  url,
  method = "GET",
  body,
  filename,
}: {
  label?: string;
  url: string;
  method?: "GET" | "POST";
  body?: unknown;
  filename?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename ?? getSuggestedFilename(response);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={handleDownload} disabled={loading}>
      {loading ? "Exportando..." : label}
    </Button>
  );
}

function getSuggestedFilename(response: Response) {
  const disposition = response.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="?(.+?)"?$/);
  return match?.[1] ?? "export.csv";
}
