---
name: web-3d
description: 3D y WebGL para marcas — Three.js y React Three Fiber (+drei), shaders GLSL (ruido, gradientes, desplazamiento, fresnel), postprocesado, 3D guiado por scroll, partículas, modelos GLTF, rendimiento y fallbacks, y 3D de marca (símbolo extruido, materiales de la paleta). También stills 3D headless para boards y piezas. Usar cuando digan "3D", "WebGL", "Three.js", "R3F", "shader", "escena", "partículas", "logo en 3D", "extruí el símbolo", "hero 3D", "fondo animado con shader", "render 3D del logo".
---

# web-3d

## 0. ¿Hace falta 3D? (decidir antes de escribir código)
Usalo solo si hay una **tarea espacial concreta**: el símbolo tiene volumen como idea, un producto físico
que se entiende girándolo, un fondo de shader que ES el gesto propietario del territorio.
**No** si es decoración: three ≈ 150 KB gz + R3F/drei ≈ 60–120 KB. Una landing tiene que seguir rápida.
Alternativa barata primero: CSS 3D, SVG, video corto, o un **still 3D renderizado** (PNG/AVIF) en vez de
escena en vivo.

## 1. Stack
- Web Next.js: **React Three Fiber + drei** (`@react-three/fiber`, `@react-three/drei`,
  `@react-three/postprocessing` si hace falta). Montaje lazy: `dynamic(() => import('./Escena'), { ssr:false })`
  + `IntersectionObserver`/`<Suspense>` con póster estático.
- HTML suelto / still headless: Three.js ESM desde `cdn.jsdelivr.net` con importmap
  (ver `examples/simbolo-extruido.html`).
- Motion del resto de la página: respetá la regla de `web-marca` (GSAP **o** framer-motion, no ambos).
  Para scroll-driven 3D con R3F: `ScrollControls` de drei; con GSAP: `ScrollTrigger` escribiendo en refs.

## 2. 3D de marca
- **Símbolo extruido:** mismas coordenadas que el SVG del kit (`Shape` + `holes` = contraformas) →
  `ExtrudeGeometry` con bevel chico. En R3F, `SVGLoader` de three o `<Svg>`/`<Extrude>` de drei.
- **Materiales desde la paleta:** leé hex de `tokens.json`; `MeshPhysicalMaterial` (clearcoat) para
  objetos, `ShaderMaterial` para fondos. `outputColorSpace = SRGBColorSpace`, tone mapping ACES.
- **Luz:** `RoomEnvironment` + PMREM (sin HDRI externo) o `<Environment preset>` de drei; clave cálida +
  contra fría para despegar el contorno.
- Fondos: gradiente + fbm + viñeta + grano en shader, colores de la paleta como uniforms.

## 3. Rendimiento (obligatorio)
- `dpr={[1, 2]}` / `setPixelRatio(Math.min(devicePixelRatio, 2))`; en mobile, 1–1,5.
- Instancing (`InstancedMesh`/`<Instances>`) para > 100 objetos; partículas en `Points` con shader.
- Texturas ≤ 2048 (mobile ≤ 1024), KTX2/Basis si hay muchas; GLTF con Draco/Meshopt
  (`gltf-transform optimize`), < 2 MB.
- `frameloop="demand"` si la escena es estática; pausar fuera de viewport y con pestaña oculta.
- `prefers-reduced-motion` → sin rotación automática ni scroll-driven, frame fijo.
- Fallback sin WebGL / gama baja: póster estático (el still del mismo símbolo). Nunca pantalla vacía.
- Medir: FPS estable ≥ 50 en laptop media, LCP no empeora (el hero no espera al canvas).

## 4. Still 3D headless (boards, piezas, póster fallback)
```bash
node <repo>/tools/render.mjs escena.html still.png --width 1600 --height 1000 --wait 2000
```
- `preserveDrawingBuffer:true` en el renderer y una señal `window.__listo` (o `--wait`).
- Chromium headless puede no tener GPU: lanzar con
  `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`.
  Si `tools/render.mjs` no acepta flags de lanzamiento, usá el script mínimo de
  `references/snippets.md` (§9). Probado así en `examples/simbolo-extruido.html` → `.jpg`.
- **Mirá el render**: seams del bevel, símbolo demasiado chico, halo embarrado (acento cálido sobre fondo
  frío da marrón: usar el tono frío o separar por zonas).

## 5. Snippets
`references/snippets.md`: (1) escena vanilla + símbolo extruido, (2) R3F + drei, (3) shader de fondo
fbm, (4) desplazamiento de vértices, (5) fresnel/rim, (6) partículas instanciadas, (7) scroll-driven,
(8) GLTF + postprocesado, (9) render headless mínimo.
Upstream útiles: `motion-design`, `overdrive`, `gsap-scrolltrigger`, `gsap-react`, `gsap-performance`.
