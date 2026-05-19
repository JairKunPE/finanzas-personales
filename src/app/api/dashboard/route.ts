import { NextRequest, NextResponse } from "next/server";

import { apiError } from "@/lib/api/server-error";
import { getDashboardSummary } from "@/lib/finance/dashboard";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const month = request.nextUrl.searchParams.get("month") ?? undefined;
    return NextResponse.json(await getDashboardSummary(month));
  } catch (error) {
    return apiError(error, "No se pudo cargar el dashboard");
  }
}
