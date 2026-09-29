---
name: kit-marca
description: Fase kit del método — después de que el equipo eligió un territorio (o una fusión), cierra el sistema de logo (símbolo, wordmark, lockups, área de resguardo, tamaño mínimo, usos incorrectos), fija paleta y tipografías en brand.config.json, genera 06-kit con build-brand-kit, escribe GUIA-RAPIDA y AUDITORIA-IDENTIDAD con tabla WCAG, arma el brand book PDF, valida, hace QA visual, empaqueta y deja el mensaje para el equipo. Usar cuando digan "ya elegimos", "armá el kit", "cerrá el logo", "logos finales", "paleta y tipografías finales", "tokens", "brand book", "manual de marca", "pasalo a kit", "entregá la identidad".
---

# kit-marca

Ejecutás la **Fase 6** de `docs/METODO.md` y la entrega de la Fase 9 sobre un expediente existente.

## 0. Precondiciones (si falla alguna, frená y decilo)
1. `<repo>` = `$BRAND_STUDIO_HOME` o subí desde la ruta real de este SKILL.md hasta `docs/CONTRATO.md`.
   Leé CONTRATO, `PRINCIPIOS-ESTETICOS.md` y el `00-control/ESTADO.md` + `RETOMAR.md` de la marca.
2. `05-eleccion/VOTACION.md` registra la ruta elegida (o fusión) **y quién la eligió**. Sin eso no hay kit:
   "está bien lo que hiciste" no es una elección.
3. Ajustes pedidos en `05-eleccion/` → listados como checklist; cada uno se resuelve y se marca.
4. Herramientas: antes del primer uso de cada una, `--help` y usá sus flags reales.

## 1. Sistema de logo (vector limpio, en `06-kit/01_LOGOS/vector/`)
Construcción: `visuales-sin-generador` recetas 1–2 (grilla, correcciones ópticas, contraformas `evenodd`).
- **Piezas:** `simbolo.svg`, `simbolo-reducido.svg` (si el hueco se cierra ≤ 24 px), `wordmark.svg`,
  `lockup-horizontal.svg`, `lockup-vertical.svg`, cada uno en positivo / negativo / 1 tinta.
- **Wordmark:** partí de la tipografía elegida, convertí a contornos, ajustá kerning a mano (pares
  críticos), unificá terminaciones con el símbolo. No es "texto en Sora": es un dibujo.
- **Área de resguardo:** en unidades del símbolo (p. ej. `x` = alto de la aguja). **Tamaño mínimo:** px y mm,
  medido renderizando, no supuesto.
- **Usos incorrectos:** 6–8 casos renderizados (estirar, rotar, recolorear fuera de paleta, sombra, contorno,
  sobre foto sin velo, reordenar el lockup).
- SVG limpios: sin `<text>`, sin trazos (todo contorno), `viewBox` ajustado, sin metadatos de editor,
  colores como hex de la paleta.
- Controles: legible a 24 px y en mono; lockup estable en claro y oscuro. Mirá el render de cada uno.

## 2. Paleta y tipografía → `brand.config.json`
- `colores`: ids estables (`primario`, `fondo`, `acento-1`, `acento-2`, `neutro-…`) con **rol** de uso.
  Dos acentos con roles distintos (p. ej. acción vs. dato). Neutros derivados, no grises genéricos.
- `tipografias`: rol (`display`, `texto`, `mono`), familia, fuente, **licencia** (OFL/Apache o licencia del
  equipo). Descargá los archivos a `02_COLORES_Y_TIPOGRAFIA/fonts/` y escribí `LICENCIAS-TIPOGRAFIAS.md`.
- `logo`: rutas relativas del expediente. `estado: "kit"`. Registrá D-### en `DECISIONES.md`.

## 3. Generar el kit
```bash
node <repo>/tools/build-brand-kit.mjs <slug>/brand.config.json     # flags reales: --help
```
Produce la estructura de CONTRATO §3 (PNG del símbolo 32–2048, lockups 2400, `tokens.json`/`tokens.css`,
plantillas sociales). Completá a mano lo que el build no genera: `03_FONDOS_Y_PATRONES/` (receta 10 y
generativos del territorio), `05_MOCKUPS_Y_CAMPANA/`, `07_PRODUCT_UI/` si aplica, `FUENTES_EDITABLES/`
(los HTML/SVG fuente).

## 4. Guías (`06-kit/06_GUIAS/`)
- `GUIA-RAPIDA.md` — una página: logo y cuándo usar cada versión, resguardo, mínimo, paleta con roles y
  pares permitidos, tipografías y jerarquía, 3 do / 3 don't, dónde está cada archivo.
- `AUDITORIA-IDENTIDAD.md` — tabla WCAG por **par y uso** generada con
  `python <repo>/tools/contraste.py …` (texto normal ≥ 4,5, grande ≥ 3, UI/gráficos ≥ 3); pares que fallan
  marcados como "solo decorativo" o corregidos. Más: prueba 24 px/mono, riesgos abiertos declarados
  (naming sin clearance legal, genericidad de la forma, percepción), qué no se verificó.

## 5. Brand book
Copiá `templates/brandbook/` a `06-kit/`, alimentalo con tokens y logos, render a `06-kit/BRAND-BOOK.pdf`
con `tools/render.mjs`. Debe tener la riqueza del board aprobado (capas, escala, aplicaciones reales), no
ser un PDF de fichas. Corré `tools/qa-layout.mjs` sobre el HTML.

## 6. Validación y QA con los ojos
```bash
python <repo>/tools/validate-kit.py <slug>/06-kit
python <repo>/tools/pdf-contact-sheet.py <slug>/06-kit/BRAND-BOOK.pdf     # → 08-qa/
python <repo>/tools/board-index.py <slug>/06-kit                          # contact sheet de PNG
```
Abrí las contact sheets y mirá: pies con `file:///` o fecha, páginas casi vacías, fuentes de reemplazo,
logos pixelados, colores fuera de paleta. Escribí el veredicto en `08-qa/QA-KIT.md` (qué se vio, qué se
corrigió). **Gate:** el equipo aprueba kit + auditoría; `validate-kit.py` pasa.

## 7. Entrega
1. Escaneá **todo** el expediente (también rondas viejas) por secretos, URLs firmadas y rutas personales.
2. `python <repo>/tools/empaquetar.py <slug>` → `09-entrega/` (ZIP + `MANIFIESTO.csv` + `.sha256`). Verificá
   hashes contra los archivos reales.
3. Opcional: `bash <repo>/tools/drive-subir.sh …` solo si `brand.config.json → drive` está completo.
4. `09-entrega/MENSAJE-PARA-EL-EQUIPO.md`: qué se entrega, cómo abrirlo, qué decidir ahora, riesgos
   abiertos, próximo paso sugerido (`piezas-marca`, `web-marca`).
5. Actualizá `ESTADO.md`, `DECISIONES.md`, `RETOMAR.md`.
