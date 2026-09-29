---
name: web-marca
description: Construye la web o landing de una marca con su kit aprobado — Next.js + Tailwind por default, tokens.css como tema, cadena de skills upstream (base → motion → pulido → QA), presupuestos de performance, accesibilidad, SEO/OG y deploy. Exige comparar pantalla por pantalla (desktop y mobile) contra los boards aprobados antes de dar por terminado. Usar cuando digan "hacé la web", "landing de la marca", "sitio", "página", "llevá la marca a la web", "implementá el board", "web de <marca>". Para landings de conversión completas delega en landing-forge.
---

# web-marca

Fase 7 (web) de `docs/METODO.md`. **Lección crítica:** la implementación tiene que conservar la riqueza
de la presentación aprobada. Si el board tenía collage, capas, escala dramática, foto tratada o grano, la
web también. Una web "prolija y plana" sobre un board espectacular es un rechazo.

## 0. Arranque
1. `<repo>` = `$BRAND_STUDIO_HOME` o subí desde la ruta real de este SKILL.md hasta `docs/CONTRATO.md`.
2. Leé ESTADO/RETOMAR, `GUIA-RAPIDA.md`, el board elegido y las piezas aprobadas. Hacé una lista de
   **rasgos visuales obligatorios** del board (capas, gesto propietario, tratamiento de imagen, escala tipo,
   texturas, motion implícito) → `07-aplicaciones/web/RASGOS-DEL-BOARD.md`. Es el criterio de éxito.
3. ¿Landing de conversión completa (secciones, copy, analytics, forms)? → skill `landing-forge` con este
   kit como input de marca. ¿Sitio institucional/portfolio/micro-sitio? → seguí acá.

## 1. Stack
- Default: **Next.js (App Router) + TypeScript + Tailwind**, en `07-aplicaciones/web/`.
- Tema: importá `06-kit/02_COLORES_Y_TIPOGRAFIA/tokens.css` en `globals.css` y mapealo a Tailwind
  (v4: `@theme { --color-primario: var(--color-primario); … }`; v3: `theme.extend.colors` con
  `var(--…)`). Fuentes con `next/font/local` desde `fonts/` del kit (licencia ya registrada).
- Logos: SVG del kit inline o como componente; favicon/OG del kit (`piezas-marca`).
- Motion: **una sola librería por proyecto.** Framer Motion **o** GSAP (+ScrollTrigger). Nunca las dos.
  Si ya hay framer-motion, no metas GSAP. Scroll-driven pesado en proyecto nuevo → GSAP.
- 3D solo si hay una tarea espacial concreta → skill `web-3d` (y su presupuesto).

## 2. Cadena de skills upstream (en orden, las que estén instaladas)
1. **Base:** `frontend-design` o `taste-skill` (anti-slop, estructura) — pasándoles tokens y RASGOS.
2. **Nivel/escala:** `top-design`, `refactoring-ui`, `web-typography`.
3. **Motion:** `motion-design` (criterio: timing, easing, coreografía) → `gsap-*` **o** framer-motion.
4. **Vida:** `animate` → `delight` → `overdrive` (este último solo si el board lo pide; es caro).
5. **Pulido:** `polish`, `typeset`, `colorize` si hace falta, `microinteractions`.
6. **QA:** gstack `qa` / `design-review` / `browse`.

## 3. Presupuestos (medir, no suponer)
- LCP < 2,5 s en 4G simulado; CLS < 0,1; JS inicial < 170 KB gz (sin 3D). Imágenes AVIF/WebP con
  `next/image` y `sizes` correctos; hero con `priority`.
- `prefers-reduced-motion`: animaciones reducidas a fades; nada esencial depende del motion.
- Sin scroll horizontal a 375 px (`tools/qa-layout.mjs --width 375`).

## 4. Accesibilidad y SEO
- Contraste de cada par usado (`tools/contraste.py`), foco visible con color de marca, HTML semántico,
  `alt` reales, navegación por teclado, `lang="es-AR"` (o el idioma del config).
- `metadata` por ruta, OG 1200×630 del kit; si cada página reemplaza `openGraph`, declarar la imagen en
  cada una (si no, se pierde). `sitemap.ts`, `robots.ts`, `schema` (Organization) si aplica.

## 5. Comparación con el board — obligatoria antes de "listo"
1. `npm run build` y servir. Capturas por pantalla/sección a **1440×900** y **390×844**
   (`tools/render.mjs <url> sal.png --width … --full-page`).
2. Lámina lado a lado: board/pieza aprobada vs. implementación, por sección, desktop y mobile →
   `08-qa/web-vs-board/`. **Mirala.**
3. Recorré `RASGOS-DEL-BOARD.md`: cada rasgo ✓ presente / ✗ perdido. Cualquier ✗ se corrige o se declara
   con motivo técnico y alternativa. Mobile no puede ser "el desktop apilado sin gracia".
4. Veredicto en `08-qa/QA-WEB.md` con capturas.

## 6. Deploy (genérico)
- Vercel: `vercel` (preview) → revisar → `vercel deploy --prod --yes`. Variables en el dashboard/CLI, nunca en el repo.
  Primera vez en la máquina (instalar CLI, login, team): seguí `docs/PUBLICAR-WEB-VERCEL.md` y hacelo vos.
- Si el CLI corta la conexión después de iniciar, inspeccioná el deployment antes de reintentar (evita
  duplicados).
- Dominio y DNS los decide el equipo. Anotá la URL en ESTADO y RETOMAR.
