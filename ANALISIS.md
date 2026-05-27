# Análisis Completo: Finanzas Personales

> **Fecha del análisis**: 2026-05-27
> **Repositorio**: `/home/jair.admin/proyectos-tecnologicos/finanzas-personales/`

---

## 1. Resumen del Proyecto

**Finanzas Personales** es una aplicación web **local-first** para registrar ingresos y gastos, categorizarlos, crear presupuestos mensuales, visualizar reportes y exportar datos a CSV. Está diseñada para un solo usuario, funcionando completamente offline (sin cuentas externas ni servicios en la nube), con soporte PWA para instalación en móviles y modo oscuro AMOLED.

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Lenguaje** | TypeScript (strict mode) |
| **Base de datos** | PostgreSQL vía Neon Serverless (`@neondatabase/serverless`) |
| **ORM** | Drizzle ORM |
| **Estilos** | Tailwind CSS 4 + shadcn/ui (New York style) |
| **Formularios** | React Hook Form + Zod (validación) |
| **Gráficos** | Recharts (donut, líneas, barras) |
| **Cache cliente** | SWR |
| **Iconos** | lucide-react |
| **Temas** | next-themes (claro/oscuro) |
| **Fechas** | date-fns (locale español) |
| **Autenticación** | jose (JWT + cookies HttpOnly) |
| **Testing** | Vitest + Testing Library (React + jsdom) |
| **PWA** | Service Worker manual (sw.js) |
| **Notificaciones** | sonner (toasts) |

> **Nota importante**: El proyecto originalmente usaba **SQLite (better-sqlite3)** pero fue migrado a **PostgreSQL (Neon Serverless)** para deploy en Vercel. Esto se ve reflejado en varios commits y en la configuración actual (`drizzle.config.ts` usa postgresql, y `src/lib/db/index.ts` usa `@neondatabase/serverless`).

---

## 2. Arquitectura

### Estructura de Carpetas

```
finanzas-personales/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/                    # API Routes (backend interno)
│   │   │   ├── auth/               #   login, logout, status, password
│   │   │   ├── budgets/            #   CRUD presupuestos
│   │   │   ├── categories/         #   CRUD categorías + reasignación
│   │   │   ├── dashboard/          #   Resumen del dashboard
│   │   │   ├── export/             #   CSV de transacciones y gastos fijos
│   │   │   ├── fixed-expenses/     #   Lista de gastos fijos
│   │   │   ├── reports/            #   summary + export CSV
│   │   │   ├── settings/           #   Tipo de cambio USD/PEN
│   │   │   └── transactions/       #   CRUD transacciones
│   │   ├── budgets/                # Página de presupuestos
│   │   ├── cards/                  # Página de tarjetas (en desarrollo)
│   │   ├── categories/             # Página de categorías
│   │   ├── fixed-expenses/         # Página de gastos fijos
│   │   ├── login/                  # Página de login
│   │   ├── reports/                # Página de reportes
│   │   ├── transactions/           # Páginas: listado, nueva, editar
│   │   ├── layout.tsx              # Layout raíz (PWA, providers, shell)
│   │   ├── page.tsx                # Dashboard principal
│   │   ├── loading.tsx             # Skeleton global
│   │   └── error.tsx               # Error boundary global
│   ├── components/
│   │   ├── auth/                   # Logout button
│   │   ├── budgets/                # BudgetCard, BudgetForm, BudgetProgress, etc.
│   │   ├── categories/             # CategoryGrid, CategoryForm, IconSelector, etc.
│   │   ├── charts/                 # ExpenseDonutChart, IncomeExpenseLineChart
│   │   ├── dashboard/              # HeroCard, FlowSummary, SavingsGoals, etc.
│   │   ├── export/                 # CsvDownloadButton, TransactionExportButton
│   │   ├── fixed-expenses/         # FixedExpenseCard, FixedExpensesSummary
│   │   ├── layout/                 # AppShell, SidebarDrawer
│   │   ├── pwa/                    # InstallPrompt, SwRegister
│   │   ├── reports/                # CategoryBreakdown, MonthlyBalance, etc.
│   │   ├── transactions/           # TransactionForm, TransactionList, etc.
│   │   └── ui/                     # Button, Card, Badge, EmptyState, etc.
│   ├── lib/
│   │   ├── api/                    # Clientes SWR para cada recurso
│   │   ├── auth/                   # password.ts (scrypt), session.ts (JWT)
│   │   ├── db/                     # Schema, conexión, repositorios
│   │   ├── finance/                # Lógica de negocio: cálculos, CSV, reportes
│   │   ├── formats.ts              # Formateo moneda/fechas
│   │   ├── forms.ts                # Helpers formularios
│   │   ├── utils.ts                # Utilidades generales
│   │   └── validation.ts           # Schemas Zod compartidos
│   ├── middleware.ts               # Protección de rutas (auth JWT)
│   └── styles/globals.css          # Tailwind + tokens de diseño
├── specs/001-personal-finance-app/ # Documentación del proyecto
├── public/                         # Assets PWA (manifest, icons, sw.js)
├── drizzle.config.ts               # Configuración Drizzle Kit
├── components.json                 # Configuración shadcn/ui
└── .agents/skills/neon-postgres/   # Skill de agente para Neon
```

### Patrón Arquitectónico

El proyecto sigue un patrón **API Routes internas** dentro del mismo Next.js:

1. **Páginas (Server Components)** → renderizan datos iniciales
2. **Componentes cliente (useState + SWR)** → interactividad, filtros, mutaciones
3. **API Routes** → lógica CRUD con Drizzle ORM
4. **Repositorios (`src/lib/db/`)** → queries de base de datos
5. **Lógica de negocio (`src/lib/finance/`)** → cálculos financieros, CSV, reportes

Las rutas protegidas usan un middleware que verifica JWT en cookies HttpOnly. El login es por contraseña única (almacenada con scrypt + salt).

---

## 3. Base de Datos

### Esquemas (Drizzle ORM → PostgreSQL)

#### Tabla: `categories`

| Campo | Tipo | Notas |
|-------|------|-------|
| id | `serial PK` | |
| name | `text NOT NULL` | Unique (índice único) |
| icon | `text NOT NULL` | Key de lucide-react |
| color | `text NOT NULL` | Hex color |
| isDefault | `boolean NOT NULL DEFAULT false` | True para las 9 categorías semilla |
| createdAt | `text NOT NULL` | ISO datetime |
| updatedAt | `text (nullable)` | |
| deletedAt | `text (nullable)` | Soft-delete para categorías custom |

#### Tabla: `transactions`

| Campo | Tipo | Notas |
|-------|------|-------|
| id | `serial PK` | |
| type | `text (enum: income, expense) NOT NULL` | |
| amount | `doublePrecision NOT NULL` | Monto en moneda original |
| originalAmount | `doublePrecision NOT NULL DEFAULT 0` | Monto original preservado |
| currency | `text (enum: PEN, USD) NOT NULL DEFAULT PEN` | |
| exchangeRate | `doublePrecision NOT NULL DEFAULT 1` | Tasa de cambio al momento del registro |
| amountPen | `doublePrecision NOT NULL DEFAULT 0` | Monto convertido a soles |
| description | `text NOT NULL` | |
| categoryId | `integer FK → categories.id NOT NULL` | |
| date | `text NOT NULL` | ISO date (YYYY-MM-DD) |
| isRecurring | `boolean NOT NULL DEFAULT false` | |
| billingCycle | `text (enum: monthly, quarterly, semiannual, annual)` | Solo para gastos fijos |
| nextBillingDate | `text (nullable)` | Próxima fecha de cobro |
| createdAt | `text NOT NULL` | |
| updatedAt | `text (nullable)` | |

Índices: `date`, `categoryId`

#### Tabla: `budgets`

| Campo | Tipo | Notas |
|-------|------|-------|
| id | `serial PK` | |
| categoryId | `integer FK → categories.id NOT NULL` | |
| month | `text NOT NULL` | YYYY-MM |
| limitAmount | `doublePrecision NOT NULL` | Límite mensual |
| createdAt | `text NOT NULL` | |
| updatedAt | `text (nullable)` | |

Índice único: `(month, categoryId)`

#### Tabla: `settings`

| Campo | Tipo | Notas |
|-------|------|-------|
| key | `text PK` | Ej: "usdToPen", "password_hash" |
| value | `text NOT NULL` | |
| updatedAt | `text NOT NULL` | |

### Relaciones

- **Category 1:N Transaction** — Una categoría tiene muchas transacciones
- **Category 1:N Budget** — Una categoría tiene presupuestos mensuales
- **Transaction M:1 Category** — Cada transacción pertenece a una categoría
- **Budget M:1 Category** — Cada presupuesto pertenece a una categoría

### Seed por Defecto

El script `seed.ts` crea 9 categorías por defecto: **Comida, Transporte, Vivienda, Servicios, Ocio, Salud, Educación, Ropa, Otros** — cada una con su icono y color de lucide-react.

Además, establece una contraseña por defecto (`admin`) usando scrypt con salt.

---

## 4. Componentes y Páginas Principales

### Páginas (App Router)

| Ruta | Archivo | Tipo | Propósito |
|------|---------|------|-----------|
| `/` | `page.tsx` | Server | Dashboard principal: balance, flujo mensual, metas, últimas transacciones |
| `/login` | `login/page.tsx` | Client | Formulario de login con contraseña |
| `/transactions` | `transactions/page.tsx` | Server | Listado de transacciones |
| `/transactions/new` | `transactions/new/page.tsx` | Client | Formulario de nueva transacción |
| `/transactions/[id]` | `transactions/[id]/page.tsx` | Client | Editar transacción existente |
| `/categories` | `categories/page.tsx` | Client | Grid visual de categorías (CRUD completo) |
| `/budgets` | `budgets/page.tsx` | Client | Presupuestos mensuales con selector de mes |
| `/reports` | `reports/page.tsx` | Client | Reportes y estadísticas con selectores |
| `/fixed-expenses` | `fixed-expenses/page.tsx` | Server | Gastos fijos agrupados por tipo |
| `/cards` | `cards/page.tsx` | Client | Mis tarjetas (en desarrollo inicial) |

### Componentes Destacados

| Componente | Ubicación | Propósito |
|------------|-----------|-----------|
| **AppShell** | `layout/app-shell.tsx` | Layout principal con header, bottom nav FAB y sidebar |
| **SidebarDrawer** | `layout/sidebar-drawer.tsx` | Menú lateral con navegación + logout |
| **HeroCard** | `dashboard/hero-card.tsx` | Saldo actual con diseño tipo wallet |
| **FlowSummary** | `dashboard/flow-summary.tsx` | Ingresos vs gastos del mes actual |
| **SavingsGoals** | `dashboard/savings-goals.tsx` | Progreso de metas de ahorro |
| **RecentTransactions** | `dashboard/recent-transactions.tsx` | Últimas 5 transacciones |
| **TransactionForm** | `transactions/transaction-form.tsx` | Formulario completo (tipo, monto, categoría, moneda, fijo/variable) |
| **TransactionList** | `transactions/transaction-list.tsx` | Lista paginada con filtros |
| **CategoryGrid** | `categories/category-grid.tsx` | Grid de tarjetas de categorías |
| **IconSelector** | `categories/icon-selector.tsx` | Selector visual de lucide icons agrupados |
| **ColorSelector** | `categories/color-selector.tsx` | Paleta + color picker HTML5 |
| **DeleteCategoryDialog** | `categories/delete-category-dialog.tsx` | Modal con opciones de reasignación |
| **BudgetForm** | `budgets/budget-form.tsx` | Formulario para asignar límite mensual |
| **BudgetDetailCard** | `budgets/budget-detail-card.tsx` | Tarjeta con progreso y alertas (80%, 100%) |
| **IncomeExpenseLineChart** | `charts/income-expense-line-chart.tsx` | Evolución mensual con Recharts |
| **ExpenseDonutChart** | `charts/expense-donut-chart.tsx` | Distribución de gastos |
| **FixedExpenseCard** | `fixed-expenses/fixed-expense-card.tsx` | Tarjeta de suscripción con próximo cobro |
| **InstallPrompt** | `pwa/install-prompt.tsx` | Banner de instalación PWA |
| **SwRegister** | `pwa/sw-register.tsx` | Registro de Service Worker |

---

## 5. API Routes Disponibles

### Autenticación

| Método | Ruta | Propósito |
|--------|------|-----------|
| POST | `/api/auth/login` | Iniciar sesión (verifica password, devuelve cookie JWT) |
| POST | `/api/auth/logout` | Cerrar sesión (elimina cookie) |
| GET | `/api/auth/status` | Verificar si hay sesión activa |
| PATCH | `/api/auth/password` | Cambiar contraseña (requiere currentPassword + newPassword) |

### Transacciones

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/transactions` | Listado paginado con filtros (type, categoryId, period, page, etc.) |
| POST | `/api/transactions` | Crear transacción |
| GET | `/api/transactions/[id]` | Obtener transacción por ID |
| PATCH | `/api/transactions/[id]` | Actualizar transacción |
| DELETE | `/api/transactions/[id]` | Eliminar transacción |

### Categorías

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/categories` | Listar categorías activas |
| POST | `/api/categories` | Crear categoría |
| PATCH | `/api/categories/[id]` | Actualizar categoría |
| DELETE | `/api/categories/[id]` | Eliminar categoría (con reasignación o borrado de transacciones) |
| GET | `/api/categories/[id]/transactions-count` | Contar transacciones de una categoría |

### Presupuestos

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/budgets?month=YYYY-MM` | Listar presupuestos con gasto real + estado (safe/warning/over) |
| POST | `/api/budgets` | Crear o actualizar presupuesto (upsert) |

### Dashboard

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/dashboard?month=YYYY-MM` | Resumen completo: balance, ingresos/gastos mes, distribución, últimas 5 transacciones, alertas de presupuesto |

### Reportes

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/reports/summary?period=&year=&month=` | Reporte completo (summary, evolución, breakdown, top categories, fixed/variable, balance mensual) |
| GET | `/api/reports/export?period=&year=&month=` | Descargar CSV del reporte actual |

### Exportación

| Método | Ruta | Propósito |
|--------|------|-----------|
| POST | `/api/export/transactions` | Exportar transacciones filtradas a CSV |
| POST | `/api/export/fixed-expenses` | Exportar gastos fijos a CSV |

### Gastos Fijos

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/fixed-expenses` | Lista de gastos fijos con monthlyEquivalent, dueSoon, grouped |

### Configuración

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/settings/currency` | Obtener tipo de cambio USD/PEN actual |
| PATCH | `/api/settings/currency` | Actualizar tipo de cambio USD/PEN |

---

## 6. Estado Actual

### Implementado ✅

- [x] **Autenticación**: Login con contraseña única, sesión JWT en cookie HttpOnly, cambio de contraseña
- [x] **Middleware**: Protección de rutas (redirección a `/login` si no hay sesión)
- [x] **Dashboard**: Saldo total, ingresos/gastos del mes, distribución por categoría, últimas 5 transacciones, alertas de presupuesto, selector de mes
- [x] **Transacciones**: CRUD completo (crear, listar, filtrar, editar, eliminar), soporte multi-moneda (PEN/USD), gastos fijos/variables
- [x] **Categorías**: CRUD completo, grid visual, selector de iconos (lucide-react agrupados), selector de color, eliminación con reasignación
- [x] **Presupuestos Mensuales**: Asignar límites por categoría, progreso visual, alertas al 80% y 100%, rollover automático al siguiente mes
- [x] **Reportes**: Periodos mensual/trimestral/semestral/anual, evolución mensual (líneas), distribución por categoría (dona), top 5 categorías, fijo vs variable, balance mensual
- [x] **Exportación CSV**: Transacciones filtradas, gastos fijos, reportes completos
- [x] **Gastos Fijos**: Página dedicada con agrupación, cálculo de equivalente mensual, fechas de próximo cobro, indicador de vencimiento próximo (7 días)
- [x] **Multi-moneda**: Soporte PEN/USD, preservación del tipo de cambio al momento del registro, conversión automática a PEN
- [x] **PWA**: Manifest, service worker, iconos SVG, install prompt, meta tags para iOS
- [x] **Tema Oscuro AMOLED**: Fondos `#000000` puro en modo oscuro
- [x] **Tema Claro**: Fondo `#F8F9FA`, cards blancas
- [x] **Mobile-first**: Bottom navigation, FAB, safe-area, responsive
- [x] **Testing**: 4 archivos de test, 8 tests (summary-cards, latest-transactions, dashboard-month-selector, fixed-expenses calculations)
- [x] **Migración a PostgreSQL**: Completada (Neon Serverless)

### Pendiente / No Implementado 🔲

- [ ] **Página de Tarjetas (`/cards`)**: Solo UI de muestra con datos hardcodeados. No tiene backend, no guarda tarjetas reales.
- [ ] **Serwist PWA**: T010 en tasks.md menciona configurar Serwist en `next.config.ts` y `src/app/sw.ts`, pero no está implementado. El service worker actual es manual (`public/sw.js`).
- [ ] **Transiciones CSS**: T084 menciona transiciones restrainidas para páginas, cards, diálogos y charts. No parece implementado (solo hay transiciones genéricas en globals.css).
- [ ] **Pase de accesibilidad**: T086 — forms, dialogs, buttons, charts, theme toggle.
- [ ] **Tests unitarios adicionales**: T087 — finance calculations (`calculations.test.ts`) y CSV serialization (`csv.test.ts`).
- [ ] **Validaciones manuales en quickstart.md**: Varios T036, T047, T056, T065, T074, T080 — registrar resultados de validación manual.
- [ ] **Responsive pass completo**: T085.
- [ ] **Revisión final de constitución**: T090.

---

## 7. Recomendaciones y Áreas de Mejora

### 🟢 Mejoras Inmediatas (Bajo Esfuerzo)

1. **Completar tests faltantes**: Implementar `src/lib/finance/calculations.test.ts` y `src/lib/finance/csv.test.ts` para tener cobertura de la lógica core.

2. **Página de Tarjetas**: La página `/cards` actualmente tiene datos hardcodeados. Si no es parte del MVP, considerar moverla a una rama de feature o eliminarla del sidebar.

3. **Manejo de errores en producción**: El `apiError` helper en `src/lib/api/server-error.ts` podría mejorarse para no exponer detalles internos en producción.

### 🟡 Mejoras de Arquitectura (Medio Esfuerzo)

4. **Serwist vs SW manual**: Evaluar si vale la pena migrar a Serwist como menciona el plan, o mantener el service worker manual que ya funciona.

5. **Transacciones recurrentes automáticas**: Actualmente los gastos fijos se marcan como `isRecurring` pero no se generan automáticamente nuevos registros cada mes. Podría implementarse un cron/scheduler o trigger al cargar el dashboard.

6. **Paginación real en transacciones**: El listado de transacciones usa paginación en el backend, pero la página de transacciones carga 1000 registros de una vez. Implementar paginación cliente con SWR.

7. **Cache y revalidación**: Algunas rutas tienen `force-dynamic` que impide cualquier caching. Para Vercel, considerar ISR o revalidate específico para reducir costos de base de datos.

### 🔴 Mejoras a Largo Plazo (Alto Esfuerzo)

8. **Multi-usuario**: El proyecto es monousuario. Para escalar, requeriría rediseño de schemas con `userId`.

9. **Presupuestos basados en ingresos**: Actualmente los presupuestos son solo por límite de gasto. Podría añadirse presupuesto basado en porcentaje de ingresos.

10. **Reglas de negocio más complejas**: Alertas por SMS/email, categorización automática por descripción, reglas de ahorro automáticas.

11. **Gráficos interactivos**: Los reportes actuales son estáticos. Podrían beneficiarse de filtros interactivos (click en categoría para filtrar).

### Observaciones Técnicas

- **Migración SQLite → PostgreSQL**: Se nota que el proyecto comenzó con SQLite. El campo `createdAt`/`updatedAt` usa `text` en lugar de `timestamp with time zone`. Funciona pero no es óptimo para PostgreSQL.
- **Seed problemático**: El seed se ejecuta cada vez que se listan categorías activas (`seedDefaultCategories()` en `listActiveCategories()`). Esto es ineficiente y podría causar issues en producción.
- **Sin migraciones Drizzle por ahora**: No hay carpeta `drizzle/` con migraciones. Usan `db:push` directamente. Para producción, se recomienda generar migraciones.

---

## 8. Cómo Ejecutar el Proyecto Localmente

### Prerrequisitos

- Node.js 18+ (recomendado 20 LTS)
- npm, pnpm o bun
- Una base de datos PostgreSQL (Neon recomendado, pero cualquier Postgres funciona)
- Clave secreta para JWT (generar con `openssl rand -hex 32`)

### Pasos

```bash
# 1. Clonar e instalar dependencias
cd /home/jair.admin/proyectos-tecnologicos/finanzas-personales
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env:
#   DATABASE_URL=postgres://user:password@host:5432/db
#   AUTH_SECRET=<generar con: openssl rand -hex 32>

# 3. Inicializar base de datos (crea tablas)
npm run db:push

# 4. Sembrar datos iniciales (categorías por defecto + contraseña admin)
npm run db:seed

# 5. Iniciar servidor de desarrollo
npm run dev

# 6. Abrir http://localhost:3000
#    Usar contraseña: admin (por defecto)
```

### Scripts Disponibles

| Comando | Propósito |
|---------|-----------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm test` | Ejecutar tests (Vitest) |
| `npm run lint` | Linter (Next.js ESLint) |
| `npm run db:generate` | Generar migraciones Drizzle |
| `npm run db:push` | Aplicar schema a la BD |
| `npm run db:seed` | Sembrar categorías y contraseña por defecto |
| `npm run db:studio` | Abrir Drizzle Studio (GUI BD) |

### Tests

Actualmente hay **4 archivos de test con 8 tests**:

| Archivo | Tests |
|---------|-------|
| `src/components/dashboard/summary-cards.test.tsx` | Renderizado de saldo, ingresos, gastos |
| `src/components/dashboard/latest-transactions.test.tsx` | Estado vacío, transacciones pobladas, moneda USD |
| `src/components/dashboard/dashboard-month-selector.test.tsx` | Selector de mes navega a query string |
| `src/lib/finance/fixed-expenses.test.ts` | Cálculos de equivalente mensual, próxima fecha, vencimiento próximo |

---

## Apéndice: Workflows Configurados (.opencode/commands)

El proyecto usa **Specify** como framework de desarrollo agnóstico. Los comandos disponibles:

| Comando | Propósito |
|---------|-----------|
| `speckit.analyze` | Analizar repositorio completo |
| `speckit.checklist` | Validar calidad de especificación |
| `speckit.clarify` | Refinar requerimientos |
| `speckit.constitution` | Validar alineación con constitución del proyecto |
| `speckit.git.*` | Operaciones Git (commit, feature, initialize, remote, validate) |
| `speckit.implement` | Ejecutar implementación guiada por tareas |
| `speckit.plan` | Generar plan de implementación |
| `speckit.specify` | Escribir especificación de feature |
| `speckit.tasks` | Desglosar plan en tareas |
| `speckit.taskstoissues` | Convertir tareas a issues |

El plan de implementación (tasks.md) documenta **126 tareas** organizadas en 11 fases, de las cuales la gran mayoría están completadas.
