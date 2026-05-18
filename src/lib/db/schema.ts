import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    icon: text("icon").notNull(),
    color: text("color").notNull(),
    isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    nameIdx: uniqueIndex("categories_name_unique").on(table.name),
  }),
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    amount: real("amount").notNull(),
    originalAmount: real("original_amount").notNull().default(0),
    currency: text("currency", { enum: ["PEN", "USD"] }).notNull().default("PEN"),
    exchangeRate: real("exchange_rate").notNull().default(1),
    amountPen: real("amount_pen").notNull().default(0),
    description: text("description").notNull(),
    categoryId: integer("category_id").notNull().references(() => categories.id),
    date: text("date").notNull(),
    isRecurring: integer("is_recurring", { mode: "boolean" }).notNull().default(false),
    billingCycle: text("billing_cycle", { enum: ["monthly", "quarterly", "semiannual", "annual"] }),
    nextBillingDate: text("next_billing_date"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at"),
  },
  (table) => ({
    dateIdx: index("transactions_date_idx").on(table.date),
    categoryIdx: index("transactions_category_idx").on(table.categoryId),
  }),
);

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const budgets = sqliteTable(
  "budgets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    categoryId: integer("category_id").notNull().references(() => categories.id),
    month: text("month").notNull(),
    limitAmount: real("limit_amount").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at"),
  },
  (table) => ({
    monthCategoryIdx: uniqueIndex("budgets_month_category_unique").on(table.month, table.categoryId),
  }),
);

export type Category = typeof categories.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type Setting = typeof settings.$inferSelect;
