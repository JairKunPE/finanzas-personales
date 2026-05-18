# Quickstart: App de Finanzas Personales

## Prerequisites

- Node.js LTS compatible with Next.js 15
- npm, pnpm, yarn or bun available locally
- No external services, accounts or API keys

## Setup

1. Install dependencies with `npm install`.
2. The app uses the local SQLite file `data/finanzas.sqlite`.
3. Run `npm run db:seed` to create the default categories.
4. Start the local development server with `npm run dev`.
5. Run `npm test` for dashboard component tests.
6. Run `npm run build` before considering the MVP ready.

## MVP Validation Results

- 2026-05-17: `npm run db:seed` completed successfully.
- 2026-05-17: `npm test` passed 2 files and 3 tests.
- 2026-05-17: `npm run build` completed successfully.
- 2026-05-18: `npm test` passed 4 files and 8 tests after adding fixed expenses.
- 2026-05-18: `npm run build` completed successfully after adding fixed expenses.

## Manual Validation Flow

1. Open the app locally and confirm it loads without sign-in.
2. Toggle light and dark mode and confirm the preference applies across dashboard,
   transactions, categories, budgets and reports.
3. Create one income transaction and one expense transaction. Confirm the date defaults to
   today and both records appear in the transaction list ordered by most recent date.
4. Edit one transaction and delete another. Confirm dashboard totals and transaction list
   update correctly.
5. Use filters for date range, type and category. Confirm the result list reflects all
   active filters and shows a useful empty state when nothing matches.
6. Create a custom category with name, icon and color. Use it in a transaction.
7. Attempt to delete a category with associated transactions. Confirm the app asks how to
   handle those transactions before completing the deletion.
8. Create a monthly budget for an expense category. Add expenses until spending reaches at
   least 80% and then exceeds 100%. Confirm warning and over-limit states appear.
9. Open the dashboard. Confirm it shows current balance, monthly income, monthly expenses,
   expense distribution, last five transactions and budget status count.
10. Open reports. Confirm the 12-month income vs expense trend, category summary, top five
    categories and monthly balance appear from available data.
11. Export all transactions to CSV. Confirm the file has readable headers and includes all
    saved active transactions.
12. Export a monthly report to CSV. Confirm the file includes income, expenses, category
    breakdown and balance for the selected month.
13. Install the app on a mobile-capable browser. Reopen it from the installed icon and
    confirm core navigation remains usable.
14. Disable network access and confirm recording, reviewing and exporting local data remain
    available for core flows.
15. Mark an expense as fixed, choose a billing cycle, and confirm it appears in Gastos Fijos
    with monthly equivalent cost, next billing date and cycle progress.
16. Confirm the dashboard separates fixed expenses from variable expenses for the selected
    month.

## Expected Empty States

- Dashboard shows zero totals and prompts to add the first transaction.
- Transaction filters show a no-results message with an option to clear filters.
- Reports show zero totals or empty charts until enough transaction data exists.
- CSV export with no data either returns headers only or a clear no-data message.

## Constitution Validation

- Data remains local and requires no account.
- CSV export is available for transactions and monthly reports.
- Mobile and desktop layouts are usable without horizontal scrolling.
- Dark mode is available from the first usable version.
- No payments, subscriptions, ads or commercial tracking are present.
