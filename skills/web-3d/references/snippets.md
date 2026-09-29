# web-3d — snippets

Versiones de referencia: three 0.160+, @react-three/fiber 8/9, drei 9/10. Verificá la API instalada
(docs oficiales de la versión instalada) antes de copiar: los nombres de props cambian entre majors.

## 1. Vanilla: símbolo extruido desde las coordenadas del SVG  ✅ probado

Completo en `../examples/simbolo-extruido.html`. Núcleo:

```js
const k = 1/40, P = (x,y) => new THREE.Vector2((x-60)*k, -(y-60)*k);   // viewBox 120, y invertida
const anillo = new THREE.Shape().absarc(0,0,55*k,0,Math.PI*2,false);
anillo.holes.push(new THREE.Path().absarc(0,0,44*k,0,Math.PI*2,true)); // contraforma = hole
const ext = { depth:.32, bevelEnabled:true, bevelThickness:.05, bevelSize:.035, bevelSegments:6, curveSegments:96 };
const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(anillo, ext),
  new THREE.MeshPhysicalMaterial({ color:'#EFE7DA', roughness:.38, clearcoat:.6 }));
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
```

## 2. React Three Fiber + drei (Next.js, cliente)

```tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import tokens from '@/brand/tokens.json';

export default function Hero3D() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 32 }} gl={{ antialias: true }}>
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.3}>
          <Simbolo color={tokens.color.papel} acento={tokens.color.acento} />
        </Float>
        <ContactShadows position={[0, -1.6, 0]} opacity={0.35} blur={2.5} />
      </Suspense>
    </Canvas>
  );
}
// en la página: const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false, loading: () => <img src="/still.avif" alt="" /> });
```
`Simbolo`: mismo `Shape` del §1 dentro de `useMemo`, `<mesh><extrudeGeometry args={[shape, ext]} />…`.

## 3. Shader de fondo: gradiente + fbm + viñeta + grano

```glsl
// fragment — uniforms: uA, uB, uC (vec3 de la paleta), uT (tiempo)
varying vec2 vUv; uniform vec3 uA,uB,uC; uniform float uT;
float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.; a*=.5; } return v; }
void main(){
  float f = fbm(vUv*3. + uT*.05);
  vec3 col = mix(uA, uB*.55, smoothstep(.35,.95, f*vUv.y*1.4));
  col = mix(col, uC, smoothstep(.62,.95, fbm(vUv*2.2 - vec2(.3,uT*.03))) * .3);
  col *= 1. - .55*length(vUv-.5);          // viñeta
  col += (h(vUv*800.)-.5)*.035;            // grano
  gl_FragColor = vec4(col,1.);
}
```
Vertex full-screen: `gl_Position = vec4(position.xy,0.,1.);` sobre `PlaneGeometry(2,2)`,
`depthTest:false`, `frustumCulled=false`.

## 4. Desplazamiento de vértices (superficie orgánica / "tela")

```glsl
// vertex — sobre PlaneGeometry(4,4,256,256) o IcosahedronGeometry(1,64)
uniform float uT; varying float vH;
// … incluir n()/fbm() del §3 (versión vec3 o usando position.xy)
void main(){
  vec3 p = position;
  float d = fbm(p.xy*1.5 + uT*.1);
  p += normal * d * .35;                  // desplazar a lo largo de la normal
  vH = d;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.);
}
// fragment: color = mix(uA, uC, smoothstep(.3,.8,vH));
```
Normales: para iluminar bien, recalcular en shader (diferencias finitas) o usar `onBeforeCompile` sobre un
`MeshStandardMaterial`.

## 5. Fresnel / rim de color de marca

```glsl
// vertex
varying vec3 vN; varying vec3 vV;
void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix*mv; }
// fragment
uniform vec3 uBase, uRim; varying vec3 vN; varying vec3 vV;
void main(){ float fr = pow(1. - max(dot(vN,vV),0.), 3.); gl_FragColor = vec4(mix(uBase,uRim,fr),1.); }
```
Con transparencia (`transparent:true`, `alpha = fr`) da el "halo" de vidrio sin postprocesado.

## 6. Partículas instanciadas (miles, 1 draw call)

```js
const N = 4000, geo = new THREE.BufferGeometry(), pos = new Float32Array(N*3);
let s = 3; const r = () => (s = (s*16807) % 2147483647) / 2147483647;   // semilla fija
for (let i=0;i<N;i++){ const a=r()*6.283, rad=1.6+r()*1.4; pos.set([Math.cos(a)*rad,(r()-.5)*.6,Math.sin(a)*rad], i*3); }
geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size:.018, color:'#7FA7A3', transparent:true, opacity:.8, depthWrite:false }));
scene.add(pts);                                   // animar pts.rotation.y en el loop (no cada vértice en CPU)
```
Objetos con geometría → `InstancedMesh(geo, mat, N)` + `setMatrixAt` una vez; en R3F `<Instances>` de drei.

## 7. 3D guiado por scroll

R3F + drei:
```tsx
<ScrollControls pages={3} damping={0.2}><Escena /></ScrollControls>
function Escena(){ const scroll = useScroll(); const ref = useRef<THREE.Group>(null!);
  useFrame(() => { const t = scroll.offset;           // 0..1
    ref.current.rotation.y = t * Math.PI * 1.5; ref.current.position.y = THREE.MathUtils.lerp(0,-1,scroll.range(.6,.4)); });
  return <group ref={ref}><Simbolo/></group>; }
```
GSAP (sin R3F): `gsap.to(obj.rotation, { y: Math.PI*1.5, scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true } })`
y renderizar en `setAnimationLoop`. Con reduced-motion: no registrar el trigger.

## 8. GLTF + postprocesado sobrio

```tsx
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
function Producto(){ const { scene } = useGLTF('/modelos/producto.glb'); return <primitive object={scene} />; }
useGLTF.preload('/modelos/producto.glb');
<EffectComposer multisampling={0}>
  <Bloom intensity={0.4} luminanceThreshold={0.85} mipmapBlur />
  <Noise opacity={0.04} /><Vignette offset={0.3} darkness={0.6} />
</EffectComposer>
```
Optimizar antes: `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp`.
Postprocesado cuesta: desactivarlo en mobile.

## 9. Render headless mínimo (si `tools/render.mjs` no permite flags de GPU)

```js
// node render-webgl.mjs escena.html salida.png 1600 1000
import { chromium } from 'playwright'; import { pathToFileURL } from 'node:url'; import path from 'node:path';
const [inp, out, w='1600', h='1000'] = process.argv.slice(2);
const b = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport:{ width:+w, height:+h } });
p.on('pageerror', e => console.error(e.message));
await p.goto(pathToFileURL(path.resolve(inp)).href);
await p.waitForFunction(() => window.__listo === true, null, { timeout: 30000 }).catch(() => {});
await p.screenshot({ path: out }); await b.close();
```
En Windows, si `chromium.launch()` se cuelga, pasá `executablePath` (o `CHROME_PATH`) apuntando al
`chrome-headless-shell` que instaló Playwright.
