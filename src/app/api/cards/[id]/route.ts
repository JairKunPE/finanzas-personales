import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { apiError } from "@/lib/api/server-error";
import { getCard, softDeleteCard, unlinkTransactionsForCard, updateCard } from "@/lib/db/cards";
import { creditCardInsertSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function notFound() {
  return NextResponse.json({ message: "Tarjeta no encontrada" }, { status: 404 });
}

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cardId = Number(id);
    const existing = await getCard(cardId);
    if (!existing) return notFound();

    const body = await request.json().catch(() => null);
    const parsed = creditCardInsertSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const updated = await updateCard(cardId, parsed.data);
    revalidatePath("/cards");
    return NextResponse.json(updated);
  } catch (error) {
    return apiError(error, "No se pudo actualizar la tarjeta");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cardId = Number(id);
    const existing = await getCard(cardId);
    if (!existing) return notFound();

    const body = await request.json().catch(() => ({}));
    const { deleteTransactions: shouldDeleteTransactions } = body;

    if (!shouldDeleteTransactions) {
      await unlinkTransactionsForCard(cardId);
    }

    await softDeleteCard(cardId);
    revalidatePath("/cards");
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "No se pudo eliminar la tarjeta");
  }
}
