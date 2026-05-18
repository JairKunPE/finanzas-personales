# Research: App de Finanzas Personales

## Decision: Use Next.js 15 App Router as a single local web app

**Rationale**: The project requires mobile and desktop web UX, PWA installation, route-based
screens, and local-only behavior. A single App Router project avoids separate frontend and
backend services while supporting internal route handlers for local CRUD and CSV export.

**Alternatives considered**: A static-only app would complicate SQLite access. A separate
backend would violate the simplicity and local-only constraints unless run locally, adding
unnecessary operational complexity.

## Decision: Use SQLite with Drizzle ORM and better-sqlite3

**Rationale**: SQLite satisfies local ownership, no account requirement, simple backup, and
offline use. Drizzle provides typed schema definitions and query ergonomics with less
runtime weight than heavier ORMs. better-sqlite3 is synchronous, mature and practical for a
single-user local app.

**Alternatives considered**: Browser localStorage/IndexedDB would be simpler to deploy but
less aligned with the constitutional stack. A remote database is rejected by privacy rules.

## Decision: Use internal API Routes for app interfaces

**Rationale**: The user requested API Routes for CRUD, reports and export. Keeping them
inside the Next.js app provides clear contracts between UI and local data logic without any
external service. Contracts document request/response shapes for planning and testing.

**Alternatives considered**: Direct server actions could reduce endpoint files but would
make CSV and client cache contracts less explicit. A public API is rejected because this is
a single-user local app.

## Decision: Use SWR for client-side cache

**Rationale**: The app needs simple local data fetching, mutation and revalidation after
CRUD changes. SWR covers this with low configuration and a smaller mental model than a more
general server-state framework.

**Alternatives considered**: TanStack Query is powerful but adds more concepts than needed
for this MVP. Plain fetch everywhere is simpler initially but creates repeated loading,
error and revalidation code.

## Decision: Use React Hook Form with Zod

**Rationale**: Transaction, category and budget forms need clear validation, typed parsing
and accessible error messages. React Hook Form keeps form state efficient and Zod shares
validation rules across form and local API boundaries.

**Alternatives considered**: Hand-written validation is possible but duplicates rules.
Other schema validators add no clear advantage for this scope.

## Decision: Use Recharts for dona and line charts

**Rationale**: The specification requires a donut chart and 12-month line chart. Recharts is
widely used in React apps, covers these chart types, and supports responsive containers.

**Alternatives considered**: CSS-only charts would be lighter but insufficient for line
trend interactions. Heavier charting libraries add unnecessary surface area.

## Decision: Use shadcn/ui, lucide-react and custom theme tokens

**Rationale**: shadcn/ui provides accessible, copy-owned base components that can be themed
without large runtime UI dependencies. lucide-react provides consistent icons for
categories and actions. Custom tokens preserve the requested professional finance visual
language.

**Alternatives considered**: Building every primitive from scratch would slow MVP delivery.
A large component framework would constrain visual direction and add dependency weight.

## Decision: Use next-themes for light/dark mode

**Rationale**: The app requires a user-controlled theme toggle across primary screens.
next-themes is a small, common solution for persisted theme preference and system-mode
handling in Next.js apps.

**Alternatives considered**: Manual theme persistence is possible but easy to get wrong
during hydration. CSS-only media queries would not satisfy a user-controlled toggle.

## Decision: Use Serwist for PWA service worker

**Rationale**: Serwist is actively maintained for modern Next.js PWA setups and supports
offline caching patterns needed for installable mobile use. It is preferred over older
next-pwa setups for this project.

**Alternatives considered**: next-pwa is familiar but has more compatibility concerns with
newer Next.js versions. A hand-written service worker increases maintenance risk.

## Decision: Use date-fns for date formatting and month calculations

**Rationale**: Budgets, reports and filters depend on calendar-month ranges and readable
dates. date-fns keeps date utilities modular and avoids large runtime date libraries.

**Alternatives considered**: Native Date only is possible but makes month boundary logic
more error-prone. Larger libraries are unnecessary for the current scope.

## Decision: Scope MVP as one complete local finance loop

**Rationale**: The MVP includes setup, default categories, transaction CRUD, dashboard,
category management, monthly budgets, reports, CSV export, PWA and dark mode because the
user explicitly listed them as first iteration items. Implementation should still proceed
by vertical slices, starting with transaction CRUD and exportable local data.

**Alternatives considered**: Deferring budgets, reports or PWA would reduce effort but
would not match the provided MVP plan. Adding accounts, sync, payments or multi-currency is
out of scope.
