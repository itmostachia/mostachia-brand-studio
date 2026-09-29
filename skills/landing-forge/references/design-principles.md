# Design Principles — Anti-AI-Slop Manifesto

Reglas de diseno extraidas de Impeccable (pbakaus) y los mejores design systems.
Este documento existe para que NINGUNA landing se vea "hecha por AI".

---

## Los 10 mandamientos anti-generico

### 1. Nunca uses Inter como default sin pensar
Inter es la "Arial de 2024". Si no hay razon de marca para usarla, explorar alternativas:
- **Warm:** Figtree, Instrument Sans, General Sans
- **Technical:** Geist, Plus Jakarta Sans, Space Grotesk
- **Editorial:** Lora, Cormorant Garamond, Source Serif Pro
- **Premium:** Satoshi, Cabinet Grotesk, Outfit

### 2. Nunca uses colores genericos
- NO `bg-gray-100` sin customizar — definir gray scale con temperatura (warm/cool)
- NO `text-gray-500` para secondary — elegir un tono que combine con la marca
- NO gradientes genéricos `from-blue-500 to-purple-500` — usar colores de marca
- SI color-mix(), oklch(), gradientes custom con colores del cliente

### 3. Nunca uses shadows genéricos de Tailwind
- NO `shadow-md` o `shadow-lg` default de Tailwind
- SI multi-layer custom shadows (ver css-patterns.md)
- SI shadow-as-border para cards modernas
- SI blue-tinted shadows para fintech/enterprise

### 4. Nunca hagas "card soup"
- NO wrappear todo en cards con border y shadow
- SI usar spacing, tipografia y color para crear jerarquia
- SI mezclar layouts: bento grids, alternating rows, full-width breaks
- SI usar separadores tipograficos (numeros grandes, lineas, puntos)

### 5. Nunca uses animaciones genéricas
- NO `animate-bounce` de Tailwind
- NO easing `ease` generico — usar ease-out (enter), ease-in (exit)
- NO duraciones uniformes — escalar segun importancia (100ms micro → 500ms entrance)
- SI curvas exponenciales (quart-out), timing contextual, stagger delays
- SI respetar prefers-reduced-motion SIEMPRE

### 6. Nunca ignores la tipografia
- SIEMPRE activar OpenType features: kern, liga, ss01
- SIEMPRE definir letter-spacing scale para headlines
- SIEMPRE font-display: swap
- SIEMPRE fallback metrics con size-adjust
- NUNCA body text < 16px
- NUNCA line-length > 75ch sin max-width
- NUNCA letter-spacing positivo en body text

### 7. Nunca dejes el contraste al azar
- Body text: 4.5:1 MINIMO (7:1 para AAA)
- Large text: 3:1 MINIMO
- NUNCA gris claro sobre blanco (el error #1 de accesibilidad)
- NUNCA rojo/verde como unico diferenciador
- Testear con herramienta de contraste antes de shipear

### 8. Nunca hagas mobile como afterthought
- SIEMPRE disenar mobile-first (min-width media queries)
- SIEMPRE touch targets 44px minimo
- SIEMPRE testear en 375px, 768px, 1440px
- NUNCA hover-only functionality (touch no tiene hover)
- USAR `@media (pointer: coarse)` para touch-specific
- USAR `@media (hover: hover)` para hover-only styles

### 9. Nunca ignores los estados
Cada elemento interactivo necesita 8 estados:
1. Default
2. Hover (`:hover` con `@media (hover: hover)`)
3. Focus (`:focus-visible` — NUNCA `:focus` solo)
4. Active (`:active`)
5. Disabled (`[disabled]`)
6. Loading
7. Error
8. Success

### 10. Nunca seas predecible
- Romper la monotonia con UN elemento inesperado por landing
- Puede ser: un cursor custom, un efecto de scroll unico, una animacion signature
- NO significa "poner todo" — significa UN detalle memorable
- El "efecto signature" se elige en Phase 1 (Research) y se aplica de manera consistente

---

## Framework de evaluacion rapida (inspirado en Impeccable /audit)

Al terminar cada landing, evaluar en 5 dimensiones (0-4 cada una):

### 1. Unicidad (0-4)
- 0: Parece template generico
- 1: Tiene colores de marca pero layout generico
- 2: Tiene personalidad visual reconocible
- 3: Dificil de confundir con otra landing
- 4: Memorable, con identity propia y efecto signature

### 2. Craft (0-4)
- 0: Shadows/spacing/typography inconsistentes
- 1: Consistente pero basico
- 2: Detalles cuidados (tracking, shadow layers, radius scale)
- 3: Nivel profesional — cada pixel intencional
- 4: Nivel Awwwards — micro-detalles que sorprenden

### 3. Performance (0-4)
- 0: Layout shifts, janky scroll, > 5s LCP
- 1: Funcional pero lento (3-5s LCP)
- 2: Bueno (< 3s LCP, sin CLS)
- 3: Rapido (< 2.5s LCP, 60fps, optimizado)
- 4: Excelente (< 1.5s LCP, perfect CWV, animations GPU-only)

### 4. Accesibilidad (0-4)
- 0: Sin considerar (contrast failures, no keyboard nav)
- 1: Basico (contrast OK, algo de semantic HTML)
- 2: WCAG AA compliant
- 3: Bueno (reduced-motion, focus indicators, ARIA)
- 4: Excelente (screen reader tested, WCAG AAA, skip links)

### 5. Responsive (0-4)
- 0: Roto en mobile
- 1: Funcional pero feo en mobile
- 2: Bueno en 3 viewports
- 3: Bien adaptado con cambios de layout inteligentes
- 4: Nativo en cada dispositivo — parece hecho para ese viewport

**Score total:** /20
- 18-20: Listo para Awwwards
- 14-17: Profesional solid
- 10-13: Aceptable pero mejorable
- < 10: Requiere retrabajo

---

## Checklist pre-ship: "Nose Test"

Antes de deployar, el orquestador debe pasar este test rapido:

- [ ] Si tapo el logo, puedo distinguir esta landing de las demas? (unicidad)
- [ ] Los headings tienen tracking custom, no default? (craft)
- [ ] Las shadows son multi-layer o custom, no shadow-md? (craft)
- [ ] Hay UN efecto signature memorable? (unicidad)
- [ ] Mobile se siente nativo, no "desktop encogido"? (responsive)
- [ ] Puedo navegar todo con keyboard? (accesibilidad)
- [ ] Los textos NO suenan roboticos? (content)
- [ ] Las animaciones son suaves y tienen proposito? (performance)
- [ ] El scroll es smooth (Lenis)? (performance)
- [ ] El build pasa sin warnings? (code quality)
