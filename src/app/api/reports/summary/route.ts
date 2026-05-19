import { NextRequest, NextResponse } from "next/server";

import { apiError } from "@/lib/api/server-error";
import { getCategoryBreakdown, getFixedVsVariable, getMonthlyBalance, getMonthlyEvolution, getReportSummary, getTopCategories } from "@/lib/finance/reports";
import type { PeriodType } from "@/lib/finance/reports";

export const dynamic = "force-dynamic";

const validPeriods = new Set(["monthly", "quarterly", "semiannual", "annual"]);

export async function GET(request: NextRequest) {
  try {
    const period = request.nextUrl.searchParams.get("period") ?? "monthly";
    const year = Number(request.nextUrl.searchParams.get("year")) || new Date().getFullYear();
    const monthParam = request.nextUrl.searchParams.get("month");

    if (!validPeriods.has(period)) {
      return NextResponse.json({ message: "Periodo invalido" }, { status: 400 });
    }

    const summary = await getReportSummary(period as PeriodType, year, monthParam ? Number(monthParam) : undefined);
    const evolution = await getMonthlyEvolution(summary.range.startDate, summary.range.endDate);
    const breakdown = await getCategoryBreakdown(summary.range.startDate, summary.range.endDate);
    const topCategories = await getTopCategories(summary.range.startDate, summary.range.endDate);
    const fixedVariable = await getFixedVsVariable(summary.range.startDate, summary.range.endDate);
    const monthlyBalance = await getMonthlyBalance(summary.range.startDate, summary.range.endDate);

    return NextResponse.json({ summary, evolution, breakdown, topCategories, fixedVariable, monthlyBalance });
  } catch (error) {
    return apiError(error, "No se pudo cargar el reporte");
  }
}
