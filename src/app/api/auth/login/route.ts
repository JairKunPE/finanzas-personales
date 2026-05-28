import { NextRequest, NextResponse } from "next/server";

import { verifyPassword } from "@/lib/auth/password";
import { createAccessToken, createRefreshToken, setBothTokenCookies } from "@/lib/auth/session";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ message: "Demasiados intentos. Intenta de nuevo en 15 minutos." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const password = body?.password;

  if (!password || typeof password !== "string") {
    return NextResponse.json({ message: "Contrasena requerida" }, { status: 400 });
  }

  const valid = await verifyPassword(password);
  if (!valid) {
    return NextResponse.json({ message: "Contrasena incorrecta" }, { status: 401 });
  }

  const accessToken = await createAccessToken();
  const refreshToken = await createRefreshToken();

  const response = NextResponse.json({ success: true });
  setBothTokenCookies(response, accessToken, refreshToken);
  return response;
}
