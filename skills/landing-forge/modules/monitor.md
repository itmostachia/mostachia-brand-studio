# forge:monitor — Performance Baseline + Post-Deploy Canary

This module is loaded by the Forge orchestrator. Do not invoke directly.
Auto-activated when forge:web is active.

---

## Phase 5 — Deploy [forge:monitor]

### 5.1 Establish performance baseline
After Vercel deploy, invoke `/benchmark` on the production URL:
- Captures: page load time, LCP, FID, CLS, total resource size
- Saves baseline numbers for future comparison
- Include baseline in delivery summary (MOMENT 3)

### 5.2 Initial smoke test
Navigate to production URL with Playwright:
- Verify HTTP 200 status
- Verify 0 console errors
- Verify SSL certificate valid
- Verify all section IDs present in DOM (cross-reference with section plan)
- Verify smooth scroll works (Lenis loaded)
- Verify no broken images (check img elements for naturalWidth > 0)

---

## Phase 7 — Handoff [forge:monitor]

### 7.1 Post-deploy canary
Invoke `/canary` on the production URL:
- Monitor for: console errors, broken images, 404s, performance regressions
- Take screenshot and compare with pre-deploy baseline
- Report any anomalies in delivery summary

### 7.2 Recommended monitoring
Include in handoff:
- Suggest running `/canary` weekly or after any content update
- Baseline performance numbers from `/benchmark`
- Canary status: healthy | warning | critical

---

## Skills used
- `/benchmark` — performance baseline
- `/canary` — post-deploy monitoring
- Playwright CLI — smoke test

## Anti-conflict rules
- Runs AFTER deploy (Phase 5) — no interference with build or QA
- Smoke test is read-only — does not modify the deployed site
- Baseline numbers are informational — do not block deploy
