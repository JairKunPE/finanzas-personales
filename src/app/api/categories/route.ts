import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { apiError } from "@/lib/api/server-error";
import { createCategory, listActiveCategories } from "@/lib/db/categories";
import { categoryInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function GET() {
  try {
    return NextResponse.json(await listActiveCategories());
  } catch (error) {
    return apiError(error, "No se pudieron cargar las categorias");
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  try {
    const category = await createCategory(parsed.data);
    revalidatePath("/categories");
    revalidatePath("/transactions");
    revalidatePath("/budgets");
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return apiError(error, "No se pudo crear la categoria");
  }
}
