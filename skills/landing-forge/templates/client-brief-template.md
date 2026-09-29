# Client Brief — {{PROJECT_NAME}}

Generado: {{DATE}}
Modo entrevista: Express | Full

---

## 1. Esencial

- **Nombre del proyecto:**
- **Producto/empresa:**
- **Qué hace (1-2 oraciones):**
- **Audiencia target:**
- **Industria/rubro:**
- **Docs de marca:** (rutas a DOCX/PDF/imágenes, o "no tiene")
- **URLs de referencia:** (URLs o "auto-detect")
- **Tono de voz:** (profesional, cercano, técnico, casual, etc.)

## 2. Web — Configuración

- **Activo:** sí
- **Modo:** crear | clonar+adaptar | clonar+mejorar
- **URL a clonar:** (si modo 2/3)
- **Preferencia de estilo:** (arquetipo sugerido o "auto")
- **Secciones deseadas:** (lista o "auto según investigación")
  - [ ] Hero
  - [ ] Social Proof / Trust Bar
  - [ ] Pain Points
  - [ ] Solución / Propuesta de valor
  - [ ] Features / Módulos
  - [ ] Tecnología / IA
  - [ ] Demo / Video
  - [ ] Pricing
  - [ ] Testimonios
  - [ ] FAQ
  - [ ] CTA Final
  - [ ] Contacto
  - [ ] Otras: ___
- **Pricing/planes:** sí/no + detalles
- **Dark mode:** sí | no | secciones alternadas
- **Multi-page:** no (landing single-page) | sí (especificar páginas)

## 3. Backend (Formularios / Leads)

- **Activo:** sí | no
- **Tipo de formulario:** contacto | lead-capture | newsletter | encuesta | custom
- **Campos del formulario:**
  - [ ] Nombre (TEXT, required)
  - [ ] Email (TEXT, required)
  - [ ] Teléfono (TEXT, optional)
  - [ ] Empresa (TEXT, optional)
  - [ ] Mensaje (TEXTAREA, optional)
  - [ ] Custom: ___
- **Canal de notificación:** email | whatsapp | telegram | slack
- **Email del admin:** (para recibir notificaciones)
- **Nombre tabla Supabase:** (default: "leads")
- **Honeypot anti-spam:** sí (default)
- **UTM tracking:** sí (default) — captura utm_source, utm_medium, utm_campaign

## 4. Analytics

- **Activo:** sí | no
- **Google Analytics 4 ID:** (ej: G-XXXXXXXXXX, o "no tiene")
- **Meta Pixel ID:** (ej: 123456789, o "no tiene")
- **Eventos a trackear:**
  - [ ] form_submit — envío de formulario
  - [ ] cta_click — clicks en botones CTA
  - [ ] scroll_depth — 25%, 50%, 75%, 100%
  - [ ] page_view — (automático con GA4)
  - [ ] Custom: ___

## 5. Contenido (post-deploy)

- **Activo:** sí | no
- **Kit de marca disponible (Brand Studio `06-kit/`):** sí (ruta) | no
- **Formatos de piezas:** post 1080×1350 | story 1080×1920 | LinkedIn 1200×627 | OG 1200×630
- **Handle de Instagram:** @___
- **Formatos solicitados:**
  - [ ] Carruseles: ___ cantidad (default: 2)
  - [ ] Posts: ___ cantidad (default: 2)
  - [ ] Stories: ___ cantidad (default: 3)
  - [ ] Video Remotion: ___ cantidad (default: 1)
- **Temas sugeridos para contenido:** (ej: "lanzamiento de la web", "features principales", etc.)
- **Estilo visual:** (auto desde la web | especificar)

## 6. Entrega (Handoff)

- **Activo:** sí | no
- **PDF de entrega:** sí | no
- **Incluir en PDF:**
  - [ ] Credenciales y accesos (Vercel, Supabase, n8n)
  - [ ] Setup de analytics (GA4, Meta Pixel)
  - [ ] Guía de contenido (cómo generar más)
  - [ ] Guía de mantenimiento (cómo actualizar textos)
  - [ ] Todo lo anterior
- **Nombre/email del destinatario:** (opcional)

## 7. Monitoreo

- **Activo:** auto (si forge:web activo)
- **Benchmark baseline:** sí (default)
- **Canary post-deploy:** sí | no
- **Duración canary:** 24hs (default) | custom

---

## Módulos Activados

(auto-completado según secciones marcadas Active: sí)

- [x] forge:web (siempre activo)
- [ ] forge:backend
- [ ] forge:analytics
- [ ] forge:content
- [x] forge:monitor (auto si forge:web activo)
- [ ] forge:handoff
- [x] forge:recipes (auto si forge:web activo)

---

## Notas adicionales

(Cualquier cosa que el usuario haya mencionado y no encaje en las secciones anteriores)
