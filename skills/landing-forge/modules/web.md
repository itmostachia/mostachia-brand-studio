# forge:web — Core Landing Page Pipeline

This module is loaded by the Forge orchestrator. Do not invoke directly.
Reads: client-brief.md §1 (Essential) + §2 (Web Configuration)

---

## Mode Detection

| El usuario dice... | Modo |
|---|---|
| "Crear landing para X", docs de marca, sin URL target | **Modo 1: Crear** → Pipeline normal (Fases 1-5) |
| "Quiero una web como [url]", "clonar esta web" | **Modo 2: Clonar + Adaptar** → Pipeline clone (`references/clone-mode.md`) |
| "Clonar y mejorar", "basate en esta pero mejor" | **Modo 3: Clonar + Mejorar** → Pipeline clone + mejoras premium |
| URL + "usala de referencia/inspiracion" | **Modo 1** con Style Discovery mejorado |

Para Modos 2 y 3, seguir `references/clone-mode.md` completo.

---

## Phase 1 — Research + Component Selection

### Investigacion de secciones
1. Leer `references/section-catalog.md` — decidir que secciones necesita esta landing
2. Leer `references/animation-playbook.md` — asignar animacion por seccion

### Seleccion de componentes (VARIEDAD OBLIGATORIA)
Leer `references/component-libraries.md` y aplicar la **Regla anti-monotonia:**

1. Elegir **1 libreria para backgrounds** (rotar entre React Bits, Ibelick, tsParticles, CSS custom)
2. Elegir **1 libreria para text effects** (rotar entre Motion Primitives, React Bits, Aceternity)
3. Elegir **1 libreria para componentes de seccion** (rotar entre Magic UI, Launch UI, Cult UI)
4. Elegir **1 efecto "signature"** unico del proyecto

### CSS Patterns por arquetipo
Leer `references/css-patterns.md` y seleccionar segun arquetipo elegido:

| Arquetipo | Patterns obligatorios | Patterns opcionales |
|---|---|---|
| 1 Warm Literary | Warm grays, multi-layer shadows, fluid type | OpenType, responsive padding |
| 2 Aggressive Tech | Shadow-as-border, negative tracking, glass nav | Pressed state |
| 3 Dark Immersive | Hover glow, pill buttons, multi-layer shadows | Neon border, glass nav |
| 4 Reductive Luxury | Fluid type, responsive padding, pill buttons | Pressed state |
| 5 Confident Duality | Pill buttons, multi-layer shadows, pressed state | Shadow-as-border |
| 6 Precision Tech | Blue-tinted shadows, negative tracking, OpenType | Neon border, glass nav |

### Background selection
Leer `references/background-effects.md` y elegir segun **Matriz de seleccion por arquetipo**.

### Plan de secciones
Generar tabla DETALLADA (se muestra como status update, NO se espera aprobacion):

```
| # | Seccion | Interaction Model | Animacion | Componentes (libreria) | Background | CSS Patterns |
```

**La columna "Interaction Model" es OBLIGATORIA.** Opciones: scroll-driven, click-driven, hover-triggered, time-based, hybrid.

### Verificar APIs
Verificar APIs de Next.js, GSAP, Tailwind v4 y shadcn contra la documentación oficial de la versión instalada (o un MCP de docs si hay uno disponible). Nunca de memoria

### Output de Phase 1
- Design brief en `docs/references/design-brief.md`
- Tabla de secciones completa

---

## Phase 2 — Foundation

### Auto-scaffold del proyecto
Crear la carpeta del proyecto automaticamente:
1. Directorio: si hay expediente de marca (Brand Studio) → `<slug>/07-aplicaciones/web/`; si no, `./{nombre-proyecto}/` relativo al directorio de trabajo o donde el usuario especifique
2. Ejecutar:
   ```bash
   npx create-next-app@latest {nombre-proyecto} \
     --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
   ```
3. Crear estructura interna:
   ```bash
   mkdir -p src/components/{ui,sections,layout,animations,icons} src/hooks src/lib src/config \
     docs/{brand,content,references} public/{images,fonts,icons}
   ```
4. Copiar docs de marca del usuario a `docs/brand/`
5. Guardar `client-brief.md` en la raiz del proyecto
6. Generar CLAUDE.md del proyecto usando `references/claude-md-template.md`
7. Inicializar git: `git init && git add -A && git commit -m "feat: scaffold inicial"`

### Setup de dependencias
Leer `references/project-scaffold.md` y ejecutar:
1. Instalar dependencias core: gsap, @gsap/react, lenis, motion, lucide-react, shadcn, tw-animate-css, @number-flow/react
2. Instalar dependencias dev: culori, playwright
3. Configurar shadcn/ui: `npx shadcn@latest init`
4. Instalar librerias seleccionadas en Phase 1

### Aplicar marca + arquetipo
1. Convertir colores hex → OKLCH (script Node con culori)
2. Aplicar en `globals.css` usando `references/globals-css-template.md`
3. **Aplicar CSS patterns del arquetipo** en globals.css
4. Configurar tipografia en `layout.tsx` (next/font) — **NO defaultear a Inter**
5. Leer `references/font-pairings.md` — seleccionar pairing del arquetipo
6. Activar OpenType features si la fuente lo soporta
7. Dark mode toggle si aplica (`references/dark-mode-system.md`)
8. Crear logo SVG component
9. Generar favicon SVG + apple-touch-icon
10. Generar OG image

### Estructura de contenido
1. Generar `src/config/site.ts` usando `references/site-ts-template.md`
2. Generar `src/config/metadata.ts` con SEO completo
3. Agregar Schema.org JSON-LD en `page.tsx`

### CLAUDE.md del proyecto
Generar usando `references/claude-md-template.md`

### Delegar
- `/design-consultation` → generar DESIGN.md

### Impeccable Setup (despues de foundation)
1. **`/teach-impeccable`** — Persiste guidelines de diseno del proyecto
2. **`/typeset`** — Valida jerarquia tipografica. NO cambia fuentes — solo refina escala
3. **`/colorize`** — Verifica paleta. NO cambia colores de marca — solo agrega acentos

**Regla anti-conflicto:** Si `/typeset` sugiere cambiar fuente del arquetipo, IGNORAR.
Si `/colorize` sugiere colores fuera de marca, IGNORAR.

### Output de Phase 2
- Proyecto Next.js configurado con marca + arquetipo
- site.ts con contenido, metadata.ts con SEO
- CLAUDE.md + DESIGN.md
- Layout con Header, Footer, SmoothScroll, ScrollProgress, BackToTop
- Impeccable context persistido, tipografia refinada, paleta validada

---

## Phase 3 — Build

### Pre-build check
Leer `references/design-principles.md` — 10 mandamientos anti-generico.
Leer `references/css-patterns.md` — patterns seleccionados listos.
Leer `references/micro-interactions.md` — aplicar en CADA elemento interactivo.
Leer `references/conversion-patterns.md` — frameworks AIDA/PAS/FAB por seccion.

### Loop por seccion
Para cada seccion del plan:

1. Leer contenido de `site.ts` para esta seccion
2. Leer `references/animation-playbook.md` para el tratamiento asignado
3. Consultar `references/component-libraries.md` para la libreria asignada
4. **Delegar a `/frontend-design`** para construir la seccion
5. Aplicar animaciones con `references/animation-playbook.md` + `motion-design` (criterio) y la librería del proyecto (`gsap-*` **o** framer-motion, nunca las dos)
6. Instalar componentes necesarios (shadcn, Magic UI, etc.)
7. Verificar responsive (mobile-first)
8. Agregar import en `page.tsx`

### Impeccable per-section (DESPUES del build core)
- `/animate` — Pule timing de animaciones. NO quita patterns del playbook
- `/arrange` — Mejora ritmo visual. NO cambia estructura de seccion
- `/clarify` — Mejora UX copy DESPUES de `/humanise-text`

### Impeccable condicionales
- `/delight` — En 2-3 secciones CLAVE (hero, CTA final, 1 mas). NO en todas
- `/overdrive` — SOLO en signature effect + hero. SOLO arquetipos agresivos (Dark Immersive, Aggressive Tech). NO en Warm Literary ni Reductive Luxury
- `/onboard` — SOLO si hay formularios o demo interactiva

### Signature Effect
Implementar en la seccion donde mejor calce. Solo UN efecto signature por landing.

### Skills a invocar durante build
**Core:** /frontend-design (o taste-skill), /ui-ux-pro-max, /humanise-text, /motion-design, gsap-* o framer-motion, /top-design
**Impeccable:** /animate, /arrange, /clarify, /delight, /overdrive, /onboard

### Post-build verification
1. `npx next build` — debe pasar sin errores
2. Verificar que CADA seccion esta importada en `page.tsx`
3. Verificar que no hay texto hardcoded (todo de `site.ts`)

### Output de Phase 3
- Todas las secciones construidas y funcionando
- Signature effect implementado
- Cada seccion pasada por animate + arrange + clarify
- Build exitoso

---

## Phase 3.5 — Refinement Layer

Se ejecuta UNA VEZ despues de que TODAS las secciones estan construidas.

### 3.5.1 Equilibrio visual — `/bolder` o `/quieter`
Evaluar la landing completa:
- Plana/safe/generica → `/bolder`
- Agresiva/sobrecargada/ruidosa → `/quieter`
- Bien equilibrada → SKIP

**MAXIMO UNO de los dos.** Si contradice el arquetipo, REVERTIR.

### 3.5.2 Simplificacion — `/distill`
- Secciones que repiten el mismo mensaje
- Elementos decorativos sin proposito
- Animaciones que no agregan valor

**NO puede eliminar secciones aprobadas.** Solo simplifica DENTRO de secciones.

### 3.5.3 Consolidacion — `/extract`
Identificar patrones repetidos → componentes reutilizables.

### 3.5.4 Normalizacion — `/normalize`
Verificar que TODO usa variables CSS, escala Tailwind, sombras custom, tipografia definida.

**Orden: bolder/quieter → distill → extract → normalize. NO alterar.**

### Output de Phase 3.5
- Landing equilibrada, simplificada, consolidada, normalizada

---

## Phase 4 — QA 7-Layer Audit

### Layer 1: QA Visual
Leer `references/qa-checklist.md`. Delegar a `/qa`:
- Screenshots a 375px, 768px, 1440px
- Fix loop: encontrar → corregir → verificar
- 0 errores en console

### Layer 2: Design Review
Delegar a `/design-review`:
- Inconsistencias de spacing, jerarquia, colores
- AI slop patterns (card soup, shadows genericos)
- Arquetipo consistente en toda la landing

### Layer 3: Anti-AI-Slop Audit
Scoring 0-20:
1. Unicidad (0-4): Signature effect? Distinguible?
2. Craft (0-4): Tracking custom? Multi-layer shadows? Radius scale?
3. Performance (0-4): 60fps? LCP < 2.5s? CLS = 0?
4. Accesibilidad (0-4): WCAG AA? Keyboard nav? Reduced-motion?
5. Responsive (0-4): Nativo cada viewport? Touch targets 44px?

**Score minimo: 16/20.** Si < 16, iterar.

Nose Test (10 items):
- [ ] Sin logo, distinguible?
- [ ] Headings con tracking custom?
- [ ] Shadows custom (no shadow-md)?
- [ ] Signature effect memorable?
- [ ] Mobile nativo?
- [ ] Keyboard nav completa?
- [ ] Textos no roboticos?
- [ ] Animaciones suaves y con proposito?
- [ ] Scroll smooth (Lenis)?
- [ ] Build sin warnings?

### Layer 4: Technical Audit — `/audit`
a11y, performance, theming, responsive, anti-patterns. Resolver P0/P1 antes de seguir.

### Layer 5: UX Critique — `/critique`
Visual hierarchy, info architecture, emotional resonance, cognitive load, persona testing.

### Layer 6: Responsive Final — `/adapt`
Edge cases entre breakpoints, fluid layouts, touch targets, landscape.

### Layer 7: Production Hardening — `/harden` → `/optimize` → `/polish`
1. `/harden` — Error handling, text overflow, edge cases
2. `/optimize` — Bundle size, images, animation profiling
3. `/polish` — Alineacion pixel-perfect, spacing micro-ajustes. ULTIMO paso.

### SEO Audit (integrado en Layer 4)
Title < 60, meta desc 150-160, OG image, JSON-LD, H1 unico, lang, canonical.

### Output de Phase 4
- Score ≥ 16/20
- Nose test 10/10
- P0/P1 = 0
- Responsive edge cases resueltos
- Production hardened + optimized + polished

---

## Phase 5 — Deploy + Document

### Deploy
```bash
npx vercel deploy --prod --yes
```
Post-deploy: verificar URL de produccion.

### Documentar el proyecto
Actualizar `docs/ESTADO.md` del proyecto (y, si hay expediente de marca, `00-control/ESTADO.md` + `RETOMAR.md`) con:
- URL, repo, stack, secciones, brand, arquetipo, signature effect, score, fecha

### Checklist de entregables
Leer `references/deliverables-checklist.md` y verificar:
- [ ] Favicon, apple-touch-icon, OG image
- [ ] Schema.org, meta description, OG tags
- [ ] CLAUDE.md del proyecto
- [ ] Deploy exitoso
- [ ] QA passed, score ≥ 16/20

### Historial de variedad
Registrar librerias y arquetipo usados para no repetir.
