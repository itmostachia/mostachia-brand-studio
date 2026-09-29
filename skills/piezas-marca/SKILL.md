---
name: piezas-marca
description: Produce todas las aplicaciones de una marca con kit aprobado — posts, stories, carruseles y LinkedIn, flyers A4/A5, presentaciones (deck HTML → PDF y .pptx), mockups y campaña, firma de email, tarjetas, favicon e imágenes OG. Siempre desde tokens, collage multivista para producto, QA renderizando y mirando, producción en tandas. Usar cuando digan "haceme posts", "stories", "carrusel", "flyer", "folleto", "presentación", "deck", "pitch", "mockups", "campaña", "firma de mail", "tarjetas", "favicon", "imagen para compartir", "piezas de la marca", "aplicaciones".
---

# piezas-marca

Fase 7 de `docs/METODO.md`. Regla de oro: **ninguna pieza puede ser más plana que el board aprobado.**

## 0. Arranque
1. `<repo>` = `$BRAND_STUDIO_HOME` o subí desde la ruta real de este SKILL.md hasta `docs/CONTRATO.md`.
2. Leé `ESTADO.md`/`RETOMAR.md` de la marca, `06-kit/06_GUIAS/GUIA-RAPIDA.md` y el board elegido
   (`04-territorios/boards/<id>/`). Si no hay kit aprobado, primero `kit-marca`.
3. Runtime de imagen (`brand.config.json → runtime_imagenes`): Codex → generación nativa con
   `docs/PROMPTS-IMAGEN.md`; si no → `visuales-sin-generador`. Nunca API keys de imagen.
4. Pedido literal del equipo → `00-control/PEDIDO-<fecha>.md`. Lista de piezas con formato y medida.

## 1. Sistema, no piezas sueltas
- Todo HTML importa `06-kit/02_COLORES_Y_TIPOGRAFIA/tokens.css` y las fuentes locales. Cero hex sueltos.
- Partí de `templates/social/` y `templates/deck/` y de `06-kit/04_PLANTILLAS_SOCIALES/`. Una plantilla
  maestra por formato con slots (titular, cuerpo, visual, CTA) + datos en JSON → render en lote.
- Gramática del territorio: la misma lógica de capas, escala, grilla y gesto propietario en todas.

## 2. Formatos (px a `--scale 1`; exportá `--scale 2` si piden alta)

| Pieza | Medida | Notas |
|---|---|---|
| Post IG / feed | 1080×1350 | márgenes seguros 64 px |
| Story / reel cover | 1080×1920 | zona segura: 250 px arriba y abajo libres |
| Carrusel | 1080×1350 × n | continuidad entre slides (un elemento cruza el borde), slide 1 = gancho, último = CTA |
| LinkedIn post | 1200×627 o 1080×1350 | |
| Flyer A4 / A5 | `@page{size:A4}` / `A5` → PDF | 3 mm de sangrado si va a imprenta; texto ≥ 9 pt |
| Presentación | 1920×1080 | ver §4 |
| Tarjeta personal | 85×55 mm (+3 mm sangrado) | frente/dorso, PDF vectorial |
| Firma email | 600 px de ancho máx. | HTML con tablas + estilos inline, logo PNG @2x alojado, sin fuentes web |
| Favicon | 16/32/48 + 180 (apple) + 512 + `favicon.svg` | usar `simbolo-reducido` |
| OG image | 1200×630 | titular grande legible en miniatura |

## 3. Producto → collage multivista
Flyers y posts de producto usan **varias vistas reales** (o UI construida en HTML) en marcos de
dispositivo, con capas, perspectiva y chips de micro-datos: `visuales-sin-generador` receta 6 y
`examples/flyer-multiview.html`. Nunca "una captura + texto". No mostrar funciones que no existen como
si existieran (arte conceptual ≠ producto).

## 4. Presentaciones
- **HTML → PDF (default):** `templates/deck/` → una `<section class="slide">` por lámina 1920×1080 →
  `node <repo>/tools/render.mjs deck.html deck.pdf`. Portada, índice, lámina de sección, dato grande,
  comparación, cita, cierre. Una idea por slide.
- **.pptx editable:** si el equipo lo pide y la skill upstream `pptx` (anthropics) está instalada, usala
  con los tokens (fuentes embebidas o con reemplazo declarado). Si no está, entregá PDF y avisá.
- Datos/gráficos: skill `dataviz` si está disponible; colores de la paleta, nunca defaults de librería.

## 5. Producción en tandas
1. Una pieza piloto por formato → render → mirar → aprobación del equipo.
2. Recién después, lote: plantilla + `datos.json` → script que recorre y llama a `render.mjs` (una sola
   instancia de navegador si el tool lo permite).
3. Nombres: `07-aplicaciones/<tipo>/<fecha>-<slug-pieza>-<formato>.png`. Fuente HTML al lado.

## 6. QA (siempre, con los ojos)
- `node <repo>/tools/qa-layout.mjs pieza.html` (desbordes, texto cortado).
- `python <repo>/tools/contraste.py` para cada par texto/fondo nuevo (fotos: medir la zona).
- `python <repo>/tools/board-index.py 07-aplicaciones/<tipo>` → contact sheet → **abrirla y mirarla**
  a tamaño miniatura: ¿se lee el titular? ¿se reconoce la marca sin el logo? ¿alguna quedó plana?
- Comparar lado a lado con el board aprobado. PDFs: `pdf-contact-sheet.py` (buscar pies con `file:///`,
  páginas casi vacías).
- Veredicto en `08-qa/QA-PIEZAS-<fecha>.md`; actualizar ESTADO/RETOMAR.

Upstream útiles: `social` (copy por red), `copywriting`/`humanise-text` (textos), `canvas-design`,
`theme-factory`, `pdf`, `pptx`.
