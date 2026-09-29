# Galería de recetas — visuales sin generador

Todas asumen variables CSS de la marca (`--tinta`, `--papel`, `--acento`, `--suave`…) y se renderizan con
`tools/render.mjs`. Ejemplos probados en `../examples/`:
- `logo-construccion.html` → recetas 1 y 2
- `poster-generativo.html` → recetas 5, 4 y 9
- `flyer-multiview.html` → receta 6
- 3D: `skills/web-3d/examples/simbolo-extruido.html` → receta 11

---

## 1. Símbolo SVG en grilla modular

Trabajá en un `viewBox` de 120 (grilla 12 × 12, módulo 10u). Todo vértice cae en la grilla o en una
fracción declarada del módulo. Un `<symbol>` reutilizable, y lámina de construcción con la grilla visible.

```html
<symbol id="simbolo" viewBox="0 0 120 120">
  <!-- anillo: evenodd = hueco real -->
  <path fill-rule="evenodd" d="M60 5a55 55 0 1 1 0 110A55 55 0 0 1 60 5Zm0 11a44 44 0 1 0 0 88a44 44 0 0 0 0-88Z"/>
  <path d="M60 22 73 54 47 54Z"/>
  <path fill-rule="evenodd" d="M47 58 73 58 60 98Z M53.2 62.5 66.8 62.5 60 83Z"/>
</symbol>
<svg width="128" height="128" style="fill:var(--tinta)"><use href="#simbolo"/></svg>
```

Proceso: 3–5 bocetos de idea (no de estilo) → elegir 1 → construir en grilla → correcciones ópticas (2) →
pruebas de escala y mono → versión reducida si hace falta. Monolínea: `stroke` con `stroke-width` en
módulos y `stroke-linecap` coherente; al exportar el kit, convertí trazos a contornos (el build del kit lo
necesita en `vector/`).

## 2. Correcciones ópticas y prueba de escala

- **Overshoot:** curvas y puntas pasan 1–2 % la línea de base/altura (r 55 en vez de 54) o se ven más chicas.
- **Centro óptico:** apenas arriba del geométrico (−2 a −4u en 120).
- **Trazos horizontales** ~8 % más finos que verticales para verse iguales.
- **Contraformas** con `evenodd`, jamás con un relleno del color del fondo.
- **Prueba obligatoria:** 128 / 48 / 24 / 16 px, positivo, negativo, sobre acento y 1 tinta. Si un hueco se
  cierra a 16 px, diseñá una **versión reducida** (menos detalle, anillo más grueso) — el ejemplo lo muestra.

```html
<div class="escalas">
  <svg width="48" height="48"><use href="#simbolo"/></svg>
  <svg width="24" height="24"><use href="#simbolo"/></svg>
  <svg width="16" height="16"><use href="#simbolo-mini"/></svg>
</div>
```

## 3. Halftone / trama de puntos (SVG o canvas)

```html
<canvas id="h" width="1080" height="1350"></canvas>
<script>
const c=h.getContext('2d'),S=18;c.fillStyle='#10222B';c.fillRect(0,0,1080,1350);c.fillStyle='#E4572E';
for(let y=0;y<1350;y+=S)for(let x=0;x<1080;x+=S){
  const d=Math.hypot(x-700,y-500)/800, r=Math.max(0,(1-d))*S*.55;   // campo: radial (o luminancia de una foto)
  c.beginPath();c.arc(x+(y/S%2)*S/2,y,r,0,7);c.fill();}
</script>
```
Variante con foto: dibujá la foto en un canvas oculto, leé `getImageData` y usá la luminancia como `r`
(solo con fotos cargadas desde el mismo origen/archivo local).

## 4. Grano + viñeta (la capa que "desplastifica")

```html
<svg class="grano" width="100%" height="100%" style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:.45">
  <filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>
<div style="position:absolute;inset:0;background:radial-gradient(120% 90% at 30% 35%,transparent 40%,rgba(0,0,0,.6))"></div>
```
Grano fuerte engorda el PNG: exportá JPG/WebP para social o bajá `opacity`.

## 5. Flow field (líneas de viento/agua/datos)

```js
let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;         // PRNG con semilla
const P=[...Array(512)].map(rnd),fade=t=>t*t*(3-2*t);
function noise(x,y){const xi=Math.floor(x),yi=Math.floor(y),u=fade(x-xi),v=fade(y-yi),
  h=(a,b)=>P[((a*57+b*131)%512+512)%512];
  return (h(xi,yi)*(1-u)+h(xi+1,yi)*u)*(1-v)+(h(xi,yi+1)*(1-u)+h(xi+1,yi+1)*u)*v;}
for(let i=0;i<2600;i++){let x=rnd()*1180-50,y=rnd()*1000-60;
  ctx.strokeStyle=i%23?'rgba(239,231,218,.16)':'rgba(228,87,46,.55)';ctx.beginPath();ctx.moveTo(x,y);
  for(let k=0;k<90;k++){const a=noise(x*.0032,y*.0032)*Math.PI*3.2;x+=Math.cos(a)*4;y+=Math.sin(a)*4;ctx.lineTo(x,y);}
  ctx.stroke();}
```
Perillas: escala del ruido (`.0032`), largo del trazo (`90`), densidad (`2600`), 1 de cada N en acento.
Dejá una zona tranquila para la tipografía (la viñeta ayuda).

## 6. Flyer de producto multivista (estilo preferido del equipo)

Nunca "una captura + texto". UI **construida en HTML** con datos verosímiles del rubro, dentro de marcos
de dispositivo, en 3–5 capas superpuestas con perspectiva, más chips flotantes con micro-datos.

```css
.escena{position:absolute;top:440px;left:0;right:0;height:780px;perspective:2200px}
.laptop{position:absolute;left:110px;width:820px;transform:rotateY(-14deg) rotateX(6deg) rotateZ(-2deg)}
.pantalla{background:#0B171D;border-radius:22px 22px 6px 6px;padding:16px;box-shadow:0 60px 120px -30px rgba(0,0,0,.7)}
.telefono{position:absolute;right:88px;top:170px;width:270px;height:560px;border-radius:44px;background:#0B171D;
          padding:11px;transform:rotateY(-8deg) rotateZ(5deg);box-shadow:0 50px 90px -20px rgba(0,0,0,.75)}
.chip{position:absolute;background:var(--papel);border-radius:16px;padding:14px 18px;transform:rotate(-3deg);
      box-shadow:0 30px 60px -20px rgba(0,0,0,.6)}
```
Reglas: números con formato local (`$ 4,82 M`, `1.274`), gráficos en SVG inline, el logo de la marca dentro
de la UI, fondo con 2 radiales de la paleta + grano. Si hay capturas reales del producto, usalas en los
marcos en vez de la UI construida. Arte conceptual ≠ producto real: no mostrar funciones inexistentes
como si existieran.

## 7. Mesh gradient sin librerías

```css
.mesh{background:
  radial-gradient(40% 50% at 20% 25%, var(--acento) 0, transparent 70%),
  radial-gradient(45% 55% at 80% 30%, var(--suave) 0, transparent 70%),
  radial-gradient(60% 60% at 55% 85%, #2B4A58 0, transparent 70%), var(--tinta);
  filter:saturate(1.1)}
.mesh::after{content:"";position:absolute;inset:0;backdrop-filter:blur(40px)}   /* funde los bordes */
```
Sumale grano (4). Evitá el degradé violeta-azul "IA" salvo que sea la paleta aprobada.

## 8. Tipografía como imagen (máscara)

```css
.titular{font:800 360px/.8 var(--font-display);letter-spacing:-.06em;
  background:url(foto-tratada.jpg) center/cover;-webkit-background-clip:text;background-clip:text;color:transparent}
.contorno{-webkit-text-stroke:2px var(--papel);color:transparent}         /* capa fantasma desplazada */
```
Combiná una línea llena + una en contorno + recorte a sangre (el texto sale del lienzo).

## 9. Afiche editorial tipográfico

Grilla de 12 columnas, 1 titular enorme (180–260 px en 1080 de ancho, interlineado 0,8–0,9, tracking
negativo), cursiva/peso contrastante en la palabra clave con el acento, rótulos mono en versalitas con
tracking +0,08em, filete de 1 px, índice/número de edición. Ver `examples/poster-generativo.html`.

## 10. Patrón modular desde el símbolo

```html
<svg width="1080" height="1080"><defs>
  <pattern id="p" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
    <use href="#simbolo" width="60" height="60" x="30" y="30" style="fill:var(--suave);opacity:.25"/>
  </pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>
```
Variantes: alternar escala/rotación por celda con el PRNG; usar solo un fragmento del símbolo (la aguja)
como módulo. Va a `03_FONDOS_Y_PATRONES/`.

## 11. Render 3D headless

Símbolo extruido, materiales de la paleta, fondo con shader. Receta completa y flags de WebGL headless en
`skills/web-3d` (`examples/simbolo-extruido.html`). Para un still, `preserveDrawingBuffer:true` y una
señal `window.__listo` antes de capturar.

## 12. Duotono / tratamiento de foto a la paleta (CSS/SVG)

```html
<svg width="0" height="0"><filter id="duo" color-interpolation-filters="sRGB">
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer>                                   <!-- sombras = tinta #10222B, luces = papel #EFE7DA -->
    <feFuncR type="table" tableValues="0.063 0.937"/><feFuncG type="table" tableValues="0.133 0.906"/>
    <feFuncB type="table" tableValues="0.169 0.855"/></feComponentTransfer></filter></svg>
<img src="foto.jpg" style="filter:url(#duo) contrast(1.1)">
```
Valores = hex/255 por canal (sombra → luz). Tritono: 3 valores por tabla. Luego grano (4) y recorte
fuerte (encuadre que el fotógrafo no eligió: detalle, textura, fuera de eje).

## 13. Tratamiento de foto con sharp (batch, sin navegador)

```js
import sharp from 'sharp';
await sharp('entrada.jpg').resize(1080,1350,{fit:'cover',position:'attention'})
  .grayscale().tint('#7FA7A3').modulate({brightness:.95,saturation:1.1})
  .composite([{input:'grano.png',blend:'overlay'}]).jpeg({quality:86,mozjpeg:true}).toFile('salida.jpg');
```
`position:'attention'` recorta hacia la zona de interés. Para duotono exacto usá la receta 12 en HTML.

## 14. Contact sheet de exploración

Una grilla HTML con todas las variantes (misma escala, mismo fondo, rótulo con semilla/parámetros) →
render → mirar → elegir. Para boards y PDFs ya hechos: `tools/board-index.py`, `tools/pdf-contact-sheet.py`.
