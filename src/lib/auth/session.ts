import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const raw = process.env.AUTH_SECRET;
  if (raw) return new TextEncoder().encode(raw);
  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("dev_secret_fallback_12345");
  }
  throw new Error("AUTH_SECRET no esta definido en las variables de entorno");
}

const ACCESS_MAX_AGE = 60 * 15;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

function cookiePrefix() {
  return process.env.NODE_ENV === "production" ? "__Host-" : "";
}

export function getAccessCookieName() {
  return `${cookiePrefix()}access_token`;
}

export function getRefreshCookieName() {
  return `${cookiePrefix()}refresh_token`;
}

function buildCookieHeader(name: string, token: string, maxAge: number, clear = false) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  if (clear) {
    return `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${secure}`;
  }
  return `${name}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${secure}`;
}

export function getAccessCookieValue(token: string, clear = false) {
  return buildCookieHeader(getAccessCookieName(), token, ACCESS_MAX_AGE, clear);
}

export function getRefreshCookieValue(token: string, clear = false) {
  return buildCookieHeader(getRefreshCookieName(), token, REFRESH_MAX_AGE, clear);
}

export function setAccessTokenCookie(response: Response, token: string) {
  response.headers.set("Set-Cookie", getAccessCookieValue(token));
}

export function setRefreshTokenCookie(response: Response, token: string) {
  response.headers.append("Set-Cookie", getRefreshCookieValue(token));
}

export function setBothTokenCookies(response: Response, accessToken: string, refreshToken: string) {
  response.headers.set("Set-Cookie", getAccessCookieValue(accessToken));
  response.headers.append("Set-Cookie", getRefreshCookieValue(refreshToken));
}

export function clearBothTokenCookies(response: Response) {
  response.headers.set("Set-Cookie", getAccessCookieValue("", true));
  response.headers.append("Set-Cookie", getRefreshCookieValue("", true));
}

export async function createAccessToken() {
  const secret = getSecret();
  return new SignJWT({ sub: "user", type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_MAX_AGE}s`)
    .sign(secret);
}

export async function createRefreshToken() {
  const secret = getSecret();
  const jti = crypto.randomUUID();
  return new SignJWT({ sub: "user", type: "refresh", jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_MAX_AGE}s`)
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const secret = getSecret();
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
