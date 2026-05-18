import { eq } from "drizzle-orm";

import { db, nowISO } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { defaultCategories } from "@/lib/finance/categories";

export function seedDefaultCategories() {
  for (const category of defaultCategories) {
    const existing = db.select().from(categories).where(eq(categories.name, category.name)).get();
    if (!existing) {
      db.insert(categories).values({ ...category, isDefault: true, createdAt: nowISO() }).run();
    }
  }
}

if (process.env.RUN_DB_SEED === "true") {
  seedDefaultCategories();
}
