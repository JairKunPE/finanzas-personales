import 'dotenv/config';
import { eq } from "drizzle-orm";

import { db, nowISO } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { defaultCategories } from "@/lib/finance/categories";
import { ensureDefaultPassword } from "@/lib/auth/password";

export async function seedDefaultCategories() {
  await ensureDefaultPassword();
  for (const category of defaultCategories) {
    const existingRows = await db.select().from(categories).where(eq(categories.name, category.name)).limit(1);
    const existing = existingRows[0];
    if (!existing) {
      await db.insert(categories).values({ ...category, isDefault: true, createdAt: nowISO() });
    }
  }
}

if (process.env.RUN_DB_SEED === "true") {
  seedDefaultCategories().then(() => {
    console.log("Seeded default categories");
    process.exit(0);
  });
}
