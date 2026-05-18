import { NextRequest, NextResponse } from "next/server";

import { generateReportCsv } from "@/lib/finance/reports";
import type { PeriodType } from "@/lib/finance/reports";

export const dynamic = "force-dynamic";

const validPeriods = new Set(["monthly", "quarterly", "semiannual", "annual"]);

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") ?? "monthly";
  const year = Number(request.nextUrl.searchParams.get("year")) || new Date().getFullYear();
  const monthParam = request.nextUrl.searchParams.get("month");

  if (!validPeriods.has(period)) {
    return NextResponse.json({ message: "Periodo invalido" }, { status: 400 });
  }

  const csv = await generateReportCsv(period as PeriodType, year, monthParam ? Number(monthParam) : undefined);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reporte-${period}-${year}.csv"`,
    },
  });
}
