# Deliverables Checklist — Todo lo que debe existir

Verificar ANTES de considerar una landing "terminada".

## Assets
- [ ] `public/favicon.svg` — icono del producto con gradiente de marca
- [ ] `public/apple-touch-icon.png` — 180x180 PNG con fondo de marca
- [ ] `public/og-image.png` — 1200x630 PNG para compartir en redes
- [ ] `src/components/icons/[nombre]-logo.tsx` — componente SVG del logo (variantes: full, icon, white)

## Codigo
- [ ] `src/config/site.ts` — TODO el contenido centralizado
- [ ] `src/config/metadata.ts` — SEO metadata completa (title, description, OG, Twitter, robots, icons, keywords)
- [ ] Schema.org JSON-LD en `page.tsx` (SoftwareApplication, LocalBusiness, o lo que aplique)
- [ ] `CLAUDE.md` en root — instrucciones del proyecto
- [ ] Todas las secciones construidas e importadas en `page.tsx`
- [ ] `layout.tsx` con: font config, SmoothScrollProvider, Header, Footer, ScrollProgress, BackToTop
- [ ] `globals.css` con: colores OKLCH de marca, keyframes de animaciones

## Calidad
- [ ] QA visual passed a 3 viewports (375px, 768px, 1440px)
- [ ] Auditoria SEO passed
- [ ] Auditoria accesibilidad passed
- [ ] Auditoria performance passed (60fps, LCP < 2.5s, CLS = 0)
- [ ] 0 errores de consola JS
- [ ] 0 warnings de consola
- [ ] `npx next build` exitoso
- [ ] `npx tsc --noEmit` sin errores

## Deploy
- [ ] Deployed a Vercel (u otra plataforma)
- [ ] URL de produccion verificada con screenshot
- [ ] SSL funcionando (https)

## Documentacion
- [ ] Nota de proyecto (`docs/ESTADO.md`; y ESTADO del expediente de marca si existe) con:
  - URL de produccion
  - Path del repo local
  - Stack tecnico
  - Secciones implementadas
  - Brand (colores hex + oklch, font, logo)
  - Precios si aplica
  - Fecha de creacion
- [ ] Aprendizajes anotados en `LECCIONES.md` del expediente o en la nota de proyecto (si hubo errores o patrones interesantes)
