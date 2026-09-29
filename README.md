# MostachIA Brand Studio

Sistema para que **Claude Code o Codex creen marcas completas**, del nombre a la web, con un método probado
en rebrandings reales y todas las skills de diseño, motion y 3D instaladas de una.

```
"Necesitamos marca para el proyecto de abogados"
        │
        ▼
 1. Brief + expediente ─► 2. Naming (si no hay nombre) ─► 3. Referencias (Pinterest, Behance…)
        │
        ▼
 4. 12–18 territorios visuales completos ─► galería comparadora + PDF ─► 🗳 el equipo vota
        │
        ▼
 5. Kit final (logos, colores, tipografías, tokens, brand book) ─► 6. Web, posts, flyers,
    presentaciones, mockups ─► 7. QA visual ─► 8. Entrega (ZIP + manifiesto + Drive opcional)
```

## Empezar

1. Clonar el repo y pedirle a tu agente: **"instalá mostachia-brand-studio siguiendo INSTALL.md"**.
2. Después, en cualquier sesión: **"creá la marca de <proyecto>"**. La skill `crear-marca` hace el resto
   y frena en los puntos donde decide el equipo (nombre, votación de territorios, aprobación final).

## Qué trae

| Carpeta | Contenido |
|---|---|
| `skills/` | Skills propias: `crear-marca` (orquestador), `naming-marca`, `territorios-marca`, `kit-marca`, `piezas-marca`, `web-marca`, `landing-forge`, `visuales-sin-generador`, `web-3d`, `humanise-text` |
| `docs/` | `METODO.md` (el playbook), `PRINCIPIOS-ESTETICOS.md` (doctrina anti-genérica + clichés prohibidos por rubro), `PROMPTS-IMAGEN.md`, `LECCIONES.md`, `CONTRATO.md` |
| `tools/` | Render HTML→PNG/PDF, QA de layout, contraste WCAG, armado del kit, hojas de contacto, empaquetado con manifiesto |
| `templates/` | Expediente de marca, galería comparadora offline, exploración de territorios, brand book, deck, piezas sociales |
| `upstream.json` | Skills de terceros que instala el setup, fijadas a un commit (Impeccable, taste-skill, GSAP, motion-design, wondelai, marketingskills, Anthropic, ui-ux-pro-max, Three.js y shaders opcionales) |

## Imágenes: Codex vs Claude

- **Codex:** usa la generación de imágenes nativa incluida en el plan de cada uno.
- **Claude Code:** **sin generadores ni API keys.** Todo se diseña en código (SVG, HTML/CSS, canvas,
  Three.js) y se renderiza, más fotografía con licencia libre. Ver `skills/visuales-sin-generador/examples/`.

## Reglas de la casa

- Muchas propuestas, realmente distintas y comparables. El equipo elige, nunca el agente.
- Nada genérico: ni stock de tazas y plantas, ni robots y glow violeta para "IA", ni balanzas para abogados.
- Se mira el resultado renderizado antes de entregar.

Licencia MIT (código y docs propios). Las skills de terceros conservan su licencia: ver `THIRD_PARTY.md`.
