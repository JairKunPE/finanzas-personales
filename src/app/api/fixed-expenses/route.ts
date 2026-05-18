import { NextResponse } from "next/server";

import { listFixedExpenses } from "@/lib/db/transactions";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(listFixedExpenses());
}
