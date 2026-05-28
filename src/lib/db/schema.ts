import { boolean, doublePrecision, index, integer, pgTable, serial, text, uniqueIndex } from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    icon: text("icon").notNull(),
    color: text("color").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    nameIdx: uniqueIndex("categories_name_unique").on(table.name),
  }),
);

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    amount: doublePrecision("amount").notNull(),
    originalAmount: doublePrecision("original_amount").notNull().default(0),
    currency: text("currency", { enum: ["PEN", "USD"] }).notNull().default("PEN"),
    exchangeRate: doublePrecision("exchange_rate").notNull().default(1),
    amountPen: doublePrecision("amount_pen").notNull().default(0),
    description: text("description").notNull(),
    categoryId: integer("category_id").notNull().references(() => categories.id),
    creditCardId: integer("credit_card_id").references(() => creditCards.id),
    date: text("date").notNull(),
    isRecurring: boolean("is_recurring").notNull().default(false),
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

export const creditCards = pgTable(
  "credit_cards",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    limitAmount: doublePrecision("limit_amount").notNull(),
    statementDay: integer("statement_day").notNull(),
    paymentDay: integer("payment_day").notNull(),
    color: text("color").notNull().default("#64748b"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
);

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const budgets = pgTable(
  "budgets",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id").notNull().references(() => categories.id),
    month: text("month").notNull(),
    limitAmount: doublePrecision("limit_amount").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at"),
  },
  (table) => ({
    monthCategoryIdx: uniqueIndex("budgets_month_category_unique").on(table.month, table.categoryId),
  }),
);

export type Category = typeof categories.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type CreditCard = typeof creditCards.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type Setting = typeof settings.$inferSelect;
