# Component Spec Template — Especificacion antes de construir

Cada componente DEBE tener un spec antes de ser construido.
"Completeness beats speed" — un spec incompleto fuerza al builder a adivinar.

---

## Cuando usar

- **Modo 1 (Crear):** Opcional pero recomendado para secciones complejas
- **Modo 2 (Clonar):** OBLIGATORIO para cada seccion
- **Modo 3 (Clonar+Mejorar):** OBLIGATORIO + seccion de mejoras

---

## Template

```markdown
# [NombreSeccion] — Component Spec

## Overview
- **Tipo:** Hero / Features / Pricing / etc.
- **Interaction Model:** scroll-driven / click-driven / hover-triggered / time-based / hybrid
- **Complejidad:** simple (<80 lineas) / medium (80-150) / complex (>150 → dividir)
- **Libreria de componentes:** Magic UI / Aceternity / React Bits / Custom / etc.

## Layout
- **Contenedor:** max-width Xpx, padding Xpx
- **Grid/Flex:** grid cols-X gap-Xpx / flex direction gap-Xpx
- **Responsive:**
  - Desktop (1440px): [descripcion]
  - Tablet (768px): [cambios]
  - Mobile (375px): [cambios]

## Tipografia (valores EXACTOS)
- Titulo: font-family, Xpx, weight X, line-height X, letter-spacing Xpx
- Subtitulo: ...
- Body: ...
- Labels/badges: ...

## Colores
- Background: oklch(...) / rgb(...)
- Text primary: ...
- Text secondary: ...
- Accent: ...
- Borders: ...

## Spacing
- Padding seccion: Xpx top, Xpx bottom
- Gap entre elementos: Xpx
- Margin titulo-contenido: Xpx

## Shadows
- Cards: [valor exacto de box-shadow]
- Hover: [valor exacto]
- Botones: [valor exacto]

## Border Radius
- Cards: Xpx
- Botones: Xpx
- Badges: Xpx / 9999px

## Animaciones
- **Entrada:** GSAP fromTo, y:30, opacity:0→1, duration 0.7s, ease power3.out, stagger 0.1s
- **Hover:** translateY(-4px), shadow expand, duration 300ms
- **Scroll-driven:** ScrollTrigger start "top 85%", toggleActions "play none none none"
- **CSS loops:** [nombre keyframe], duration Xs, linear infinite

## Interacciones
- **Click:** [que pasa al clickear]
- **Hover:** [que pasa al hover]
- **Scroll:** [que pasa al scrollear]
- **Focus:** focus-ring, outline 2px solid accent

## Contenido (de site.ts)
- Titulo: siteConfig.[seccion].title
- Items: siteConfig.[seccion].items (X items)
- CTA: siteConfig.[seccion].cta

## Assets
- Iconos: Lucide [nombre] / Custom SVG
- Imagenes: public/images/[nombre]
- Videos: public/videos/[nombre]

## Notas adicionales
- [cualquier detalle especifico]
```

---

## Regla de complejidad: <150 lineas

Si el spec tiene mas de 150 lineas, dividir el componente:

```
hero-section/
  → hero-background.tsx (aurora/video/particles)
  → hero-content.tsx (titulo, subtitulo, CTAs)
  → hero-visual.tsx (floating cards/screenshot/3D)
```

Cada sub-componente tiene su propio spec de <150 lineas.

---

## Ejemplo real (Hero section de Fluxo)

```markdown
# HeroSection — Component Spec

## Overview
- **Tipo:** Hero
- **Interaction Model:** hybrid (time-based aurora + scroll-driven reveal)
- **Complejidad:** complex → dividir en 3 sub-componentes
- **Librerias:** GSAP (stagger), Motion (word rotate), CSS (aurora)

## Sub-componentes
1. AuroraBackground — 4 gradient blobs, aurora-drift keyframes, grid overlay, noise SVG
2. HeroContent — StaggeredHeadline, MorphingWordRotate, ShimmerButton, StatCounter
3. FloatingCards — 6 cards con orbit (useAnimationFrame), mouse parallax, 3D tilt

## Layout
- Contenedor: relative, min-h-[90vh] md:min-h-screen
- Grid: flex flex-col lg:flex-row
- Responsive:
  - Desktop: 2 columnas (texto izq, cards der)
  - Tablet: 2 columnas comprimidas
  - Mobile: stack, cards hidden

## Tipografia
- H1: text-fluid-hero (clamp 2rem-4.5rem), weight 700, tracking-display-hero (-2.4px)
- Subtitle: text-fluid-subtitle (clamp 1.125rem-1.5rem), weight 400, tracking-body
- Stats: text-2xl weight 700, tabular-nums

## Colores
- Background: white con aurora blobs (brand-green/10, brand-cyan/10, brand-navy/5)
- Text: brand-navy (H1), foreground (body), brand-green→brand-cyan gradient (rotating word)
- CTA primary: bg-brand-navy, text-white
- CTA secondary: border-border, text-foreground

## Shadows
- CTA primary: shadow-premium + glow-pulse animation
- Floating cards: shadow-elevated → shadow-premium on hover

## Animaciones
- Aurora: 3 keyframes (aurora-drift-1/2/3), 15-25s alternate infinite
- Headline: GSAP stagger, fromTo opacity:0 y:20 filter:blur(4px), 0.06s per word
- Word rotate: AnimatePresence, blur+scale+y transitions, 3s interval
- Stats: IntersectionObserver + spring counter, threshold 0.5
- CTA: glow-pulse 3s infinite, shimmer-sweep 3s infinite

## Contenido
- siteConfig.hero.headline (split por espacios para stagger)
- siteConfig.hero.rotatingWords (array)
- siteConfig.hero.subheadline
- siteConfig.hero.stats (3 items)
- siteConfig.hero.cta.primary / secondary
```

---

## Uso en el workflow

### Modo 1 (Crear)
- Escribir specs para secciones complejas (hero, modules, AI, demo)
- Opcional para secciones simples (FAQ, contact)

### Modo 2 (Clonar)
- OBLIGATORIO para cada seccion
- Valores extraidos de competitor-extraction.md
- Layout copiado del target, contenido del cliente

### Modo 3 (Clonar+Mejorar)
- OBLIGATORIO + seccion "Mejoras" al final del spec:
```markdown
## Mejoras sobre original
- Shadows: shadow-md generico → shadow-premium (5 capas)
- Tracking: default → tracking-display (-1.5px)
- Animaciones: fade-in basico → GSAP stagger con blur
- Micro-interactions: sin hover effects → btn-interactive + card-interactive
- Signature effect: [elegir uno que el original no tenga]
```
