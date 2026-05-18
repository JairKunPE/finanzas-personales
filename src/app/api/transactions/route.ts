import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { createTransaction, listTransactions } from "@/lib/db/transactions";
import { getCurrencySettings } from "@/lib/db/settings";
import { transactionInputSchema, transactionQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function validationError(error: ZodError) {
  return NextResponse.json({ message: "Datos invalidos", issues: error.issues.map((issue) => issue.message) }, { status: 400 });
}

export function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = transactionQuerySchema.safeParse(params);
  if (!parsed.success) return validationError(parsed.error);
  return NextResponse.json(listTransactions(parsed.data));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = transactionInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const settings = getCurrencySettings();
  const input = parsed.data.currency === "USD" && !parsed.data.exchangeRate ? { ...parsed.data, exchangeRate: settings.usdToPen } : parsed.data;
  const transaction = createTransaction(input);
  return NextResponse.json(transaction, { status: 201 });
}
