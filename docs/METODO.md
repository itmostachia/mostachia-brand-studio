# Método — crear una marca de punta a punta

> Playbook del equipo. Las skills lo ejecutan; este documento explica **qué** se hace en cada fase, con qué
> entra, qué sale, quién aprueba y cuánto tarda. Estructura de carpetas y config: `docs/CONTRATO.md`.
> Criterio estético: `docs/PRINCIPIOS-ESTETICOS.md`. Errores conocidos: `docs/LECCIONES.md`.

## Idea central

Una identidad no se elige leyendo capítulos (logo, color, tipo…) de una sola dirección. Se elige
**comparando mundos completos** dentro de un mismo marco: 12–18 territorios realmente distintos, cada uno
con su brandboard total y su prueba en aplicaciones reales. El equipo vota. Recién ahí se construye el kit,
y la implementación tiene que conservar la riqueza de lo que se aprobó.

## Mapa de fases

| # | Fase | Carpeta | Skill | Gate (quién aprueba) | Tiempo típico |
|---|---|---|---|---|---|
| 0 | Intake y control | `00-control/` | `crear-marca` | — | 15 min |
| 1 | Brief | `01-brief/` | `crear-marca` | Responsable del proyecto confirma el brief | 30–60 min |
| 2 | Naming (si hace falta) | `02-naming/` | `naming-marca` | Equipo elige finalista(s) | 1–2 h + 1 día de decisión |
| 3 | Referencias | `03-referencias/` | `crear-marca` | — (el equipo puede sumar/quitar) | 1–2 h |
| 4 | Territorios | `04-territorios/` | `territorios-marca` | QA interno (rúbrica ≥16/20 por board) | 1–2 días de agente |
| 5 | Elección / fusión | `05-eleccion/` | `crear-marca` | **Votación del equipo — STOP obligatorio** | lo que tarde el equipo |
| 6 | Kit | `06-kit/` | `kit-marca` | Equipo aprueba kit + auditoría | 1 día |
| 7 | Aplicaciones | `07-aplicaciones/` | `piezas-marca`, `web-marca`, `web-3d` | Equipo aprueba cada tanda | 1–3 días |
| 8 | QA | `08-qa/` | todas | Veredicto QA escrito | continuo + 2 h final |
| 9 | Entrega | `09-entrega/` | `crear-marca` | Responsable del proyecto | 1 h |

Regla transversal: **al cerrar cualquier fase** se actualizan `00-control/ESTADO.md` (fase, hecho, sigue),
`DECISIONES.md` (una fila D-00N por decisión: fecha, decisión, quién, por qué) y `RETOMAR.md` (instrucción
exacta para que otra sesión continúe). Si otro agente no puede seguir leyendo solo esos dos archivos, la
fase no está cerrada.

---

## Fase 0 — Intake y control

- **Entra:** el pedido (mensaje, audio transcripto, mail).
- **Hace:** crear expediente con `tools/nuevo-expediente.mjs` o retomar uno existente leyendo `ESTADO.md`.
  Guardar el pedido **literal** en `PEDIDO-ORIGINAL.md` (inmutable). Cada pedido posterior va en
  `PEDIDO-<fecha>.md` con su interpretación de trabajo debajo. Detectar runtime de imagen (CONTRATO §4) y
  registrarlo en `brand.config.json → runtime_imagenes`.
- **Sale:** expediente con `brand.config.json` (estado `brief`), ESTADO/DECISIONES/RETOMAR iniciales.
- **Done:** otra sesión puede retomar sin el chat.

## Fase 1 — Brief

- **Entra:** pedido + lo que se sepa del negocio.
- **Hace:** **una sola ronda** de preguntas agrupadas (ver `skills/crear-marca/references/entrevista-brief.md`).
  Lo que no se responde se infiere y se marca como *supuesto* en el brief.
- **Sale:** `01-brief/BRIEF.md` — negocio y producto real, audiencia, competencia directa y alternativas,
  tono, qué NO debe parecer, restricciones (nombre fijo, colores heredados, plazos, soportes obligatorios),
  aplicaciones que sí o sí hay que probar, supuestos.
- **Gate:** el responsable confirma o corrige el brief. Sin brief confirmado, no se abren territorios
  (sí se puede avanzar naming y referencias en paralelo).

## Fase 2 — Naming (solo si no hay nombre)

- **Hace:** `naming-marca` → 10–15 nombres en estrategias distintas, pronunciación, eslóganes para
  finalistas y chequeo **preliminar** de disponibilidad (marcas, dominios, handles).
- **Sale:** `02-naming/NAMING.md`.
- **Gate:** el equipo elige 1 nombre (o 2–3 finalistas que viajan a territorios). Se registra en
  DECISIONES. El chequeo preliminar **no es asesoramiento legal**: antes de lanzar, pagar pauta o registrar,
  clearance profesional.

## Fase 3 — Referencias

- **Entra:** imágenes que el equipo suelta en `03-referencias/entrada/` + búsqueda propia (Pinterest,
  Behance, Awwwards, Savee, sitios de estudios) **solo como inspiración**.
- **Hace:** mirar cada referencia de verdad (no por el nombre de archivo). Por cada una en `ANALISIS.md`:
  qué se observa (paleta, tipo por rasgos, composición, gesto, textura, cómo muestra aplicaciones),
  qué se transfiere (principio, no forma), qué se evita. Registrar origen, autor si se conoce y licencia en
  `FUENTES.csv`; si no hay origen, decir "desconocido", nunca inventarlo. Cerrar con familias de gusto que
  emergen y tensiones a mantener abiertas. Una referencia densa indica **cuánta evidencia** mostrar por
  propuesta, no el estilo a copiar.
- **Sale:** `ANALISIS.md`, `FUENTES.csv`.
- **Done:** cada referencia leída + matriz referencia → principio → uso posible → límite.

## Fase 4 — Territorios

- **Hace:** `territorios-marca` → 12–18 rutas que no comparten a la vez familia de paleta + clasificación
  tipográfica + gesto gráfico. Cada una: idea, lectura estratégica, paleta por roles con HEX, par
  tipográfico con licencia, símbolo + wordmark, gramática, imagen, movimiento, 8 aplicaciones, pre-crítica.
  Render de boards (Codex: imagen nativa según `PROMPTS-IMAGEN.md`; Claude: código vía
  `visuales-sin-generador`). Galería + `EXPLORACION.pdf`.
- **Formato fijo:** página A = brandboard total; página B = aplicaciones reales. Mismo marco, misma
  escena de demo (mismo cliente ficticio, mismas tareas, mismos soportes) para todos. Un territorio
  distinto cada 2 páginas, 3 como máximo. Cierre con matriz comparativa + hoja de votación.
- **Gate interno:** rúbrica /20 por board (<16 se rehace), contrastes medidos, contact sheet **mirada**.

## Fase 5 — Elección / fusión — STOP

- **Hace:** presentar galería/PDF al equipo. Cada integrante vota (top 3 con motivo, más "qué robarías de
  otra ruta"). Registrar en `05-eleccion/VOTACION.md`.
- **Resultado posible:** una ruta, o una **fusión explícita** ("sistema X + símbolo de Y, sin Z"). La fusión
  se documenta como decisión con sus reglas, y se valida con un board nuevo antes del kit.
- **Gate:** **el agente nunca elige ganador.** Puede recomendar con argumentos; la elección es del equipo.
  Sin `VOTACION.md` con decisión registrada, no se abre la fase 6.
- Pedidos de ajuste ("más cálido", "otro símbolo") se aplican sobre la ruta elegida y se muestran en el
  mismo marco para comparar antes/después.

## Fase 6 — Kit

- **Hace:** `kit-marca` → vectorizar símbolo y wordmark, tokens, tipografías con licencia, fondos,
  plantillas, brand book y guías (`GUIA-RAPIDA.md`, `AUDITORIA-IDENTIDAD.md`) según CONTRATO §3.
  Recién acá se completan `colores` y `tipografias` en `brand.config.json`.
- **Controles:** símbolo legible a 24 px y en monocromo; logo horizontal estable en claro y oscuro; dos
  acentos con roles distintos; contraste WCAG medido por par y uso; riesgos abiertos declarados
  (naming, genericidad de la forma, percepción).
- **Gate:** equipo aprueba kit + auditoría. `tools/validate-kit.py` pasa.

## Fase 7 — Aplicaciones

- **Hace:** `piezas-marca` (posts, stories, flyers multivista, presentaciones, mockups), `web-marca`
  (landing/web), `web-3d` si hay una tarea espacial concreta.
- **Regla de oro:** la implementación **no puede ser más plana que la presentación aprobada**. Si el board
  tenía collage, capas, escala dramática o foto tratada, la pieza real también. Comparar lado a lado
  aprobado vs implementado antes de mostrar.
- Separar **arte conceptual** (boards, visiones) de **prototipo funcional** (web, UI). No presentar un
  concepto como producto implementado ni prometer funciones inexistentes.
- **Gate:** equipo aprueba cada tanda.

## Fase 8 — QA (continuo)

- Contrastes (`tools/contraste.py`), layout (`tools/qa-layout.mjs`: desborde, solapes, texto cortado,
  375 px sin scroll horizontal), contact sheets (`tools/pdf-contact-sheet.py`, `tools/board-index.py`).
- **Mirar el render.** Exit 0 no es QA. Veredicto escrito en `08-qa/` con capturas y qué se corrigió.

## Fase 9 — Entrega

- **Hace:** `tools/empaquetar.py` → ZIP + `MANIFIESTO.csv` (ruta, bytes, dimensiones, sha256 en minúsculas)
  + `.sha256` + `MENSAJE-PARA-EL-EQUIPO.md`. Opcional: `tools/drive-subir.sh` con la carpeta de
  `brand.config.json → drive` (nunca IDs hardcodeados).
- **Antes de empaquetar:** escanear **todo** el expediente (también rondas viejas) por URLs firmadas,
  secretos y rutas personales. Validar hashes contra los archivos reales, no contra el manifiesto del autor.
- **Gate:** responsable del proyecto. `estado: entrega` en config.

---

## Expectativas de tiempo y ritmo

- Primera exploración completa (brief → PDF de 12–18 territorios): **2–3 días** de trabajo de agente,
  con el equipo interviniendo solo en brief, naming y votación.
- Si una ronda se rechaza, **se conserva** (no se borra: sirve para comparar y para aprender) y se rehace la
  presentación, no solo el objeto que molestó.
- Los pedidos del equipo se guardan literales. "Está bien lo que hiciste" **no** es una elección de ruta.

## Qué NO hacer (rechazos reales del equipo)

- Pocas opciones (4–6) cuando se está eligiendo: mínimo 10–15.
- Formatos mezclados entre propuestas (una en 16:9, otra en vertical): mata la comparación.
- Stock/lifestyle genérico (tazas, comida, plantas, gente genérica) y estética IA genérica.
- Tres identidades sobre la misma pantalla recoloreada: cambiar tokens no es otra propuesta.
- Flyers planos (una imagen + texto) cuando se pidieron collages con varias vistas reales del producto.
- Implementación más pobre que el board aprobado.
- Declarar ganador por cuenta propia.
