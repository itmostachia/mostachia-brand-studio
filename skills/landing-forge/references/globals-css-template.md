# Template: src/app/globals.css

Setup de Tailwind CSS v4 con colores de marca en OKLCH + shadcn/ui + animaciones custom.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);

  /* Brand colors — reemplazar con valores del proyecto */
  --color-brand-primary: /* OKLCH_PRIMARY */;
  --color-brand-secondary: /* OKLCH_SECONDARY */;
  --color-brand-accent: /* OKLCH_ACCENT */;
  --color-brand-dark: /* OKLCH_DARK */;
  --color-brand-light: /* OKLCH_LIGHT */;

  /* Shadcn semantic tokens (no tocar estructura, solo valores) */
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  /* ... chart, sidebar tokens */

  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
}

:root {
  --background: oklch(1 0 0);
  --foreground: /* BRAND_DARK_OKLCH */;
  --primary: /* BRAND_PRIMARY_OKLCH */;
  --primary-foreground: oklch(1 0 0);
  --secondary: /* BRAND_LIGHT_OKLCH */;
  --secondary-foreground: /* BRAND_DARK_OKLCH */;
  --muted: /* BRAND_LIGHT_OKLCH */;
  --muted-foreground: oklch(0.556 0.020 260);
  --accent: /* BRAND_ACCENT_OKLCH */;
  --accent-foreground: /* BRAND_DARK_OKLCH */;
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0.008 265);
  --input: oklch(0.922 0.008 265);
  --ring: /* BRAND_PRIMARY_OKLCH */;
  --radius: 0.625rem;
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
  html { @apply font-sans scroll-smooth; }
}

/* ═══ Custom Keyframes ═══ */

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes shimmer-sweep {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(200%); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(var(--brand-primary-rgb), 0.25); }
  50% { box-shadow: 0 4px 30px rgba(var(--brand-primary-rgb), 0.4); }
}

@keyframes aurora-drift-1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(80px, 40px) scale(1.15); }
}

@keyframes aurora-drift-2 {
  0% { transform: translate(0, 0) scale(1.1); }
  100% { transform: translate(-60px, 60px) scale(0.9); }
}

@keyframes aurora-drift-3 {
  0% { transform: translate(0, 0) scale(0.95); }
  100% { transform: translate(50px, -50px) scale(1.1); }
}

@keyframes orbit {
  from { transform: rotate(0deg) translateX(32px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(32px) rotate(-360deg); }
}
```

**Notas:**
- Convertir hex a OKLCH con culori: `node -e "const {oklch,parse}=require('culori'); ..."`
- Los brand colors se usan como: `bg-brand-primary`, `text-brand-accent`, `from-brand-secondary to-brand-accent`
- El dark theme es opcional para landings (usar secciones dark puntuales con clases inline)
