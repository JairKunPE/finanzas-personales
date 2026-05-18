import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import * as schema from "@/lib/db/schema";

const dbPath = resolve(process.cwd(), "data", "finanzas.sqlite");
mkdirSync(dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath, { timeout: 5000 });
sqlite.pragma("journal_mode = WAL");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    is_default INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    deleted_at TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount REAL NOT NULL CHECK (amount > 0),
    original_amount REAL NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'PEN' CHECK (currency IN ('PEN', 'USD')),
    exchange_rate REAL NOT NULL DEFAULT 1,
    amount_pen REAL NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    date TEXT NOT NULL,
    is_recurring INTEGER NOT NULL DEFAULT 0,
    billing_cycle TEXT,
    next_billing_date TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    month TEXT NOT NULL,
    limit_amount REAL NOT NULL CHECK (limit_amount > 0),
    created_at TEXT NOT NULL,
    updated_at TEXT,
    UNIQUE(month, category_id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const transactionColumns = sqlite.prepare("PRAGMA table_info(transactions)").all() as Array<{ name: string }>;
const columnNames = new Set(transactionColumns.map((column) => column.name));
function addColumnIfMissing(name: string, statement: string) {
  if (columnNames.has(name)) return;
  try {
    sqlite.exec(statement);
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("duplicate column")) throw error;
  }
}

addColumnIfMissing("original_amount", "ALTER TABLE transactions ADD COLUMN original_amount REAL NOT NULL DEFAULT 0");
addColumnIfMissing("currency", "ALTER TABLE transactions ADD COLUMN currency TEXT NOT NULL DEFAULT 'PEN'");
addColumnIfMissing("exchange_rate", "ALTER TABLE transactions ADD COLUMN exchange_rate REAL NOT NULL DEFAULT 1");
addColumnIfMissing("amount_pen", "ALTER TABLE transactions ADD COLUMN amount_pen REAL NOT NULL DEFAULT 0");
addColumnIfMissing("is_recurring", "ALTER TABLE transactions ADD COLUMN is_recurring INTEGER NOT NULL DEFAULT 0");
addColumnIfMissing("billing_cycle", "ALTER TABLE transactions ADD COLUMN billing_cycle TEXT");
addColumnIfMissing("next_billing_date", "ALTER TABLE transactions ADD COLUMN next_billing_date TEXT");
sqlite.exec("UPDATE transactions SET original_amount = amount WHERE original_amount = 0");
sqlite.exec("UPDATE transactions SET amount_pen = amount WHERE amount_pen = 0");

export const db = drizzle(sqlite, { schema });

export function nowISO() {
  return new Date().toISOString();
}
