import { NextResponse } from "next/server";

import { listFixedExpenses } from "@/lib/db/transactions";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listFixedExpenses());
}
