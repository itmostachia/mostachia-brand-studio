# Prompts de imagen — runtime Codex (generación nativa)

> Aplica **solo** cuando la sesión tiene la herramienta nativa de generación de imágenes (CONTRATO §4).
> Nunca usar APIs pagas ni pedir API keys. En Claude Code u otro runtime: ver el final de este documento.

## 1. Anatomía de un prompt

Los prompts se escriben **en inglés** (mejor adherencia) y se guardan como archivo en
`04-territorios/prompts/<id>-<tipo>-v<n>.md` antes de generar. Orden fijo:

1. **Encargo y formato.** Qué es y para qué: `Create ONE complete brand identity presentation board…`,
   proporción exacta (`portrait 3:4`, `landscape 16:10`) — **la misma para todos los territorios del mismo
   tipo** — y nivel de oficio (`art-directed identity studio portfolio quality`).
2. **Nombre deletreado.** `The brand name reads exactly "norte", five letters n o r t e.` El nombre del
   territorio es una etiqueta interna: `Direction name X is only a proposal label, NOT the brand; all
   applications are signed <nombre>.`
3. **Paleta con HEX exactos.** `PALETTE: #102A35, #C8F04B, #F4F1EA, #5E7D86.` Con roles si importan
   (`lime only as signal`). Nunca pedir que imprima etiquetas largas de HEX si no hacen falta.
4. **Sistema de logo.** Descripción constructiva del gesto (qué letra, qué operación, dónde **no** va).
5. **Composición.** Módulos y jerarquía: `7–9 unequal modules`, dónde va el wordmark grande, qué ocupa el
   centro, qué % de la imagen es producto (`at least 35%`).
6. **Una aplicación concreta por imagen** (en la página B): *una* superficie protagonista (dashboard, home
   web, pieza de campaña, packaging) que ocupe la mayor parte, no un collage de todo. El board (página A) sí
   muestra el mundo completo en módulos.
7. **Texto visible.** Pocas palabras en español, literales y entre comillas: headline, 3–4 etiquetas de UI.
   `Sparse short readable Spanish text.`
8. **Tipografía por cualidades.** `robust humanist grotesk with open apertures` — `do not invent font names`.
9. **Negativos.** Clichés generales + los del rubro (PRINCIPIOS-ESTETICOS §2) + `no other brand names, no
   fake metrics or growth claims, no fake loading percentages, no placeholder gibberish`.
10. **Cierre.** `All people and content fictional. Finished image only.`

### Rol de la imagen de referencia

Cuando se adjunta un board aprobado para generar la página B o una pieza derivada, decirlo explícitamente:
`Use the attached board ONLY for exact logo, palette and design language. Create a NEW layout, not a crop
of the board.` Las referencias de terceros **nunca** se adjuntan para copiar: se describen como principio
(estructura, ritmo, tratamiento) en el prompt.

### Plantilla mínima (board)

```text
Create ONE extraordinary complete brand identity presentation board for the brand "<nombre>" (spelled
exactly: <letras separadas>), a <qué hace, en una línea>. Direction "<territorio>" is only an internal
label; every application is signed <nombre>. Portrait 3:4, art-directed identity studio quality,
7–9 unequal modules, generous coherent gutters.
PALETTE: <HEX1>, <HEX2>, <HEX3>, <HEX4> — <roles breves>.
LOGO SYSTEM: <construcción del gesto; dónde nunca va>.
COMPOSITION: <wordmark grande en…; producto grande en centro ≥35%; mobile; web hero "<headline>";
two DIFFERENT campaign compositions; compact email; logo light/dark/icon-only; Aa sample without font
names; palette chips with these exact HEX>.
Sparse readable Spanish text: "<headline>", "<etiqueta 1>", "<etiqueta 2>", "<etiqueta 3>".
NO: <clichés generales>, <clichés del rubro>, generic purple AI gradients, other brand names, fake metrics.
All people and content fictional. Finished image only.
```

## 2. Corrección: un solo cambio local por edición

Si un board sale casi bien, **no se regenera de cero**: se edita la imagen con **una** corrección local y
todo lo demás congelado.

```text
Edit this exact identity board. CRITICAL: <el único problema, preciso>. <Cómo corregirlo>.
Keep layout, palette, typography, product modules and every other element exactly as they are.
Finished same <formato> board.
```

- Una edición = un problema. Si hay tres problemas, tres ediciones encadenadas (o regenerar si son de fondo).
- El error más común es de **deletreo**: un gesto insertado dentro de la palabra cambia la lectura. La
  corrección pide sacar el gesto de adentro del wordmark y ubicarlo como ícono separado.
- Después de cada edición, revisar la imagen **completa**: una corrección puede dejar una cifra o etiqueta
  contradictoria en otro módulo.

## 3. Registro obligatorio — `04-territorios/GENERACIONES.json`

Cada imagen generada (elegida o no) se registra **en el momento**, como un array de objetos:

```json
{
  "id": "T07",
  "tipo": "board | aplicacion | pieza | edicion",
  "version": 2,
  "prompt_path": "04-territorios/prompts/T07-board-v2.md",
  "archivo": "04-territorios/boards/T07/board.png",
  "origen": "nombre de archivo devuelto por la herramienta (sin rutas personales ni URLs firmadas)",
  "sha256": "hex en minúsculas del archivo guardado",
  "ancho": 1536,
  "alto": 2048,
  "estado": "seleccionada | descartada",
  "motivo": "por qué se descartó o qué corrigió",
  "fecha": "2026-09-29",
  "herramienta": "generacion nativa codex"
}
```

- Los descartes se conservan en `04-territorios/boards/<id>/descartes/` — sirven para comparar y aprender.
- `sha256` en minúsculas, calculado sobre el archivo **ya guardado** en el expediente.
- Una fila está completa solo con dimensiones + hash + procedencia. No congelar filas con nulos.
- Nunca guardar URLs firmadas ni querystrings: se sanean en **cada** escritura.
- Texto de marca que la imagen no resuelve bien (fechas, etiquetas de simulación, créditos) se agrega fuera
  de la imagen, en la galería/PDF.

## 4. Revisión de cada imagen antes de seleccionarla

- ¿Nombre deletreado exacto en **todos** los wordmarks?
- ¿HEX respetados (medir con cuentagotas sobre la imagen)?
- ¿Algún cliché colado? ¿Marcas ajenas? ¿Texto basura?
- ¿El producto se entiende? ¿Una sola sección activa en la navegación?
- ¿Mismo formato que el resto de los territorios?
- Puntaje con la rúbrica de `skills/territorios-marca/references/rubrica-board.md`. <16/20 → otra versión.

## 5. Runtime Claude Code / sin generador

No hay generación de imágenes ni se piden keys. Los boards, aplicaciones y piezas se **construyen en código**
(SVG, HTML/CSS, canvas, WebGL) con tipografías reales y se rasterizan con `tools/render.mjs`; la fotografía,
cuando haga falta, sale de cualquier fuente web (Pinterest, Google, bancos) y se registra el origen en `FUENTES.csv`. Método completo:
`skills/visuales-sin-generador`. El registro equivalente a GENERACIONES.json es la lista de archivos fuente
+ renders con hash, que genera la misma skill.
