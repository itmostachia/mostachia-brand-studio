---
name: landing-forge
description: >
  Forge System v5 — sistema modular de entrega digital end-to-end.
  Entrevista adaptativa → ejecucion autonoma → entrega para revision.
  7 modulos: web (core), backend (n8n+Supabase), analytics (GA4+Pixel),
  content (piezas de lanzamiento vía piezas-marca), monitor (canary+benchmark), handoff (PDF+docs),
  recipes (templates inter-proyecto). 18 Impeccable micro-skills integradas.
  35+ skills coordinadas. Score minimo 16/20.
  Usar cuando: "crear landing", "nueva landing page", "landing para [producto]",
  "build landing page", "landing from scratch", "pagina web para vender",
  "armar una landing", "necesito una web para [X]", "crear sitio web",
  "clonar esta web", "quiero una web como [url]", "replicar este sitio",
  "basate en esta web", "hacela igual a esta", "forge", "landing de la marca",
  "entrega completa de la web", "sistema completo para [cliente]", "mega landing",
  "landing super espectacular", "web para un sorteo", "web para un amigo",
  "web para un cliente".
argument-hint: <nombre del proyecto, URL a clonar, o descripcion del producto>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Agent, WebSearch, WebFetch
---

# Forge System v5 — Entrega Digital Modular

## Integración con MostachIA Brand Studio

- Ubicá el repo: `$BRAND_STUDIO_HOME` o subí desde la ruta real de este SKILL.md hasta `docs/CONTRATO.md`.
- **Si existe expediente de marca** (`<slug>/brand.config.json` + `06-kit/`): la marca NO se extrae ni se
  inventa. Tokens, fuentes y logos salen de `06-kit/`; el proyecto va en `<slug>/07-aplicaciones/web/`;
  el `client-brief.md` se pre-completa desde `01-brief/BRIEF.md`; se saltea `agents/brand-extractor`.
  El arquetipo se elige para **conservar los rasgos del board aprobado** (ver `web-marca` §0 y §5): la
  landing no puede ser más plana que el board. Comparación lado a lado obligatoria antes de entregar.
- Sin expediente: flujo normal de abajo (brand-extractor sobre los docs que haya).
- Visuales: si el runtime no tiene generación nativa de imágenes, `visuales-sin-generador` (cero API keys).
- 3D/WebGL: `web-3d`. Motion: una sola librería por proyecto (GSAP **o** framer-motion).

## Principios fundamentales

1. **NUNCA generico** — cada proyecto es unico. Investigar antes de construir
2. **3 modos** — Crear / Clonar+Adaptar / Clonar+Mejorar (ver `references/clone-mode.md`)
3. **Style archetype first** — elegir DNA visual ANTES de tocar codigo (ver `references/style-archetypes.md`)
4. **Spec before build** — cada componente complejo tiene spec ANTES de construir
5. **Interaction model first** — identificar si es scroll/click/hover/time ANTES de construir
6. **Component variety** — NUNCA usar la misma libreria para todas las secciones
7. **Anti-AI-slop** — cada decision de design pasa el "nose test" (ver `references/design-principles.md`)
8. **Content centralizado** — todo en `src/config/site.ts`, zero hardcoded
9. **Mobile-first** — responsive desde el primer componente
10. **60fps** — solo `transform` y `opacity` en animaciones. GSAP cleanup obligatorio
11. **Signature effect** — cada landing tiene UN efecto memorable
12. **Completeness beats speed** — no despachar sin spec completo
13. **Delegar** — usar skills existentes, no reinventar
14. **Impeccable pipeline** — cada seccion pasa por animate+arrange+clarify DURANTE build, y refinement+7-layer audit DESPUES
15. **Equilibrio bolder/quieter** — si plano `/bolder`, si agresivo `/quieter`. Nunca extremos
16. **Module autonomy** — cada modulo tiene su scope. El orquestador routea, los modulos ejecutan. Todos leen de client-brief.md

---

## Documentos de referencia

| Documento | Proposito |
|---|---|
| `references/style-archetypes.md` | 6 arquetipos de estilo visual |
| `references/component-libraries.md` | 10+ librerias con regla anti-monotonia |
| `references/background-effects.md` | 7 categorias de fondos por arquetipo |
| `references/css-patterns.md` | 13 patrones CSS premium |
| `references/design-principles.md` | 10 mandamientos anti-generico + scoring 0-20 |
| `references/section-catalog.md` | 18 tipos de secciones con narrativa |
| `references/animation-playbook.md` | Animaciones por seccion |
| `references/site-ts-template.md` | Template TypeScript para contenido |
| `references/globals-css-template.md` | Template OKLCH + keyframes |
| `references/project-scaffold.md` | Estructura + dependencias |
| `references/claude-md-template.md` | Template CLAUDE.md por proyecto |
| `references/qa-checklist.md` | 50+ items QA + scoring |
| `references/font-pairings.md` | 20 font pairings por arquetipo |
| `references/micro-interactions.md` | Patterns de micro-interaccion con timing |
| `references/dark-mode-system.md` | Setup light/dark + secciones alternadas |
| `references/conversion-patterns.md` | AIDA/PAS/FAB + CTA placement |
| `references/clone-mode.md` | Pipeline modos 2 y 3 |
| `references/competitor-extraction.md` | Design tokens via Playwright |
| `references/component-spec-template.md` | Spec por componente |
| `references/deliverables-checklist.md` | Checklist entregables |

---

## Three-Moment Model

### MOMENTO 1: Discovery Interview (interactivo)
UNA conversacion inicial. Preguntas adaptativas por bloques. Express (5 preguntas) o Full (15-20).
Output: `client-brief.md` en la raiz del proyecto → activa modulos.
Despues del brief: confirmar lista de modulos activados → ARRANCAR.

### MOMENTO 2: Ejecucion (autonomo)
SIN interrupciones. SIN checkpoints. SIN aprobaciones intermedias.
Status updates solamente: "Phase 2/7 — Foundation [web+backend+analytics]"
Si algo falla, auto-fix. Si no se puede despues de 3 intentos, PAUSAR y reportar.

**Context management:** Si el contexto se llena mid-build:
1. Guardar estado en `docs/ESTADO.md` del proyecto (fase actual + lo completado + lo pendiente) y, si hay expediente, en `00-control/RETOMAR.md`
2. Decirle al usuario: "Contexto lleno. Abri una nueva sesion en la carpeta del proyecto y decime 'continuar forge'."
3. En la nueva sesion: leer `client-brief.md` + CLAUDE.md + `docs/ESTADO.md` → retomar desde donde quedo
4. El `client-brief.md` en la raiz del proyecto es la fuente de verdad — cualquier sesion nueva lo lee y sabe que hacer

### MOMENTO 3: Entrega (interactivo)
Presentar TODOS los outputs: URL, screenshots, scores, brand.json, contenido, PDF.
Iterar sobre feedback. El usuario dice "el hero es muy oscuro" → fix y re-entregar.
Este es el UNICO punto donde el usuario revisa.

---

## Module Registry

| Modulo | Archivo | Se activa cuando | Depende de |
|---|---|---|---|
| forge:web | `modules/web.md` | Siempre (core) | — |
| forge:backend | `modules/backend.md` | client-brief §3 Active=si | forge:web (Phase 2+3) |
| forge:analytics | `modules/analytics.md` | client-brief §4 Active=si | forge:web (Phase 2+3) |
| forge:content | `modules/content.md` | client-brief §5 Active=si | forge:web (post-deploy) |
| forge:monitor | `modules/monitor.md` | Auto si forge:web activo | forge:web (Phase 5) |
| forge:handoff | `modules/handoff.md` | client-brief §6 Active=si | Todos los demas |
| forge:recipes | `modules/recipes.md` | Auto si forge:web activo | forge:web (Phase 1+5) |

---

## Discovery Interview

### Deteccion de modo

| El usuario dice... | Modo |
|---|---|
| "Crear landing para X", docs de marca, sin URL target | **Modo 1: Crear** |
| "Quiero una web como [url]", "clonar esta web" | **Modo 2: Clonar + Adaptar** |
| "Clonar y mejorar", "basate en esta pero mejor" | **Modo 3: Clonar + Mejorar** |
| URL + "usala de referencia/inspiracion" | **Modo 1** con Style Discovery |
| "Solo contenido", "posts para esta web" | **Solo forge:content** (skip web) |

| "Continuar forge", "seguir con el proyecto", "retomar" | **Continuar** → Leer client-brief.md + `docs/ESTADO.md` → retomar fase pendiente |

Si hay ambiguedad: "Queres (A) crear algo original, (B) replicar el diseno exacto, o (C) replicar y MEJORAR?"

### Express mode (5 preguntas — usar cuando el usuario dice "rapido" o da info minima)

1. ¿Que es el producto y para quien?
2. ¿Tenes docs de marca? (drag/drop o "no")
3. ¿Webs de referencia que te gusten? (o "buscame algunas")
4. ¿Necesita formulario de contacto? (si → campos basicos name+email+message)
5. ¿Algo mas? (analytics IDs, contenido para redes, o "solo la web")

→ Auto-completar client-brief.md con defaults para lo no preguntado.

### Full mode (15-20 preguntas, por bloques adaptativos)

**Bloque 1 — Esencial (siempre, 3-5 preguntas)**
1. Nombre del producto/empresa
2. Que hace (1-2 oraciones)
3. Audiencia target + industria
4. Docs de marca (DOCX/PDF/imagenes)
5. URLs de referencia (o auto-detect)

**Bloque 2 — Web (siempre para builds web)**
6. ¿Crear / Clonar+Adaptar / Clonar+Mejorar?
7. (Si clone) URL target
8. Preferencia de estilo (mostrar resumen de arquetipos de `references/style-archetypes.md`)
9. Secciones deseadas (mostrar catalogo de `references/section-catalog.md`)
10. ¿Dark mode? ¿Multi-page?

**Bloque 3 — Backend (si necesita forms/leads)**
11. Campos del formulario
12. ¿Adonde van las notificaciones? (email/whatsapp/telegram)
13. Proyecto Supabase (existente o nuevo)

**Bloque 4 — Analytics (sugerir automaticamente si hay web)**
14. GA4 Measurement ID
15. Meta Pixel ID
16. Eventos a trackear

**Bloque 5 — Contenido (ofrecer despues de definir la web)**
17. ¿Contenido de lanzamiento para redes?
18. ¿Que formatos? (carrusel, post, story, video)
19. ¿Hay kit de marca de Brand Studio? (ruta al expediente)

**Bloque 6 — Entrega (ofrecer si es proyecto de cliente)**
20. ¿PDF de entrega con credenciales y guia?

### Reglas de skip
- "Solo landing" → skip Bloques 3, 4, 5, 6
- "No formulario" → skip Bloque 3
- "Sin analytics" → skip Bloque 4
- Docs de marca ricos → skip "URLs de referencia"

### Post-interview
1. Procesar docs de marca via `agents/brand-extractor` (DOCX/PDF/imagenes)
2. Definir ruta del proyecto: `<slug>/07-aplicaciones/web/` si hay expediente; si no `./{nombre-proyecto}/` relativo al directorio de trabajo. Si el usuario esta en otra carpeta, preguntar
3. **Crear la carpeta del proyecto** con scaffold completo (Next.js + estructura + docs)
4. Guardar `client-brief.md` en la raiz del proyecto
5. Generar CLAUDE.md del proyecto con arquetipo, modulos activos, y convenciones
6. Mostrar: "Proyecto creado en {ruta}. Modulos activados: [lista]. Fases: [N]. Arrancando."
7. Comenzar MOMENTO 2.

---

## Execution Timeline

| Phase | forge:web | forge:backend | forge:analytics | forge:content | forge:monitor | forge:handoff | forge:recipes |
|-------|-----------|---------------|-----------------|---------------|---------------|---------------|---------------|
| 1 Research | secciones, componentes, signature | — | — | — | — | — | consultar recetas |
| 2 Foundation | scaffold, marca, DESIGN.md, Impeccable setup | tabla Supabase, workflow n8n | GA4 script, Meta Pixel | — | — | — | — |
| 3 Build | build secciones + Impeccable | form component, webhook | eventos en CTAs/form | — | — | — | — |
| 3.5 Refinement | bolder/quieter, distill, extract, normalize | — | — | — | — | — | — |
| 4 QA | 7-layer audit | test E2E form→Supabase→notif | verificar eventos | — | — | — | — |
| 5 Deploy | Vercel deploy, nota de proyecto | activar workflow n8n | verificar prod | — | benchmark baseline | — | guardar receta |
| 6 Content | — | — | — | tokens del kit/web, piezas vía piezas-marca | — | — | — |
| 7 Handoff | — | — | — | — | canary monitoring | PDF + docs, MOMENTO 3 | — |

### Module Routing (orden de lectura por fase)
- Phase 1: `modules/web.md` §Phase1, luego `modules/recipes.md` §Phase1
- Phase 2: `modules/web.md` §Phase2, luego `modules/backend.md` §Phase2, luego `modules/analytics.md` §Phase2
- Phase 3: `modules/web.md` §Phase3, luego `modules/backend.md` §Phase3, luego `modules/analytics.md` §Phase3
- Phase 3.5: `modules/web.md` §Phase3.5 solamente
- Phase 4: `modules/web.md` §Phase4, luego `modules/backend.md` §Phase4, luego `modules/analytics.md` §Phase4
- Phase 5: `modules/web.md` §Phase5, luego `modules/monitor.md` §Phase5, luego `modules/recipes.md` §Phase5
- Phase 6: `modules/content.md` §Phase6
- Phase 7: `modules/handoff.md` §Phase7, luego `modules/monitor.md` §Phase7

Si un modulo NO esta activo, su columna se skipea silenciosamente.

### Status updates durante ejecucion
Formato: `"Phase N/7 — [Nombre] [modulos activos]"`
En error: `"Error en forge:backend Phase 2: [descripcion]. Auto-fixing..."`

---

## Conflict Resolution (CRITICO)

### Inter-module conflicts

| Conflicto | Resolucion |
|-----------|------------|
| Colores: web usa OKLCH, piezas usan HEX | `modules/content.md` convierte via culori en Phase 6 (con kit: tokens del kit mandan) |
| Fonts: web usa next/font, piezas usan @font-face | Mismos archivos de `fonts/` del kit — sin conflicto |
| Webhook URL necesaria antes del form | `modules/backend.md` crea workflow en Phase 2, form en Phase 3 |
| Campos form = columnas Supabase | Ambos derivan de client-brief.md §3 — fuente unica |
| Analytics scripts + componentes | Scripts en Phase 2 (layout.tsx), eventos en Phase 3 (componentes) |
| Content necesita web deployada | `modules/content.md` corre en Phase 6, DESPUES de deploy Phase 5 |

### Impeccable skills anti-conflicto

| Skill existente | Impeccable | Regla |
|---|---|---|
| `references/font-pairings.md` | `/typeset` | font-pairings ELIGE fuentes. typeset REFINA escala. Si typeset cambia fuente, IGNORAR |
| `brand-extractor` | `/colorize` | brand-extractor EXTRAE colores. colorize AGREGA acentos. Si cambia marca, IGNORAR |
| `references/animation-playbook.md` + `motion-design` | `/animate` | playbook da PATRONES. animate PULE timing. Si quita animacion del playbook, IGNORAR |
| `references/section-catalog.md` | `/arrange` | catalog define ESTRUCTURA. arrange REFINA spacing. Si cambia estructura, IGNORAR |
| `/humanise-text` | `/clarify` | humanise = suene humano. clarify = sea claro. Complementarios, en ese orden |
| `/frontend-design` | `/bolder` `/quieter` | frontend construye. bolder/quieter calibra. MAXIMO uno de los dos |
| `/design-review` | `/critique` | design-review = visual. critique = UX. Scopes distintos |
| `/qa` (visual) | `/audit` (tecnico) | qa = screenshots. audit = checks automatizados. Complementarios |
| Responsive manual | `/adapt` | manual = 3 viewports. adapt = edge cases entre viewports |
| Performance check | `/optimize` | check = detectar. optimize = FIXEAR. Complementarios |

### Principio maestro
Cuando una Impeccable skill contradice una decision del arquetipo, el playbook, o el manual de marca → **el arquetipo/playbook/marca GANAN siempre.** Las Impeccable skills refinan DENTRO de los limites ya establecidos.

---

## Pipeline visual completo

```
MOMENTO 1 — Discovery Interview
  └→ Bloques adaptativos 1-6 → client-brief.md → activacion de modulos → GO

MOMENTO 2 — Ejecucion Autonoma
  Phase 1 — Research [web] [recipes]
  Phase 2 — Foundation [web + backend + analytics]
  Phase 3 — Build [web + backend + analytics]
  Phase 3.5 — Refinement [web]
  Phase 4 — QA 7-Layer [web + backend + analytics]
  Phase 5 — Deploy [web + monitor + recipes]
  Phase 6 — Content Launch [content]
  Phase 7 — Handoff [handoff + monitor]

MOMENTO 3 — Entrega
  └→ Presentar todo → iterar sobre feedback → entrega final
```

---

## Comunicacion

- MOMENTO 1: Preguntar naturalmente. Agrupar preguntas relacionadas. No interrogar.
- MOMENTO 2: Una linea de status al inicio de cada fase. No preguntas. No aprobaciones.
- MOMENTO 3: Presentar todo. URL + screenshots + score + contenido + PDF.
  Preguntar: "¿Algo que quieras cambiar?"
- Si algo falla: explicar en 1 linea, corregir sin preguntar.
- Al final: URL de produccion + score + resumen completo de lo construido y entregado.
