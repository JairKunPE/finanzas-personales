import { NextResponse } from "next/server";

export function apiError(error: unknown, fallback = "No se pudo completar la solicitud") {
  console.error(error);
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ message }, { status: 500 });
}
