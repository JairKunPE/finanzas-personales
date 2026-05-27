import 'dotenv/config';
import { count, eq } from "drizzle-orm";

import { db, nowISO } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { defaultCategories } from "@/lib/finance/categories";
import { ensureDefaultPassword } from "@/lib/auth/password";

export async function seedDefaultCategories() {
  await ensureDefaultPassword();
  const [row] = await db.select({ value: count() }).from(categories);
  if (row && row.value > 0) return;
  for (const category of defaultCategories) {
    await db.insert(categories).values({ ...category, isDefault: true, createdAt: nowISO() });
  }
}

if (process.env.RUN_DB_SEED === "true") {
  seedDefaultCategories().then(() => {
    console.log("Seeded default categories");
    process.exit(0);
  });
}
