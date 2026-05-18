<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- PRINCIPLE_1_NAME -> I. Privacidad Total
- PRINCIPLE_2_NAME -> II. Simplicidad Sobre Features
- PRINCIPLE_3_NAME -> III. UX Primero
- PRINCIPLE_4_NAME -> IV. Datos Exportables
- PRINCIPLE_5_NAME -> V. Stack Pragmatico
Added principles:
- VI. Codigo Limpio y Mantenible
- VII. Sin Pagos ni Suscripciones
Added sections:
- Restricciones Tecnicas
- Flujo de Desarrollo y Calidad
Removed sections:
- None
Templates requiring updates:
- updated .specify/templates/plan-template.md
- updated .specify/templates/spec-template.md
- updated .specify/templates/tasks-template.md
- reviewed .specify/templates/commands/*.md (no command files present)
- reviewed AGENTS.md (no principle-specific updates required)
Follow-up TODOs: None
-->
# Finanzas Personales Constitution

## Core Principles

### I. Privacidad Total

Todos los datos financieros MUST almacenarse localmente en el dispositivo o en archivos
controlados por el usuario. La aplicacion MUST NOT requerir cuentas de usuario,
servidores externos, telemetria remota ni APIs de terceros para funcionar. Cualquier
funcionalidad que exponga datos fuera del entorno local MUST ser rechazada salvo que sea
una exportacion iniciada explicitamente por el usuario.

Rationale: los datos financieros son sensibles; el usuario conserva propiedad y control
total sobre ellos.

### II. Simplicidad Sobre Features

Cada feature MUST resolver una necesidad personal concreta con el menor alcance viable.
El MVP MUST priorizar flujos completos y usables sobre funcionalidades incompletas. Toda
complejidad nueva, abstraccion adicional o dependencia MUST justificarse por una necesidad
actual, no por escenarios futuros hipoteticos.

Rationale: una app personal mantiene valor cuando es rapida de usar, facil de mantener y
no acumula deuda por sobreingenieria.

### III. UX Primero

La aplicacion MUST ser rapida, responsive en movil y escritorio, y soportar modo oscuro.
Los flujos principales MUST poder completarse sin friccion innecesaria. Las animaciones y
transiciones MAY usarse cuando aclaren el estado o mejoren la percepcion de fluidez, pero
MUST permanecer sobrias y no bloquear interacciones.

Rationale: la gestion financiera personal requiere una experiencia clara y confiable que
no castigue el uso frecuente.

### IV. Datos Exportables

El usuario MUST poder exportar sus datos en CSV en cualquier momento desde la aplicacion.
Los datos exportados MUST ser legibles, completos para el alcance implementado y no
depender de formatos propietarios. Ninguna feature MUST crear lock-in que impida migrar o
respaldar la informacion.

Rationale: la portabilidad protege al usuario y refuerza que los datos le pertenecen.

### V. Stack Pragmatico

El stack aprobado para el producto es Next.js 15 con App Router, TypeScript, Tailwind CSS
4, SQLite y Drizzle ORM. Nuevas dependencias MUST ser necesarias, pequenas en alcance y
justificadas en el plan de implementacion. La arquitectura MUST evitar servidores,
servicios externos y capas genericas que no aporten valor inmediato al MVP.

Rationale: el stack definido cubre las necesidades del proyecto sin introducir
infraestructura o dependencias innecesarias.

### VI. Codigo Limpio y Mantenible

El codigo MUST usar tipos claros, componentes pequenos y separacion explicita entre UI,
logica de negocio y persistencia. Los nombres MUST comunicar intencion. La duplicacion MAY
mantenerse cuando extraer abstracciones haga el codigo menos claro. Los cambios MUST ser
comprensibles para otro desarrollador, o para el mantenedor original, tras meses sin
contexto.

Rationale: la mantenibilidad reduce el coste de evolucionar una herramienta personal a lo
largo del tiempo.

### VII. Sin Pagos ni Suscripciones

La aplicacion MUST permanecer gratuita y personal. El producto MUST NOT introducir pagos,
suscripciones, paywalls, anuncios, tracking comercial ni integraciones orientadas a
monetizacion.

Rationale: el producto existe como herramienta personal, no como modelo de negocio.

## Restricciones Tecnicas

- La aplicacion MUST funcionar sin autenticacion, sin cuentas y sin backend remoto.
- La persistencia MUST permanecer local con SQLite y Drizzle ORM salvo en planes que
  modifiquen esta constitucion primero.
- Las features que gestionen datos financieros MUST incluir consideraciones de privacidad,
  respaldo/exportacion y manejo de errores locales.
- La UI MUST contemplar desktop, movil y modo oscuro desde el diseno inicial, no como
  ajuste posterior.
- El alcance del MVP MUST favorecer una unica ruta funcional completa antes de agregar
  variantes o automatizaciones.

## Flujo de Desarrollo y Calidad

- Cada plan MUST documentar como cumple la privacidad local, exportacion de datos,
  simplicidad, UX responsive/dark mode y restricciones del stack.
- Cada especificacion MUST definir historias independientes y priorizadas, con P1 capaz
  de entregar valor como MVP usable.
- Las tareas MUST separarse por historia de usuario e incluir, cuando aplique,
  persistencia local, exportacion CSV, estados de error, responsive design y modo oscuro.
- Las pruebas automatizadas son recomendadas para logica de negocio y persistencia; cuando
  no se agreguen, el plan MUST describir una validacion manual reproducible.
- Las dependencias nuevas, integraciones externas o desviaciones del stack MUST registrarse
  como violaciones de constitucion y justificarse antes de implementarse.

## Governance

Esta constitucion tiene prioridad sobre decisiones ad hoc, plantillas y planes de feature.
Las enmiendas MUST actualizar este documento, incluir un Sync Impact Report y propagar los
cambios a plantillas y guias afectadas en el mismo cambio.

Versioning policy:
- MAJOR: elimina o redefine de forma incompatible principios o restricciones vigentes.
- MINOR: agrega principios, secciones o guias materiales de cumplimiento.
- PATCH: aclara redaccion, corrige errores o mejora precision sin cambiar obligaciones.

Compliance review:
- Todo plan MUST pasar el Constitution Check antes de investigacion o diseno.
- Toda implementacion MUST revisarse contra privacidad local, simplicidad, UX,
  exportabilidad, stack aprobado y mantenibilidad antes de considerarse completa.
- Las excepciones MUST documentarse con razon, alternativa mas simple rechazada y alcance
  temporal; excepciones que contradigan principios MUST requerir enmienda previa.

**Version**: 1.0.0 | **Ratified**: 2026-05-17 | **Last Amended**: 2026-05-17
