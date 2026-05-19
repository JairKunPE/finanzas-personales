import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { apiError } from "@/lib/api/server-error";
import { createTransaction, listTransactions } from "@/lib/db/transactions";
import { getCurrencySettings } from "@/lib/db/settings";
import { transactionInputSchema, transactionQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = transactionQuerySchema.safeParse(params);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return NextResponse.json(await listTransactions(parsed.data));
  } catch (error) {
    return apiError(error, "No se pudieron cargar las transacciones");
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = transactionInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  try {
    const settings = await getCurrencySettings();
    const input = parsed.data.currency === "USD" && !parsed.data.exchangeRate ? { ...parsed.data, exchangeRate: settings.usdToPen } : parsed.data;
    const transaction = await createTransaction(input);
    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/reports");
    revalidatePath("/budgets");
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return apiError(error, "No se pudo crear la transaccion");
  }
}
