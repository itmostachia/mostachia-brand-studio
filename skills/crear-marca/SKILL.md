---
name: crear-marca
description: Orquesta la creación de una marca de punta a punta con el método MostachIA Brand Studio — brief, naming, referencias, 12–18 territorios comparables, votación del equipo, kit, aplicaciones, QA y entrega, todo en un expediente retomable. Usar cuando digan "crear marca", "marca nueva", "rebranding", "identidad visual", "branding para", "necesitamos marca para el proyecto X", "brandboard", "propuestas visuales", "armemos la identidad de", o retomen un expediente de marca existente.
---

# crear-marca — orquestador

Ejecutás `docs/METODO.md`. No improvises fases ni saltees gates.

## 0. Ubicar el repo y leer el contrato

1. `<repo>` = `$BRAND_STUDIO_HOME` si existe. Si no: resolvé la ruta **real** de este SKILL.md (seguí
   symlinks/junctions) y subí directorios hasta encontrar `docs/CONTRATO.md`.
2. Leé `<repo>/docs/CONTRATO.md` y `<repo>/docs/PRINCIPIOS-ESTETICOS.md`. `METODO.md` y `LECCIONES.md`
   cuando los necesites.
3. Herramientas: `node <repo>/tools/<x>.mjs` / `python <repo>/tools/<x>.py`. Antes del primer uso de cada
   una, corré `--help` y usá sus flags reales.

## 1. Runtime de imagen

- ¿Hay herramienta nativa de generación de imágenes en esta sesión? → `codex-nativo` (método
  `docs/PROMPTS-IMAGEN.md`).
- Si no → `codigo`: cero generadores, cero API keys; visuales en código vía skill `visuales-sin-generador`.
- Nunca pidas keys de OpenAI/Gemini/etc. Registrá el valor en `brand.config.json → runtime_imagenes`.

## 2. Expediente: crear o retomar

- ¿Existe `<slug>/00-control/ESTADO.md`? → leé ESTADO + RETOMAR y seguí desde la fase indicada. No repitas
  lo hecho ni re-litigues decisiones de DECISIONES.md.
- Si no: `node <repo>/tools/nuevo-expediente.mjs` (slug en kebab-case, destino default `./marcas/`).
  Guardá el pedido **literal** en `00-control/PEDIDO-ORIGINAL.md`.
- Pedidos posteriores → `PEDIDO-<AAAA-MM-DD>.md` literal + interpretación de trabajo.

## 3. Brief — una sola ronda

Hacé **una** ronda de preguntas agrupadas (lista en `references/entrevista-brief.md`); lo no respondido se
infiere y se marca *supuesto*. Escribí `01-brief/BRIEF.md`.
**Gate:** el responsable confirma el brief. Mientras tanto podés avanzar naming y referencias.

## 4. Nombre

Preguntá: **"¿Ya tienen nombre?"**
- Sí → registrarlo en config + DECISIONES.
- No, o quieren alternativas → invocá **`naming-marca`**. **Gate:** el equipo elige; vos no.

## 5. Referencias

1. Pedí al equipo que suelte imágenes en `03-referencias/entrada/`.
2. Podés buscar en la web (Pinterest, Behance, Awwwards, Savee, sitios de estudios) **solo como
   inspiración**. Nunca copiar marcas, logos ni composiciones ajenas.
3. Mirá cada imagen de verdad. `ANALISIS.md`: por referencia → qué se observa / qué se transfiere / qué se
   evita; cerrar con familias de gusto y tensiones abiertas.
4. `FUENTES.csv`: `archivo,origen_url,autor,licencia,fecha,uso` — si no se sabe, "desconocido"; nunca
   inventar.
**Done:** todas las referencias leídas + matriz referencia → principio → uso → límite.

## 6. Territorios

Invocá **`territorios-marca`**. **Done:** 12–18 territorios, galería + `EXPLORACION.pdf`, rúbrica ≥16/20
en todos, contrastes medidos, contact sheet **mirada**.

## 7. Votación — STOP

1. Entregá galería + PDF + `05-eleccion/VOTACION.md` armado con la plantilla de
   `references/plantillas-control.md`.
2. **Frená y esperá.** Nunca elijas ganador ni avances al kit por tu cuenta. Podés recomendar con razones si
   te lo piden.
3. Registrá la decisión (ruta única o **fusión explícita**: "sistema X + símbolo de Y, sin Z") en VOTACION y
   DECISIONES. Si es fusión o hay ajustes: un board nuevo en el mismo marco, aprobado antes del kit.

## 8. Kit y aplicaciones

- **`kit-marca`** → `06-kit/` (CONTRATO §3) + `tools/validate-kit.py`. **Gate:** equipo aprueba kit + auditoría.
- Después, según pedido: **`piezas-marca`** (social, flyers multivista, presentaciones, mockups),
  **`web-marca`** (web/landing), **`web-3d`** (solo con una tarea espacial concreta).
- Regla: la implementación no puede quedar más plana que lo aprobado; compará lado a lado antes de mostrar.
  **Gate:** equipo aprueba cada tanda.

## 9. QA

`tools/contraste.py`, `tools/qa-layout.mjs`, `tools/pdf-contact-sheet.py`, `tools/board-index.py`.
Checklist anti-slop de PRINCIPIOS-ESTETICOS §7. **Mirá los renders.** Veredicto en `08-qa/`.

## 10. Entrega

1. Escaneá todo el expediente (rondas viejas incluidas) por URLs firmadas, secretos y rutas personales.
2. `python <repo>/tools/empaquetar.py` → `09-entrega/` (ZIP, MANIFIESTO.csv, .sha256,
   MENSAJE-PARA-EL-EQUIPO.md). Recomputá hashes (minúsculas) sobre los archivos reales.
3. Drive opcional: `bash <repo>/tools/drive-subir.sh` con la carpeta de `brand.config.json → drive`.
**Gate:** responsable del proyecto. `estado: entrega`.

## Al cerrar CADA fase

- `brand.config.json → estado` actualizado.
- `ESTADO.md` (fase, hecho con evidencia, sigue), `DECISIONES.md` (D-00N), `RETOMAR.md` (instrucción exacta).
- Error nuevo → `00-control/LECCIONES.md`.
- Reporte al usuario: 2–4 líneas + rutas. Nunca "listo" sin evidencia de herramienta en esta sesión.
