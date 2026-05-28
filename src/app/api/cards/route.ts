import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { apiError } from "@/lib/api/server-error";
import { createCard, listActiveCards } from "@/lib/db/cards";
import { creditCardInsertSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function GET() {
  try {
    return NextResponse.json(await listActiveCards());
  } catch (error) {
    return apiError(error, "No se pudieron cargar las tarjetas");
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = creditCardInsertSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  try {
    const card = await createCard(parsed.data);
    revalidatePath("/cards");
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    return apiError(error, "No se pudo crear la tarjeta");
  }
}
