# Section Catalog — Landing Page Sections

Catalogo de secciones disponibles para landing pages. Leer este archivo al planificar la estructura.

## Secciones Core (casi siempre necesarias)

### 1. Hero
**Cuando:** Siempre. Es la primera impresion.
**Contenido:** Headline, subheadline con palabra rotativa, 2 CTAs (primario + secundario), stats de confianza, visual abstracto o producto.
**Animacion:** GSAP timeline stagger para texto, morphing word rotate (blur transition), floating elements con orbita, aurora/gradient background.
**Componentes:** ShimmerButton, WordRotate/MorphingText, Particles.

### 2. Social Proof / Trust Bar
**Cuando:** Siempre. Va justo debajo del hero para credibilidad inmediata.
**Contenido:** Trust badges (seguridad, soporte, certificaciones), stats con numeros, logos de clientes/integraciones.
**Animacion:** Marquee infinito dual-direction, spring-physics number counters.
**Componentes:** Marquee, NumberTicker.

### 3. Pain Points / Problema
**Cuando:** El producto resuelve dolores claros del cliente.
**Contenido:** Titulo empático ("¿Suena familiar?"), 3-4 cards con icono + titulo + descripcion del dolor.
**Animacion:** Stagger reveal con ScrollTrigger, hover color shift (red→green = problema→solucion).
**Componentes:** Cards custom con borde rojo warning.

### 4. Solution / Propuesta de Valor
**Cuando:** Siempre. Transicion de problema a solucion.
**Contenido:** Tagline fuerte, 3 pilares/beneficios principales, conectores visuales.
**Animacion:** Gradient text shimmer, beam connectors con traveling dots, orbiting icons.
**Componentes:** AnimatedBeam, OrbitingCircles.

### 5. Features / Modulos
**Cuando:** El producto tiene multiples funcionalidades.
**Contenido:** Bento grid con cards de diferente tamano. Titulo, descripcion, bullet features, badge IA si aplica.
**Animacion:** Magic card spotlight (radial gradient siguiendo mouse), conic-gradient border rotate, cascade reveal con rotacion.
**Componentes:** BentoGrid, MagicCard, BorderBeam, Badge.

### 6. Pricing
**Cuando:** Hay precios definidos (no "contactar para cotizar").
**Contenido:** 2-3 plan cards con nombre, precio, features, CTA. Plan destacado con badge.
**Animacion:** Neon border rotante en plan destacado, spring-physics price counter, SVG path-draw checkmarks.
**Componentes:** NeonGradientCard, NumberFlow, Card.

### 7. FAQ
**Cuando:** Casi siempre. Reduce friccion antes del CTA final.
**Contenido:** 6-8 preguntas frecuentes en accordion.
**Animacion:** Stagger reveal, smooth height animation en open/close.
**Componentes:** Accordion (shadcn).

### 8. CTA Final
**Cuando:** Siempre. Ultimo empujon antes del footer.
**Contenido:** Titulo grande, subtitulo, 2 botones (primario + secundario).
**Animacion:** Gradient background limpio, spotlight mouse-following, fade-up reveal.
**Componentes:** ShimmerButton.

### 9. Contact Form
**Cuando:** El modelo es contacto directo (no self-serve).
**Contenido:** Form (nombre, email, empresa, tel, mensaje) + info de contacto (email, tel, WhatsApp, ubicacion).
**Animacion:** Stagger form fields, hover focus effects.
**Componentes:** Input, Textarea, Label (shadcn).

## Secciones Opcionales

### 10. Technology / IA Showcase
**Cuando:** El producto tiene un diferenciador tecnico fuerte (IA, blockchain, etc).
**Contenido:** Titulo + visualizacion abstracta + lista de capacidades.
**Animacion:** Dark section, animated beams, node diagrams, particle effects, text decode.
**Nota:** Usar como seccion "dark" para romper el ritmo visual.

### 11. Demo / Video
**Cuando:** Hay video del producto o se quiere mostrar la UI.
**Contenido:** Video embed o placeholder con frame tipo laptop/browser.
**Animacion:** 3D perspective scroll (rotateX scrub), browser chrome frame.
**Componentes:** ContainerScroll.

### 12. Testimonials
**Cuando:** Hay testimonios reales de clientes.
**Contenido:** Quotes con foto, nombre, cargo, empresa.
**Animacion:** Infinite moving cards carousel o grid con hover.
**Componentes:** InfiniteMovingCards, Marquee.

### 13. About / Team
**Cuando:** El equipo es un selling point (fundadores reconocidos, equipo grande).
**Contenido:** Fotos, nombres, cargos, bio breve.

### 14. Integrations / Partners
**Cuando:** El producto se integra con herramientas conocidas.
**Contenido:** Logo grid de integraciones.
**Animacion:** Logo marquee infinito.

### 15. Comparison Table
**Cuando:** Hay competidores directos y se quiere comparar feature-by-feature.
**Contenido:** Tabla con check/cross por feature vs competidores.

### 16. Timeline / Roadmap
**Cuando:** Producto en beta/early stage que quiere mostrar vision.
**Contenido:** Timeline vertical/horizontal con hitos.

### 17. Blog Preview
**Cuando:** Hay blog activo con contenido relevante.
**Contenido:** 3 ultimos articulos con imagen, titulo, excerpt.

### 18. Newsletter Signup
**Cuando:** Se quiere capturar emails antes del lanzamiento.
**Contenido:** Input de email + CTA simple.

## Orden narrativo recomendado

```
Hero → Social Proof → Pain Points → Solution → Features →
[Tech/AI] → [Demo] → Pricing → [Testimonials] → FAQ → CTA → Contact
```

Las secciones entre [] son opcionales. El orden puede variar segun el producto.
