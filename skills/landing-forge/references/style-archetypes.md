# Style Archetypes — Design DNA por proyecto

Cada landing debe tener una personalidad visual unica. Estos 6 arquetipos
(extraidos de 58 design systems reales) son el punto de partida — NO restricciones.
Son vocabularios visuales probados que EXPANDEN las opciones del agente.

---

## Como usar este documento

1. Durante Phase 0 (Discovery), analizar la marca y la industria
2. Sugerir el arquetipo mas adecuado al usuario (puede rechazarlo o mezclar)
3. El arquetipo sugiere: paleta base, tipografia, shadows, spacing, border-radius, botones
4. Los colores REALES de la marca siempre tienen prioridad
5. Se puede mezclar 2 arquetipos (80/20) para resultados unicos
6. Se puede ignorar completamente y crear algo custom
7. Son GUIAS, no reglas — el objetivo es INSPIRAR variedad, no limitar

---

## Arquetipo 1: Warm Literary Minimalism

**Referencia:** Claude, Notion, Cursor
**Ideal para:** Estudios profesionales, consultoras, productos de IA, educacion, editorial
**Sensacion:** Confiable, humano, sofisticado, cercano

### Paleta sugerida
```css
--bg-primary: #f5f4ed;       /* Crema calido, NUNCA blanco puro */
--bg-card: #faf9f5;          /* Marfil */
--text-primary: rgba(0,0,0,0.95); /* Casi negro, nunca #000 */
--text-secondary: rgba(0,0,0,0.55);
--border: rgba(0,0,0,0.10);
--accent: #c96442;           /* Terracota calido — solo CTAs */
```

### Tipografia
- Display: Serif (weight 500) — opciones: Lora, Cormorant Garamond, Playfair Display
- Body: Sans (weight 400) — opciones: Inter, Figtree, Instrument Sans
- Line-height body: 1.55-1.60 (editorial, generoso)
- Letter-spacing headlines: -0.26px a -1.0px (sutil)

### Shadows
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.04);
--shadow-md: 0 4px 24px rgba(0,0,0,0.05);
--shadow-ring: 0 0 0 1px rgba(0,0,0,0.06);
```

### Componentes
- Botones: rounded-rect 8px, padding generoso, transicion color suave
- Cards: border 1px solid, shadow minima, radius 12px
- Border-radius scale: 4 / 8 / 12 / 16px
- Section gap: 80-120px (ritmo de "paginas de libro")

### Animaciones preferidas
- Fade-in suaves (300-500ms), text reveals con blur sutil
- NO particulas ni efectos agresivos — elegancia por restraint

---

## Arquetipo 2: Aggressive Technical Minimalism

**Referencia:** Vercel, Figma
**Ideal para:** SaaS tech, developer tools, plataformas, startups B2B tech
**Sensacion:** Tecnico, confiado, stripped-down, "codigo compilado a UI"

### Paleta sugerida
```css
--bg-primary: #ffffff;
--bg-dark: #000000;          /* Para secciones alternadas */
--text-primary: #171717;
--text-secondary: #666666;
--border: rgba(0,0,0,0.08);
/* ACROMATICO — sin color de acento en chrome */
```

### Tipografia
- Display: Geometric sans (weight 600 UNICO) — opciones: Geist, Inter Tight
- Letter-spacing AGRESIVO: -2.4px a 48px, -2.88px a 64px
- Solo 3 weights: 400, 500, 600

### Shadows
```css
/* Shadow-as-border (tecnica Vercel) */
--shadow-ring: 0 0 0 1px rgba(0,0,0,0.08);
--shadow-elevated: 0 0 0 1px rgba(0,0,0,0.08), 0 2px 2px rgba(0,0,0,0.04);
```

### Componentes
- Botones: Ghost con shadow-border, o solid negro/blanco
- Cards: Shadow-as-border, radius 8px, fondo blanco puro
- Sin decoracion — cada pixel tiene proposito
- Section gap: 80-120px (galeria de arte)

### Animaciones preferidas
- Transiciones minimas (150-200ms), hover opacity 0.7
- Gradientes animados para fondos dark

---

## Arquetipo 3: Dark Immersive Presence

**Referencia:** Spotify, Raycast, Supabase, Linear
**Ideal para:** Musica/media, dev tools premium, gaming, crypto, fintech dark
**Sensacion:** Cinematico, premium, inmersivo, code-editor credibility

### Paleta sugerida
```css
--bg-primary: #0a0a0a;
--bg-elevated: #141414;
--bg-surface: #1a1a1a;
--text-primary: #fafafa;
--text-secondary: rgba(255,255,255,0.60);
--border: rgba(255,255,255,0.08);
--accent: #1ed760;          /* Un SOLO color saturado */
```

### Tipografia
- Display: Sans bold (weight 700) — opciones: Satoshi, General Sans, Cabinet Grotesk
- Line-height body: 1.40-1.50 (dark no necesita tanto aire)

### Shadows
```css
--shadow-md: 0 8px 8px rgba(0,0,0,0.30);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.50);
--shadow-inset: inset 0 1px 0 rgba(255,255,255,0.04);
```

### Componentes
- Botones: Pill (9999px), hover opacity, accent color primary
- Cards: bg-surface con border rgba(255,255,255,0.06), radius 12-16px
- Section gap: 40-80px (comprimido)

### Animaciones preferidas
- Particles/starfield, glow pulses, beam effects
- Gradient animations (aurora, mesh), 3D sutil, parallax agresivo

---

## Arquetipo 4: Reductive Luxury

**Referencia:** Apple, Tesla
**Ideal para:** Productos premium, hardware, automotive, luxury brands, real estate
**Sensacion:** Lujo por ausencia, cinematico, producto = diseno

### Paleta sugerida
```css
--bg-primary: #ffffff;
--bg-secondary: #f5f5f7;
--text-primary: #1d1d1f;
--text-secondary: #86868b;
--accent: #0071e3;           /* Solo interactive elements */
```

### Tipografia
- Display: Sans (weight 600) — opciones: Outfit, Manrope
- Letter-spacing: -0.28px a -0.374px (universal sutil)
- clamp() para fluid typography en headings

### Shadows
```css
--shadow-product: 3px 5px 30px rgba(0,0,0,0.22);
/* Solo en producto/hero, nunca en UI chrome */
```

### Componentes
- Botones: Pill (980px), azul sobre blanco, blanco sobre dark
- Cards: SIN borders, SIN shadows — solo color de fondo
- Section gap: ~100vh (cada seccion es una "escena")
- Whitespace extremo — 60%+ del viewport vacio

### Animaciones preferidas
- Scroll-pinned reveals, parallax cinematico, scale transitions
- Video autoplay como hero — ZERO decoracion

---

## Arquetipo 5: Confident Duality

**Referencia:** Uber, Airbnb
**Ideal para:** Marketplaces, delivery, hospitality, consumer apps, fintech consumer
**Sensacion:** Eficiente, accesible, warm pero directo

### Paleta sugerida
```css
--bg-primary: #ffffff;
--text-primary: #000000;
--accent: #ff385c;           /* UN color vibrante de punch */
```

### Tipografia
- Display: Geometric sans (weight 700) — opciones: DM Sans, Plus Jakarta Sans
- Letter-spacing: -0.18px a -0.44px (solo headings)
- Line-height: 1.22-1.43

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.08);
--shadow-card: 0 6px 20px rgba(0,0,0,0.16);
```

### Componentes
- Botones: Pill CTAs, accent color prominent
- Cards: Shadow elevadas, radius 12px, foto arriba
- Touch targets 44px+ (mobile-first real)
- Section gap: 64-96px (eficiente)

### Animaciones preferidas
- Scale on hover (1.02-1.05), smooth slide transitions
- Carousel/swiper, micro-interactions en botones

---

## Arquetipo 6: Precision Technical Excellence

**Referencia:** Stripe, Linear
**Ideal para:** Fintech, payments, enterprise SaaS, data platforms, analytics
**Sensacion:** Sofisticacion financiera, lujo por restraint, precision tecnica

### Paleta sugerida
```css
--bg-primary: #ffffff;
--bg-dark: #0a2540;          /* Navy profundo */
--text-primary: #425466;     /* Slate — NO negro */
--accent: #533afd;           /* Purple sofisticado */
--accent-secondary: #00d4ff; /* Cyan para gradients */
```

### Tipografia
- Display: Variable sans (weight 300 — ANTI-CONVENCION = lujo)
- OpenType features: ss01, kern, liga — OBLIGATORIO
- Letter-spacing: -1.4px (headlines)

### Shadows
```css
/* Blue-tinted paired shadows (tecnica Stripe) */
--shadow-stripe: 0 13px 27px -5px rgba(50,50,93,0.25),
                 0 8px 16px -8px rgba(0,0,0,0.30);
```

### Componentes
- Botones: Rounded-rect 4-6px (tight), purple gradient
- Cards: Multi-layer shadow, navy sections
- Gradients diagonales como decoracion
- Section gap: 60-80px (precision)

### Animaciones preferidas
- Gradient mesh en navy backgrounds, beam/line animations
- Number counters spring, SVG path draw, diagonal reveals

---

## Matriz de decision rapida

| Industria | Arquetipo sugerido | Mezcla sugerida |
|---|---|---|
| Estudio contable/legal | 1 (Warm Literary) | +20% de 6 (Precision) |
| SaaS / Dev tools | 2 (Aggressive Tech) | +20% de 3 (Dark) |
| Fintech / Payments | 6 (Precision Tech) | +20% de 2 (Aggressive) |
| E-commerce / Marketplace | 5 (Confident Duality) | +20% de 1 (Warm) |
| Producto premium / Luxury | 4 (Reductive Luxury) | +20% de 6 (Precision) |
| AI / Machine Learning | 3 (Dark Immersive) | +20% de 2 (Aggressive) |
| Salud / Wellness | 1 (Warm Literary) | +20% de 5 (Duality) |
| Gaming / Entertainment | 3 (Dark Immersive) | +20% de 5 (Duality) |
| Real estate premium | 4 (Reductive Luxury) | +20% de 1 (Warm) |
| Consultora / Agencia | 1 (Warm Literary) | +20% de 4 (Luxury) |
| Startup consumer | 5 (Confident Duality) | +20% de 2 (Aggressive) |
| Crypto / Web3 | 3 (Dark Immersive) | +20% de 6 (Precision) |

## Reglas de combinacion

1. **80/20:** Arquetipo primario domina, secundario aporta matices
2. **No mezclar warm + cool grays** — elegir una temperatura
3. **No mezclar serif + aggressive tracking** — son incompatibles
4. **Dark Immersive puede ser seccion alternada en cualquier arquetipo**
5. **Los colores del cliente SIEMPRE tienen prioridad** sobre defaults
6. **Estos son puntos de partida, no restricciones** — la creatividad manda
