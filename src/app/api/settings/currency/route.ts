import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getCurrencySettings, setUsdToPen } from "@/lib/db/settings";
import { currencySettingsSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCurrencySettings());
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = currencySettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Tipo de cambio invalido", issues: parsed.error.issues.map((issue) => issue.message) }, { status: 400 });
  }
  const result = await setUsdToPen(parsed.data.usdToPen);
  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  return NextResponse.json(result);
}
