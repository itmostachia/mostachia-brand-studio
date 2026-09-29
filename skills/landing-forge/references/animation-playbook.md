# Animation Playbook — Patrones por Seccion

Patrones de animacion probados en produccion. Basado en el proyecto Fluxo.

## Stack de animacion

| Libreria | Rol | Importar como |
|----------|-----|---------------|
| GSAP + @gsap/react | Scroll-driven, timelines, stagger | `import gsap from "gsap"`, `import { useGSAP } from "@gsap/react"`, `import { ScrollTrigger } from "gsap/ScrollTrigger"` |
| Framer Motion | Hover, tap, enter/exit, orbit | `import { motion, AnimatePresence, useAnimationFrame } from "motion/react"` |
| Lenis | Smooth scroll global | `ReactLenis` wrapping layout |
| CSS @keyframes | Marquee, shimmer, aurora, orbit | En globals.css |

## Reglas inquebrantables
- Solo animar `transform` y `opacity` (NUNCA width, height, top, left)
- GSAP cleanup via `useGSAP({ scope: ref })`
- `prefers-reduced-motion: reduce` → pausar/skip animaciones
- Mobile: reducir particulas, simplificar 3D, menos elementos animados
- 60fps no negociable — testear con Chrome DevTools Performance

---

## Hero

### Fondo
Aurora con gradient blobs (CSS):
- 3-4 divs con `bg-brand-[color]/[opacity] blur-[100px+]` posicionados absolute
- CSS keyframes `aurora-drift-N` para movimiento lento (12-22s, alternate)
- Grid pattern con `linear-gradient` + mask radial para fade en bordes
- Noise texture SVG overlay al 2-3% opacity

### Texto
- **Headline**: Split en words (`text.split(" ")`), cada word es un `<span>`. GSAP stagger: `opacity: 0, y: 24, filter: "blur(4px)"` → `opacity: 1, y: 0, filter: "blur(0px)"`. Stagger 0.08s.
- **Palabra rotativa**: `AnimatePresence mode="wait"` con blur+scale transition. `initial={{ opacity: 0, filter: "blur(12px)", scale: 0.92 }}` → `animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}`. Gradient text color (green→cyan).
- **Subtitulo + CTAs + Stats**: GSAP timeline secuencial con offsets negativos.

### Botones
- Shimmer: pseudo-element con `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` animado con `translateX(-100%)` → `translateX(200%)` cada 3s.
- Glow pulse: `box-shadow` cycling opacity.
- `whileHover={{ scale: 1.03, y: -2 }}`, `whileTap={{ scale: 0.97 }}`.

### Stats
- Spring physics counter: `useSpring(0, { stiffness: 80, damping: 15 })` + IntersectionObserver para trigger.

### Floating cards (visual derecho)
- Cada card orbita en elipse usando `useAnimationFrame`:
  ```
  const angle = (time / 1000 + offset) / speed * Math.PI * 2 * direction;
  orbitX.set(Math.cos(angle) * radiusX);
  orbitY.set(Math.sin(angle) * radiusY);
  ```
- Mouse parallax: `useTransform(mouseX, [0,1], [-15*depth, 15*depth])` con spring.
- 3D tilt on hover: `rotateX/rotateY` basado en mouse local dentro de la card.
- Glass morphism: `bg-white/80 backdrop-blur-md border-white/20`.

---

## Social Proof

- Dual marquee con `useAnimationFrame` (direcciones opuestas, velocidades distintas)
- Pause on hover (set `isPaused` flag)
- Number counters: `useSpring` + `useInView` trigger
- Gradient borders pulsantes top/bottom

---

## Pain Points

- Grid 2x2 (1col mobile). GSAP stagger reveal: `opacity: 0, y: 50` → visible. Stagger 0.15s.
- Card `whileHover={{ y: -4 }}` con spring transition.
- Borde izquierdo rojo (`border-l-4 border-l-red-400/80`).
- Icono en circulo rojo sutil (`bg-red-50 ring-1 ring-red-100`).

---

## Solucion

- Titulo con gradient shimmer: `bg-gradient-to-r bg-[length:200%_auto] bg-clip-text text-transparent` + `animate-[shimmer_3s_linear_infinite]`.
- 3 pilares con GSAP stagger reveal.
- Beam connectors: linea gradient base (30% opacity) + dot viajero con `animation: beam-travel-h 2s ease-in-out infinite`.
- Orbiting dot por pilar: `animation: orbit [speed]s linear infinite` con `transform: rotate() translateX(32px) rotate()`.
- Numeros decorativos 01/02/03 al 5% opacity detras.

---

## Modulos / Features (Bento Grid)

- Grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`. Cards large span 2 cols.
- **Magic card spotlight**: `onMouseMove` tracking, `radial-gradient(300px circle at ${x}px ${y}px, rgba(green,0.08), transparent)`.
- **Conic gradient border**: en hover, `conic-gradient(from var(--angle), green, cyan, green)` girando.
- **AI badge**: `bg-gradient-to-r from-green to-cyan` + neon pulse `box-shadow` animation.
- Cascade reveal: `opacity: 0, y: 80, scale: 0.95, rotation: ±1deg, filter: "blur(4px)"` → clean. Delay por posicion en grid.
- Hover: card scale 1.03, vecinas scale 0.98 (push effect). Shadow cyan.

---

## IA / Technology (Dark Section)

- `background="navy"` para contraste.
- Beams de fondo: divs absolutas con gradient lineal thin (2px), animados cruzando.
- Node diagram: circulos con iconos conectados por lineas gradient + dots viajeros.
- Nodo central con ring orbitante.
- Feature list: check icons con SVG stroke-draw animation (`strokeDashoffset` → 0).
- Sparkles SVG random alrededor del titulo.

---

## Demo / Video

- Frame tipo browser: barra con traffic lights (dots) + URL bar.
- GSAP ScrollTrigger scrub: `rotateX: 15deg, scale: 0.9` → `rotateX: 0, scale: 1`. Perspective 1200px.
- Glow detras: gradient green→cyan, blur-3xl, opacity pulsante.
- Si no hay video: floating UI cards como preview (ingresos, vencimientos, etc).
- Sombra que se expande al aplanarse.

---

## Pricing

- 3 cards. Highlighted: `scale-[1.05]`, neon border con `conic-gradient` spin (`animate-[spin_4s_linear_infinite]`), badge "Mas popular".
- Price: spring counter `animate(0, price, { type: "spring" })` + `useInView`.
- Checkmarks: SVG `<path d="M5 13l4 4L19 7">` con `strokeDasharray/strokeDashoffset` animation secuencial.
- CTA highlighted: shimmer sweep diagonal.
- Hover: `y: -10`, colored shadow.

---

## FAQ

- Accordion shadcn. Stagger reveal por item con GSAP.
- `hover:text-brand-navy` en triggers.
- Smooth height con Motion AnimatePresence (si se customiza).

---

## CTA Final

- Background: CSS `linear-gradient(135deg, variations de navy)` — NO blobs ni formas que creen artefactos.
- Mouse spotlight: `useMotionValue` + `useSpring` → `radial-gradient` que sigue cursor.
- Texto: GSAP fade-up stagger por palabra.
- Botones: primario blanco con shimmer, secundario ghost con border hover.

---

## Contact

- 2 columnas (stack mobile). Form izquierda, info derecha.
- GSAP stagger de form fields (`opacity: 0, y: 20` → visible).
- Info items con stagger desde derecha (`opacity: 0, x: 20`).
