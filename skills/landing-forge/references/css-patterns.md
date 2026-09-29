# CSS Patterns Premium — Tecnicas extraidas de los mejores sitios

Patrones CSS probados en produccion por Apple, Stripe, Vercel, Spotify, etc.
Cada uno transforma un componente "generico" en algo premium.

---

## 1. Shadow-as-Border (Vercel)

Reemplaza `border: 1px solid` con box-shadow. Evita box-model complications
y se ve mas refinado.

```css
/* En vez de: border: 1px solid #e5e5e5 */
box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.08);

/* Elevated card */
box-shadow:
  0px 0px 0px 1px rgba(0,0,0,0.08),
  0px 2px 2px rgba(0,0,0,0.04);

/* Floating card (3 layers) */
box-shadow:
  0px 0px 0px 1px rgba(0,0,0,0.08),
  0px 2px 2px rgba(0,0,0,0.04),
  0px 8px 8px -8px rgba(0,0,0,0.04);
```

**Cuando usar:** Arquetipo 2 (Aggressive Tech), cualquier card moderna
**Tailwind:** Definir como custom utility en globals.css

---

## 2. Blue-Tinted Paired Shadows (Stripe)

Doble shadow: una azulada + una negra. Crea profundidad "parallax-like".

```css
/* Standard elevation */
box-shadow:
  0 13px 27px -5px rgba(50,50,93,0.25),
  0 8px 16px -8px rgba(0,0,0,0.30);

/* Heavy elevation */
box-shadow:
  0 30px 45px -30px rgba(50,50,93,0.25),
  0 18px 36px -18px rgba(0,0,0,0.10);
```

**Cuando usar:** Arquetipo 6 (Precision Tech), fintech, enterprise
**Truco:** Adaptar el azul (50,50,93) al color primario de la marca

---

## 3. Negative Letter-Spacing Scale

Tracking agresivo en headlines crea urgencia y densidad visual.

```css
/* Scale proporcional al font-size */
.display-64 { font-size: 64px; letter-spacing: -2.88px; }  /* -4.5% */
.display-48 { font-size: 48px; letter-spacing: -2.40px; }  /* -5% */
.display-36 { font-size: 36px; letter-spacing: -1.44px; }  /* -4% */
.display-32 { font-size: 32px; letter-spacing: -0.96px; }  /* -3% */
.display-24 { font-size: 24px; letter-spacing: -0.48px; }  /* -2% */
.body-16    { font-size: 16px; letter-spacing: normal; }
```

**Cuando usar:** Arquetipos 2, 3, 6 — tech y dark themes
**NO usar con:** Arquetipos 1 y 4 (serif o luxury — tracking sutil max)
**Tailwind v4:** `tracking-[-2.4px]` o definir scale custom

---

## 4. Warm Gray System

NUNCA usar grises puros. Agregar undertone calido o frio segun marca.

```css
/* WARM (Claude, Notion, Cursor) */
--gray-50: #faf9f5;   /* Yellow undertone */
--gray-100: #f5f4ed;
--gray-200: #e8e6db;
--gray-300: #d1cfc3;
--gray-400: #a09e93;
--gray-500: #706e64;
--gray-900: rgba(0,0,0,0.95);

/* COOL (Apple, Raycast) */
--gray-50: #f5f5f7;   /* Blue undertone */
--gray-100: #e8e8ed;
--gray-200: #d2d2d7;
--gray-500: #86868b;
--gray-900: #1d1d1f;
```

**Regla:** Elegir una temperatura y mantenerla en toda la landing
**Deteccion:** Si la marca usa colores calidos → warm. Frios → cool

---

## 5. Pill Button Pattern

Bordes completamente redondeados para CTAs consumer-friendly.

```css
.btn-pill {
  border-radius: 9999px;
  padding: 10px 24px;
  font-weight: 500;
  transition: all 150ms ease;
}

/* Hover approach 1: Opacity (Spotify) */
.btn-pill:hover { opacity: 0.85; }

/* Hover approach 2: Scale (Airbnb) */
.btn-pill:hover { transform: scale(1.02); }

/* Hover approach 3: Darken (Apple) */
.btn-pill:hover { background: color-mix(in oklch, var(--accent), black 10%); }
```

**Cuando usar:** Arquetipos 3, 4, 5 — consumer-facing, premium
**Tailwind:** `rounded-full`

---

## 6. Glass Navigation (Apple, Raycast)

Header transparente con blur que revela contenido debajo.

```css
.nav-glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

/* Dark variant */
.nav-glass-dark {
  background: rgba(0, 0, 0, 0.80);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
```

**Cuando usar:** Casi siempre. Universal pattern que se ve premium
**Tailwind:** `bg-white/70 backdrop-blur-2xl`

---

## 7. OpenType Feature Activation

Features tipograficas que separan profesional de amateur.

```css
/* Headlines — stylistic alternates */
.headline {
  font-feature-settings: "ss01", "kern", "liga";
}

/* Tabular numbers — para datos alineados */
.data-number {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

/* Fractions */
.fraction {
  font-feature-settings: "frac";
}
```

**Cuando usar:** SIEMPRE. Especialmente Arquetipo 6 (Stripe usa ss01)
**Tailwind:** `tabular-nums`, `oldstyle-nums`, `lining-nums`

---

## 8. Fluid Typography con clamp()

Headlines que escalan perfectamente entre mobile y desktop.

```css
/* Hero headline */
.hero-title {
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
  line-height: 1.08;
  letter-spacing: clamp(-0.5px, -1vw, -2.4px);
}

/* Section headline */
.section-title {
  font-size: clamp(1.5rem, 3vw + 0.5rem, 3rem);
  line-height: 1.15;
}

/* Body — NO usar clamp, mantener fijo */
.body { font-size: 1rem; /* 16px siempre */ }
```

**Cuando usar:** Siempre para headlines. NUNCA para body text
**Nota:** Solo para marketing headings, no UI

---

## 9. Multi-Layer Shadow System

Shadows con multiples capas se ven mas realistas que una sola.

```css
/* 2-layer (sutil) */
--shadow-realistic-sm:
  0 1px 2px rgba(0,0,0,0.07),
  0 2px 4px rgba(0,0,0,0.07);

/* 3-layer (medio) */
--shadow-realistic-md:
  0 1px 2px rgba(0,0,0,0.07),
  0 2px 4px rgba(0,0,0,0.07),
  0 4px 8px rgba(0,0,0,0.07);

/* 5-layer (dramático — Notion style) */
--shadow-realistic-lg:
  0 1px 1px rgba(0,0,0,0.04),
  0 2px 4px rgba(0,0,0,0.04),
  0 4px 8px rgba(0,0,0,0.04),
  0 8px 16px rgba(0,0,0,0.04),
  0 16px 32px rgba(0,0,0,0.04);
```

**Regla:** Cada capa dobla el offset de la anterior
**Opacidad:** 0.04-0.07 por capa (sumar ≤ 0.20 total)

---

## 10. Hover Glow Effect

Glow sutil en hover usando box-shadow con color de accent.

```css
.card-glow {
  transition: box-shadow 300ms ease;
}

.card-glow:hover {
  box-shadow:
    0 0 0 1px rgba(var(--accent-rgb), 0.15),
    0 4px 16px rgba(var(--accent-rgb), 0.10),
    0 8px 32px rgba(var(--accent-rgb), 0.05);
}
```

**Cuando usar:** Arquetipos 3 y 6 — dark themes y precision tech
**Variante:** Cambiar accent-rgb al color primario de cada marca

---

## 11. Responsive section padding

Padding de seccion que escala bien sin media queries.

```css
.section {
  padding-block: clamp(3rem, 8vw, 7rem);
  padding-inline: clamp(1rem, 5vw, 4rem);
}

/* Container con max-width */
.container {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2rem);
}
```

**Cuando usar:** Siempre. Reemplaza py-16 md:py-24 lg:py-32

---

## 12. Conic Gradient Rotating Border

Borde animado con gradiente conico girando (efecto neon).

```css
.neon-border {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.neon-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: conic-gradient(from var(--angle, 0deg), var(--accent), transparent 40%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: rotate-border 3s linear infinite;
}

@keyframes rotate-border {
  to { --angle: 360deg; }
}
```

**Cuando usar:** Pricing card destacada, feature premium, CTA
**CUIDADO:** Solo en 1 elemento por pagina. Demasiados neon = cheap

---

## 13. Pressed State (micro-interaction)

Scale down sutil al hacer click = sensacion tactil.

```css
.interactive:active {
  transform: scale(0.97);
  transition: transform 100ms ease;
}
```

**Cuando usar:** Botones, cards clickeables
**Tailwind:** `active:scale-[0.97]`

---

## Anti-patterns CSS premium

- NUNCA `border: 1px solid #ddd` generico — usar shadow-as-border o warm border
- NUNCA `border-radius: 5px` sin razon — usar scale consistente
- NUNCA `color: #333` — usar gray system con temperatura
- NUNCA `box-shadow: 0 2px 10px rgba(0,0,0,0.1)` generico — usar multi-layer
- NUNCA `transition: all 0.3s ease` — especificar propiedades + usar ease-out
- NUNCA `letter-spacing: 0.5px` en body — positivo = amateur
- NUNCA `font-weight: bold` — usar weight numerico exacto
