import { NextResponse } from "next/server";

import { getCategory, transactionsCount } from "@/lib/db/categories";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryId = Number(id);
  const existing = await getCategory(categoryId);
  if (!existing) return NextResponse.json(0);
  return NextResponse.json(await transactionsCount(categoryId));
}
