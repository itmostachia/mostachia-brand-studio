# Competitor Extraction — Extraer design tokens exactos de sitios web

Guia para extraer design tokens REALES (no aproximados) de cualquier sitio web
usando Playwright CLI + JavaScript injection.

---

## Cuando usar

- **Modo 1 (Crear):** En Phase 0 Style Discovery, para analizar competidores
- **Modo 2 (Clonar):** En Clone-Phase 0 Reconnaissance, obligatorio
- **Modo 3 (Clonar+Mejorar):** En Clone-Phase 0, obligatorio

---

## Paso 1: Abrir el sitio con Playwright CLI

```bash
playwright-cli open [URL]
```

## Paso 2: Capturar screenshots

```bash
# Full page desktop
playwright-cli screenshot --full-page --filename docs/references/clone-target/desktop.png

# Navegar secciones especificas y capturar
playwright-cli screenshot --filename docs/references/clone-target/hero.png
```

## Paso 3: Extraer design tokens via JavaScript

Ejecutar este script en la consola del browser (via Playwright CLI o DevTools):

```javascript
// === DESIGN TOKEN EXTRACTOR ===
// Ejecutar en la consola del sitio target

(function extractDesignTokens() {
  const results = { colors: {}, typography: {}, spacing: {}, shadows: {}, radius: {} };

  // --- COLORES ---
  const colorElements = document.querySelectorAll('*');
  const colorSet = new Set();
  colorElements.forEach(el => {
    const style = getComputedStyle(el);
    [style.color, style.backgroundColor, style.borderColor].forEach(c => {
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') colorSet.add(c);
    });
  });
  results.colors = [...colorSet].slice(0, 20); // Top 20 colores unicos

  // --- TIPOGRAFIA ---
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button');
  const fontSet = new Map();
  headings.forEach(el => {
    const style = getComputedStyle(el);
    const key = `${style.fontFamily}|${style.fontSize}|${style.fontWeight}|${style.lineHeight}|${style.letterSpacing}`;
    if (!fontSet.has(key)) {
      fontSet.set(key, {
        tag: el.tagName,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        textTransform: style.textTransform,
        sample: el.textContent?.slice(0, 50)
      });
    }
  });
  results.typography = [...fontSet.values()];

  // --- SPACING ---
  const sections = document.querySelectorAll('section, [class*="section"], main > div');
  const spacingSet = new Set();
  sections.forEach(el => {
    const style = getComputedStyle(el);
    spacingSet.add(`padding: ${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`);
    spacingSet.add(`margin: ${style.marginTop} ${style.marginBottom}`);
    spacingSet.add(`gap: ${style.gap}`);
  });
  results.spacing = [...spacingSet];

  // --- SHADOWS ---
  const shadowSet = new Set();
  colorElements.forEach(el => {
    const shadow = getComputedStyle(el).boxShadow;
    if (shadow && shadow !== 'none') shadowSet.add(shadow);
  });
  results.shadows = [...shadowSet];

  // --- BORDER RADIUS ---
  const radiusSet = new Set();
  colorElements.forEach(el => {
    const radius = getComputedStyle(el).borderRadius;
    if (radius && radius !== '0px') radiusSet.add(radius);
  });
  results.radius = [...radiusSet];

  // --- OUTPUT ---
  console.log(JSON.stringify(results, null, 2));
  return results;
})();
```

### Como ejecutar con Playwright CLI

```bash
# Opcion 1: Via playwright-cli evaluate (si soporta)
playwright-cli evaluate "(() => { /* script above */ })()"

# Opcion 2: Via script Node.js con Playwright
node extract-tokens.mjs
```

### Script Node.js alternativo (extract-tokens.mjs)

```javascript
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(process.argv[2] || 'https://example.com', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Screenshots
await page.screenshot({ fullPage: true, path: 'docs/references/clone-target/desktop.png' });

// Extract tokens
const tokens = await page.evaluate(() => {
  // ... (mismo script de arriba)
});

writeFileSync('docs/references/clone-target/design-tokens.json', JSON.stringify(tokens, null, 2));
console.log('Tokens extracted:', Object.keys(tokens).map(k => `${k}: ${tokens[k].length || Object.keys(tokens[k]).length}`));

await browser.close();
```

## Paso 4: Mapear secciones

Scrollear el sitio completo y documentar:

```markdown
# Section Map — [nombre del sitio]

| # | Seccion | Tipo | Interaction Model | Altura aprox | Notas |
|---|---------|------|-------------------|-------------|-------|
| 1 | Hero | Hero con video bg | Time-based (autoplay) | 100vh | Parallax en scroll |
| 2 | Logos | Trust bar | Static | 80px | Marquee infinito |
| 3 | Features | Feature grid | Hover-triggered | 600px | Cards con tilt |
| ...| ... | ... | ... | ... | ... |
```

### Interaction Models (identificar ANTES de construir)

| Modelo | Como detectarlo | Ejemplo |
|---|---|---|
| **Scroll-driven** | Elementos cambian al scrollear (parallax, pin, reveal) | GSAP ScrollTrigger |
| **Click-driven** | Tabs, accordions, modals que requieren click | FAQ accordion |
| **Hover-triggered** | Efectos que aparecen solo al hover | Card tilt, tooltip |
| **Time-based** | Animaciones que corren solas (autoplay, loop) | Marquee, aurora, video |
| **Hybrid** | Combinacion de 2+ modelos | Hero con aurora (time) + reveal (scroll) |

## Paso 5: Documentar en design-tokens.md

```markdown
# Design Tokens — [nombre del sitio clonado]

## Colores
- Primary: rgb(X, Y, Z) → oklch(...)
- Background: ...
- Text: ...
- Accent: ...

## Tipografia
- H1: font-family, 64px, weight 700, line-height 1.1, tracking -2.4px
- H2: ...
- Body: ...

## Shadows
- Card: 0 4px 12px rgba(...)
- Elevated: ...

## Border Radius
- Cards: 16px
- Buttons: 8px
- Inputs: 6px

## Spacing
- Section padding: 120px top/bottom
- Container max-width: 1200px
- Card gap: 24px
```

---

## Anti-patterns

- NUNCA aproximar: "se ve como un gris claro" → usar getComputedStyle exacto
- NUNCA asumir font: verificar con DevTools o extractor
- NUNCA ignorar interacciones: si el original tiene hover effects, documentarlos
- NUNCA copiar contenido del target sin adaptarlo al cliente
