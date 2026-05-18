# Data Model: App de Finanzas Personales

## Entity: Category

Represents a transaction classification available to the single user.

**Fields**:
- `id`: integer primary key
- `name`: text, required, unique among active categories
- `icon`: text, required, stores a lucide icon key or stable icon identifier
- `color`: text, required, hex or design-token color value
- `isDefault`: boolean, required, true for seeded categories
- `createdAt`: ISO datetime text, required
- `updatedAt`: ISO datetime text, optional
- `deletedAt`: ISO datetime text, optional for soft deletion of custom categories

**Relationships**:
- One category has many transactions.
- One category has many monthly budgets.

**Validation rules**:
- Name must be non-empty after trimming.
- Active category names must be unique case-insensitively.
- Default categories are seeded: Comida, Transporte, Vivienda, Servicios, Ocio, Salud,
  Educacion, Ropa, Otros.
- Default categories cannot be fully removed; custom categories may be soft-deleted.

**State transitions**:
- Active -> Soft deleted when a custom category is deleted after the user chooses how to
  handle associated transactions.
- Soft deleted categories are hidden from new transaction forms but retained for historical
  transaction readability when needed.

## Entity: Transaction

Represents an income or expense movement.

**Fields**:
- `id`: integer primary key
- `type`: text enum, `income` or `expense`, required
- `amount`: decimal-compatible number, required, greater than 0
- `description`: text, required
- `categoryId`: integer foreign key to Category, required
- `date`: ISO date text, required
- `createdAt`: ISO datetime text, required
- `updatedAt`: ISO datetime text, optional

**Relationships**:
- Each transaction belongs to one category.
- Transactions contribute to dashboard totals, budget spending, reports and CSV exports.

**Validation rules**:
- Amount must be positive and finite.
- Type must be `income` or `expense`.
- Date defaults to current local date and can be changed by the user.
- Category must exist and be selectable at the time of creation/editing.

**State transitions**:
- Created -> Updated when edited.
- Created/Updated -> Deleted when the user confirms deletion. Deleted transactions are
  removed from active totals and reports.

## Entity: Budget

Represents a monthly spending limit for one category.

**Fields**:
- `id`: integer primary key
- `categoryId`: integer foreign key to Category, required
- `month`: text in `YYYY-MM` format, required
- `limitAmount`: decimal-compatible number, required, greater than 0
- `createdAt`: ISO datetime text, required
- `updatedAt`: ISO datetime text, optional

**Relationships**:
- Each budget belongs to one category and one month.
- Expense transactions in the same month/category determine spent amount and status.

**Validation rules**:
- Only expense categories should be used for spending limits in UI flows.
- One budget per category per month.
- Limit amount must be positive.

**Derived states**:
- `safe`: spent amount is below 80% of limit.
- `warning`: spent amount is at least 80% and at most 100% of limit.
- `overLimit`: spent amount is greater than 100% of limit.

**Month rollover**:
- When a month is first accessed, create budgets for that month from the previous month's
  category limits if they do not already exist.
- Spent amount is always derived from transactions, not stored as a mutable source of truth.

## Entity: Monthly Report

Derived read model for reporting and CSV export.

**Fields**:
- `month`: text in `YYYY-MM` format
- `totalIncome`: decimal-compatible number
- `totalExpenses`: decimal-compatible number
- `balance`: `totalIncome - totalExpenses`
- `categoryBreakdown`: list of category totals and percentages
- `topCategories`: top five categories by expense amount

**Relationships**:
- Derived from transactions and categories for a selected period.
- Used by dashboard, reports screen and monthly CSV export.

**Validation rules**:
- Reports group by transaction date.
- Percentages are calculated against total expenses for the selected period.
- Empty periods return zero totals and empty breakdowns.

## Entity: Theme Preference

Represents the user's chosen display mode.

**Fields**:
- `mode`: `light`, `dark`, or `system`

**Validation rules**:
- The selected mode must apply across all primary screens.
- The app remains usable if no preference has been saved.

## CSV Export Shapes

### Transactions CSV

Columns:
- `id`
- `type`
- `amount`
- `description`
- `categoryName`
- `categoryIcon`
- `categoryColor`
- `date`
- `createdAt`
- `updatedAt`

### Monthly Report CSV

Columns:
- `month`
- `section`
- `categoryName`
- `totalIncome`
- `totalExpenses`
- `categoryExpense`
- `percentageOfExpenses`
- `balance`
