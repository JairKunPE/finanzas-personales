import { NextRequest, NextResponse } from "next/server";

import { getAccessCookieName, verifyToken } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const cookieName = getAccessCookieName();
  const token = request.cookies.get(cookieName)?.value;
  const authenticated = token ? await verifyToken(token) : false;
  return NextResponse.json({ authenticated });
}
