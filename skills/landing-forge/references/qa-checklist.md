# QA Checklist — Landing Pages

Verificar TODOS estos items antes de deploy. Delegar a `/qa` para los visuales.

## Visual (screenshots a 375px, 768px, 1440px)
- [ ] Mobile: todas las secciones visibles, sin overflow horizontal
- [ ] Mobile: texto no truncado, botones accesibles con el pulgar
- [ ] Mobile: floating cards/3D ocultos (demasiado pesados)
- [ ] Tablet: layout adapta correctamente, grids de 2 columnas
- [ ] Desktop: ancho completo utilizado, spacing balanceado
- [ ] Header: glass-morphism al scrollear, nav active state, hamburger mobile
- [ ] Hero: headline legible, CTAs prominentes, visual funcional
- [ ] Cada seccion: padding consistente, contenido alineado
- [ ] Footer: links visibles, columnas responsive
- [ ] Animaciones: 60fps, sin jank, scroll suave, reveals correctos
- [ ] Secciones dark: contraste de texto legible, fondos limpios sin artefactos

## SEO
- [ ] Title < 60 caracteres
- [ ] Meta description 150-160 caracteres
- [ ] og:title + og:description + og:image (1200x630)
- [ ] twitter:card = summary_large_image + twitter:image
- [ ] Schema.org JSON-LD presente y valido
- [ ] H1 unico (exactamente 1)
- [ ] Heading order correcto (H1 → H2 → H3, sin saltos)
- [ ] `lang` attribute en `<html>`
- [ ] Canonical URL configurada
- [ ] robots meta (index, follow)
- [ ] Keywords relevantes (10-15)

## Accesibilidad
- [ ] Contraste WCAG AA (4.5:1 texto, 3:1 texto grande)
- [ ] Todas las imagenes con alt text
- [ ] Todos los inputs con labels asociados
- [ ] Keyboard navigation funcional (tab por todos los interactivos)
- [ ] Focus indicators visibles
- [ ] `prefers-reduced-motion` respetado en TODAS las animaciones
- [ ] ARIA labels en botones sin texto (hamburger, back-to-top, play)
- [ ] Semantic HTML (nav, main, section, footer)
- [ ] Skip to content link (opcional pero recomendado)

## Performance
- [ ] 60fps en todas las animaciones (Chrome DevTools Performance)
- [ ] CLS = 0 (solo transform + opacity animados)
- [ ] LCP < 2.5s (hero carga rapido)
- [ ] Imagenes con next/image + sizes correctos
- [ ] Below-fold images lazy loaded
- [ ] GSAP cleanup via useGSAP scope
- [ ] NO propiedades que causan layout shift animadas
- [ ] Fonts con display: swap
- [ ] `npx next build` exitoso sin errores ni warnings

## Codigo
- [ ] TypeScript strict — cero `any`
- [ ] 0 errores de consola en browser
- [ ] 0 warnings de consola en browser
- [ ] Todo el contenido viene de site.ts (nada hardcoded)
- [ ] `npx tsc --noEmit` pasa

## Anti-AI-Slop (ver references/design-principles.md)
- [ ] Fuente NO es Inter sin motivo de marca
- [ ] Headlines tienen letter-spacing custom (NO default)
- [ ] Shadows son multi-layer o shadow-as-border (NO shadow-md generico)
- [ ] Gray scale tiene temperatura (warm o cool, NO grises puros)
- [ ] Border-radius es consistente (scale definida, NO valores random)
- [ ] Hay UN efecto signature memorable
- [ ] NO hay "card soup" — se usan layouts variados
- [ ] Animaciones usan easing especifico (NO `ease` generico)
- [ ] OpenType features activados (kern, liga) si la fuente los soporta
- [ ] Secciones usan componentes de DIFERENTES librerias (variedad)

## Scoring Framework (evaluacion /20)
- [ ] Unicidad: ____/4 (¿se distingue de otras landings?)
- [ ] Craft: ____/4 (¿cada detalle es intencional?)
- [ ] Performance: ____/4 (¿60fps, LCP < 2.5s, CLS = 0?)
- [ ] Accesibilidad: ____/4 (¿WCAG AA, keyboard, reduced-motion?)
- [ ] Responsive: ____/4 (¿nativo en cada viewport?)
- [ ] **TOTAL: ____/20** (minimo 14 para deploy)
