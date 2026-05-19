"use client";

import { useSearchParams } from "next/navigation";

import { CsvDownloadButton } from "@/components/export/csv-download-button";

export function TransactionExportButton() {
  const searchParams = useSearchParams();

  const body: Record<string, string> = {};
  const type = searchParams.get("type");
  const categoryId = searchParams.get("categoryId");
  const period = searchParams.get("period");
  const fixed = searchParams.get("fixed");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  if (type) body.type = type;
  if (categoryId) body.categoryId = categoryId;
  if (period) body.period = period;
  if (fixed) body.fixed = fixed;
  if (from) body.from = from;
  if (to) body.to = to;
  if (month) body.month = month;
  if (year) body.year = year;

  return <CsvDownloadButton label="Exportar CSV" url="/api/export/transactions" method="POST" body={body} />;
}
