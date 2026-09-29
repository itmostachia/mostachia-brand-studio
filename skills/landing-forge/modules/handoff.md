# forge:handoff — Client Delivery Package

This module is loaded by the Forge orchestrator. Do not invoke directly.
Reads: client-brief.md §6 (Handoff)
Runs in: Phase 7 (last — after all other modules complete)

---

## Phase 7 — Client Handoff [forge:handoff]

### 7.1 Gather all project data
Collect from project artifacts:

**Always available (from forge:web):**
- Production URL (from Vercel deploy)
- Repository local path
- Stack: Next.js + Tailwind + libraries used
- Archetype used + signature effect
- QA score (X/20) from Phase 4
- Screenshots at 375px, 768px, 1440px
- Sections implemented (list)
- Brand colors (HEX + OKLCH) and fonts

**Conditional (from other modules):**
- [forge:backend] Supabase table name + webhook URL + n8n workflow URL
- [forge:analytics] GA4 ID + Meta Pixel ID + events configured
- [forge:content] piezas de lanzamiento generadas (ruta de `07-aplicaciones/social/` o equivalente)
- [forge:monitor] Benchmark baseline numbers + canary status

### 7.2 Generate handoff PDF
Invoke `/pdf` skill to create a professional document.

**PDF Structure:**

1. **Cover page**
   - Project name + client logo
   - Date of delivery
   - "Entregado por {equipo/estudio}" (tomar de client-brief)

2. **Site overview**
   - Production URL
   - Screenshot (desktop)
   - Stack and technologies used
   - Sections implemented

3. **Design system**
   - Colors: primary, secondary, accent (HEX swatches)
   - Typography: heading font, body font, weights
   - Archetype used + signature effect description

4. **Credentials & Access** (if client-brief §6 includes credentials)
   - Vercel project URL
   - Supabase project URL + table name
   - n8n workflow URL + webhook endpoint
   - GA4 property ID + how to access
   - Meta Pixel ID + how to verify

5. **Analytics setup** (if forge:analytics active)
   - Events being tracked (table: event name, trigger, destination)
   - How to view in GA4 real-time
   - How to view in Meta Events Manager

6. **Content guide** (if forge:content active)
   - Plantillas de piezas usadas (tokens + HTML fuente)
   - How to generate new content: skill `piezas-marca` con el kit de la marca
   - Style JSON location
   - Generated content inventory

7. **Performance baseline** (if forge:monitor active)
   - LCP, FID, CLS, resource size
   - "Green" thresholds for each metric

8. **Quality report**
   - QA score: X/20 with category breakdown
   - Nose test results (10/10)
   - Responsive verification (3 viewports)

9. **Maintenance guide** (if client-brief §6 includes maintenance)
   - How to update content: edit `src/config/site.ts` → run `vercel deploy --prod --yes`
   - How to update images: replace in `public/images/`
   - How to add a section: create in `src/components/sections/` + import in `page.tsx`
   - Common tasks with exact commands

Save PDF to: `docs/handoff/{project_name}_handoff.pdf`

### 7.3 Final project note
Write complete project note at `docs/ENTREGA.md` in the project (and update the brand expediente `00-control/ESTADO.md` if there is one):
- All data from 7.1
- Link to handoff PDF
- Content pieces generated (if forge:content)
- Recipe data (archetype, libraries, signature, score)
- "Project complete" status
- Date

### 7.4 Trigger MOMENT 3 — Delivery
This is where the autonomous execution ends and the user reviews.

Present ALL outputs in a structured summary:
```
## Entrega: {project_name}

**Web:** {production_url}
**Score:** {X}/20 ✓
**Viewports:** ✓ mobile | ✓ tablet | ✓ desktop

[Si backend] **Formulario:** funcional → Supabase + {notificación}
[Si analytics] **Analytics:** GA4 + Meta Pixel configurados
[Si content] **Contenido:** {N} piezas generadas (ver carpeta de piezas)
[Si handoff] **PDF:** docs/handoff/{name}_handoff.pdf

¿Algo que quieras cambiar?
```

Iterate on feedback. User says specific changes → fix and re-deliver ONLY what changed.

---

## Skills used
- `/pdf` — generate professional PDF
- Write — project note directo a disco

## Anti-conflict rules
- Runs LAST (Phase 7) — all other modules must be complete
- PDF generation is read-only — does not modify any project files
- The project note complements (not replaces) the project's CLAUDE.md
- MOMENT 3 trigger is the ONLY point where user reviews the full delivery
