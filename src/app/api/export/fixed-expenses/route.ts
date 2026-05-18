import { NextResponse } from "next/server";

import { generateFixedExpensesCsv } from "@/lib/finance/csv-export";

export const dynamic = "force-dynamic";

export async function POST() {
  const csv = await generateFixedExpensesCsv();

  const now = new Date();
  const filename = `finanzas_gastos-fijos_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
