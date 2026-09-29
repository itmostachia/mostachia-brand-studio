# Micro-Interactions — Detalles que hacen la diferencia

Patterns de micro-interaccion para cada elemento interactivo.
Estos detalles separan una landing "buena" de una "increible".

---

## Botones

### Primary Button
```css
.btn-primary {
  transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.25);
}
.btn-primary:active {
  transform: translateY(0) scale(0.98);
  transition-duration: 100ms;
}
```

### Ghost / Secondary Button
```css
.btn-ghost {
  transition: background-color 150ms ease, color 150ms ease;
}
.btn-ghost:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
/* Dark mode */
.dark .btn-ghost:hover {
  background-color: rgba(255, 255, 255, 0.06);
}
```

### Shimmer Button (CTA premium)
```css
.btn-shimmer {
  position: relative;
  overflow: hidden;
}
.btn-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 55%, transparent 60%);
  transform: translateX(-100%);
  transition: none;
}
.btn-shimmer:hover::after {
  animation: shimmer-sweep 0.6s ease forwards;
}
```

### Icon Button (hamburger, close, back-to-top)
```css
.btn-icon {
  transition: background-color 150ms ease, transform 200ms ease;
}
.btn-icon:hover {
  background-color: rgba(0, 0, 0, 0.06);
}
.btn-icon:active {
  transform: scale(0.92);
}
```

---

## Navigation

### Nav Link Active Indicator (pill animado)
```tsx
// Framer Motion layoutId para transicion suave entre items
<motion.div
  layoutId="activeNav"
  className="absolute inset-0 bg-primary/10 rounded-full"
  transition={{ type: "spring", stiffness: 380, damping: 30 }}
/>
```

### Header Scroll Transition
```css
/* Transicion suave a glass morphism */
.header {
  transition: background-color 300ms ease, backdrop-filter 300ms ease, box-shadow 300ms ease;
}
.header.scrolled {
  background-color: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
}
```

### Mobile Menu (Sheet)
```css
/* Slide desde derecha con overlay fade */
.sheet-overlay {
  animation: fade-in 200ms ease;
}
.sheet-content {
  animation: slide-in-right 300ms cubic-bezier(0.32, 0.72, 0, 1);
}
```

---

## Cards

### Hover Lift
```css
.card-lift {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 300ms ease;
}
.card-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
```

### Spotlight Follow (Magic Card)
```tsx
// Mouse-tracking radial gradient
const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
};
// CSS: background: radial-gradient(300px at var(--mouse-x) var(--mouse-y), rgba(accent, 0.06), transparent);
```

### 3D Tilt on Hover
```tsx
// Calcular rotacion desde posicion del mouse
const rotateX = ((y - rect.height / 2) / rect.height) * -8; // max 8deg
const rotateY = ((x - rect.width / 2) / rect.width) * 8;
// style: transform: perspective(800px) rotateX(Xdeg) rotateY(Ydeg)
// transition: transform 150ms ease
// on mouseleave: reset to rotateX(0) rotateY(0) con 500ms ease
```

---

## Form Inputs

### Focus State
```css
.input {
  transition: border-color 200ms ease, box-shadow 200ms ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.12);
  outline: none;
}
```

### Label Float (label sube al focusear)
```css
.label-float {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: all 200ms ease;
  color: var(--text-secondary);
  pointer-events: none;
}
.input:focus ~ .label-float,
.input:not(:placeholder-shown) ~ .label-float {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  color: var(--accent);
}
```

### Validation States
```css
/* Error — shake + red border */
.input-error {
  border-color: var(--error);
  animation: shake 300ms ease;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* Success — green check fade in */
.input-success {
  border-color: var(--success);
}
.check-icon {
  animation: scale-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Scroll Interactions

### Scroll Progress Bar
```css
.scroll-progress {
  transform-origin: left;
  /* scaleX controlado por JS: window.scrollY / (document.body.scrollHeight - window.innerHeight) */
  transition: none; /* Debe ser instantaneo */
}
```

### Back to Top Button
```css
.back-to-top {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 300ms ease, transform 300ms ease;
  pointer-events: none;
}
.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

### Section Reveal (ScrollTrigger)
```tsx
// GSAP reveal con blur
gsap.fromTo(element, 
  { opacity: 0, y: 30, filter: 'blur(4px)' },
  { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: element, start: 'top 85%' }
  }
);
```

---

## Tooltips y Popovers

### Tooltip Hover
```css
.tooltip {
  opacity: 0;
  transform: translateY(4px) scale(0.95);
  transition: opacity 150ms ease, transform 150ms ease;
  pointer-events: none;
}
.trigger:hover .tooltip {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-delay: 200ms; /* Delay para evitar flicker */
}
```

---

## Loading States

### Skeleton Pulse
```css
.skeleton {
  background: linear-gradient(90deg, 
    rgba(0,0,0,0.06) 25%, 
    rgba(0,0,0,0.10) 37%, 
    rgba(0,0,0,0.06) 63%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease infinite;
}
@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Button Loading
```css
.btn-loading {
  position: relative;
  color: transparent; /* Oculta texto */
  pointer-events: none;
}
.btn-loading::after {
  content: '';
  position: absolute;
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
```

---

## Transitions entre secciones

### Gradient Divider
```css
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent);
}
```

### Color Transition (light → dark section)
```css
/* Gradiente en el borde entre secciones */
.section-dark {
  position: relative;
}
.section-dark::before {
  content: '';
  position: absolute;
  top: -60px;
  left: 0; right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--bg-dark));
  pointer-events: none;
}
```

---

## Timing Reference

| Interaccion | Duracion | Easing | Nota |
|---|---|---|---|
| Button hover | 150-200ms | ease-out | Respuesta inmediata |
| Button active/press | 100ms | ease | Mas rapido que hover |
| Card hover lift | 250-300ms | cubic-bezier(0.34,1.56,0.64,1) | Slight overshoot |
| Input focus | 200ms | ease | Suave, no distractivo |
| Tooltip appear | 150ms + 200ms delay | ease | Delay evita flicker |
| Nav indicator | spring(380,30) | spring | Physics-based = natural |
| Sheet/drawer open | 300ms | cubic-bezier(0.32,0.72,0,1) | iOS-like deceleration |
| Sheet/drawer close | 200ms | ease-in | Mas rapido que open |
| Scroll reveal | 600-800ms | power3.out | Stagger 50-100ms entre items |
| Skeleton pulse | 1500ms | ease | Loop infinito |
| Spinner | 600ms | linear | Loop infinito |
| Validation shake | 300ms | ease | Una sola vez |
| Toast enter | 300ms | cubic-bezier(0.34,1.56,0.64,1) | Overshoot |
| Toast exit | 200ms | ease-in | Rapido, no molestar |

---

## prefers-reduced-motion

**CRITICO: NO interferir con CSS animations desde esta media query.**

Muchos usuarios de Windows tienen `prefers-reduced-motion: reduce` activo sin saberlo
(Accesibilidad > Efectos visuales OFF en Windows 11).

**3 errores documentados y su solucion (proyecto Fluxo, 2026-04-07):**

1. `animation-duration: 0.01ms !important` en `*` → Mato TODAS las animaciones
2. `.opacity-0 { opacity: 1 !important }` → Rompio GSAP stagger (cards aparecen de golpe)
3. `.floating-cards-container { display: none }` → Oculto componentes del hero

**La UNICA regla segura en CSS:**

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto !important;
  }
}
```

**Todo lo demas se maneja en JS:** GSAP y Motion ya soportan `matchMedia("(prefers-reduced-motion: reduce)")`.
Cada componente que necesite respetar reduced-motion debe chequearlo en JS, no en CSS global.

**NUNCA HACER:**
- `animation-duration: 0.01ms !important` en `*`
- `.opacity-0 { opacity: 1 !important }` (rompe GSAP reveals)
- `display: none` en componentes animados
- `animation-iteration-count: 1 !important`
- `transition-duration: 0.01ms !important` en `*` (rompe hover feedback)

SIEMPRE verificar visualmente con Playwright ANTES de deployar cambios de accesibilidad.
