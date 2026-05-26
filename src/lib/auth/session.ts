import { randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const raw = process.env.AUTH_SECRET;
  if (raw) return new TextEncoder().encode(raw);
  if (process.env.NODE_ENV === "development") {
    const fallback = randomBytes(32).toString("hex");
    console.warn("⚠️  AUTH_SECRET no definido. Usando secreto temporal para desarrollo:", fallback);
    return new TextEncoder().encode(fallback);
  }
  throw new Error("AUTH_SECRET no esta definido en las variables de entorno. Agrega AUTH_SECRET a tu archivo .env");
}

const COOKIE_NAME = "session";
const MAX_AGE_SECONDS = 60 * 60 * 24;

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function getSessionCookieValue(token: string, clear = false) {
  if (clear) {
    return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`;
  }
  return `${COOKIE_NAME}=${token}; Path=/; Max-Age=${MAX_AGE_SECONDS}; HttpOnly; SameSite=Strict`;
}

export async function createSessionToken() {
  const secret = getSecret();
  return new SignJWT({ sub: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  try {
    const secret = getSecret();
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
