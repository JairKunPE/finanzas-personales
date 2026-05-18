import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { deleteTransaction, getTransaction, updateTransaction } from "@/lib/db/transactions";
import { getCurrencySettings } from "@/lib/db/settings";
import { transactionInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const transaction = await getTransaction(Number(id));
  if (!transaction) return NextResponse.json({ message: "Transaccion no encontrada" }, { status: 404 });
  return NextResponse.json(transaction);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = transactionInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const settings = await getCurrencySettings();
  const input = parsed.data.currency === "USD" && !parsed.data.exchangeRate ? { ...parsed.data, exchangeRate: settings.usdToPen } : parsed.data;
  const transaction = await updateTransaction(Number(id), input);
  if (!transaction) return NextResponse.json({ message: "Transaccion no encontrada" }, { status: 404 });
  return NextResponse.json(transaction);
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const deleted = await deleteTransaction(Number(id));
  if (!deleted) return NextResponse.json({ message: "Transaccion no encontrada" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
