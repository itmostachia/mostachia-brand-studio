# forge:analytics — GA4 + Meta Pixel + Event Tracking

This module is loaded by the Forge orchestrator. Do not invoke directly.
Reads: client-brief.md §4 (Analytics)

---

## Phase 2 — Foundation [forge:analytics]

### 2.1 Install Google Analytics 4
If GA4 Measurement ID provided in client-brief §4:

In `src/app/layout.tsx`, add GA4 via next/script:
```tsx
import Script from "next/script";

// Inside <head> or after <body>:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
  strategy="afterInteractive"
/>
<Script id="ga4-config" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA4_ID}');
  `}
</Script>
```

### 2.2 Install Meta Pixel
If Meta Pixel ID provided in client-brief §4:

In `src/app/layout.tsx`, add Meta Pixel:
```tsx
<Script id="meta-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${PIXEL_ID}');
    fbq('track', 'PageView');
  `}
</Script>
<noscript>
  <img height="1" width="1" style={{display:'none'}}
    src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
  />
</noscript>
```

### 2.3 Create analytics utility
Create `src/lib/analytics.ts` — wrapper that sends to both GA4 and Meta if configured:

```typescript
type EventParams = Record<string, string | number | boolean>;

export const trackEvent = (name: string, params?: EventParams) => {
  // GA4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", name, params);
  }
};

// Predefined events
export const trackCTAClick = (ctaName: string, section: string) =>
  trackEvent("cta_click", { cta_name: ctaName, section });

export const trackFormSubmit = (formName: string) => {
  trackEvent("generate_lead", { form_name: formName });
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", { content_name: formName });
  }
};

export const trackScrollDepth = (depth: number) =>
  trackEvent("scroll_depth", { depth: `${depth}%` });
```

Add TypeScript declarations for window.gtag and window.fbq in a `src/types/analytics.d.ts`.

---

## Phase 3 — Build [forge:analytics]

### 3.1 Event tracking on CTA buttons
On all CTA buttons identified by data-track="cta":
```tsx
import { trackCTAClick } from "@/lib/analytics";

onClick={() => trackCTAClick("solicitar-demo", "hero")}
```

### 3.2 Event tracking on form submit
In the contact/lead form component, on successful submission:
```tsx
import { trackFormSubmit } from "@/lib/analytics";

// After successful POST to webhook:
trackFormSubmit("contact-form");
```

### 3.3 Scroll depth tracking
In `src/hooks/use-scroll-depth.ts`:
- Use IntersectionObserver on section elements
- Fire trackScrollDepth(25), trackScrollDepth(50), etc. as user scrolls
- Each depth fires ONCE per session (use Set to track fired depths)

Import and use in layout or page component.

---

## Phase 4 — QA [forge:analytics]

### 4.1 Verify scripts load
Using Playwright, navigate to dev server:
- Check network requests to googletagmanager.com (GA4)
- Check network requests to connect.facebook.net (Meta Pixel)
- Verify 0 console errors from analytics scripts

### 4.2 Verify events fire
- Click a CTA → check window.dataLayer for cta_click event
- Submit form → check window.dataLayer for generate_lead event
- Scroll page → verify scroll_depth events at thresholds

---

## Phase 5 — Deploy [forge:analytics]

### 5.1 Post-deploy verification
After Vercel deploy, visit production URL:
- Verify GA4 real-time report shows the visit (if user has GA4 access)
- Verify no console errors related to analytics

---

## Skills used
- Documentación oficial de GA4 y Meta Pixel (WebFetch) si hace falta
- Playwright (verification)

## Anti-conflict rules
- Scripts install in layout.tsx using next/script (no conflict with other layout elements)
- Analytics utility is a separate file (src/lib/analytics.ts) — no coupling with components
- Events are added as onClick handlers — no interference with existing animations or interactions
- Scroll tracking uses IntersectionObserver — no conflict with Lenis smooth scroll
