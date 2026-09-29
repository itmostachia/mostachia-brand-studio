# Conversion Patterns — Copy frameworks + UX de conversion

Patterns de copywriting y UX que maximizan conversion en landing pages.
Complementa a `/humanise-text` con frameworks especificos para landing.

---

## Copy Frameworks para cada seccion

### Hero — Framework AIDA
**A**tencion → **I**nteres → **D**eseo → **A**ccion

```
Headline (Atencion): Una frase que capture el problema o la aspiracion
  → "Simplifica tu gestion contable"
  
Subheadline (Interes): Como lo logras / que hace diferente
  → "Software con IA que automatiza el 80% del trabajo manual"
  
Social proof (Deseo): Numero o evidencia que genera confianza
  → "Usado por 500+ despachos en Mexico"
  
CTA (Accion): Verbo + beneficio, NO "Registrate"
  → "Empieza gratis" / "Ver demo" / "Probalo 14 dias"
```

### Pain Points — Framework PAS
**P**roblema → **A**gitacion → **S**olucion

```
Titulo seccion: "Lo que tu despacho enfrenta hoy"

Card 1 (Problema): Nombrar dolor especifico
  → "Errores en declaraciones"
  
Card 1 (Agitacion): Consecuencia emocional
  → "Multas, clientes insatisfechos, noches sin dormir"
  
Card 1 (Solucion implícita): Lo que ellos quieren
  → "Validacion automatica antes de enviar al SAT"
```

### Features — Framework FAB
**F**eature → **A**dvantage → **B**enefit

```
Feature: "Motor de IA integrado"
Advantage: "Analiza patrones en tus datos automaticamente"  
Benefit: "Toma decisiones informadas en segundos, no horas"
→ El titulo de la card es el BENEFIT, no el feature
```

### Pricing — Framework Value Anchoring

```
1. Mostrar precio mas caro primero (si hay 3 planes)
   O mostrar el recomendado en el medio (psicologia del centro)
2. Highlight del plan recomendado (borde, badge "Popular", color)
3. Anchor de valor: "Ahorra X horas/semana" o "vs contratar un contador"
4. CTA del plan recomendado: Color accent. Otros: ghost/outline
5. Incluir garantia: "14 dias gratis" / "Sin tarjeta" / "Cancela cuando quieras"
```

### CTA Final — Framework Urgencia + Facilidad

```
Titulo: Beneficio final (NO "Contactanos")
  → "Transforma tu despacho desde hoy"
  
Subtitulo: Eliminar friccion
  → "Setup en 5 minutos. Sin tarjeta de credito."
  
CTA primario: Accion + beneficio
  → "Empezar prueba gratuita"
  
CTA secundario: Compromiso menor
  → "Agendar demo" / "Ver video"
```

---

## UX Patterns de conversion

### Above the fold (sin scroll)
Estos elementos DEBEN ser visibles sin scrollear:
- [ ] Headline que explica que haces
- [ ] Subheadline que explica para quien
- [ ] CTA primario (color accent, grande)
- [ ] Social proof minimo (logos, numero de clientes, rating)
- [ ] Visual (screenshot, video thumbnail, ilustracion)

### CTA Placement Rules
1. **Hero:** CTA primario + secundario (demo/video)
2. **Despues de Pain Points:** CTA contextual "Soluciona esto ahora"
3. **Despues de Features/Pricing:** CTA de conversion
4. **CTA Final section:** Full-width, ultimo push antes de footer
5. **Sticky CTA mobile:** Boton fijo en bottom (aparece despues de hero scroll)
6. **MINIMO 3 CTAs** por landing, **MAXIMO 6** (no spammear)

### Trust Signals — Donde ponerlos
| Signal | Ubicacion | Efecto |
|---|---|---|
| Logos de clientes | Justo debajo del hero | Credibilidad inmediata |
| Numero de usuarios | Hero o trust bar | Social proof cuantitativo |
| Rating (stars) | Hero o trust bar | Calidad percibida |
| Testimonials | Despues de features | Confirmacion de valor |
| Garantia/free trial | Pricing + CTA final | Reducir riesgo |
| Certificaciones | Footer o about | Autoridad |
| "Sin tarjeta" | Junto a CTA | Eliminar friccion |

### Form Optimization
- Pedir MINIMO de campos (nombre + email para leads)
- CTA del form: verbo especifico, NO "Enviar"
  → "Obtener acceso" / "Reservar demo" / "Descargar guia"
- Mostrar beneficio junto al form: "Respuesta en 24hs" / "Demo personalizada"
- Labels visibles (no solo placeholder)
- Validacion inline (no esperar submit)
- Mobile: inputs full-width, keyboard correcto (type="email", type="tel")

---

## Copy Rules (anti-AI-slop para textos)

### DO
- Usar numeros especificos: "Ahorra 12 horas/semana" > "Ahorra tiempo"
- Hablar en segunda persona: "Tu despacho" > "Los despachos"
- Usar verbos de accion: "Automatiza" > "Solucion de automatizacion"
- Una idea por oracion
- Parrafos de max 3 lineas
- Bullet points para listas de 3+ items

### DON'T
- "Revolucionario", "Innovador", "De clase mundial" (buzzwords vacias)
- "Solucion integral", "Plataforma holistica" (corporatespeak)
- "Nuestro equipo de expertos" (no es sobre vos, es sobre el cliente)
- Oraciones de 30+ palabras
- Parrafos de 5+ lineas
- Exclamaciones excesivas!!!
- Emojis en copy principal (solo en badges/labels si aplica)

### Headline Formulas que funcionan
1. **Resultado + timeframe:** "Cierra tu contabilidad mensual en 2 horas"
2. **Eliminar dolor:** "Nunca mas te quedes hasta tarde por una declaracion"
3. **Aspiracional:** "El despacho contable que siempre quisiste tener"
4. **Pregunta:** "¿Cuanto tiempo perdés en tareas repetitivas?"
5. **How-to:** "Como los despachos top automatizan su gestion"
6. **Social proof:** "500+ despachos ya simplificaron con Fluxo"

---

## Multi-page Support

### Cuando usar multi-page vs single-page

| Criterio | Single-page | Multi-page |
|---|---|---|
| Producto simple (1-2 features) | Si | No |
| Producto complejo (5+ modulos) | Posible | Recomendado |
| Audiencia tecnica que investiga | No | Si |
| SEO como canal principal | No | Si (mas keywords) |
| Landing para ads/campaña | Si | No |

### Estructura multi-page sugerida

```
/ (home)          → Landing principal (hero + resumen)
/features         → Detalle de features/modulos
/pricing          → Pricing completo con comparacion
/about            → Historia, equipo, valores
/contact          → Formulario de contacto
/blog             → Si hay contenido (SEO)
/[feature-slug]   → Pagina por feature para SEO
```

### Implementacion Next.js App Router

```
src/app/
  layout.tsx         # Layout compartido (header, footer, fonts)
  page.tsx           # Landing home
  features/
    page.tsx         # Features page
  pricing/
    page.tsx         # Pricing page
  contact/
    page.tsx         # Contact page
```

### Regla: compartir componentes
- Header y Footer: compartidos via layout
- SectionWrapper: reutilizable en todas las paginas
- Componentes de seccion: importables donde se necesiten
- `site.ts` puede tener sub-objetos por pagina

---

## A/B Testing Considerations

### Elementos mas impactantes para testear
1. **Headline** (mayor impacto en conversion)
2. **CTA copy** ("Empieza gratis" vs "Ver demo" vs "Probar ahora")
3. **CTA color** (accent vs contraste)
4. **Hero layout** (izquierda-derecha vs centrado)
5. **Social proof** (logos vs numeros vs testimonials)
6. **Pricing presentation** (3 plans vs 2 vs slider)

### Implementacion simple (sin tools externos)
```tsx
// Variante simple con query param o cookie
const variant = searchParams?.get('v') === 'b' ? 'B' : 'A';

// Hero A
{variant === 'A' && <HeroVariantA />}
// Hero B  
{variant === 'B' && <HeroVariantB />}

// Tracking: UTM params + analytics event
```

### Tools recomendados (si necesitas mas)
- Vercel Edge Config + Flags SDK (built-in)
- PostHog (open source, feature flags + analytics)
- Google Optimize alternatives (GrowthBook, Statsig)
