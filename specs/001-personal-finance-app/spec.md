# Feature Specification: App de Finanzas Personales

**Feature Branch**: `001-personal-finance-app`

**Created**: 2026-05-17

**Status**: Draft

**Input**: User description: "Aplicacion web personal para registrar ingresos y gastos, categorizarlos, ver dashboard, presupuestos, reportes y exportaciones CSV. Todo corre localmente, sin internet ni cuentas, con experiencia responsive, modo claro/oscuro e instalacion en movil."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar y consultar transacciones (Priority: P1)

Como usuario, quiero registrar ingresos y gastos diarios con monto, descripcion,
categoria y fecha para conocer mi saldo actual y revisar mi historial financiero.

**Why this priority**: Sin transacciones no existe valor financiero ni datos para dashboard,
presupuestos, reportes o exportacion.

**Independent Test**: Crear un ingreso y un gasto, confirmar que aparecen en la lista en
orden descendente por fecha, que pueden filtrarse por tipo/categoria/rango de fechas y que
pueden editarse o eliminarse.

**Acceptance Scenarios**:

1. **Given** que el usuario no tiene transacciones, **When** registra un gasto con monto,
   descripcion, categoria y fecha por defecto, **Then** la transaccion queda guardada y se
   muestra como el movimiento mas reciente.
2. **Given** que existen varias transacciones, **When** el usuario filtra por rango de
   fechas, tipo y categoria, **Then** la lista muestra solo las transacciones que cumplen
   todos los filtros y mantiene el orden por fecha descendente.
3. **Given** que una transaccion fue registrada con datos incorrectos, **When** el usuario
   la edita o elimina, **Then** el historial y los totales reflejan el cambio.

---

### User Story 2 - Ver salud financiera en dashboard (Priority: P2)

Como usuario, quiero abrir un dashboard principal y ver mi saldo, ingresos del mes,
gastos del mes, ultimas transacciones y estado de presupuestos para entender rapidamente
mi situacion financiera.

**Why this priority**: El dashboard convierte los registros diarios en una vision accionable
que ayuda al usuario a tomar decisiones sin revisar listas largas.

**Independent Test**: Con transacciones y presupuestos existentes, abrir el dashboard y
verificar que los totales, grafico de gastos por categoria, ultimas 5 transacciones e
indicador de presupuestos coinciden con los datos registrados.

**Acceptance Scenarios**:

1. **Given** que hay ingresos y gastos en el mes actual, **When** el usuario abre el
   dashboard, **Then** ve saldo actual, ingresos del mes y gastos del mes calculados con
   los datos disponibles.
2. **Given** que existen gastos en varias categorias, **When** el usuario consulta el
   dashboard, **Then** ve una distribucion visual de gastos por categoria.
3. **Given** que hay categorias con presupuesto cerca o sobre su limite, **When** el
   usuario revisa el indicador de presupuestos, **Then** ve cuantas categorias requieren
   atencion.

---

### User Story 3 - Administrar categorias (Priority: P3)

Como usuario, quiero usar categorias predefinidas y crear categorias personalizadas para
clasificar mis movimientos de forma consistente.

**Why this priority**: Las categorias hacen posibles los reportes, presupuestos y filtros
utiles para analizar gastos.

**Independent Test**: Crear, editar y eliminar una categoria personalizada; confirmar que
las categorias disponibles incluyen las predefinidas y que al eliminar una categoria con
transacciones asociadas se solicita una decision antes de continuar.

**Acceptance Scenarios**:

1. **Given** una instalacion nueva, **When** el usuario abre la seleccion de categoria,
   **Then** ve Comida, Transporte, Vivienda, Servicios, Ocio, Salud, Educacion, Ropa y
   Otros con nombre, icono y color.
2. **Given** que el usuario necesita una clasificacion adicional, **When** crea una
   categoria personalizada con nombre, icono y color, **Then** puede usarla en nuevas
   transacciones.
3. **Given** una categoria con transacciones asociadas, **When** el usuario intenta
   eliminarla, **Then** la app le pregunta si desea reasignar o conservar las transacciones
   antes de completar la accion.

#### 13. Gestion Visual de Categorias (Funcionalidad 3 actualizada)

- Pagina dedicada en `/categories` con grid visual de todas las categorias
- Cada categoria se muestra como una tarjeta con: nombre, icono (lucide-react), color de fondo
- Las categorias por defecto (Comida, Transporte, Vivienda, Servicios, Ocio, Salud, Educacion, Ropa, Otros) tienen iconos y colores asignados
- El usuario puede CREAR nuevas categorias personalizadas eligiendo:
  - Nombre
  - Icono (selector visual con grid de iconos de lucide-react, categorizados por tipo)
  - Color (selector de color con paleta predefinida + color picker HTML5)
- El usuario puede EDITAR cualquier categoria (nombre, icono, color)
- El usuario puede ELIMINAR categorias personalizadas
  - Las categorias por defecto NO se pueden eliminar (solo editar icono/color)
- Al eliminar una categoria que tiene transacciones asociadas:
  - Mostrar un modal preguntando que hacer
  - Opcion A: Reasignar las transacciones a otra categoria (selector)
  - Opcion B: Eliminar todas las transacciones de esa categoria
- API Routes completas para CRUD de categorias con manejo de reasignacion
- Integrar en el formulario de transacciones: al seleccionar categoria, mostrar el icono y color de cada una
- En el dashboard y reportes, las categorias deben mostrar su icono y color asociado

#### 14. Presupuestos Mensuales

- Nueva pagina en `/budgets` con vista general de presupuestos del mes actual
- Selector para cambiar de mes en la pagina de presupuestos
- Por cada categoria de gasto, se puede asignar un limite de gasto mensual
- Cada categoria se muestra como una tarjeta con:
  - Nombre, icono y color de la categoria
  - Limite asignado
  - Gasto actual del mes
  - Barra de progreso visual (porcentaje consumido)
  - Indicador de alerta visual al 80% del limite (barra amarilla)
  - Indicador de alerta roja al 100% o mas (barra roja + texto "Limite superado")
  - Monto restante o excedido
- Las categorias sin presupuesto asignado se muestran igual pero con boton "Asignar presupuesto"
- Al cambiar de mes, los presupuestos del mes anterior se mantienen como referencia, y se crean nuevos presupuestos para el mes siguiente con los mismos limites
- El usuario puede editar el limite de cualquier categoria en cualquier momento
- API Routes para CRUD de presupuestos
- Integrar en el Dashboard: indicador de cuantas categorias estan cerca o sobre el limite
- Los gastos fijos/suscripciones deben contar para el presupuesto de su categoria

#### Esquema
- Tabla budgets: id (INTEGER PK), categoryId (INTEGER FK), month (TEXT 'YYYY-MM'), limitAmount (REAL), createdAt (TEXT)
- La suma de gastos del mes por categoria se calcula desde transactions

#### 15. Reportes y Estadisticas

- Nueva pagina en `/reports` con vista completa de reportes
- Selector de periodo: permite cambiar entre vista mensual, trimestral, semestral o anual
- Selector de ano y mes para navegar

#### Componentes del Reporte

1. **Resumen del Periodo**
   - Total ingresos del periodo
   - Total gastos del periodo
   - Balance (ingresos - gastos)
   - Porcentaje de ahorro (balance / ingresos * 100)
   - Comparacion con el periodo anterior (flecha verde/roja + porcentaje de cambio)

2. **Grafico de Linea: Evolucion Mensual**
   - Linea de ingresos (verde) y gastos (roja) mes a mes
   - Eje X: meses del periodo seleccionado
   - Tooltip al hover con valores exactos
   - Usar Recharts para el grafico

3. **Distribucion de Gastos por Categoria**
   - Grafico de dona con datos del periodo seleccionado
   - Al lado, tabla con: Categoria, icono, Total gastado, Porcentaje del total
   - Ordenado de mayor a menor gasto

4. **Top 5 Categorias de Gasto**
   - Las 5 categorias donde mas se gasta en el periodo
   - Ranking con barra horizontal y porcentaje

5. **Desglose Fijo vs Variable**
   - Grafico de barras: cuanto de los gastos son fijos (suscripciones) vs variables
   - Total de gastos fijos del periodo
   - Total de gastos variables del periodo

6. **Balance Mensual Detallado**
   - Tabla con fila por cada mes del periodo
   - Columnas: Mes, Ingresos, Gastos, Balance, % Ahorro

7. **Exportar Reporte**
   - Boton "Exportar Reporte como CSV" que descarga todos los datos del reporte actual

#### API
- Endpoint `/api/reports/summary` unificado que devuelve todos los datos del reporte en una sola llamada
- Endpoint `/api/reports/export` para descarga CSV del reporte actual

#### 16. Exportacion de Datos

- Boton de exportar en la pagina de transacciones: descarga todas las transacciones filtradas como CSV
- Boton de exportar en la pagina de gastos fijos: descarga la lista de suscripciones como CSV
- El CSV debe tener headers claros y formato que se pueda abrir en Excel / Google Sheets
- El archivo debe descargarse con nombre descriptivo: `finanzas_transacciones_2026-05.csv`, `finanzas_gastos-fijos_2026-05-18.csv`, etc.

#### Endpoints
- POST `/api/export/transactions` exportar transacciones filtradas con body JSON (type, categoryId, period, from, to)
- POST `/api/export/fixed-expenses` exportar todos los gastos fijos

#### 17. PWA (Progressive Web App)

- La app debe ser instalable en dispositivos moviles (Android y iOS) como una app nativa
- Al abrir la app en Chrome/Edge/Safari desde el movil, debe mostrar un banner de "Instalar app" o el usuario debe poder agregarla a la pantalla de inicio manualmente

#### Requisitos Tecnicos

1. **Manifest.json** en `/manifest.webmanifest`:
   - name: "Finanzas Personales"
   - short_name: "Finanzas"
   - description: "App de finanzas personales con control de gastos e ingresos"
   - theme_color: #000000 (coherente con modo AMOLED)
   - background_color: #000000
   - display: standalone (abre sin barra de navegacion del navegador)
   - orientation: portrait-primary
   - icons: icono SVG en la raiz y referenciado

2. **Service Worker** en `/sw.js`:
   - Cachear assets estaticos (JS, CSS, HTML) para funcionamiento offline parcial
   - Estrategia: cache-first para JS/CSS, network-first para API calls
   - Registrar el service worker desde un componente cliente

3. **Iconos**:
   - Icono SVG en `/icon.svg` para el manifest
   - Apple touch icon para iOS en `/apple-icon.svg`
   - Favicon basico

4. **Meta Tags** en layout raiz:
   - viewport con viewport-fit=cover
   - apple-mobile-web-app-capable
   - apple-mobile-web-app-status-bar-style: black-translucent
   - mobile-web-app-capable
   - theme-color: #000000

5. **Install Prompt**:
   - Componente que muestra boton "Instalar app" cuando el evento beforeinstallprompt esta disponible

- Boton de exportar en la pagina de transacciones: descarga todas las transacciones filtradas como CSV
- Boton de exportar en la pagina de gastos fijos: descarga la lista de suscripciones como CSV
- El CSV debe tener headers claros y formato que se pueda abrir en Excel / Google Sheets
- El archivo debe descargarse con nombre descriptivo: `finanzas_transacciones_2026-05.csv`, `finanzas_gastos-fijos_2026-05-18.csv`, etc.

#### Endpoints
- POST `/api/export/transactions` exportar transacciones filtradas con body JSON (type, categoryId, period, from, to)
- POST `/api/export/fixed-expenses` exportar todos los gastos fijos

- Nueva pagina en `/reports` con vista completa de reportes
- Selector de periodo: permite cambiar entre vista mensual, trimestral, semestral o anual
- Selector de ano y mes para navegar

#### Componentes del Reporte

1. **Resumen del Periodo**
   - Total ingresos del periodo
   - Total gastos del periodo
   - Balance (ingresos - gastos)
   - Porcentaje de ahorro (balance / ingresos * 100)
   - Comparacion con el periodo anterior (flecha verde/roja + porcentaje de cambio)

2. **Grafico de Linea: Evolucion Mensual**
   - Linea de ingresos (verde) y gastos (roja) mes a mes
   - Eje X: meses del periodo seleccionado
   - Tooltip al hover con valores exactos
   - Usar Recharts para el grafico

3. **Distribucion de Gastos por Categoria**
   - Grafico de dona con datos del periodo seleccionado
   - Al lado, tabla con: Categoria, icono, Total gastado, Porcentaje del total
   - Ordenado de mayor a menor gasto

4. **Top 5 Categorias de Gasto**
   - Las 5 categorias donde mas se gasta en el periodo
   - Ranking con barra horizontal y porcentaje

5. **Desglose Fijo vs Variable**
   - Grafico de barras: cuanto de los gastos son fijos (suscripciones) vs variables
   - Total de gastos fijos del periodo
   - Total de gastos variables del periodo

6. **Balance Mensual Detallado**
   - Tabla con fila por cada mes del periodo
   - Columnas: Mes, Ingresos, Gastos, Balance, % Ahorro

7. **Exportar Reporte**
   - Boton "Exportar Reporte como CSV" que descarga todos los datos del reporte actual

#### API
- Endpoint `/api/reports/summary` unificado que devuelve todos los datos del reporte en una sola llamada
- Endpoint `/api/reports/export` para descarga CSV del reporte actual

- Nueva pagina en `/budgets` con vista general de presupuestos del mes actual
- Selector para cambiar de mes en la pagina de presupuestos
- Por cada categoria de gasto, se puede asignar un limite de gasto mensual
- Cada categoria se muestra como una tarjeta con:
  - Nombre, icono y color de la categoria
  - Limite asignado
  - Gasto actual del mes
  - Barra de progreso visual (porcentaje consumido)
  - Indicador de alerta visual al 80% del limite (barra amarilla)
  - Indicador de alerta roja al 100% o mas (barra roja + texto "Limite superado")
  - Monto restante o excedido
- Las categorias sin presupuesto asignado se muestran igual pero con boton "Asignar presupuesto"
- Al cambiar de mes, los presupuestos del mes anterior se mantienen como referencia, y se crean nuevos presupuestos para el mes siguiente con los mismos limites
- El usuario puede editar el limite de cualquier categoria en cualquier momento
- API Routes para CRUD de presupuestos
- Integrar en el Dashboard: indicador de cuantas categorias estan cerca o sobre el limite
- Los gastos fijos/suscripciones deben contar para el presupuesto de su categoria

#### Esquema
- Tabla budgets: id (INTEGER PK), categoryId (INTEGER FK), month (TEXT 'YYYY-MM'), limitAmount (REAL), createdAt (TEXT)
- La suma de gastos del mes por categoria se calcula desde transactions

- Pagina dedicada en `/categories` con grid visual de todas las categorias
- Cada categoria se muestra como una tarjeta con: nombre, icono (lucide-react), color de fondo
- Las categorias por defecto (Comida, Transporte, Vivienda, Servicios, Ocio, Salud, Educacion, Ropa, Otros) tienen iconos y colores asignados
- El usuario puede CREAR nuevas categorias personalizadas eligiendo:
  - Nombre
  - Icono (selector visual con grid de iconos de lucide-react, categorizados por tipo)
  - Color (selector de color con paleta predefinida + color picker HTML5)
- El usuario puede EDITAR cualquier categoria (nombre, icono, color)
- El usuario puede ELIMINAR categorias personalizadas
  - Las categorias por defecto NO se pueden eliminar (solo editar icono/color)
- Al eliminar una categoria que tiene transacciones asociadas:
  - Mostrar un modal preguntando que hacer
  - Opcion A: Reasignar las transacciones a otra categoria (selector)
  - Opcion B: Eliminar todas las transacciones de esa categoria
- API Routes completas para CRUD de categorias con manejo de reasignacion
- Integrar en el formulario de transacciones: al seleccionar categoria, mostrar el icono y color de cada una
- En el dashboard y reportes, las categorias deben mostrar su icono y color asociado

---

### User Story 4 - Gestionar presupuestos mensuales (Priority: P4)

Como usuario, quiero asignar limites mensuales por categoria y ver alertas de avance para
controlar mis gastos antes de superar mis objetivos.

**Why this priority**: Los presupuestos convierten la app de registro pasivo en una
herramienta de control financiero preventivo.

**Independent Test**: Asignar un limite a una categoria, registrar gastos que alcancen 80%
y luego superen el limite, y confirmar que las barras, advertencias y alertas cambian de
estado correctamente.

**Acceptance Scenarios**:

1. **Given** una categoria sin presupuesto mensual, **When** el usuario asigna un limite,
   **Then** ve una barra de progreso con gasto acumulado frente al limite.
2. **Given** que el gasto de una categoria alcanza al menos 80% de su limite, **When** el
   usuario revisa presupuestos o dashboard, **Then** ve una advertencia visual.
3. **Given** que inicia un nuevo mes, **When** el usuario consulta presupuestos, **Then**
   existen presupuestos del nuevo mes con los mismos limites y gasto acumulado reiniciado.

---

### User Story 5 - Analizar reportes y estadisticas (Priority: P5)

Como usuario, quiero revisar tendencias, gasto por categoria, top de categorias y balance
mensual para identificar habitos y oportunidades de ahorro.

**Why this priority**: Los reportes ayudan a convertir datos historicos en decisiones
financieras, pero dependen de tener transacciones y categorias consistentes.

**Independent Test**: Cargar datos de varios meses y confirmar que la evolucion de ingresos
vs gastos, resumen por categoria, top 5 y balance mensual coinciden con los registros.

**Acceptance Scenarios**:

1. **Given** que existen transacciones en los ultimos 12 meses, **When** el usuario abre
   reportes, **Then** ve la evolucion mensual de ingresos y gastos.
2. **Given** que existen gastos categorizados, **When** el usuario revisa el resumen por
   categoria, **Then** ve total y porcentaje de cada categoria sobre el gasto total.
3. **Given** que hay informacion mensual suficiente, **When** el usuario revisa balances,
   **Then** ve cuanto ahorro o gasto de mas en cada mes.

---

### User Story 6 - Exportar datos (Priority: P6)

Como usuario, quiero exportar mis transacciones y reportes mensuales a CSV para respaldar,
auditar o migrar mis datos sin depender de la app.

**Why this priority**: La portabilidad es un principio del proyecto y asegura que el usuario
mantenga control total sobre su informacion.

**Independent Test**: Exportar todas las transacciones y un reporte mensual, abrir los CSV
en una hoja de calculo y confirmar que contienen encabezados claros y datos completos.

**Acceptance Scenarios**:

1. **Given** que existen transacciones registradas, **When** el usuario exporta todas las
   transacciones, **Then** recibe un archivo CSV con todas las filas y campos relevantes.
2. **Given** que el usuario selecciona un mes con actividad, **When** exporta el reporte
   mensual, **Then** recibe un CSV con resumen de ingresos, gastos, categorias y balance.

---

### User Story 7 - Gestionar moneda y tipo de cambio (Priority: P7)

Como usuario, quiero registrar transacciones en Soles o Dolares y configurar el tipo de
cambio para que todos mis totales se mantengan comparables en Soles.

**Why this priority**: El usuario puede manejar gastos o ingresos en USD, pero necesita que
dashboard, reportes y filtros conserven una moneda base consistente.

**Independent Test**: Configurar el tipo de cambio USD a PEN, registrar una transaccion en
USD y confirmar que la lista muestra monto original y equivalente en Soles mientras el
dashboard usa el monto convertido.

**Acceptance Scenarios**:

1. **Given** que el usuario configura un tipo de cambio USD a PEN, **When** registra una
   transaccion en USD, **Then** la transaccion guarda monto original, moneda y tipo de
   cambio usado al momento del registro.
2. **Given** que existen transacciones en PEN y USD, **When** el usuario consulta dashboard
   o reportes, **Then** todos los totales se muestran convertidos a Soles.
3. **Given** una transaccion en USD, **When** se muestra en una lista, **Then** el usuario ve
   el monto original en USD y su equivalente en Soles.

---

### User Story 8 - Filtrar por periodos avanzados (Priority: P8)

Como usuario, quiero seleccionar periodos rapidos, mes, ano y rangos personalizados para
analizar mis transacciones y dashboard con menos friccion.

**Why this priority**: Los filtros por periodo reducen esfuerzo al revisar meses concretos,
comparar rangos y enfocar el dashboard en un mes distinto al actual.

**Independent Test**: Usar Mes actual, Mes anterior, Ultimos 3 meses, Ultimo ano y un rango
personalizado para confirmar que lista y dashboard muestran datos del periodo elegido.

**Acceptance Scenarios**:

1. **Given** transacciones de varios meses, **When** el usuario selecciona un mes y ano,
   **Then** la lista muestra solo transacciones de ese periodo.
2. **Given** transacciones historicas, **When** el usuario usa un selector rapido, **Then**
   se aplican las fechas correspondientes al periodo seleccionado.
3. **Given** que el usuario cambia el mes del dashboard, **When** se actualiza la vista,
   **Then** totales y grafico corresponden al mes seleccionado.

---

### User Story 9 - Gestionar gastos fijos y suscripciones (Priority: P9)

Como usuario, quiero marcar gastos como fijos o variables y revisar mis suscripciones en
una seccion dedicada para entender mis compromisos mensuales recurrentes.

**Why this priority**: Los gastos fijos afectan la salud financiera antes de cualquier
gasto variable; visualizarlos ayuda a anticipar cobros y controlar presupuestos.

**Independent Test**: Crear un gasto fijo mensual, trimestral, semestral o anual; confirmar
que aparece en la pagina de Gastos Fijos con costo mensual equivalente, proxima fecha de
cobro, agrupacion visual y total mensual acumulado.

**Acceptance Scenarios**:

1. **Given** que el usuario registra una transaccion de gasto, **When** la marca como fija,
   **Then** puede elegir ciclo de facturacion y la app calcula la proxima fecha de cobro.
2. **Given** una suscripcion anual de 120, **When** se muestra en Gastos Fijos, **Then** el
   costo mensual equivalente es 10 en la moneda base convertida a PEN.
3. **Given** gastos fijos con proxima fecha dentro de 7 dias, **When** el usuario abre la
   seccion Gastos Fijos, **Then** esos gastos muestran un indicador de proximo vencimiento.
4. **Given** gastos fijos y variables en el mes, **When** el usuario abre el dashboard,
   **Then** ve un indicador separado de gastos fijos del mes vs gastos variables.

---

### Edge Cases

- Si el usuario intenta guardar una transaccion con monto vacio, cero, negativo o no
  numerico, la app debe impedirlo y explicar el problema.
- Si el usuario no tiene transacciones, dashboard, reportes y exportaciones deben mostrar
  estados vacios utiles sin errores.
- Si una categoria personalizada tiene transacciones asociadas, su eliminacion debe exigir
  una decision explicita para reasignar o preservar la trazabilidad.
- Si el usuario filtra una lista y no hay resultados, la app debe mostrar que no existen
  movimientos para esos criterios y permitir limpiar filtros.
- Si el acceso al almacenamiento local falla, la app debe informar que los datos no pudieron
  guardarse o leerse y evitar mostrar resultados como si fueran completos.
- Si un mes nuevo comienza antes de que el usuario abra la app, los presupuestos del mes
  deben prepararse con los limites vigentes al consultarlos.
- Si el usuario exporta sin datos disponibles, la app debe entregar un CSV con encabezados
  claros o indicar que no hay datos exportables, sin bloquear la aplicacion.
- Si el usuario cambia el tipo de cambio global, transacciones existentes en USD deben
  conservar el tipo de cambio con el que fueron registradas.
- Si no hay tipo de cambio configurado, la app debe usar un valor inicial editable y
  permitir actualizarlo antes de registrar transacciones en USD.
- Si un selector rapido produce un rango sin transacciones, la app debe mostrar un estado
  vacio util y permitir cambiar el periodo.
- Si una transaccion fija no tiene ciclo de facturacion, la app debe impedir guardarla y
  explicar que el ciclo es obligatorio para gastos recurrentes.
- Si la proxima fecha de cobro cae dentro de los proximos 7 dias, la app debe resaltarla en
  la vista de Gastos Fijos.

## Requirements *(mandatory)*

### Requisitos de Diseño

- El modo oscuro MUST usar fondos principales `#000000` (negro puro) en lugar de gris
  oscuro para permitir apagado real de pixeles en pantallas AMOLED.
- Los componentes sobre fondo AMOLED MUST conservar contraste suficiente para lectura,
  estados de error, ingresos, gastos y acciones primarias.

### Funcionalidades Nuevas

- **Gestion de Moneda**: La moneda base es Sol Peruano (PEN), configurable localmente junto
  con el tipo de cambio USD a PEN. Las transacciones pueden registrarse en PEN o USD y
  conservan monto original, moneda y tipo de cambio usado al momento del registro.
- **Filtros Avanzados**: Las transacciones y dashboard soportan seleccion por mes, ano,
  rangos personalizados y accesos rapidos para mes actual, mes anterior, ultimos 3 meses y
  ultimo ano. Reportes deben soportar vistas mensual y anual cuando se implementen.
- **Gestion de Gastos Fijos y Suscripciones**: Las transacciones de gasto pueden marcarse
  como fijas o variables. Los gastos fijos incluyen ciclo de facturacion, proxima fecha de
  cobro, costo mensual equivalente y una pagina dedicada en el sidebar.

### Functional Requirements

- **FR-001**: The system MUST allow users to create income and expense transactions with
  amount, description, category and date.
- **FR-002**: The system MUST default the transaction date to the current date while
  allowing the user to choose another date.
- **FR-003**: The system MUST validate required transaction fields before saving and show
  clear messages for invalid values.
- **FR-004**: The system MUST display a paginated transaction list ordered by date
  descending.
- **FR-005**: Users MUST be able to filter transactions by date range, transaction type and
  category, individually or in combination.
- **FR-006**: Users MUST be able to edit and delete existing transactions.
- **FR-007**: The system MUST include predefined categories: Comida, Transporte, Vivienda,
  Servicios, Ocio, Salud, Educacion, Ropa and Otros.
- **FR-008**: Each category MUST have a name, icon and assigned color.
- **FR-009**: Users MUST be able to create, edit and delete custom categories.
- **FR-010**: The system MUST ask the user how to handle associated transactions before
  deleting a category that is in use.
- **FR-011**: The system MUST show a dashboard with current balance, current-month income
  total and current-month expense total.
- **FR-012**: The system MUST show a visual distribution of expenses by category.
- **FR-013**: The system MUST show the five most recent transactions on the dashboard.
- **FR-014**: The system MUST show how many budget categories are near or above their
  monthly limit.
- **FR-015**: Users MUST be able to assign a monthly spending limit per category.
- **FR-016**: The system MUST show budget progress as amount spent compared with the
  configured limit.
- **FR-017**: The system MUST show a warning when category spending reaches at least 80% of
  the monthly limit.
- **FR-018**: The system MUST show an alert when category spending exceeds the monthly
  limit.
- **FR-019**: The system MUST create the next month's budgets with the same limits when a
  new month begins.
- **FR-020**: The system MUST show income and expense trends by month for the latest 12
  months with available data.
- **FR-021**: The system MUST show a category expense summary with total amount and
  percentage of total expenses.
- **FR-022**: The system MUST show the top five spending categories for the selected period.
- **FR-023**: The system MUST show monthly balance as saved amount or overspent amount per
  month.
- **FR-024**: Users MUST be able to export all transactions to CSV.
- **FR-025**: Users MUST be able to export a monthly report to CSV.
- **FR-026**: CSV exports MUST include clear headers and enough fields to understand the
  exported records without proprietary tooling.
- **FR-027**: The system MUST support light and dark themes with a user-controlled toggle.
- **FR-028**: The system MUST provide a mobile-priority responsive experience that remains
  usable on desktop.
- **FR-029**: The system MUST use distinct visual treatment for expenses and income so the
  user can distinguish them quickly.
- **FR-030**: The system MUST work without user accounts, internet access or external
  services for all core flows.
- **FR-031**: The system MUST be installable from a mobile device and remain useful for the
  main flows after installation.
- **FR-032**: The system MUST use pure black `#000000` for the main backgrounds when dark
  mode is active to support AMOLED screens.
- **FR-033**: The system MUST use Sol Peruano (PEN) as the default base currency and persist
  currency settings locally.
- **FR-034**: Users MUST be able to register transactions in PEN or USD.
- **FR-035**: Each transaction MUST store original amount, currency and exchange rate used
  at registration time.
- **FR-036**: Users MUST be able to update a global USD to PEN exchange rate manually from
  the UI.
- **FR-037**: Dashboard, reports and totals MUST display amounts converted to Soles.
- **FR-038**: USD transactions MUST display original USD amount and equivalent PEN amount.
- **FR-039**: Transaction filters MUST include month, year and quick selectors for current
  month, previous month, last 3 months, last year and custom range.
- **FR-040**: Reports MUST support monthly and annual views.
- **FR-041**: Dashboard MUST allow selecting the month to visualize.
- **FR-042**: Users MUST be able to mark expense transactions as fixed/recurring or
  variable.
- **FR-043**: Fixed expenses MUST support billing cycles: monthly, quarterly, semiannual and
  annual.
- **FR-044**: The system MUST calculate monthly equivalent cost from the billing cycle and
  converted PEN amount.
- **FR-045**: The system MUST calculate next billing date from the last payment date and
  billing cycle.
- **FR-046**: The system MUST provide a dedicated Gastos Fijos or Suscripciones page from
  the sidebar.
- **FR-047**: Fixed expense cards MUST show name, amount per cycle, monthly equivalent,
  cycle, next billing date and cycle progress.
- **FR-048**: The fixed expenses page MUST show total monthly equivalent cost and highlight
  expenses due within the next 7 days.
- **FR-049**: Dashboard MUST show fixed monthly expenses separately from variable expenses.
- **FR-050**: Reports and budgets SHOULD use fixed expenses as a base when those modules are
  implemented or expanded.

### Constitution Alignment *(mandatory)*

- **Privacy**: All financial data remains local to the user's environment; no accounts,
  remote servers, telemetry or third-party services are required for core flows.
- **Simplicity**: The MVP path is recording transactions, viewing a useful dashboard and
  exporting data; advanced analysis depends on those records and can be delivered after the
  core path is stable.
- **UX**: Mobile usability, desktop responsiveness, dark mode and clear financial visuals
  are required from the first usable version. Dark mode uses pure black main backgrounds for
  AMOLED screens.
- **Exportability**: Transaction and monthly report exports are mandatory CSV capabilities
  with readable headers and complete data for the selected scope.
- **Stack**: Planning must follow the project-approved local-first constraints defined by
  the constitution.
- **Maintainability**: The product separates data entry, category/budget rules, reporting
  calculations and presentation so each flow can be understood and tested independently.
- **Monetization**: The feature introduces no payments, subscriptions, ads, commercial
  tracking or paywalls.

### Key Entities *(include if feature involves data)*

- **Transaction**: A financial movement representing income or expense. Key attributes:
  original amount, currency, exchange rate, converted amount in PEN, description, type,
  category, date, recurrence flag, billing cycle, next billing date and created/updated
  timestamps.
- **Category**: A classification for transactions. Key attributes: name, icon, color,
  predefined/custom flag and active/deleted status.
- **Budget**: A monthly spending limit for a category. Key attributes: category, month,
  limit amount, spent amount and status against threshold.
- **Monthly Report**: A derived summary for a month. Key attributes: total income, total
  expenses, balance, category breakdown and top categories.
- **Theme Preference**: User preference for light or dark display mode.
- **Currency Settings**: Local configuration for base currency and current USD to PEN
  exchange rate. Key attributes: base currency, USD to PEN exchange rate and updated
  timestamp.
- **Fixed Expense**: A recurring expense represented by a transaction marked as fixed. Key
  attributes: transaction reference, billing cycle, amount per cycle, monthly equivalent,
  next billing date and due-soon status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can record a new transaction in under 30 seconds on a mobile screen.
- **SC-002**: A user can understand current balance, monthly income and monthly expenses
  within 10 seconds of opening the dashboard.
- **SC-003**: A user can find a specific historical transaction using filters in under 20
  seconds when at least 100 transactions exist.
- **SC-004**: Budget warnings appear whenever spending reaches 80% or more of the configured
  monthly limit, and over-limit alerts appear when spending exceeds 100%.
- **SC-005**: CSV transaction export includes 100% of saved transactions and can be opened
  in common spreadsheet tools with recognizable columns.
- **SC-006**: The main flows remain usable on a phone-width screen and a desktop-width
  screen without horizontal scrolling.
- **SC-007**: A user can switch between light and dark themes and see the preference applied
  across all primary screens.
- **SC-008**: The app can be used for recording, reviewing and exporting data without an
  internet connection or account sign-in.
- **SC-009**: A user can register a USD transaction and see its PEN equivalent immediately
  in the transaction list and dashboard totals.
- **SC-010**: A user can change dashboard month or transaction period filters in under 10
  seconds using quick selectors or custom range controls.
- **SC-011**: In dark mode, primary page backgrounds render as `#000000`.
- **SC-012**: A user can identify total monthly fixed expenses and subscriptions due in the
  next 7 days within 10 seconds of opening the Gastos Fijos page.

## Assumptions

- The app is intended for a single personal user on their own device, not for shared family
  or multi-user finance management.
- PEN is the base currency for totals. USD is supported through a manually configured USD
  to PEN exchange rate.
- Deleted transactions are removed from active totals and reports unless the user exports or
  backs them up before deletion.
- Predefined categories cannot be removed entirely; users can create custom categories for
  additional classification needs.
- Monthly budgets are based on calendar months and category spending only, not income goals.
- Reports use transaction dates, not creation dates, for monthly grouping.
