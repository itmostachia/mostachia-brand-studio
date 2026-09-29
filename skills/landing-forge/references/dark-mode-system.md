# Dark Mode System — Guia para light/dark toggle y secciones dark

Cubre 2 escenarios:
1. Landing con toggle light/dark mode completo
2. Landing light con secciones dark alternadas (mas comun)

---

## Escenario 1: Toggle Light/Dark Mode

### Setup con Tailwind v4 + next-themes

```bash
npm install next-themes
```

```tsx
// layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Variables CSS dual

```css
/* globals.css — definir ambos modos */
:root {
  --bg-primary: oklch(0.98 0.005 80);      /* Warm white */
  --bg-surface: oklch(0.96 0.005 80);
  --text-primary: oklch(0.15 0.02 260);
  --text-secondary: oklch(0.45 0.02 260);
  --border: oklch(0.90 0.01 260);
  --accent: oklch(0.55 0.20 260);           /* Mismo accent ambos modos */
  --shadow-color: rgba(0, 0, 0, 0.08);
}

.dark {
  --bg-primary: oklch(0.13 0.01 260);       /* Near-black */
  --bg-surface: oklch(0.17 0.01 260);
  --text-primary: oklch(0.95 0.005 80);
  --text-secondary: oklch(0.65 0.01 80);
  --border: oklch(0.22 0.01 260);
  --accent: oklch(0.65 0.20 260);           /* Ligeramente mas claro en dark */
  --shadow-color: rgba(0, 0, 0, 0.30);
}
```

### Reglas criticas dark mode

1. **NO invertir colores** — disenar dark mode como un tema separado
2. **Desaturar accent ligeramente** en dark (subir lightness 5-10%)
3. **Shadows mas fuertes** en dark (0.20-0.40 opacity vs 0.04-0.08 light)
4. **Elevar con color** no con shadow — bg-surface mas claro = mas elevado
5. **Borders mas visibles** — rgba(255,255,255,0.08) minimo
6. **No usar blanco puro** (#fff) para texto — usar oklch(0.95...) para reducir glare
7. **Imagenes/iconos** — considerar versiones invertidas o con border para contraste
8. **Testear contraste** — WCAG AA en AMBOS modos

### Toggle Button
```tsx
'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      aria-label="Toggle dark mode"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
```

---

## Escenario 2: Secciones dark alternadas (mas comun en landings)

### Pattern: alternating sections

```tsx
// Usar la prop background de SectionWrapper
<SectionWrapper background="white">  {/* Hero */}
<SectionWrapper background="light">  {/* Trust bar */}
<SectionWrapper background="white">  {/* Pain points */}
<SectionWrapper background="navy">   {/* Solution — DARK */}
<SectionWrapper background="white">  {/* Features */}
<SectionWrapper background="dark">   {/* AI/Tech — DARK */}
<SectionWrapper background="white">  {/* Pricing */}
<SectionWrapper background="navy">   {/* CTA Final — DARK */}
```

### Transiciones entre light y dark sections

```css
/* Gradiente suave en el borde */
.section-to-dark {
  position: relative;
}
.section-to-dark::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bg-dark));
  pointer-events: none;
}

.section-from-dark {
  position: relative;
}
.section-from-dark::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, var(--bg-dark), transparent);
  pointer-events: none;
}
```

### Color mapping para secciones dark

```css
/* Las secciones dark tienen sus propias variables */
.section-dark, [data-theme="dark"] {
  --text-primary: oklch(0.95 0.005 80);
  --text-secondary: oklch(0.65 0.01 80);
  --border: rgba(255, 255, 255, 0.08);
  --card-bg: rgba(255, 255, 255, 0.04);
  --card-bg-hover: rgba(255, 255, 255, 0.08);
}
```

---

## Colores que funcionan en ambos modos

| Elemento | Light | Dark | Nota |
|---|---|---|---|
| Accent (CTA) | Saturacion original | +5-10% lightness | Mantener legibilidad |
| Success green | oklch(0.55 0.18 145) | oklch(0.65 0.18 145) | Mas claro en dark |
| Error red | oklch(0.55 0.22 25) | oklch(0.65 0.22 25) | Mas claro en dark |
| Warning yellow | oklch(0.75 0.15 85) | oklch(0.80 0.15 85) | Ligero bump |
| Links | oklch(0.50 0.15 260) | oklch(0.70 0.15 260) | Significativamente mas claro |

---

## Checklist dark mode

- [ ] Contraste WCAG AA en ambos modos
- [ ] Accent color legible sobre dark bg
- [ ] Shadows ajustadas (mas fuertes en dark)
- [ ] Borders visibles (rgba white 0.08+)
- [ ] Texto NO es blanco puro (#fff) — usar oklch(0.95)
- [ ] Imagenes con fondo transparente se ven bien en dark
- [ ] SVG icons con currentColor (heredan color de texto)
- [ ] Focus indicators visibles en ambos modos
- [ ] Gradientes ajustados para dark (no quedan con "halo")
- [ ] Transiciones suaves entre secciones light/dark
