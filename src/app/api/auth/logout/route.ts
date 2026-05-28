import { NextResponse } from "next/server";

import { clearBothTokenCookies } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearBothTokenCookies(response);
  return response;
}
