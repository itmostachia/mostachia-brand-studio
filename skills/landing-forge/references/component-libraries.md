# Component Libraries Catalog

Catalogo curado de librerias de componentes animados para landing pages.
Cada seccion de cada landing debe usar componentes de DIFERENTES librerias
para garantizar variedad visual.

---

## Regla de oro: NUNCA usar la misma libreria para todas las secciones

Para cada proyecto, seleccionar minimo 3 fuentes de componentes diferentes.
Mezclar es lo que hace que cada landing se sienta unica.

---

## Tier S — Librerias principales (usar siempre)

### Magic UI
- **URL:** magicui.design
- **Stars:** ~9K | **Licencia:** MIT
- **Stack:** React + TypeScript + Tailwind + Motion
- **150+ componentes** — la coleccion mas grande para landing pages
- **Componentes clave:**
  - Marquee (infinite scroll logos)
  - Hero Video Dialog (click-to-play modal)
  - Animated List / Animated Grid
  - Shimmer Button, Pulsating Button
  - Meteors, Globe, Particles
  - Dock (macOS-style)
  - Number Ticker, Typing Animation
  - Bento Grid layout
  - Border Beam, Magic Card
  - Blur Fade, Fade Text
- **Mejor para:** Social proof, features grid, hero CTAs, backgrounds
- **Instalacion:** `npx shadcn@latest add "https://magicui.design/r/[component]"`

### Aceternity UI
- **URL:** ui.aceternity.com
- **Stars:** ~5K | **Licencia:** MIT
- **Stack:** Next.js + Tailwind + Framer Motion
- **Componentes clave:**
  - 3D Card Effect (tilt on hover)
  - Spotlight (mouse-tracking radial)
  - Background Beams, Background Gradient
  - Meteor Effect
  - Typewriter Effect
  - Floating Navbar
  - Parallax Scroll
  - Tracing Beam (scroll line)
  - Lamp Effect (glow reveal)
  - Wavy Background
  - Moving Border (traveling border)
  - Text Generate Effect
  - Infinite Moving Cards
- **Mejor para:** Heroes de alto impacto, backgrounds, 3D effects
- **Instalacion:** Copy-paste desde docs

### React Bits
- **URL:** reactbits.dev
- **Stars:** ~32K | **Licencia:** MIT
- **Stack:** React (framework-agnostic internamente)
- **110+ componentes en 6 categorias:**
  - **Text:** Split Text, Gradient Text, Blur Text, Scramble Text, Fade Text, Counter, Shiny Text, Variable Proximity
  - **Backgrounds:** Aurora, Hyperspeed, Particles, Grid Distortion, Waves, Noise
  - **Animations:** Magnet Lines, Crosshair, Pixel Transition, Star Border
  - **Components:** Dock, TiltedScroll, InfiniteScroll, StackedCards, CircularGallery
  - **Cursors:** Spotlight Cursor, Neon Cursor, Blob Cursor
  - **3D:** Ball Pit, Balatro, Threads, Globe
- **Mejor para:** Text effects variados, backgrounds unicos, cursores custom
- **Instalacion:** Copy-paste o npm

### Motion Primitives
- **URL:** motion-primitives.com
- **Stars:** ~5.3K | **Licencia:** MIT
- **Stack:** React + Motion + Tailwind
- **Componentes clave:**
  - TextEffect (per-character/word animations)
  - MorphingDialog (fluid modal transitions)
  - AnimatedBackground (tabs/segments con bg animado)
  - Spotlight (cursor-following)
  - Transition Panel (full-screen transitions)
  - Carousel (physics-based)
  - InView (intersection triggers)
- **Mejor para:** Building blocks compositivos, text effects, transitions
- **Instalacion:** Copy-paste

---

## Tier A — Librerias especializadas (usar segun necesidad)

### Launch UI
- **URL:** launchuicomponents.com
- **Stars:** ~313 | **Licencia:** MIT
- **Stack:** Next.js 15 + Shadcn + Tailwind v4
- **100+ componentes ESPECIFICOS de landing pages:**
  - Heroes (floating, glowing, video, split, centered)
  - Navigation (transparent, sticky, megamenu)
  - Pricing (comparison, toggle, cards)
  - Testimonials (carousel, grid, featured)
  - FAQ (accordion, tabs, search)
  - CTA (banner, floating, inline)
  - Features (bento, icon grid, alternating)
  - Footers (multi-column, minimal, centered)
- **Mejor para:** Secciones completas pre-armadas con variantes
- **Valor unico:** Multiples variantes por seccion = variedad automatica

### Cult UI
- **URL:** cult-ui.com
- **Stars:** ~2.6K | **Licencia:** MIT
- **Stack:** React + Framer Motion + Shadcn-compatible
- **Componentes unicos:**
  - Shader Lens Blur (efecto de lente con WebGL)
  - Dynamic Island (Apple-style notification)
  - Fractal Grid (grid generativo)
  - Texture Cards (depth maps)
  - Direction-Aware Hover
- **Mejor para:** Efectos WOW unicos que no estan en otras librerias

### Eldora UI
- **URL:** eldoraui.site
- **Stack:** React + TypeScript + Tailwind + Framer Motion
- **Componentes clave:**
  - Animated testimonials
  - Pricing tables con toggle
  - Feature showcases
  - Hero sections variados
- **Mejor para:** Variantes adicionales de secciones comunes

### Page UI (Shipixen)
- **URL:** pageui.shipixen.com
- **Licencia:** MIT
- **Stack:** Next.js + Shadcn + Tailwind
- **Componentes:**
  - Landing page headers con variantes
  - Pricing plans animados
  - FAQ sections
  - Newsletter signup
  - Animated marquees
- **Mejor para:** Templates rapidos con theming/dark mode built-in

### Animate UI
- **URL:** animate-ui.com
- **Stack:** React + TypeScript + Tailwind + Motion + Shadcn CLI
- **Componentes:** Fully animated distribution, instalable via shadcn CLI
- **Mejor para:** Cuando queres componentes shadcn pero animados

---

## Tier B — Fondos y efectos (complementarios)

### tsParticles
- **URL:** tsparticles.dev
- **Stars:** ~8.7K | **Paquete:** `@tsparticles/react`
- **Efectos:** Particulas, confetti, fireworks, snow, bubbles, stars
- **Presets configurables** — cada proyecto puede tener un fondo de particulas diferente
- **Mejor para:** Hero backgrounds, celebration moments

### Ibelick Background Snippets
- **URL:** bg.ibelick.com
- **Dark-mode-first backgrounds:**
  - Animated gradients
  - Mesh gradients
  - Dot patterns
  - Grid patterns con glow
- **Estilo:** Linear, Vercel, Raycast inspired
- **Mejor para:** Fondos de secciones dark

### Lottie (dotLottie-Web)
- **URL:** lottiefiles.com
- **Paquete:** `@lottiefiles/dotlottie-react`
- **Micro-animaciones After Effects quality:**
  - Loading states
  - Success/error confirmations
  - Illustrated icons animados
  - Onboarding illustrations
- **Mejor para:** Micro-interactions y estados de UI

### Drei (React Three Fiber helpers)
- **URL:** drei.docs.pmnd.rs
- **Stars:** ~29.8K
- **Efectos 3D lightweight:**
  - Float (floating objects)
  - Sparkles (particle sparkles)
  - MeshDistortMaterial (distorsion organica)
  - GradientTexture
  - Text3D
  - Stars (starfield background)
- **Mejor para:** UN elemento 3D sutil por landing (no abusar)
- **CUIDADO:** Peso de bundle. Solo usar si el proyecto lo justifica

---

## Estrategia de seleccion por seccion

| Seccion | Fuente primaria | Alternativas |
|---|---|---|
| Hero background | React Bits (Aurora, Waves) | Ibelick, tsParticles |
| Hero text effect | Motion Primitives (TextEffect) | React Bits (Split, Scramble) |
| Hero CTA | Magic UI (Shimmer Button) | Aceternity (Moving Border) |
| Trust bar/logos | Magic UI (Marquee) | Launch UI (logo carousel) |
| Features grid | Magic UI (Bento Grid, Magic Card) | Cult UI (Fractal Grid) |
| Pricing | Launch UI (variantes) | Page UI (toggle plans) |
| Testimonials | Aceternity (Infinite Moving Cards) | Eldora UI (animated) |
| FAQ | Launch UI (accordion variants) | Page UI |
| CTA final | Aceternity (Lamp Effect) | Magic UI (Shimmer BG) |
| Demo/video | Magic UI (Hero Video Dialog) | Custom browser frame |
| 3D accent | Drei (Float + Sparkles) | React Bits (Globe, Ball Pit) |
| Cursor effects | React Bits (Spotlight, Neon) | Motion Primitives (Spotlight) |

---

## Regla anti-monotonia

Para cada proyecto, el orquestador debe seleccionar:
- **1 libreria para backgrounds** (rotar entre React Bits, Ibelick, tsParticles)
- **1 libreria para text effects** (rotar entre Motion Primitives, React Bits, Aceternity)
- **1 libreria para componentes de seccion** (rotar entre Magic UI, Launch UI, Cult UI)
- **1 efecto "signature"** unico del proyecto (shader, 3D, cursor custom, etc.)

Esto garantiza que NUNCA dos landings se vean iguales.
