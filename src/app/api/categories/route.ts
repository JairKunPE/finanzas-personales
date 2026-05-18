import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { createCategory, listActiveCategories } from "@/lib/db/categories";
import { categoryInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function GET() {
  return NextResponse.json(await listActiveCategories());
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const category = await createCategory(parsed.data);
  return NextResponse.json(category, { status: 201 });
}
