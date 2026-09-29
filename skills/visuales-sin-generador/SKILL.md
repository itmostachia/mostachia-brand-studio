---
name: visuales-sin-generador
description: Visuales de marca de nivel estudio SIN generadores de imagen y SIN API keys — logos SVG construidos en grilla, arte generativo (ruido, flow fields, halftone, grano, mesh gradients), dirección de arte en CSS, mockups de producto/UI en HTML (collage multivista), renders 3D con Three.js headless, afiches tipográficos y fotos de cualquier fuente de internet tratadas a la paleta. Usar cuando el runtime no tiene generación nativa de imágenes (Claude Code), o digan "hacé los visuales sin IA", "sin generador", "armá el board en código", "mockup del producto", "afiche", "fondo generativo", "construí el logo", "conseguí fotos", "traé imágenes de internet", "tratá esta foto con la paleta".
---

# visuales-sin-generador

Runtime `codigo` (CONTRATO §4): todo visual sale de **código renderizado con Playwright** o de **fotos de
internet tratadas** (cualquier fuente: uso interno). Nunca pidas ni uses keys de OpenAI/Gemini/etc. El resultado tiene que verse
dirigido por un estudio, no "hecho en código".

## 0. Ubicar el repo
`<repo>` = `$BRAND_STUDIO_HOME` o subí desde la ruta real de este SKILL.md hasta encontrar
`docs/CONTRATO.md`. Leé `docs/PRINCIPIOS-ESTETICOS.md` (clichés prohibidos, checklist anti-slop).

## 1. Elegí la técnica por lo que la pieza necesita

| Necesidad | Técnica | Receta |
|---|---|---|
| Símbolo / wordmark | SVG en grilla con correcciones ópticas | 1, 2 |
| Textura / fondo propietario | canvas o SVG generativo con semilla fija | 3, 4, 5 |
| Afiche / portada editorial | tipografía como imagen + capas CSS | 8, 9 |
| Producto / app / SaaS | UI construida en HTML dentro de marcos de dispositivo, collage multivista | 6 |
| Objeto / símbolo con volumen | Three.js headless (skill `web-3d`) | 11 |
| Personas, lugares, materia real | foto de internet + tratamiento a la paleta | 12, 13 |

Recetas con código: `references/recetas.md`. Fotos: `references/fotos.md`.
Ejemplos probados (HTML + PNG renderizado): `examples/`.

## 2. Reglas de oficio
- **Tokens primero:** colores y tipos salen de `territorios.json` (fase territorios) o
  `06-kit/02_COLORES_Y_TIPOGRAFIA/tokens.css` (fase kit) como variables CSS. Nada de hex sueltos inventados.
- **Semilla fija** en todo lo generativo (PRNG propio): el mismo HTML da el mismo PNG. Anotá la semilla.
- **Capas:** fondo (color/ruido) → forma/imagen → tipografía → detalle (rótulos mono, cotas, sellos) →
  grano. Una pieza de una sola capa se ve plana.
- **Grano y viñeta** casi siempre (receta 4): matan el look "vector de plantilla".
- **Escala dramática:** un elemento dominante (titular enorme, símbolo gigante recortado, foto a sangre).
- **Contraforma real:** huecos con `fill-rule="evenodd"`, nunca un relleno del color del fondo (se rompe
  sobre foto o sobre otro color).
- **Pinterest/Behance = inspiración.** Nunca reusar sus imágenes ni copiar marcas ajenas.
- Upstream útiles si están instalados: `canvas-design`, `theme-factory`, `taste-skill` (incl. `brandkit`),
  `frontend-design`, `web-typography`, `colorize`.

## 3. Render y QA con los ojos
```bash
node <repo>/tools/render.mjs pieza.html pieza.png --width 1080 --height 1350 --scale 2
node <repo>/tools/render.mjs pieza.html pieza.pdf          # usa @page del CSS
```
Corré `--help` antes del primer uso. Para WebGL ver `web-3d` (flags de SwiftShader).
Después: **abrí el PNG y miralo**. Revisá: texto cortado, solapes no intencionales, fuente de reemplazo
(esperar `document.fonts.ready`), contraste, jerarquía a tamaño miniatura, y el símbolo a 24 px y en mono.
Iterá hasta que se sostenga al lado de una referencia de nivel. Exit 0 no es QA.

## 4. Registro
- Cada foto externa → fila en `03-referencias/FUENTES.csv` con su origen (para poder rastrearla o
  reemplazarla después).
- Fuentes tipográficas: solo con licencia libre (OFL/Apache) o las que el equipo tenga; anotar en
  `LICENCIAS-TIPOGRAFIAS.md` en fase kit.
- Guardá el HTML fuente junto al PNG (es el editable).
