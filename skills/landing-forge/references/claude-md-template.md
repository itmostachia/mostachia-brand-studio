# Template: CLAUDE.md para proyectos de landing page

Copiar al root del proyecto y reemplazar los placeholders.

```markdown
# [NOMBRE] — Landing Page

## Proyecto
Landing page para [DESCRIPCION_BREVE].
Stack: Next.js 16+ (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui

## Estructura del proyecto
[Copiar de project-scaffold.md]

## Convenciones de codigo
- TypeScript estricto — no `any`, interfaces para todo
- Componentes funcionales con arrow functions
- Archivos: kebab-case. Componentes: PascalCase
- Un componente por archivo
- Imports con alias `@/`
- `className` via `cn()` de `@/lib/utils`

## Estilos
- Tailwind CSS v4, NO CSS modules
- Variables CSS custom en globals.css
- Responsive: mobile-first (sm > md > lg > xl)

## Animaciones — REGLAS
- GSAP + useGSAP para scroll-driven y timelines
- Lenis (ReactLenis) para smooth scroll global
- Motion (Framer Motion) para hover, tap, enter/exit
- 60fps NO NEGOCIABLE
- Respetar `prefers-reduced-motion`
- GSAP cleanup via useGSAP context scope
- NO animar width, height, top, left — solo transform y opacity

## Content
- Todo centralizado en `src/config/site.ts`
- No hardcodear textos en componentes
- Metadata SEO en `src/config/metadata.ts`

## Skills a usar
1. ui-ux-pro-max — diseno
2. motion-design + gsap-* o framer-motion — animaciones premium (una sola librería)
3. animated-component-libraries — Magic UI, React Bits
4. frontend-design — construccion production-grade
5. humanise-text — copy natural
6. Docs oficiales de cada librería (versión instalada)
7. qa / gstack — QA visual

## Brand
- Colores: [LISTAR_COLORES]
- Tipografia: [FONT_FAMILY]
- Tono: [TONO_DE_VOZ]

## Deploy
vercel deploy --prod --yes
```
