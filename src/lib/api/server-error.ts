import { NextResponse } from "next/server";

export function apiError(error: unknown, fallback = "No se pudo completar la solicitud") {
  console.error(error);
  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction
    ? "Error interno del servidor"
    : error instanceof Error
      ? error.message
      : fallback;
  return NextResponse.json({ message }, { status: 500 });
}
