import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { deleteTransactionsByCategory, getCategory, reassignTransactions, softDeleteCategory, transactionsCount, updateCategory } from "@/lib/db/categories";
import { categoryInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function notFound() {
  return NextResponse.json({ message: "Categoria no encontrada" }, { status: 404 });
}

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryId = Number(id);
  const existing = await getCategory(categoryId);
  if (!existing) return notFound();

  const body = await request.json().catch(() => null);
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const updated = await updateCategory(categoryId, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryId = Number(id);
  const existing = await getCategory(categoryId);
  if (!existing) return notFound();

  if (existing.isDefault) {
    return NextResponse.json({ message: "No se puede eliminar una categoria por defecto" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const { reassignTo, deleteTransactions: shouldDeleteTransactions } = body;

  if (reassignTo) {
    await reassignTransactions(categoryId, Number(reassignTo));
  } else if (shouldDeleteTransactions) {
    await deleteTransactionsByCategory(categoryId);
  }

  await softDeleteCategory(categoryId);
  return NextResponse.json({ success: true });
}
