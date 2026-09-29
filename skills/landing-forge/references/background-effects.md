# Background Effects — Guia de variedad visual

Cada landing debe tener un fondo hero y fondos de seccion UNICOS.
Este documento cataloga todas las opciones disponibles para NUNCA repetir.

---

## Regla: Cada proyecto elige 1 background hero + 1-2 fondos de seccion

No mezclar mas de 2-3 estilos de fondo en una misma landing.
El fondo hero es el "signature visual" del proyecto.

---

## Categoria 1: Gradient Animations

### Aurora / Gradient Blobs
- **Fuente:** CSS @keyframes + blur + opacity
- **Efecto:** Blobs de color moviendose suavemente, estilo Northern Lights
- **Ejemplo:** Lo que usamos en Fluxo hero
- **Mejor para:** SaaS, tech, IA
- **Configuracion:** 3-4 blobs, blur(120px+), opacity 10-15%, drift animation 15-25s
- **Variantes:** Usar colores de marca, cambiar velocidades, agregar grid overlay

### Mesh Gradient
- **Fuente:** CSS conic-gradient + radial-gradient combinados
- **Efecto:** Gradiente organico multi-punto (estilo Apple Music, Linear)
- **Mejor para:** Premium, luxury, creative
- **Implementacion:** 3+ radial-gradients con posiciones y colores diferentes

### Animated Gradient Sweep
- **Fuente:** CSS @keyframes background-position
- **Efecto:** Gradiente lineal que se mueve continuamente
- **Mejor para:** CTAs, secciones de acento
- **Implementacion:** background-size: 200% + animation

---

## Categoria 2: Particle Systems

### tsParticles — Starfield
- **Paquete:** `@tsparticles/react` + `@tsparticles/slim`
- **Efecto:** Estrellas flotando, movimiento lento
- **Mejor para:** Dark themes, space/tech
- **Variante unica por proyecto:** Cambiar densidad, velocidad, color, forma

### tsParticles — Network
- **Efecto:** Particulas conectadas por lineas (estilo neuronal)
- **Mejor para:** AI, data, tech
- **Interactivo:** Particulas reaccionan al mouse

### tsParticles — Confetti / Fireworks
- **Efecto:** Explosion de particulas
- **Mejor para:** Celebraciones, pricing CTA, success states
- **Trigger:** Al hacer click o al scrollear a una seccion

### React Bits — Particles
- **Efecto:** Sistema de particulas custom con fisica
- **Mejor para:** Dark themes
- **Ventaja:** Mas control granular que tsParticles

---

## Categoria 3: Grid / Pattern Overlays

### Dot Grid
- **Fuente:** CSS radial-gradient repeating
- **Efecto:** Puntos regulares como papel de ingenieria
- **Mejor para:** Tech, SaaS, developer tools
```css
background-image: radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px);
background-size: 24px 24px;
```

### Line Grid
- **Fuente:** CSS linear-gradient repeating
- **Efecto:** Cuadricula fina
- **Mejor para:** Precision tech, fintech
```css
background-image:
  linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
background-size: 40px 40px;
```

### Noise Texture
- **Fuente:** SVG filter feTurbulence
- **Efecto:** Grano fotografico sutil
- **Mejor para:** Editorial, warm, vintage
- **Implementacion:** SVG overlay con opacity 3-8%

---

## Categoria 4: Interactive / Mouse-following

### Spotlight
- **Fuente:** Motion useMotionValue + useSpring + radial-gradient
- **Efecto:** Circulo de luz que sigue el cursor
- **Mejor para:** Hero sections, CTAs, dark themes
- **Implementacion:** onMouseMove actualiza position, radial-gradient CSS

### Magic Card Spotlight
- **Fuente:** CSS radial-gradient + onMouseMove
- **Efecto:** Highlight que sigue el cursor DENTRO de cada card
- **Mejor para:** Feature grids, pricing cards
- **Ejemplo:** Lo que usamos en modules Fluxo

### Cursor Trail
- **Fuente:** React Bits (Spotlight Cursor, Neon Cursor, Blob Cursor)
- **Efecto:** Estela visual que sigue el cursor
- **Mejor para:** Creative, gaming, portfolio
- **CUIDADO:** Sutil. No debe interferir con la usabilidad

---

## Categoria 5: Animated Shapes / SVG

### Morphing Blobs
- **Fuente:** SVG animate + d path morphing
- **Efecto:** Formas organicas que cambian forma continuamente
- **Mejor para:** Creative, wellness, organic brands

### Wave Animation
- **Fuente:** React Bits (Waves) o SVG path animation
- **Efecto:** Ondas en la base de una seccion
- **Mejor para:** Separadores entre secciones, footer

### Geometric Patterns
- **Fuente:** CSS clip-path + animation
- **Efecto:** Formas geometricas rotando/moviendose
- **Mejor para:** Tech, fintech, enterprise

---

## Categoria 6: 3D / WebGL (heavyweight — usar con precaucion)

### Three.js Globe
- **Fuente:** React Three Fiber + Drei
- **Efecto:** Globo 3D interactivo con puntos de conexion
- **Mejor para:** Global/international products
- **PESO:** Bundle grande. Solo si el proyecto lo justifica

### Distortion Material
- **Fuente:** Drei MeshDistortMaterial
- **Efecto:** Esfera o forma 3D con distorsion organica
- **Mejor para:** AI, creative, experimental

### Float + Sparkles
- **Fuente:** Drei
- **Efecto:** Objetos flotando con particulas brillantes
- **Mejor para:** Premium, luxury
- **PESO:** Moderado. Usar sparingly

---

## Categoria 7: Video / Media

### Video Background
- **Fuente:** HTML5 video autoplay loop muted
- **Efecto:** Video ambiental como fondo
- **Mejor para:** Luxury, real estate, automotive, hospitality
- **CRITICO:** Optimizar peso (< 5MB), poster image para loading

### Gradient Video Overlay
- **Fuente:** Video + CSS gradient overlay
- **Efecto:** Video con gradiente encima para legibilidad de texto
- **Mejor para:** Cualquier video background

---

## Matriz de seleccion por arquetipo

| Arquetipo | Hero BG recomendado | Seccion BG | Evitar |
|---|---|---|---|
| 1 Warm Literary | Noise texture + crema | White/cream alternado | Particulas, 3D, neon |
| 2 Aggressive Tech | Gradient sweep dark | Dot grid sutil | Blobs, organic shapes |
| 3 Dark Immersive | Aurora / Particles | Gradient mesh dark | Light patterns, grids |
| 4 Reductive Luxury | Video / White puro | Solo color changes | TODO decorativo |
| 5 Confident Duality | Gradient sutil + foto | White/gray alternado | Heavy effects |
| 6 Precision Tech | Mesh gradient navy | Line grid + navy sections | Organic, playful |

---

## Anti-patterns

- NO usar mas de 1 background animado visible al mismo tiempo
- NO usar backgrounds pesados en mobile (desactivar o simplificar)
- NO usar particulas + aurora + 3D juntos — elegir UNO
- NO usar fondos que distraigan del contenido
- SIEMPRE testear performance con el background activo (60fps)
- SIEMPRE tener un fallback estatico para prefers-reduced-motion
