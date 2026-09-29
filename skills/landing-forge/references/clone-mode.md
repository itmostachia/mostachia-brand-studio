# Clone Mode — Replicar y mejorar sitios web existentes

Landing Forge soporta 3 modos de operacion. Este documento cubre los Modos 2 y 3.

---

## Deteccion de modo

| El usuario dice... | Modo |
|---|---|
| "Crear landing para X", docs de marca, sin URL de referencia | **Modo 1: Crear** (pipeline normal) |
| "Quiero una web como [url]", "clonar esta web", "hacela igual a esta" | **Modo 2: Clonar + Adaptar** |
| "Clonar esta web y mejorarla", "replicar pero mejor", "basate en esta" | **Modo 3: Clonar + Mejorar** |

Si hay ambiguedad, preguntar: "Queres replicar exacto el diseno de esa web (adaptado a tu marca), o queres que ademas lo mejore con animaciones premium y nuestro sistema?"

---

## Modo 2: Clonar + Adaptar

### Objetivo
Replicar la estructura, layout, estilo y "feel" de un sitio existente, pero con la marca y contenido del cliente.

### Pipeline

#### Clone-Phase 0: Reconnaissance
1. Abrir URL target con Playwright CLI
2. Capturar screenshots full-page a 1440px + 375px
3. Extraer design tokens via script (ver `references/competitor-extraction.md`):
   - Colores exactos (getComputedStyle)
   - Tipografia (font-family, weights, sizes, line-heights, letter-spacing)
   - Spacing scale (paddings, margins, gaps)
   - Border-radius scale
   - Shadow values exactos
   - Breakpoints responsive
4. Mapear estructura de secciones:
   - Cuantas secciones tiene
   - Que tipo es cada una (hero, features, pricing, etc.)
   - Que interaction model usa cada una (scroll/click/hover/time)
5. Identificar animaciones y transiciones:
   - Scroll-driven? (parallax, pin, reveal)
   - Hover effects?
   - CSS animations? (keyframes observables)
   - Libreria detectable? (GSAP, Framer Motion, Lenis, etc.)
6. Descargar assets visibles:
   - Imagenes (right-click save o network tab)
   - SVG icons
   - Videos si hay
7. Guardar todo en `docs/references/clone-target/`:
   - Screenshots
   - `design-tokens.md` con valores exactos
   - `section-map.md` con estructura
   - `interactions.md` con modelo de interaccion

#### Clone-Phase 1: Foundation
1. Auto-scaffold proyecto Next.js (igual que Modo 1)
2. Aplicar design tokens EXACTOS del sitio target (no aproximar):
   - Colores en globals.css (convertir a OKLCH si no lo son)
   - Tipografia en layout.tsx (buscar equivalente en Google Fonts si es custom)
   - Shadow scale, border-radius scale, spacing scale
3. PERO reemplazar:
   - Colores de marca → colores del CLIENTE (no del target)
   - Tipografia → la del cliente si tiene, o mantener la del target
   - Logo → el del cliente
4. Generar site.ts con contenido del CLIENTE (no del target)
5. Generar metadata.ts con SEO del cliente

#### Clone-Phase 2: Build (spec-first)
Para cada seccion del sitio target:
1. Escribir spec con estructura exacta (ver `references/component-spec-template.md`)
2. Construir replicando el LAYOUT del target pero con CONTENIDO del cliente
3. Replicar interaction model (si el target usa scroll-driven, usar scroll-driven)
4. Replicar animaciones lo mas fielmente posible
5. Verificar responsive side-by-side con screenshots del target

#### Clone-Phase 3: QA Visual
1. Screenshots del clon a 1440px + 375px
2. Comparacion side-by-side con screenshots del target
3. Verificar:
   - Layout coincide en estructura (no pixel-perfect, pero mismo "feel")
   - Spacing proporcional
   - Jerarquia tipografica similar
   - Animaciones replican el comportamiento
   - Contenido del CLIENTE visible (no del target)
4. Fix loop hasta que la comparacion sea satisfactoria

#### Clone-Phase 4: Deploy
Igual que Modo 1 — Vercel + nota de proyecto (`docs/ESTADO.md`)

### Output de Modo 2
- Sitio que se VE como el target pero es del cliente
- Misma estructura de secciones
- Mismo estilo de animaciones
- Marca del cliente aplicada
- Contenido del cliente

---

## Modo 3: Clonar + Mejorar

### Objetivo
Replicar la base del sitio target, PERO aplicar todo el sistema Landing Forge v2.1 para que el resultado sea MEJOR que el original.

### Pipeline

Fases 0-2 iguales a Modo 2, PERO con estas adiciones:

#### Mejora-Phase 1: Style Archetype Overlay
1. Identificar que arquetipo del target se acerca mas (ver `references/style-archetypes.md`)
2. Aplicar los CSS patterns premium de ESE arquetipo:
   - Si el target usa shadows genericas → reemplazar con nuestro shadow system (5 niveles)
   - Si el target usa tracking default → aplicar nuestro letter-spacing scale
   - Si no tiene fluid typography → agregar clamp()
   - Si no tiene OpenType features → activar kern, liga
3. El resultado mantiene el "feel" del target pero con craft premium

#### Mejora-Phase 2: Animation Upgrade
1. Analizar animaciones del target
2. Si son basicas (fade-in genericos), reemplazar con nuestro playbook:
   - GSAP stagger con blur
   - Spring physics
   - Scroll-driven reveals
3. Si son buenas, mantenerlas Y agregar micro-interactions de `references/micro-interactions.md`:
   - btn-interactive en todos los botones
   - card-interactive en cards
   - focus-ring en todos los interactivos
4. Agregar signature effect si el target no tiene uno

#### Mejora-Phase 3: Conversion Optimization
1. Aplicar frameworks de `references/conversion-patterns.md`:
   - AIDA en hero
   - PAS en pain points (si hay)
   - FAB en features
2. Verificar CTA placement rules
3. Agregar trust signals si faltan

#### Mejora-Phase 4: Full QA Triple
Aplicar QA completa de Landing Forge:
1. QA Visual (3 viewports)
2. Design Review (anti-slop)
3. Scoring /20 (minimo 16 para Modo 3 — es premium)
4. Nose test
5. SEO audit
6. Performance audit

### Output de Modo 3
- Sitio que SUPERA al target
- Estructura del target + mejoras de layout si aplica
- Animaciones premium (upgrade del target)
- Micro-interactions completas
- Sistema de diseno cohesivo (shadows, tracking, typography)
- Score >= 16/20
- Listo para produccion

---

## Diferencias clave entre modos

| Aspecto | Modo 1 (Crear) | Modo 2 (Clonar) | Modo 3 (Clonar+Mejorar) |
|---|---|---|---|
| Input | Docs de marca + producto | URL target + docs cliente | URL target + docs cliente |
| Diseno | Desde cero (arquetipos) | Replica del target | Replica + mejoras premium |
| Animaciones | Nuestro playbook | Replica del target | Replica + upgrade |
| Shadows | Nuestro sistema | Del target | Nuestro sistema (upgrade) |
| Typography | Nuestros pairings | Del target | Del target + nuestro scale |
| QA | Scoring /20 (min 14) | Side-by-side visual | Scoring /20 (min 16) |
| Resultado | Original unico | Replica adaptada | Replica mejorada |

---

## Notas importantes

- **Etica:** Solo clonar para uso propio/clientes. No copiar identidad de marca ajena.
  El clon reemplaza TODOS los elementos de marca por los del cliente.
- **Fidelidad:** Modo 2 busca ~90% fidelidad visual. No pixel-perfect exacto, sino mismo "feel".
- **Mejoras:** Modo 3 puede alterar el layout original si la mejora es clara y justificada.
  Siempre preguntar al usuario antes de cambios grandes.
- **Multi-URL:** Se pueden pasar multiples URLs para extraer lo mejor de cada una
  ("el hero de esta, el pricing de esta otra").
