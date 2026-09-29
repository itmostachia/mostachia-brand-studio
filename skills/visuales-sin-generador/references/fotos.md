# Fotos de internet — conseguir, registrar, tratar

**Política del equipo:** las marcas que se arman con este repo son de uso interno, así que se puede usar
**cualquier foto de internet** — Pinterest, Google Imágenes, Behance, bancos (Unsplash, Pexels, Pixabay),
capturas — y adaptarla a la marca. No hace falta chequear licencias.

Dónde buscar rápido: Pinterest y Google Imágenes (volumen y estética), Unsplash / Pexels (alta resolución),
Behance / Savee / Cosmos (dirección de arte). Bajá la versión más grande disponible.

Reglas que sí quedan:
- **Registrá el origen** en `03-referencias/FUENTES.csv` (URL o "captura"): sirve para volver a la
  fuente, conseguir mejor resolución o reemplazarla si algún día la pieza sale a la calle.
- **No se copia la identidad de otra marca**: logos, símbolos o packaging ajenos no pasan a ser nuestros.
  Una foto sí; el logo de otro, no.
- Si una marca después se publica comercialmente para un cliente, avisá en `ESTADO.md` qué fotos
  convendría reemplazar por propias o de banco (una línea, sin frenar el trabajo).

## Cómo elegir (anti-stock)
- Nada de lifestyle genérico (gente sonriendo a la laptop, tazas, plantas, apretones de manos).
- Preferí **materia y detalle**: texturas, superficies, arquitectura, herramientas del oficio, luz dura.
- Una foto buena + tratamiento propio (duotono, recorte, grano) > tres fotos "lindas".
- Que el tratamiento sea sistemático (misma curva/duotono para toda la marca) → se vuelve un activo.

## Registro obligatorio: `03-referencias/FUENTES.csv`

```csv
archivo,fuente,url_pagina,autor,licencia,credito_requerido,modificada,uso,fecha
foto-textura-01.jpg,Pinterest,https://pinterest.com/pin/<id>,-,uso interno,no,duotono+recorte,board T07,2026-09-29
```
- `url_pagina` = página pública de la foto (nunca URLs firmadas ni de CDN con token).
- Si `credito_requerido = si`: el crédito va en la pieza o en los créditos de la web/brand book
  ("Foto: Autor / Fuente, CC BY 4.0").
- Descargá al expediente (`03-referencias/entrada/` o la carpeta de la pieza); no hotlinkees en entregables.

## Tratamiento
Recetas 12 y 13 de `recetas.md` (duotono SVG/CSS, `sharp` en batch). Color grade con
`feColorMatrix`/`feComponentTransfer` a partir de los hex de la paleta; siempre terminar con grano y
revisar que el texto sobre la foto pase contraste (`tools/contraste.py` sobre el color dominante de la
zona, o poné un velo de `--tinta` al 40–60 %).
