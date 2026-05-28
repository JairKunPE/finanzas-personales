import { NextRequest, NextResponse } from "next/server";

import { createAccessToken, getAccessCookieName, getRefreshCookieName, verifyToken } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/status"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const accessCookieName = getAccessCookieName();
  const refreshCookieName = getRefreshCookieName();

  const accessToken = request.cookies.get(accessCookieName)?.value;
  const refreshToken = request.cookies.get(refreshCookieName)?.value;

  if (accessToken && (await verifyToken(accessToken))) {
    return NextResponse.next();
  }

  if (refreshToken && (await verifyToken(refreshToken))) {
    const newAccessToken = await createAccessToken();
    const response = pathname.startsWith("/api/")
      ? NextResponse.next()
      : NextResponse.redirect(new URL(pathname, request.url));
    response.cookies.set(accessCookieName, newAccessToken, {
      path: "/",
      maxAge: 60 * 15,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next|icon|manifest|sw\\.js).*)"],
};
