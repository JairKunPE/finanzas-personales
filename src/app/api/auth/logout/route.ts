import { NextResponse } from "next/server";

import { getSessionCookieValue } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", getSessionCookieValue("", true));
  return response;
}
