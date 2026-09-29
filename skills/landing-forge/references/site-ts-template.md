# Template: src/config/site.ts

Estructura TypeScript para centralizar todo el contenido de la landing. Copiar y adaptar.

```typescript
export const siteConfig = {
  name: "NOMBRE_PRODUCTO",
  tagline: "TAGLINE_PRINCIPAL",
  description: "DESCRIPCION_SEO_150_CHARS",
  url: "https://DOMINIO.com",

  nav: [
    { label: "Inicio", href: "#hero" },
    { label: "Modulos", href: "#modulos" },
    // ... agregar segun secciones
    { label: "Contacto", href: "#contacto" },
  ],

  hero: {
    headline: "HEADLINE_PRINCIPAL_IMPACTANTE",
    rotatingWords: ["Palabra1", "Palabra2", "Palabra3"],
    subheadline: "SUBTITULO_QUE_EXPLICA_EL_PRODUCTO",
    cta: {
      primary: { label: "CTA_PRIMARIO", href: "#contacto" },
      secondary: { label: "CTA_SECUNDARIO", href: "#demo" },
    },
    stats: [
      { value: 10, suffix: "+", label: "STAT_1" },
      { value: 50, suffix: "+", label: "STAT_2" },
      { value: 100, suffix: "%", label: "STAT_3" },
    ],
  },

  trustBar: {
    items: ["Trust1", "Trust2", "Trust3", "Trust4", "Trust5"],
  },

  painPoints: {
    title: "TITULO_PROBLEMA",
    subtitle: "SUBTITULO_EMPATICO",
    items: [
      { icon: "LUCIDE_ICON_NAME", title: "DOLOR_1", description: "DESC_1" },
      // ... 3-4 items
    ],
  },

  solution: {
    title: "TITULO_SOLUCION",
    subtitle: "SUBTITULO",
    pillars: [
      { icon: "ICON", title: "PILAR_1", description: "DESC" },
      { icon: "ICON", title: "PILAR_2", description: "DESC" },
      { icon: "ICON", title: "PILAR_3", description: "DESC" },
    ],
  },

  modules: [
    {
      icon: "ICON",
      title: "MODULO",
      description: "DESC",
      features: ["Feature1", "Feature2", "Feature3"],
      hasAI: false,
      size: "large" as const, // "large" | "medium" | "standard"
    },
    // ... todos los modulos
  ],

  ai: {
    title: "TITULO_IA",
    subtitle: "SUBTITULO",
    features: [
      { title: "FEATURE_IA_1", description: "DESC" },
      // ... 4-5 features
    ],
  },

  demo: {
    title: "TITULO_DEMO",
    subtitle: "SUBTITULO",
    videoUrl: "", // YouTube/Vimeo URL o vacio para placeholder
    videoPlaceholder: true,
  },

  pricing: {
    title: "TITULO_PRECIOS",
    subtitle: "SUBTITULO",
    plans: [
      {
        name: "PLAN_1",
        price: 0,
        currency: "USD",
        period: "mes",
        description: "DESC",
        features: ["F1", "F2", "F3"],
        cta: "Comenzar",
        highlighted: false,
      },
      {
        name: "PLAN_2",
        price: 0,
        currency: "USD",
        period: "mes",
        description: "DESC",
        features: ["F1", "F2", "F3"],
        cta: "Comenzar",
        highlighted: true,
        badge: "Mas popular",
      },
      // ... plan 3
    ],
  },

  faq: [
    { question: "PREGUNTA_1", answer: "RESPUESTA_1" },
    // ... 6-8 preguntas
  ],

  cta: {
    title: "TITULO_CTA_FINAL",
    subtitle: "SUBTITULO",
    primary: { label: "CTA_PRIMARIO", href: "#contacto" },
    secondary: { label: "CTA_SECUNDARIO", href: "#contacto" },
  },

  contact: {
    title: "Hablemos",
    subtitle: "DESC",
    email: "EMAIL",
    phone: "TELEFONO",
    whatsapp: "NUMERO_SIN_+",
    address: "CIUDAD, PAIS",
    social: { instagram: "", linkedin: "", twitter: "" },
  },

  footer: {
    tagline: "TAGLINE",
    links: {
      producto: [
        { label: "LINK", href: "#seccion" },
      ],
      empresa: [
        { label: "LINK", href: "#seccion" },
      ],
    },
  },
} as const;
```

**Notas:**
- Iconos: usar nombres de Lucide React (LayoutDashboard, Building2, CalendarCheck, etc.)
- Sizes de modulos: "large" ocupa 2 columnas en bento grid, "medium" y "standard" 1 columna
- `as const` al final para TypeScript inference
