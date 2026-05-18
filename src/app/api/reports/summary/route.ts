import { NextRequest, NextResponse } from "next/server";

import { getCategoryBreakdown, getFixedVsVariable, getMonthlyBalance, getMonthlyEvolution, getReportSummary, getTopCategories } from "@/lib/finance/reports";
import type { PeriodType } from "@/lib/finance/reports";

export const dynamic = "force-dynamic";

const validPeriods = new Set(["monthly", "quarterly", "semiannual", "annual"]);

export function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") ?? "monthly";
  const year = Number(request.nextUrl.searchParams.get("year")) || new Date().getFullYear();
  const monthParam = request.nextUrl.searchParams.get("month");

  if (!validPeriods.has(period)) {
    return NextResponse.json({ message: "Periodo invalido" }, { status: 400 });
  }

  const summary = getReportSummary(period as PeriodType, year, monthParam ? Number(monthParam) : undefined);
  const evolution = getMonthlyEvolution(summary.range.startDate, summary.range.endDate);
  const breakdown = getCategoryBreakdown(summary.range.startDate, summary.range.endDate);
  const topCategories = getTopCategories(summary.range.startDate, summary.range.endDate);
  const fixedVariable = getFixedVsVariable(summary.range.startDate, summary.range.endDate);
  const monthlyBalance = getMonthlyBalance(summary.range.startDate, summary.range.endDate);

  return NextResponse.json({ summary, evolution, breakdown, topCategories, fixedVariable, monthlyBalance });
}
