import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { listBudgetsWithSpent, upsertBudget } from "@/lib/db/budgets";
import { budgetInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  if (!month) return NextResponse.json({ message: "month is required" }, { status: 400 });
  return NextResponse.json(await listBudgetsWithSpent(month));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = budgetInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  await upsertBudget(parsed.data.categoryId, parsed.data.month, parsed.data.limitAmount);
  const all = await listBudgetsWithSpent(parsed.data.month);
  const updated = all.find((b) => b.categoryId === parsed.data.categoryId);
  return NextResponse.json(updated ?? all[0], { status: 201 });
}
