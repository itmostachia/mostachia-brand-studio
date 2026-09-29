# forge:content — Piezas de lanzamiento

This module is loaded by the Forge orchestrator. Do not invoke directly.
Runs in: Phase 6 (post-deploy only)
Activated when: client-brief §5 Active = sí

Delegá la producción en la skill **`piezas-marca`** (y `visuales-sin-generador` para los visuales cuando
el runtime no tiene generación nativa de imágenes). Nunca pedir ni usar API keys de generadores de imagen.

---

## Prerequisites
- Web deployada (Phase 5) y su URL de producción.
- Tokens de marca: si existe expediente de Brand Studio, `06-kit/02_COLORES_Y_TIPOGRAFIA/tokens.css`
  manda. Si no, extraerlos de la web (6.1).

## Phase 6 — Content Launch [forge:content]

### 6.1 Tokens
- Con kit: usar `tokens.css`/`tokens.json` tal cual.
- Sin kit: leer las CSS custom properties de `globals.css` del proyecto (colores OKLCH → convertir a HEX
  con `culori` para las piezas) y las familias de `next/font`. Guardarlos en
  `docs/brand/tokens.json` del proyecto.

### 6.2 Capturas de producción
`node <brand-studio>/tools/render.mjs <url-prod> hero.png --width 1440 --height 900` y
`--width 390 --height 844` para mobile. Estas capturas alimentan los mockups multivista (receta 6 de
`visuales-sin-generador`): vistas reales del producto en marcos de dispositivo, nunca una captura sola.

### 6.3 Piezas
Seguir `piezas-marca`: pieza piloto por formato (post 1080×1350, story 1080×1920, LinkedIn 1200×627) →
render → mirar → aprobación → lote desde plantilla + `datos.json`. Copy con `social` /
`copywriting` + `humanise-text`.

### 6.4 Output
- `docs/content/` del proyecto (o `07-aplicaciones/social/` del expediente): PNG + HTML fuente + `CAPTIONS.md`.
- Contact sheet de todas las piezas, revisada con los ojos.

## Skills used
- `piezas-marca`, `visuales-sin-generador`, `social`, `copywriting`, `humanise-text`

## Anti-conflict rules
- Las piezas nunca redefinen la marca: tokens de la web/kit mandan.
- Si una pieza contradice el arquetipo visual de la landing, gana el arquetipo.
