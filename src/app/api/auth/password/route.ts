import { NextRequest, NextResponse } from "next/server";

import { verifyPassword, setPassword } from "@/lib/auth/password";
import { createAccessToken, createRefreshToken, setBothTokenCookies } from "@/lib/auth/session";

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const currentPassword = body?.currentPassword;
  const newPassword = body?.newPassword;

  if (!currentPassword || typeof currentPassword !== "string") {
    return NextResponse.json({ message: "Contrasena actual requerida" }, { status: 400 });
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 4) {
    return NextResponse.json({ message: "La nueva contrasena debe tener al menos 4 caracteres" }, { status: 400 });
  }

  const valid = await verifyPassword(currentPassword);
  if (!valid) {
    return NextResponse.json({ message: "Contrasena actual incorrecta" }, { status: 401 });
  }

  await setPassword(newPassword);

  const accessToken = await createAccessToken();
  const refreshToken = await createRefreshToken();

  const response = NextResponse.json({ success: true });
  setBothTokenCookies(response, accessToken, refreshToken);
  return response;
}
