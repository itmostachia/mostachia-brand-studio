# Fotos con licencia libre — conseguir, registrar, tratar

## Fuentes (revisar la licencia de CADA imagen, no la del sitio)

| Fuente | Licencia típica | Crédito | Ojo |
|---|---|---|---|
| Unsplash | Unsplash License (uso comercial, sin atribución obligatoria) | recomendado | no vender la foto tal cual; no implicar respaldo de personas/marcas; logos y personas reconocibles pueden necesitar release |
| Pexels | Pexels License (similar) | recomendado | idem; revisar marcas registradas en la foto |
| Pixabay | Pixabay Content License | no obligatorio | no usar personas reconocibles de forma ofensiva ni como endorsement |
| Openverse | varía por imagen (CC0, CC BY, CC BY-SA, CC BY-NC…) | **obligatorio en CC BY/BY-SA** | descartar NC (no comercial) y ND si vas a modificar; BY-SA contagia la licencia a la derivada |

Nunca: Pinterest, Behance, Dribbble, Google Imágenes, Instagram → solo **inspiración** (y se analiza en
`03-referencias/ANALISIS.md`, no se reutiliza el archivo). Nada de logos, packaging ni productos de
terceros protagonistas.

## Cómo elegir (anti-stock)
- Nada de lifestyle genérico (gente sonriendo a la laptop, tazas, plantas, apretones de manos).
- Preferí **materia y detalle**: texturas, superficies, arquitectura, herramientas del oficio, luz dura.
- Una foto buena + tratamiento propio (duotono, recorte, grano) > tres fotos "lindas".
- Que el tratamiento sea sistemático (misma curva/duotono para toda la marca) → se vuelve un activo.

## Registro obligatorio: `03-referencias/FUENTES.csv`

```csv
archivo,fuente,url_pagina,autor,licencia,credito_requerido,modificada,uso,fecha
foto-textura-01.jpg,Unsplash,https://unsplash.com/photos/<id>,Nombre Autor,Unsplash License,no,duotono+recorte,board T07,2026-09-29
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
