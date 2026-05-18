# Implementation Plan: App de Finanzas Personales

**Branch**: `001-personal-finance-app` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-personal-finance-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a local-first personal finance web app for one user to record income and expenses,
categorize transactions, track monthly budgets, view dashboard/reporting visuals, export
CSV data, install on mobile as a PWA, and use light/dark themes. The implementation uses
Next.js App Router with strict TypeScript, local SQLite via Drizzle, minimal local API
Routes, and focused UI dependencies justified by the required forms, charts, theme and PWA
experience.

## Technical Context

**Language/Version**: TypeScript strict mode, Next.js 15 App Router, React 19-compatible
patterns where supported by the project setup

**Primary Dependencies**: Tailwind CSS 4, shadcn/ui, Recharts, Drizzle ORM,
better-sqlite3, Serwist, date-fns, React Hook Form, Zod, lucide-react, next-themes, SWR

**Storage**: Local SQLite database file in the project workspace, accessed through Drizzle
ORM and better-sqlite3; seed creates default categories on first setup

**Testing**: Manual quickstart validation for MVP flows; add unit tests for finance
calculations/export helpers and integration tests for local CRUD flows when test tooling is
introduced

**Target Platform**: Local web app usable on mobile and desktop browsers, installable as a
PWA for mobile use; no account, remote backend, telemetry or third-party APIs

**Project Type**: Single Next.js web application with local persistence and internal API
Routes

**Performance Goals**: Primary dashboard understandable within 10 seconds, transaction
entry under 30 seconds on mobile, filter lookup under 20 seconds with at least 100
transactions, smooth chart/theme transitions without blocking user input

**Constraints**: Offline-capable core flows, mobile-first responsive layout, dark mode,
CSV export, local-only financial data, no authentication, no external services, no
monetization

**Scale/Scope**: Single personal user, one local database, hundreds to low thousands of
transactions, default plus custom categories, monthly budgets and 12-month reports

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Local privacy**: PASS. Financial data stays in the local SQLite file. API Routes are
  internal app interfaces only; no remote servers, accounts, telemetry, or third-party APIs
  are introduced.
- **Simplicity/MVP**: PASS. The first complete journey is create transactions -> view
  dashboard -> export CSV. Categories, budgets, reports, PWA and theme support are included
  because they are explicit MVP requirements, but abstractions remain feature-scoped.
- **UX first**: PASS. Mobile-first layout, desktop responsiveness, dark mode, clear empty
  states, budget warnings and smooth non-blocking transitions are planned from the start.
- **Exportability**: PASS. Transaction export and monthly report export are first-class CSV
  flows with documented fields and validation.
- **Pragmatic stack**: PASS. The stack matches the constitution: Next.js 15 App Router,
  TypeScript, Tailwind CSS 4, SQLite and Drizzle ORM. Added dependencies are narrow and
  justified in `research.md`.
- **Maintainability**: PASS. UI components, feature components, local API handlers,
  schemas, formatting utilities and calculation helpers are separated by responsibility.
- **No monetization**: PASS. No payments, subscriptions, ads, commercial tracking or
  paywalls are part of the plan.

**Post-design re-check**: PASS. Phase 1 artifacts preserve local-only storage, CSV
contracts, mobile/dark-mode validation, and feature-scoped interfaces. No unresolved gate
violations remain.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-finance-app/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── local-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   ├── budgets/route.ts
│   │   ├── categories/route.ts
│   │   ├── export/monthly-report/route.ts
│   │   ├── export/transactions/route.ts
│   │   ├── reports/monthly/route.ts
│   │   └── transactions/route.ts
│   ├── budgets/page.tsx
│   ├── categories/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── reports/page.tsx
│   └── transactions/
│       ├── [id]/page.tsx
│       ├── new/page.tsx
│       └── page.tsx
├── components/
│   ├── budgets/
│   ├── categories/
│   ├── charts/
│   ├── dashboard/
│   ├── transactions/
│   └── ui/
├── lib/
│   ├── api/
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── finance/
│   ├── formats.ts
│   └── utils.ts
└── styles/
    └── globals.css

public/
├── icon-192.png
├── icon-512.png
└── manifest.webmanifest
```

**Structure Decision**: Use one Next.js application under `src/` with route-level pages,
internal local API Routes, reusable feature components, and local persistence utilities in
`src/lib/db`. This keeps the app simple while separating UI, domain calculations, local
data access, and export/report interfaces.

## Complexity Tracking

No constitution violations require justification.
