---
name: brand-extractor
description: >
  Extrae identidad de marca de DOCX, PDF e imagenes.
  Colores (hex a OKLCH), tipografia, logo, tagline, tono de voz.
  Usado por landing-forge durante la fase de discovery.
allowed-tools: Read, Bash, Glob
---

# Brand Extractor

Agente especializado en extraer identidad visual y verbal de archivos de marca.

## Inputs aceptados

| Tipo | Como procesarlo |
|------|----------------|
| DOCX | `pip install python-docx` → script Python inline para texto + imagenes |
| PDF | Delegar a `/pdf` skill |
| PNG/JPG | Claude Vision via Read tool (analizar colores, logo, tipografia) |
| Texto directo | Parsear lo que el usuario pega en el chat |

## Proceso de extraccion

### 1. Colores
- Buscar menciones de hex (#RRGGBB) en texto
- Si hay imagenes de paleta: leer con Vision y extraer hex
- Convertir TODOS los hex a OKLCH:
```bash
node -e "
const { oklch, parse } = require('culori');
const colors = { nombre: '#HEXVAL' };
for (const [n, h] of Object.entries(colors)) {
  const c = oklch(parse(h));
  console.log(n + ': oklch(' + c.l.toFixed(3) + ' ' + (c.c||0).toFixed(3) + ' ' + (c.h||0).toFixed(1) + ')');
}
"
```
- Si `culori` no esta instalado: `npm install culori --save-dev`

### 2. Tipografia
- Buscar nombres de fuentes mencionados (Inter, Poppins, Montserrat, etc.)
- Identificar pesos usados (Regular, Medium, Semibold, Bold)
- Determinar si es Google Font o font local
- Si no hay font especificada: recomendar Inter (versatil, moderna, SaaS standard)

### 3. Logo
- Extraer imagenes del DOCX:
```python
from docx import Document
import os
doc = Document('archivo.docx')
for i, rel in enumerate(doc.part.rels.values()):
    if 'image' in rel.reltype:
        img = rel.target_part
        ext = os.path.splitext(img.partname)[1]
        with open(f'docs/brand/logo_{i}{ext}', 'wb') as f:
            f.write(img.blob)
```
- Analizar el logo con Vision: describir forma, colores, si tiene icono + texto
- Planificar componente SVG si el logo es simple, o usar imagen si es complejo

### 4. Tagline / Nombre
- Extraer nombre del producto y taglines del documento
- Identificar la propuesta de valor principal

### 5. Tono de voz
- Analizar el lenguaje del documento: formal, casual, tecnico, amigable
- Determinar si usan tu/vos/usted
- Identificar mercado target por el lenguaje

## Output

Objeto estructurado con toda la informacion extraida:

```
Brand:
  nombre: "Fluxo"
  tagline: "El flujo inteligente de tu despacho"
  colores:
    primary: { hex: "#1E3A8A", oklch: "oklch(0.379 0.138 265.5)", role: "navy" }
    secondary: { hex: "#22C55E", oklch: "oklch(0.723 0.192 149.6)", role: "green" }
    accent: { hex: "#38BDF8", oklch: "oklch(0.754 0.139 232.7)", role: "cyan" }
    dark: { hex: "#1F2937", oklch: "oklch(0.278 0.030 256.8)", role: "text" }
    light: { hex: "#F3F4F6", oklch: "oklch(0.967 0.003 264.5)", role: "bg" }
  tipografia:
    familia: "Inter"
    pesos: [400, 500, 600, 700]
    source: "google"
  logo:
    tipo: "icono + texto"
    archivos: ["docs/brand/logo.png"]
    descripcion: "Ala/flujo con gradiente verde a celeste"
  tono: "profesional pero accesible, usa 'tu'"
  mercado: "Mexico"
```

Guardar este resumen en `docs/brand/README.md`.
