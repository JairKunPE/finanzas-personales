import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { db, nowISO } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const PASSWORD_HASH_KEY = "password_hash";

async function getRow(key: string) {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0] ?? null;
}

async function setRow(key: string, value: string) {
  const updatedAt = nowISO();
  await db
    .insert(settings)
    .values({ key, value, updatedAt })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt } });
}

function hashPassword(plain: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyHash(plain: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = scryptSync(plain, salt, 64);
  const storedBuffer = Buffer.from(hash, "hex");
  if (computed.length !== storedBuffer.length) return false;
  return timingSafeEqual(computed, storedBuffer);
}

export async function getStoredPasswordHash() {
  const row = await getRow(PASSWORD_HASH_KEY);
  return row?.value ?? null;
}

export async function setPassword(plain: string) {
  const hashed = hashPassword(plain);
  await setRow(PASSWORD_HASH_KEY, hashed);
}

export async function verifyPassword(plain: string) {
  const stored = await getStoredPasswordHash();
  if (!stored) return false;
  return verifyHash(plain, stored);
}

export async function ensureDefaultPassword() {
  const existing = await getStoredPasswordHash();
  if (!existing) {
    const defaultPassword = "admin";
    await setPassword(defaultPassword);
    console.log("🔑 Contrasena inicial configurada:", defaultPassword);
    return true;
  }
  return false;
}
