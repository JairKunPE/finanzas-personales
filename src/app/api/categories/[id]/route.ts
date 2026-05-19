import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { apiError } from "@/lib/api/server-error";
import { deleteTransactionsByCategory, getCategory, reassignTransactions, softDeleteCategory, updateCategory } from "@/lib/db/categories";
import { categoryInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function notFound() {
  return NextResponse.json({ message: "Categoria no encontrada" }, { status: 404 });
}

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const categoryId = Number(id);
    const existing = await getCategory(categoryId);
    if (!existing) return notFound();

    const body = await request.json().catch(() => null);
    const parsed = categoryInputSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const updated = await updateCategory(categoryId, parsed.data);
    revalidatePath("/categories");
    revalidatePath("/transactions");
    revalidatePath("/budgets");
    return NextResponse.json(updated);
  } catch (error) {
    return apiError(error, "No se pudo actualizar la categoria");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
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
    revalidatePath("/categories");
    revalidatePath("/transactions");
    revalidatePath("/budgets");
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "No se pudo eliminar la categoria");
  }
}
