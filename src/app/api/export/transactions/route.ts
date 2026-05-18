import { NextRequest, NextResponse } from "next/server";

import { generateTransactionsCsv } from "@/lib/finance/csv-export";
import { transactionQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = transactionQuerySchema.safeParse(body);
  const query = parsed.success ? parsed.data : { page: 1, pageSize: 10000 };

  const csv = await generateTransactionsCsv(query);

  const now = new Date();
  const filename = `finanzas_transacciones_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
