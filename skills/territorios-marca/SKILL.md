---
name: territorios-marca
description: Produce 12–18 territorios de identidad genuinamente distintos para una marca — cada uno con idea, paleta por roles con HEX, tipografía con licencia, símbolo y wordmark, gramática gráfica, imagen, movimiento y 8 aplicaciones — y los presenta en un marco comparable (página A brandboard + página B aplicaciones), con galería, EXPLORACION.pdf, matriz y hoja de votación. Usar cuando digan "propuestas visuales", "territorios", "brandboards", "rutas de identidad", "opciones de marca", "exploración visual", "quiero ver varias identidades", o cuando crear-marca llega a la fase 4.
---

# territorios-marca

## Antes

1. `<repo>` = `$BRAND_STUDIO_HOME` o subir desde la ruta real de este SKILL.md hasta `docs/CONTRATO.md`.
2. Leé: `docs/PRINCIPIOS-ESTETICOS.md`, `01-brief/BRIEF.md`, `02-naming/NAMING.md` (nombre elegido),
   `03-referencias/ANALISIS.md`. Sin brief confirmado → volvé a `crear-marca`.
3. Runtime (`brand.config.json → runtime_imagenes`): `codex-nativo` → `docs/PROMPTS-IMAGEN.md`;
   `codigo` → skill `visuales-sin-generador`.
4. Herramientas: corré `--help` antes del primer uso de cada una.

## 1. Fijar el marco de comparación (una vez, antes de diseñar)

Escribilo al inicio de `TERRITORIOS.md`:
- **Formato único:** página A (brandboard) y página B (aplicaciones) en la misma proporción para todos.
- **Escena de demo común** (del brief): mismo caso ficticio, mismos textos, mismos soportes.
- **Módulos de A:** wordmark grande, símbolo + versiones (claro/oscuro/mono/24 px), paleta con HEX,
  muestra tipográfica, gesto gráfico, imagen, 3–4 aplicaciones chicas.
- **B:** la aplicación protagonista del rubro (producto/web/local/packaging) grande + 2–3 soportes.

## 2. Generar 12–18 territorios

Por cada uno completá la ficha de `references/ficha-territorio.md`: idea y concepto, lectura estratégica,
paleta por roles con HEX, par tipográfico con licencia verificada, símbolo + wordmark (construcción del
gesto), gramática gráfica, dirección de imagen, nota de movimiento, **8 aplicaciones**, pre-crítica
(fortaleza, riesgo, señal de fracaso, prueba decisiva).

Abrí el abanico a propósito: registros distintos (editorial, instrumento, material/táctil, cinematográfico,
tipográfico radical, orgánico, sistema modular, cálido gráfico, lujo silencioso, popular/callejero…),
temperaturas de color distintas, clasificaciones tipográficas distintas.

## 3. Chequeo de diversidad (obligatorio)

Tabla en `TERRITORIOS.md`: `id | familia de paleta | clasificación tipográfica | gesto gráfico`.
**No puede haber dos territorios que coincidan en las tres columnas.** Si coinciden en dos, justificá qué los
separa en una línea o reemplazá uno. Clasificaciones: grotesk, neo-grotesk, humanista, geométrica, serif
transicional, serif didona, slab, mono, condensada/display, script/manual.

## 4. Escribir fuentes estructuradas

- `04-territorios/TERRITORIOS.md` (humano) y `04-territorios/territorios.json` (mismo contenido, esquema en
  `references/ficha-territorio.md`). El JSON lo consumen `galeria-data.mjs` y `contraste.py`: validá que
  parsea antes de seguir.
- `python <repo>/tools/contraste.py` sobre `territorios.json`: pares texto/fondo ≥4.5, grandes/UI ≥3.
  Corregí HEX o marcá "solo gráfico" antes de renderizar.

## 5. Renderizar boards

`04-territorios/boards/<id>/board.(png|html|svg)` + `aplicacion.(png|html|svg)`.
- **Codex:** prompts según `docs/PROMPTS-IMAGEN.md`, guardados en `04-territorios/prompts/`; cada
  generación registrada en `04-territorios/GENERACIONES.json`; correcciones de a una edición local;
  descartes en `boards/<id>/descartes/`.
- **Claude / código:** boards HTML/SVG construidos con `visuales-sin-generador` (tipos reales, gesto
  dibujado en SVG, fotos de cualquier fuente con su origen en `FUENTES.csv`), rasterizados con `node <repo>/tools/render.mjs`.
- Verificá el nombre letra por letra en cada wordmark.

## 6. Puntuar cada board

Rúbrica /20 de `references/rubrica-board.md`. **<16 = rehacer** (no presentarlo). Registrá puntaje y
motivo en `territorios.json`.

## 7. Galería y PDF

1. Copiá `<repo>/templates/galeria` a `04-territorios/galeria/` y generá `data.js` con
   `node <repo>/tools/galeria-data.mjs`.
2. `EXPLORACION.pdf` desde `<repo>/templates/exploracion` con `render.mjs`: portada → 2 páginas por
   territorio (A + B; un territorio nuevo cada 2 páginas, 3 como máximo) → **matriz comparativa**
   (idea, paleta, tipo, gesto, fortaleza, riesgo) → **hoja de votación**.
3. `python <repo>/tools/board-index.py` (índice visual de los 12–18) para el primer descarte.

## 8. QA — mirar antes de decir listo

1. `node <repo>/tools/qa-layout.mjs` sobre galería y fuentes HTML (desbordes, solapes, texto cortado, 375 px).
2. `python <repo>/tools/pdf-contact-sheet.py` sobre `EXPLORACION.pdf` → `08-qa/`.
3. **Abrí y mirá la contact sheet y el board-index.** Buscá: formatos mezclados, páginas en blanco, pie con
   `file:///`, nombre mal escrito, clichés, dos territorios que se parecen. Exit 0 no es QA.
4. Checklist anti-slop de PRINCIPIOS-ESTETICOS §7. Veredicto en `08-qa/QA-TERRITORIOS.md`.

## Done

- 12–18 territorios, diversidad OK, todos ≥16/20, contrastes medidos.
- `TERRITORIOS.md`, `territorios.json`, boards A+B, galería, `EXPLORACION.pdf`, board-index, contact sheet
  mirada, `GENERACIONES.json` completo (Codex).
- ESTADO/DECISIONES/RETOMAR al día; `brand.config.json → estado: eleccion`.
- **No declarás ganador.** Devolvés a `crear-marca` para la votación.
