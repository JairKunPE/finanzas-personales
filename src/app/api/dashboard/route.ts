import { NextRequest, NextResponse } from "next/server";

import { getDashboardSummary } from "@/lib/finance/dashboard";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month") ?? undefined;
  return NextResponse.json(await getDashboardSummary(month));
}
