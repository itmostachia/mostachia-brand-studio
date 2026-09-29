# MostachIA Brand Studio — instrucciones para el agente

Este repo es el sistema de MostachIA para crear marcas de punta a punta: nombre → propuestas visuales →
identidad final → kit → web, piezas y presentaciones. Aplica a Claude Code y a Codex (ver `AGENTS.md`).

## Regla principal

Cada vez que el usuario pida **marca nueva, rebranding, identidad visual, naming, brandboard, propuestas
visuales, logo, paleta, kit de marca, web/landing de una marca, flyers, posts o presentaciones de una
marca** → invocá la skill **`crear-marca`** (o la etapa puntual si ya hay expediente). No improvises el
proceso por fuera del método: está en `docs/METODO.md`.

| Pedido | Skill |
|---|---|
| Marca nueva / rebranding / "necesitamos marca para X" | `crear-marca` (orquesta todo) |
| Solo nombres / eslogan | `naming-marca` |
| Propuestas visuales / brandboards / territorios | `territorios-marca` |
| Ya eligieron → logos, colores, tokens, brand book | `kit-marca` |
| Posts, stories, flyers, presentaciones, mockups | `piezas-marca` |
| Web / landing de la marca | `web-marca` (landings completas: `landing-forge`) |
| 3D, WebGL, shaders, escenas | `web-3d` |
| Visuales sin generador de imágenes | `visuales-sin-generador` |

## No negociables

1. **Leé primero** `docs/CONTRATO.md` (estructura, config, runtimes) y `docs/PRINCIPIOS-ESTETICOS.md`.
2. **Imágenes:** en Codex, generación nativa del plan del usuario. En Claude u otro runtime,
   **ningún generador ni API key**: diseño en código + cualquier foto de internet, adaptada a la marca (`visuales-sin-generador`).
   Nunca pedir keys de OpenAI/Gemini/etc. para imágenes.
3. **Cantidad y comparabilidad:** 12–18 territorios realmente distintos, mismo marco de comparación
   (página A brandboard completo + página B aplicaciones), matriz y votación al final.
4. **El equipo elige.** Nunca declarar una ruta ganadora ni avanzar al kit sin la votación registrada en
   `05-eleccion/VOTACION.md`.
5. **Anti-genérico:** nada de stock/lifestyle genérico ni clichés del rubro (ver lista por industria en
   `PRINCIPIOS-ESTETICOS.md`). Fotos de cualquier origen se pueden usar y adaptar (uso interno); lo que no se copia es la identidad de otra marca (logos, símbolos).
6. **QA con los ojos:** renderizá y mirá el resultado (contact sheet) antes de decir "listo". Un script
   que sale con código 0 no es QA visual.
7. **Expediente al día:** cada fase actualiza `00-control/ESTADO.md`, `DECISIONES.md` y `RETOMAR.md`.
8. Nada de secretos, cookies ni URLs firmadas en el expediente ni en el repo.

## Instalación

Si las skills no aparecen, correr el instalador (ver `INSTALL.md`). El agente puede ejecutarlo solo.
