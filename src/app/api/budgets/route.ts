import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { apiError } from "@/lib/api/server-error";
import { listBudgetsWithSpent, upsertBudget } from "@/lib/db/budgets";
import { budgetInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  if (!month) return NextResponse.json({ message: "month is required" }, { status: 400 });
  try {
    return NextResponse.json(await listBudgetsWithSpent(month));
  } catch (error) {
    return apiError(error, "No se pudieron cargar los presupuestos");
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = budgetInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  try {
    await upsertBudget(parsed.data.categoryId, parsed.data.month, parsed.data.limitAmount);
    revalidatePath("/");
    revalidatePath("/budgets");
    const all = await listBudgetsWithSpent(parsed.data.month);
    const updated = all.find((b) => b.categoryId === parsed.data.categoryId);
    return NextResponse.json(updated ?? all[0], { status: 201 });
  } catch (error) {
    return apiError(error, "No se pudo guardar el presupuesto");
  }
}
