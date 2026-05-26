import { NextRequest, NextResponse } from "next/server";

import { getSessionCookieName, verifySessionToken } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const cookieName = getSessionCookieName();
  const token = request.cookies.get(cookieName)?.value;
  const authenticated = token ? await verifySessionToken(token) : false;
  return NextResponse.json({ authenticated });
}
