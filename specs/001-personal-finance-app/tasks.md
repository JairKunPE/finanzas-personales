# Tasks: App de Finanzas Personales

**Input**: Design documents from `/specs/001-personal-finance-app/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/local-api.yaml, quickstart.md

**Tests**: Dashboard component tests were explicitly requested by the user. Other flows use reproducible manual validation tasks from quickstart.md unless test coverage is added later.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks.
- **[Story]**: Maps implementation tasks to user stories from spec.md.
- Every task includes an exact file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the project, install approved dependencies, configure styling/theme/PWA foundations, and create the shared folder structure.

- [X] T001 Initialize Next.js 15 App Router with strict TypeScript configuration in package.json, tsconfig.json, next.config.ts, src/app/layout.tsx, and src/app/page.tsx
- [X] T002 Configure Tailwind CSS 4 global styles and mobile-first theme tokens in src/styles/globals.css and postcss.config.mjs
- [X] T003 Install and register shadcn/ui base configuration in components.json and src/components/ui/button.tsx
- [X] T004 [P] Configure next-themes provider and theme toggle shell in src/components/theme-provider.tsx and src/components/theme-toggle.tsx
- [X] T005 [P] Configure shared app layout with mobile navigation, desktop sidebar, and header placeholders in src/app/layout.tsx and src/components/layout/app-shell.tsx
- [X] T006 [P] Configure shared fetcher and SWR provider in src/lib/api/fetcher.ts and src/components/app-providers.tsx
- [X] T007 [P] Configure React Hook Form and Zod shared validation helpers in src/lib/forms.ts
- [X] T008 [P] Configure date and currency formatting helpers in src/lib/formats.ts
- [X] T009 [P] Configure shared utility helpers in src/lib/utils.ts
- [ ] T010 Configure Serwist PWA integration scaffold in next.config.ts and src/app/sw.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create local persistence, schemas, seed data, shared domain logic, and reusable UI primitives required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T011 Create Drizzle SQLite connection using better-sqlite3 in src/lib/db/index.ts
- [X] T012 Create categories, transactions, and budgets Drizzle schemas in src/lib/db/schema.ts
- [X] T013 Create default category seed script for Comida, Transporte, Vivienda, Servicios, Ocio, Salud, Educacion, Ropa, and Otros in src/lib/db/seed.ts
- [X] T014 Configure migration and seed scripts in package.json and drizzle.config.ts
- [X] T015 [P] Create shared Zod schemas for category, transaction, budget, and report inputs in src/lib/validation.ts
- [X] T016 [P] Create category repository helpers in src/lib/db/categories.ts
- [X] T017 [P] Create transaction repository helpers in src/lib/db/transactions.ts
- [X] T018 [P] Create budget repository helpers in src/lib/db/budgets.ts
- [X] T019 [P] Create finance calculation helpers for totals, balances, budget status, and category percentages in src/lib/finance/calculations.ts
- [X] T020 [P] Create CSV serialization helpers for transactions and monthly reports in src/lib/finance/csv.ts
- [X] T021 [P] Create shared empty, loading, error, and confirmation UI primitives in src/components/ui/empty-state.tsx, src/components/ui/loading-state.tsx, src/components/ui/error-state.tsx, and src/components/ui/confirm-dialog.tsx
- [X] T022 [P] Create shared icon and color constants for default categories in src/lib/finance/categories.ts
- [X] T023 Verify local seed and database setup by documenting commands in specs/001-personal-finance-app/quickstart.md

**Checkpoint**: Local data model, seed data, providers, theme, and shared helpers are ready.

---

## Phase 3: User Story 1 - Registrar y consultar transacciones (Priority: P1) MVP

**Goal**: Users can create, list, filter, edit, and delete income/expense transactions with local persistence.

**Independent Test**: Create one income and one expense, verify descending date order, filter by type/category/date range, edit one transaction, delete another, and confirm totals/history reflect changes.

### Implementation for User Story 1

- [X] T024 [P] [US1] Create transaction input schema and form defaults in src/components/transactions/transaction-form-schema.ts
- [X] T025 [P] [US1] Implement transactions list and create handlers for GET and POST /api/transactions in src/app/api/transactions/route.ts
- [X] T026 [P] [US1] Implement transaction update and delete handlers for PATCH and DELETE /api/transactions/{id} in src/app/api/transactions/[id]/route.ts
- [X] T027 [US1] Implement TransactionForm component with amount, description, category, type, and date fields in src/components/transactions/transaction-form.tsx
- [X] T028 [P] [US1] Implement category select control using active categories in src/components/transactions/category-select.tsx
- [X] T029 [P] [US1] Implement transaction filters component for date range, type, and category in src/components/transactions/transaction-filters.tsx
- [X] T030 [US1] Implement paginated transaction table/list with edit and delete actions in src/components/transactions/transaction-list.tsx
- [X] T031 [US1] Implement delete confirmation flow for transactions in src/components/transactions/delete-transaction-dialog.tsx
- [X] T032 [US1] Implement transactions page with filters, pagination, loading, empty, and error states in src/app/transactions/page.tsx
- [X] T033 [US1] Implement new transaction page using TransactionForm in src/app/transactions/new/page.tsx
- [X] T034 [US1] Implement edit transaction page using TransactionForm and existing record loading in src/app/transactions/[id]/page.tsx
- [X] T035 [US1] Add SWR mutation and revalidation helpers for transaction CRUD in src/lib/api/transactions.ts
- [ ] T036 [US1] Validate US1 manual flow and record results in specs/001-personal-finance-app/quickstart.md

**Checkpoint**: User Story 1 is independently functional and delivers the MVP transaction loop.

---

## Phase 4: User Story 2 - Ver salud financiera en dashboard (Priority: P2)

**Goal**: Users can open the dashboard and quickly understand balance, monthly income, monthly expenses, spending distribution, recent activity, and budget status count.

**Independent Test**: With transactions and budgets present, verify dashboard totals, donut chart, latest five transactions, and budget indicator match local data.

### Tests for User Story 2

- [X] T037 [P] [US2] Configure component test tooling for React components in package.json and vitest.config.ts
- [X] T038 [P] [US2] Add tests for summary cards rendering income, expenses, and balance in src/components/dashboard/summary-cards.test.tsx
- [X] T039 [P] [US2] Add tests for latest transactions empty and populated states in src/components/dashboard/latest-transactions.test.tsx

### Implementation for User Story 2

- [X] T040 [P] [US2] Implement dashboard summary data helper in src/lib/finance/dashboard.ts
- [X] T041 [P] [US2] Implement GET /api/dashboard route for balance, monthly income, monthly expenses, category distribution, latest transactions, and budget status count in src/app/api/dashboard/route.ts
- [X] T042 [P] [US2] Implement summary cards component in src/components/dashboard/summary-cards.tsx
- [X] T043 [P] [US2] Implement expenses donut chart with responsive container in src/components/charts/expense-donut-chart.tsx
- [X] T044 [P] [US2] Implement latest transactions component in src/components/dashboard/latest-transactions.tsx
- [X] T045 [P] [US2] Implement budget status indicator component in src/components/dashboard/budget-status-indicator.tsx
- [X] T046 [US2] Compose dashboard page with loading, empty, error, and populated states in src/app/page.tsx
- [ ] T047 [US2] Validate US2 dashboard quickstart scenario and record results in specs/001-personal-finance-app/quickstart.md

**Checkpoint**: User Story 2 is independently demonstrable using data created through US1 and seeded categories.

---

## Phase 5: User Story 3 - Administrar categorias (Priority: P3)

**Goal**: Users can view predefined categories, create/edit custom categories, and safely remove custom categories that may have associated transactions.

**Independent Test**: Create, edit, and delete a custom category; confirm default categories exist and deleting an in-use category asks for reassignment or historical retention.

### Implementation for User Story 3

- [ ] T048 [P] [US3] Implement category form schema and defaults in src/components/categories/category-form-schema.ts
- [X] T049 [P] [US3] Implement categories list and create handlers for GET and POST /api/categories in src/app/api/categories/route.ts
- [X] T050 [P] [US3] Implement category update and delete handlers for PATCH and DELETE /api/categories/{id} in src/app/api/categories/[id]/route.ts
- [X] T051 [P] [US3] Implement category grid card component with icon, color, default/custom status, and actions in src/components/categories/category-card.tsx
- [X] T052 [US3] Implement category form for name, icon, and color in src/components/categories/category-form.tsx
- [X] T053 [US3] Implement delete category dialog with reassign and keep historical options in src/components/categories/delete-category-dialog.tsx
- [X] T054 [US3] Implement categories management page with grid, form dialog, loading, empty, and error states in src/app/categories/page.tsx
- [X] T055 [US3] Add SWR mutation and revalidation helpers for category CRUD in src/lib/api/categories.ts
- [ ] T056 [US3] Validate US3 category quickstart scenario and record results in specs/001-personal-finance-app/quickstart.md
- [X] T116 [P] [US3] Create categorized lucide icon constants for icon selector in src/lib/finance/icons.ts
- [X] T117 [P] [US3] Create icon selector component with categorized grid in src/components/categories/icon-selector.tsx
- [X] T118 [P] [US3] Create color selector component with palette and HTML5 picker in src/components/categories/color-selector.tsx
- [X] T119 [P] [US3] Update repository with create, update, delete, and transactionsCount helpers in src/lib/db/categories.ts
- [X] T120 [P] [US3] Update category-select to show icon and color inline in src/components/transactions/category-select.tsx
- [X] T121 [P] [US3] Update latest-transactions to show category icon and color in src/components/dashboard/latest-transactions.tsx
- [X] T122 [P] [US3] Add categories navigation link to sidebar and mobile nav in src/components/layout/app-shell.tsx

**Checkpoint**: User Story 3 can be completed independently after foundational seed and transaction support.

---

## Phase 6: User Story 4 - Gestionar presupuestos mensuales (Priority: P4)

**Goal**: Users can set monthly category limits, see spending progress, receive warnings at 80%, receive alerts over 100%, and get new-month budgets with prior limits.

**Independent Test**: Assign a monthly limit, create expenses reaching 80% and then exceeding 100%, and verify progress/status plus rollover behavior for a new month.

### Implementation for User Story 4

- [X] T057 [P] [US4] Implement budget form schema and month defaults in src/components/budgets/budget-form-schema.ts
- [X] T058 [P] [US4] Implement budget month rollover helper in src/lib/db/budgets.ts
- [X] T059 [P] [US4] Implement GET and POST /api/budgets handlers with derived spent amount and status in src/app/api/budgets/route.ts
- [X] T060 [P] [US4] Implement budget progress bar component with safe, warning, and over-limit states in src/components/budgets/budget-progress.tsx
- [X] T061 [US4] Implement budget form for category, month, and limit amount in src/components/budgets/budget-form.tsx
- [X] T062 [US4] Implement budget category list with progress and alert states in src/components/budgets/budget-card.tsx
- [X] T063 [US4] Implement budgets page with month selector, rollover trigger, loading, empty, and error states in src/app/budgets/page.tsx
- [X] T064 [US4] Add SWR mutation and revalidation helpers for budgets in src/lib/api/budgets.ts
- [ ] T065 [US4] Validate US4 budget quickstart scenario and record results in specs/001-personal-finance-app/quickstart.md

**Checkpoint**: User Story 4 is independently testable with seeded categories and transaction expenses.

---

## Phase 7: User Story 5 - Analizar reportes y estadisticas (Priority: P5)

**Goal**: Users can view 12-month income vs expense trends, category expense summaries, top spending categories, and monthly balances.

**Independent Test**: With transactions across multiple months, confirm trend, category totals/percentages, top five categories, and monthly balances match local records.

### Implementation for User Story 5

- [X] T066 [P] [US5] Implement monthly report calculation helper for trend, category breakdown, top categories, and balances in src/lib/finance/reports.ts
- [X] T067 [P] [US5] Implement GET /api/reports/summary route using period, year, month selectors in src/app/api/reports/summary/route.ts
- [X] T068 [P] [US5] Implement income vs expenses line chart in src/components/charts/income-expense-line-chart.tsx
- [X] T069 [P] [US5] Implement category expense summary table with totals and percentages in src/components/reports/category-breakdown.tsx
- [X] T070 [P] [US5] Implement top spending categories component in src/components/reports/top-categories.tsx
- [X] T071 [P] [US5] Implement monthly balance component in src/components/reports/monthly-balance.tsx
- [X] T072 [US5] Implement reports page with period/month/year selectors, charts, tables, loading, empty, and error states in src/app/reports/page.tsx
- [X] T073 [US5] Add SWR data helper for reports in src/lib/api/reports.ts
- [ ] T074 [US5] Validate US5 reports quickstart scenario and record results in specs/001-personal-finance-app/quickstart.md
- [X] T123 [P] [US5] Implement reports summary cards with period comparison in src/components/reports/summary-cards.tsx
- [X] T124 [P] [US5] Implement fixed vs variable chart component in src/components/reports/fixed-variable-chart.tsx
- [X] T125 [P] [US5] Implement CSV export endpoint for reports in src/app/api/reports/export/route.ts
- [X] T126 [P] [US5] Add reports navigation link to sidebar and mobile nav in src/components/layout/app-shell.tsx

**Checkpoint**: User Story 5 is independently reviewable using historical transaction data.

---

## Phase 8: User Story 6 - Exportar datos (Priority: P6)

**Goal**: Users can export all transactions and a selected monthly report to CSV with readable headers and complete selected data.

**Independent Test**: Export all transactions and one monthly report, open both CSV files in a spreadsheet, and verify headers plus values match local app data.

### Implementation for User Story 6

- [X] T075 [P] [US6] Implement POST /api/export/transactions route returning CSV with filtered transactions in src/app/api/export/transactions/route.ts
- [X] T076 [P] [US6] Implement POST /api/export/fixed-expenses route returning CSV in src/app/api/export/fixed-expenses/route.ts
- [X] T077 [P] [US6] Implement reusable CSV download button component in src/components/export/csv-download-button.tsx
- [X] T078 [US6] Add transactions CSV download button to transactions page in src/app/transactions/page.tsx
- [X] T079 [US6] Add fixed expenses CSV download button to fixed-expenses page in src/app/fixed-expenses/page.tsx
- [ ] T080 [US6] Validate US6 CSV export quickstart scenario and record results in specs/001-personal-finance-app/quickstart.md

**Checkpoint**: User Story 6 completes the data portability requirement.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Finalize PWA installability, offline behavior, responsive polish, accessibility, performance, and constitution validation across all stories.

- [X] T081 [P] Configure PWA manifest metadata and icons in public/manifest.webmanifest, public/icon.svg
- [X] T082 Configure offline navigation and asset caching behavior in public/sw.js and next.config.ts
- [X] T083 [P] Add mobile splash/icon metadata and viewport theme colors in src/app/layout.tsx
- [ ] T084 [P] Add restrained transitions for page loads, cards, dialogs, and charts in src/styles/globals.css
- [X] T127 [P] Create SVG app icon for PWA in public/icon.svg
- [X] T128 [P] Create apple touch icon for iOS in public/apple-icon.svg
- [X] T129 [P] Create service worker registration component in src/components/pwa/sw-register.tsx
- [X] T130 [P] Create install prompt component in src/components/pwa/install-prompt.tsx
- [ ] T085 [P] Run responsive pass for dashboard, transactions, categories, budgets, and reports in src/app/page.tsx, src/app/transactions/page.tsx, src/app/categories/page.tsx, src/app/budgets/page.tsx, and src/app/reports/page.tsx
- [ ] T086 [P] Run accessibility pass for forms, dialogs, buttons, charts, and theme toggle in src/components/transactions/transaction-form.tsx, src/components/categories/category-form.tsx, src/components/budgets/budget-form.tsx, and src/components/theme-toggle.tsx
- [ ] T087 [P] Add unit tests for finance calculations and CSV serialization in src/lib/finance/calculations.test.ts and src/lib/finance/csv.test.ts
- [ ] T088 Run dashboard component tests and any finance helper tests via package.json test script
- [ ] T089 Run quickstart end-to-end manual validation and record final results in specs/001-personal-finance-app/quickstart.md
- [ ] T090 Run final constitution review for local privacy, CSV export, dark mode, responsive UX, no auth, no external services, and no monetization in specs/001-personal-finance-app/plan.md

---

## Phase 10: New Scope - AMOLED, Currency, and Advanced Filters

**Purpose**: Add the requested AMOLED dark mode, PEN/USD transaction support, persisted exchange-rate settings, advanced transaction period filters, and dashboard month selector.

- [X] T091 Configure AMOLED pure-black dark mode backgrounds in src/styles/globals.css
- [X] T092 Extend SQLite schema and runtime table migration for currency settings and transaction currency fields in src/lib/db/schema.ts and src/lib/db/index.ts
- [X] T093 Create currency settings repository and default PEN/USD exchange-rate seed in src/lib/db/settings.ts
- [X] T094 Extend transaction validation schema with currency and exchange-rate fields in src/lib/validation.ts
- [X] T095 Update transaction repository queries to store original amount, currency, exchange rate, converted PEN amount, month/year filters, and quick-period ranges in src/lib/db/transactions.ts
- [X] T096 Add settings API route for reading/updating USD to PEN exchange rate in src/app/api/settings/currency/route.ts
- [X] T097 Update transaction API routes to apply current exchange rate when registering USD transactions in src/app/api/transactions/route.ts and src/app/api/transactions/[id]/route.ts
- [X] T098 Update transaction form with currency selector and USD to PEN equivalent preview in src/components/transactions/transaction-form.tsx
- [X] T099 Add currency settings UI for manually updating USD to PEN exchange rate in src/components/transactions/currency-settings-card.tsx and src/app/transactions/page.tsx
- [X] T100 Update transaction list to show original USD amount plus PEN equivalent and use PEN converted values for totals in src/components/transactions/transaction-list.tsx
- [X] T101 Add advanced filters for month, year, current month, previous month, last 3 months, last year, and custom ranges in src/components/transactions/transaction-filters.tsx
- [X] T102 Add dashboard month selector and pass selected month to dashboard summary in src/components/dashboard/dashboard-month-selector.tsx, src/app/page.tsx, src/app/api/dashboard/route.ts, and src/lib/finance/dashboard.ts
- [X] T103 Update dashboard components to render PEN totals from converted amounts in src/components/dashboard/summary-cards.tsx and src/components/charts/expense-donut-chart.tsx
- [X] T104 Add tests for currency display and dashboard month selector behavior in src/components/dashboard/latest-transactions.test.tsx and src/components/dashboard/dashboard-month-selector.test.tsx

---

## Phase 11: New Scope - Fixed Expenses and Subscriptions

**Purpose**: Add fixed/variable expense classification, billing cycles, next billing dates, monthly equivalent cost, a dedicated sidebar page, and dashboard fixed vs variable indicators.

- [X] T105 Update specification for fixed expenses and subscriptions in specs/001-personal-finance-app/spec.md
- [X] T106 Extend transaction schema and runtime migration with isRecurring, billingCycle, and nextBillingDate in src/lib/db/schema.ts and src/lib/db/index.ts
- [X] T107 Extend transaction validation and defaults for recurring expenses and billing cycles in src/lib/validation.ts and src/components/transactions/transaction-form-schema.ts
- [X] T108 Add fixed expense calculation helpers for cycle months, next billing date, monthly equivalent, due-soon state, and progress in src/lib/finance/fixed-expenses.ts
- [X] T109 Update transaction repository create/update/list/select queries with recurring fields in src/lib/db/transactions.ts
- [X] T110 Add fixed expenses API route returning subscriptions, total monthly equivalent, due-soon count, and grouped data in src/app/api/fixed-expenses/route.ts
- [X] T111 Update transaction form to mark expenses as fixed/variable and choose billing cycle in src/components/transactions/transaction-form.tsx
- [X] T112 Add Gastos Fijos navigation entry to sidebar and mobile nav in src/components/layout/app-shell.tsx
- [X] T113 Create fixed expenses dashboard page and cards in src/app/fixed-expenses/page.tsx, src/components/fixed-expenses/fixed-expense-card.tsx, and src/components/fixed-expenses/fixed-expenses-summary.tsx
- [X] T114 Add fixed vs variable monthly expense indicator to dashboard in src/lib/finance/dashboard.ts, src/app/api/dashboard/route.ts, src/components/dashboard/fixed-variable-indicator.tsx, and src/app/page.tsx
- [X] T115 Add tests for fixed expense helper calculations in src/lib/finance/fixed-expenses.test.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; starts immediately.
- **Foundational (Phase 2)**: Depends on Phase 1; blocks all user stories.
- **US1 Transactions (Phase 3)**: Depends on Phase 2; establishes the MVP data loop.
- **US2 Dashboard (Phase 4)**: Depends on Phase 2 and benefits from US1 data; can be built with seeded/sample data after APIs exist.
- **US3 Categories (Phase 5)**: Depends on Phase 2 and integrates with US1 category selection.
- **US4 Budgets (Phase 6)**: Depends on Phase 2 and uses category plus expense data.
- **US5 Reports (Phase 7)**: Depends on Phase 2 and uses transaction/category data.
- **US6 Export (Phase 8)**: Depends on Phase 2 and uses transaction/report helpers.
- **Polish (Phase 9)**: Depends on selected user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No user-story dependency after foundation; recommended MVP scope.
- **US2 (P2)**: Requires data from US1 for real validation but can be UI-developed in parallel with mocked/local fixtures.
- **US3 (P3)**: Can be developed after foundation; deletion behavior is best validated with US1 transactions.
- **US4 (P4)**: Requires categories and expense transactions for realistic validation.
- **US5 (P5)**: Requires transaction history for realistic validation.
- **US6 (P6)**: Requires transaction/report data for meaningful CSV validation.

### Within Each User Story

- Schema/helpers before API route handlers.
- API route handlers before SWR client helpers and page integration.
- Reusable components before page composition.
- Manual validation after page integration.
- Tests requested for dashboard components before or alongside US2 implementation.

---

## Parallel Opportunities

- Phase 1 tasks T004-T009 can run in parallel after T001-T003 establish the project.
- Phase 2 repository/helper tasks T015-T022 can run in parallel after schema task T012.
- US1 route handlers, filters, category select, and form schema can start in parallel after repository helpers exist.
- US2 dashboard components T042-T045 and tests T038-T039 can run in parallel once component props are defined.
- US3 API handlers and visual category card can run in parallel.
- US4 rollover helper, API route, and progress component can run in parallel.
- US5 report route, chart, table, top categories, and balance components can run in parallel.
- US6 export routes and download button can run in parallel.
- Polish tasks T081, T083, T084, T085, T086, and T087 can run in parallel.

## Parallel Example: User Story 1

```bash
Task: "T024 [P] [US1] Create transaction input schema and form defaults in src/components/transactions/transaction-form-schema.ts"
Task: "T025 [P] [US1] Implement transactions list and create handlers for GET and POST /api/transactions in src/app/api/transactions/route.ts"
Task: "T026 [P] [US1] Implement transaction update and delete handlers for PATCH and DELETE /api/transactions/{id} in src/app/api/transactions/[id]/route.ts"
Task: "T028 [P] [US1] Implement category select control using active categories in src/components/transactions/category-select.tsx"
Task: "T029 [P] [US1] Implement transaction filters component for date range, type, and category in src/components/transactions/transaction-filters.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T038 [P] [US2] Add tests for summary cards rendering income, expenses, and balance in src/components/dashboard/summary-cards.test.tsx"
Task: "T039 [P] [US2] Add tests for latest transactions empty and populated states in src/components/dashboard/latest-transactions.test.tsx"
Task: "T042 [P] [US2] Implement summary cards component in src/components/dashboard/summary-cards.tsx"
Task: "T043 [P] [US2] Implement expenses donut chart with responsive container in src/components/charts/expense-donut-chart.tsx"
Task: "T044 [P] [US2] Implement latest transactions component in src/components/dashboard/latest-transactions.tsx"
Task: "T045 [P] [US2] Implement budget status indicator component in src/components/dashboard/budget-status-indicator.tsx"
```

## Parallel Example: User Story 5

```bash
Task: "T068 [P] [US5] Implement income vs expenses line chart in src/components/charts/income-expense-line-chart.tsx"
Task: "T069 [P] [US5] Implement category expense summary table with totals and percentages in src/components/reports/category-summary-table.tsx"
Task: "T070 [P] [US5] Implement top spending categories component in src/components/reports/top-categories.tsx"
Task: "T071 [P] [US5] Implement monthly balance component in src/components/reports/monthly-balance.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1 Transactions).
3. Validate creating, listing, filtering, editing, deleting and persisting local transactions.
4. Stop and confirm the core local finance loop before expanding to dashboard, budgets and reports.

### Incremental Delivery

1. Add US1 for transaction CRUD and history.
2. Add US2 for dashboard insight using the transaction data.
3. Add US3 for category management and better classification.
4. Add US4 for monthly budget control.
5. Add US5 for historical analysis and reports.
6. Add US6 for CSV portability.
7. Complete PWA, responsive, accessibility and final quality polish.

### Validation Strategy

1. Use quickstart.md after each story checkpoint.
2. Run dashboard component tests after US2 and final polish.
3. Run finance helper tests after T087.
4. Re-run final constitution review before marking the implementation complete.

## Notes

- [P] tasks are safe to parallelize only after their listed phase prerequisites are complete.
- All app data must remain local; do not add authentication, remote services, telemetry, payments, subscriptions, ads, or commercial tracking.
- API Routes are internal local app interfaces and must not become external service integrations.
- Prefer the smallest clear implementation for each task; avoid adding generic layers not required by the current story.
