# Contrato compartido — estructura, config y runtimes

> Todas las skills, scripts y plantillas de este repo respetan este contrato.
> Si algo acá cambia, se actualiza en todos lados en el mismo commit.

## 1. Expediente de marca (una carpeta por marca)

Cada marca vive en su propia carpeta, **fuera de este repo** (default: `./marcas/<slug>/` relativo a donde
trabaje el equipo; configurable). Estructura fija:

```
<slug>/
  brand.config.json          # fuente única de verdad (ver §2)
  00-control/
    PEDIDO-ORIGINAL.md       # pedido literal, inmutable. Pedidos nuevos → PEDIDO-<fecha>.md
    ESTADO.md                # fase actual, qué está hecho, qué sigue (lo primero que lee otro agente)
    DECISIONES.md            # tabla D-001, D-002… (fecha, decisión, quién, por qué)
    RETOMAR.md               # instrucción exacta para que otra sesión continúe
    LECCIONES.md             # errores y correcciones de esta marca
  01-brief/                  # BRIEF.md: negocio, audiencia, competencia, tono, restricciones
  02-naming/                 # NAMING.md: candidatos, criterios, chequeo preliminar, elegido
  03-referencias/
    entrada/                 # imágenes que suelta el equipo (Pinterest, capturas, etc.)
    ANALISIS.md              # lectura por referencia: qué se observa / qué se transfiere / qué se evita
    FUENTES.csv              # origen y licencia de cada imagen o fuente
  04-territorios/
    TERRITORIOS.md           # 12–18 rutas; cada una con idea, paleta por roles, tipo, símbolo, gramática
    territorios.json         # mismo contenido, estructurado. Esquema: skills/territorios-marca/references/ficha-territorio.md
    prompts/                 # prompts de imagen por territorio (runtime Codex)
    GENERACIONES.json        # registro de cada imagen generada (id, prompt, sha256, elegida/descartada)
    boards/<id>/             # board.(html|svg|png) + aplicacion.(html|svg|png) + descartes/ por territorio
    galeria/                 # copia de templates/galeria con data.js generado
    EXPLORACION.pdf          # 2 páginas por territorio + matriz + votación
  05-eleccion/               # VOTACION.md, ruta elegida (o fusión) y ajustes pedidos
  06-kit/                    # salida de tools/build-brand-kit.mjs (ver §3)
  07-aplicaciones/
    web/                     # proyecto Next.js / landing
    social/  flyers/  presentaciones/  mockups/
  08-qa/                     # contrastes, capturas, contact sheets, veredictos
  09-entrega/                # ZIP + MANIFIESTO.csv + .sha256 + MENSAJE-PARA-EL-EQUIPO.md
```

Regla: **otro agente tiene que poder continuar leyendo solo `00-control/ESTADO.md` y `RETOMAR.md`.**

## 2. `brand.config.json`

```json
{
  "slug": "estudio-norte",
  "nombre": "Estudio Norte",
  "eslogan": "…",
  "estado": "brief | naming | referencias | territorios | eleccion | kit | aplicaciones | entrega",
  "idioma": "es-AR",
  "runtime_imagenes": "auto | codex-nativo | codigo",
  "colores": [
    { "id": "primario", "hex": "#102A35", "rol": "fondo principal / texto sobre claro" }
  ],
  "tipografias": [
    { "rol": "display", "familia": "Sora", "fuente": "Google Fonts", "licencia": "OFL" }
  ],
  "logo": { "simbolo_svg": "06-kit/01_LOGOS/vector/simbolo.svg", "wordmark_svg": "…" },
  "drive": { "cuenta": null, "carpeta_id": null }
}
```

- `colores` y `tipografias` se completan recién en fase kit (antes viven por territorio en `territorios.json`).
- `drive` es opcional: nunca hay IDs ni cuentas hardcodeadas en scripts; siempre se leen de acá.
- **Nunca** secretos en este archivo.

## 3. Kit final (`06-kit/`)

```
01_LOGOS/vector/*.svg   01_LOGOS/png/*.png (símbolo 32–2048 px, lockups 2400 px)
02_COLORES_Y_TIPOGRAFIA/tokens.json  tokens.css  fonts/  LICENCIAS-TIPOGRAFIAS.md
03_FONDOS_Y_PATRONES/   04_PLANTILLAS_SOCIALES/ (1080x1350, 1080x1920, 1200x627, 1920x1080)
05_MOCKUPS_Y_CAMPANA/   06_GUIAS/ (GUIA-RAPIDA.md, AUDITORIA-IDENTIDAD.md)
07_PRODUCT_UI/          FUENTES_EDITABLES/   BRAND-BOOK.pdf
```

## 4. Runtimes de imagen (decisión de diseño del repo)

| Runtime | Cómo se detecta | Qué se usa para visuales |
|---|---|---|
| **Codex** | la herramienta nativa de generación de imágenes está disponible en la sesión | generación nativa (incluida en el plan del usuario), con el método de `docs/PROMPTS-IMAGEN.md` |
| **Claude Code / otros** | no hay herramienta nativa de imagen | **cero generadores y cero API keys**: diseño en código (SVG, HTML/CSS, canvas, WebGL/Three.js) renderizado con Playwright, + fotos con licencia libre (ver `skills/visuales-sin-generador`) |

`runtime_imagenes: "auto"` = detectar. Nunca pedir ni usar keys de OpenAI/Gemini/etc. para imágenes.

## 5. Herramientas del repo (`tools/`)

Todas aceptan rutas por argumento, sin rutas absolutas de ninguna máquina. Dependencias: Node ≥ 20
(`playwright`, `sharp`), Python ≥ 3.10 (`Pillow`, `pypdfium2`). `install` las verifica.

`npm install` en la raíz instala las dependencias Node. `npm run smoke` corre el pipeline completo sobre la
marca de prueba (`tests/fixture`) en una carpeta temporal (`-- --conservar` para mirar los renders).
Navegador: `CHROME_PATH` → Chromium de Playwright → `chrome-headless-shell` del caché → Chrome del sistema.

| Herramienta | Uso | Qué hace |
|---|---|---|
| `nuevo-expediente.mjs` | `node tools/nuevo-expediente.mjs --nombre "X" [--slug x] [--dir ./marcas]` | Crea `<dir>/<slug>/` desde `templates/expediente` (§1) y completa `brand.config.json`. Nunca pisa. |
| `galeria-data.mjs` | `node tools/galeria-data.mjs 04-territorios/territorios.json` | Valida el JSON y genera `galeria/` y `exploracion/` (plantillas + `data.js`). Offline por `file://`. |
| `render.mjs` | `node tools/render.mjs in.html out.(png\|pdf) [--width --height --scale --selector --all --full-page --wait --gl]` | HTML→PNG (viewport, página o elemento) o PDF con el `@page` del CSS, sin encabezado/pie. `--gl`: WebGL por software. |
| `qa-layout.mjs` | `node tools/qa-layout.mjs in.html [--selector .page] [--json r.json]` | Desbordes, elementos fuera de página y texto recortado. Código 1 si hay problemas. |
| `contraste.py` | `python tools/contraste.py territorios.json\|brand.config.json [--out 08-qa]` | WCAG: `pares_contraste` por territorio (texto ≥4.5, texto-grande/boton/ui ≥3, grafico informa) o matriz completa de la config → CSV + MD. Código 1 si falla un par bloqueante. |
| `pdf-contact-sheet.py` | `python tools/pdf-contact-sheet.py doc.pdf 08-qa/x` | Páginas → `pages/page-NN.png` + `contact-sheet-N.jpg` (para mirarla). |
| `board-index.py` | `python tools/board-index.py out.jpg (imgs… \| --territorios t.json \| --carpeta dir)` | Índice visual de N boards con número y nombre. |
| `build-brand-kit.mjs` | `node tools/build-brand-kit.mjs brand.config.json [--fonts dir] [--secciones s.json] [--sin-brandbook]` | Kit §3 desde la config + SVG de símbolo y wordmark: logos (color/mono/negativo, SVG+PNG), tokens, patrones, plantillas sociales, guías, brand book PDF, `kit-manifest.json`. Roles por id `fondo`/`texto`/`acento` (si no, se infieren). |
| `validate-kit.py` | `python tools/validate-kit.py 06-kit [--config brand.config.json]` | Archivos y dimensiones del contrato, manifiesto, vacíos, `{{marcadores}}` y rutas locales. Código 1 si falla. |
| `empaquetar.py` | `python tools/empaquetar.py <expediente> [--incluir 06-kit …]` | ZIP + `MANIFIESTO.csv` (path,size,sha256) + `.zip.sha256` en `09-entrega/`. Se niega si detecta secretos o URLs firmadas. |
| `drive-subir.sh` | `DRIVE_CLI=gws tools/drive-subir.sh <expediente> 09-entrega/x.zip [--dry-run]` | **Opcional.** Sube a la carpeta `drive.carpeta_id` (o `DRIVE_FOLDER_ID`) con un CLI estilo `gws`; reanudable, nunca borra ni cambia permisos. |

Plantillas (`templates/`): `expediente/` (§1), `galeria/`, `exploracion/` (PDF 16:9: A + B por territorio,
matriz, votación), `brandbook/`, `deck/` (16:9), `social/` (post, story, LinkedIn, slide, flyer A4) y `kit/`
(README del kit). Todas se tematizan con las mismas variables de `tokens.css` (`--fondo`, `--texto`,
`--acento`, `--sobre-acento`, `--superficie`, `--oscuro`, `--font-display`, `--font-texto`…).
`territorios.json` admite además `archivos.simbolo` (SVG del símbolo; si falta se busca
`boards/<id>/simbolo.svg`) para que galería y exploración dibujen el territorio cuando no hay board raster.
