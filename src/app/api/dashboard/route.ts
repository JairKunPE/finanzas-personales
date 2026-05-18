import { NextRequest, NextResponse } from "next/server";

import { getDashboardSummary } from "@/lib/finance/dashboard";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month") ?? undefined;
  return NextResponse.json(getDashboardSummary(month));
}
