# Lecciones operativas

> Errores reales ya pagados. Cada expediente tiene además su `00-control/LECCIONES.md`; si una lección
> se repite entre marcas, se sube acá.

## Codificación y texto

- **PowerShell → Python rompe UTF-8.** Pasar JSON con tildes/ñ por un pipe de PowerShell a Python produce
  mojibake (`Ã³` en vez de `ó`). Prevención: escribir archivos con herramienta de edición o con
  `encoding="utf-8"` explícito; si hay que transportar JSON por shell, serializar no-ASCII como escapes
  (`ensure_ascii=True`). Verificar con los puntos de código (`ascii(texto)`), no con lo que muestra la consola.
- **`read_text()` / `open()` sin `encoding`** en Windows usa cp1252. Siempre `encoding="utf-8"`.
- **PowerShell `Set-Content`** escribe en la página de códigos del sistema: usar `-Encoding utf8` (y tener
  en cuenta el BOM; quitar `U+FEFF` antes de parsear JSON).
- **`Get-Content -Encoding UTF8` no repara** un archivo que ya se dañó: hay que revertir las secuencias
  o reescribir desde la fuente.

## Hashes y manifiestos

- **Hashes en minúsculas, siempre.** `Get-FileHash` devuelve MAYÚSCULAS, `hashlib` minúsculas: el mismo
  archivo "no coincide". Normalizar a lowercase al escribir y al comparar.
- **Manifiesto solo con fila completa:** ruta, bytes, ancho, alto, sha256, procedencia. Congelar con `null`
  en dims/hash genera falsos positivos más tarde.
- **Validar contra los archivos reales, no contra el manifiesto del autor.** Recomputar hashes antes de
  subir o empaquetar; si difiere, abortar antes de crear carpetas remotas.
- **Validar lo persistido antes de repetir una generación:** si un subagente murió a mitad, mirar qué quedó
  guardado; no regenerar lo que ya existe.

## Privacidad

- **Sanear URLs firmadas en cada escritura**, no solo al final. Objetos de error de herramientas incluyen
  URLs temporales con token: guardar ruta sin query, nombre, tipo y resultado. Nunca imprimir el objeto entero.
- Antes de cada paquete, escanear **todo** el expediente, incluidas rondas viejas y auditorías históricas.
- ZIPs viejos no se corrigen retroactivamente: se marca cuál es el vigente (p. ej. `ULTIMA-COPIA.md`).

## Render y PDF

- **Chrome headless PDF:** pasar **las dos** banderas `--no-pdf-header-footer` (vigente) y
  `--print-to-pdf-no-header` (legacy), más `--virtual-time-budget=5000` y `@page { margin: 0 }` en el CSS.
  Si falta la primera, el PDF sale con fecha arriba y `file:///…` en el pie de todas las páginas.
- **Exit 0 no es QA.** Abrir el PDF / mirar la contact sheet. Defectos típicos que ningún script detecta:
  pie con `file:///`, página casi en blanco con un ítem huérfano, texto cortado, wordmark mal deletreado.
- Listas que no deben partirse: la línea que las presenta viaja con ellas (`break-inside: avoid` en el
  bloque completo).
- Páginas muy largas: no capturar `fullPage` gigante; capturar viewports con metadatos.
- Después de cambiar el viewport, esperar un frame/estado fresco antes de capturar: la primera captura
  puede traer el frame anterior.
- Imágenes perezosas pueden reportar `naturalWidth = 0` justo después de crearse: observar tras entrar en
  viewport antes de declarar "archivo ausente".

## Navegador y automatización

- Un timeout de navegación no prueba que falló: revisar el estado visible antes de reintentar acciones
  con efecto.
- No reconstruir URLs de memoria: usar enlaces observados o el manifiesto.
- `fill("")` puede no disparar el evento de limpieza: seleccionar todo + Backspace y verificar tras recarga.
- Servidores locales temporales mueren entre sesiones: tener un script de arranque (`127.0.0.1`, puerto
  fijo) y detener solo los procesos propios.

## Proceso

- **Identidad ≠ propuesta de producto.** Tres identidades sobre la misma pantalla no son tres propuestas.
  Una propuesta de producto exige diferencias en navegación, unidad principal de trabajo y disposición.
- "Está bien lo que hiciste" no elige una ruta. Registrar solo decisiones explícitas.
- Una ronda rechazada se conserva y se documenta por qué; se rehace la presentación entera, no solo el
  objeto que molestó.
- Cambiar tokens de color no cuenta como arquitectura nueva.
- El editor de parches puede rechazar borrar+crear el mismo archivo en una operación: usar actualización o
  versión numerada.
