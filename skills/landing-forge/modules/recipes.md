# forge:recipes — Project Template System

This module is loaded by the Forge orchestrator. Do not invoke directly.
Auto-activated when forge:web is active.
Storage: carpeta de recetas del equipo, `$LANDING_FORGE_RECETAS` (default `./recetas-landing/` junto a los proyectos). Un `.md` por proyecto.

---

## Phase 1 — Research [forge:recipes]

### 1.1 Consult past projects
Before selecting archetype, components, and signature effect:

1. Search the recipe notes in `$LANDING_FORGE_RECETAS` (default `./recetas-landing/` junto a los proyectos) for projects in the same industry
2. Read the `## Recipe` section of matching project notes
3. If a past project in the same industry exists:
   - Note which archetype was used → recommend a DIFFERENT one
   - Note which component libraries were used → rotate to different ones
   - Note which signature effect was used → pick a different one
   - Show the user: "Found recipe from {project}: archetype {X}, score {Y}/20. Recommending different archetype for variety."

### 1.2 Apply anti-repetition rules
Read the last 3 project notes (sorted by date):
- Extract: archetype, background library, signature effect
- Apply rules:
  - NO same archetype 2 projects in a row
  - NO same background library 2 projects in a row
  - NO same signature effect 2 projects in a row
- If collision detected → flag to research phase for alternative selection
- Log which alternatives are available

### 1.3 Suggest recipe reuse (when beneficial)
If a past project in the SAME industry scored ≥ 17/20:
- Suggest: "Recipe from {project} scored {score}. Want to use it as starting point?"
- If yes: pre-fill section plan, component selection, CSS patterns from the recipe
- User can still modify anything — recipe is a suggestion, not a constraint

---

## Phase 5 — Deploy [forge:recipes]

### 5.1 Save project recipe
After successful deploy (score ≥ 16/20), write the project recipe note (`<recetas>/<proyecto>.md`):

```markdown
## Recipe
- **Industry:** {industry}
- **Archetype:** {archetype_name} ({mix if 80/20})
- **Component libraries:**
  - Background: {library}
  - Text effects: {library}
  - Section components: {library}
  - Signature effect: {effect_name} ({library})
- **CSS patterns:** {comma-separated list}
- **Sections:** {count} ({types list})
- **Font pairing:** {heading} + {body}
- **QA score:** {score}/20
- **Date:** {date}
- **Modules active:** {list of forge: modules used}
```

### 5.2 Update variety tracker
In the same recipe note, append to `## Variety History`:
```markdown
## Variety History
- Archetype: {name} (last used: {date})
- Background lib: {name}
- Signature: {effect}
```

This data is consumed by Phase 1.1 of the NEXT project.

---

## Skills used
- Write/Read directos sobre la carpeta de recetas (sin MCPs)

## Anti-conflict rules
- Recipes are SUGGESTIONS — the user always has final say
- Anti-repetition rules apply to the AUTOMATED selection, not to explicit user choices
  (if user says "I want Warm Literary again", use it regardless of anti-repetition)
- Recipe data is READ-ONLY during Phase 1 — never modifies past project notes
- Recipe is WRITTEN in Phase 5 — after deploy confirms success
