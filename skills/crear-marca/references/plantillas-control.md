# Plantillas de control

`nuevo-expediente.mjs` crea estos archivos; si faltan o hay que rehacerlos, usá estas formas.

## ESTADO.md

```
# Estado — <nombre>
Actualizado: <AAAA-MM-DD> · Fase: <estado de brand.config.json> · Runtime imagen: <codex-nativo|codigo>

## Hecho (con evidencia)
- <qué> → <ruta del artefacto> (<cómo se verificó>)

## En curso

## Sigue
1. <próxima acción concreta>

## Bloqueos / esperando a
- <p. ej. votación del equipo>
```

## DECISIONES.md

```
| ID | Fecha | Decisión | Quién | Por qué |
|---|---|---|---|---|
| D-001 | 2026-09-29 | Nombre: "…" | Equipo | … |
```

Solo decisiones explícitas. "Está bien lo que hiciste" no es una elección.

## RETOMAR.md

```
# Retomar
Leé ESTADO.md. Fase actual: <x>. Próximo paso exacto: <acción + herramienta + ruta>.
No rehacer: <lista>. Esperando: <gate>. Archivos clave: <rutas relativas al expediente>.
```

## VOTACION.md (05-eleccion)

```
# Votación — <nombre>
Material: 04-territorios/EXPLORACION.pdf · galería: 04-territorios/galeria/index.html

## Votos
| Persona | 1° | 2° | 3° | Qué robarías de otra ruta | Comentario |
|---|---|---|---|---|---|

## Resultado
- Decisión: <ruta T0X> | <fusión: sistema T0X + símbolo T0Y, sin …>
- Ajustes pedidos:
- Decidido por: <quién> · Fecha:
```

El agente arma la tabla vacía y **espera**. Nunca completa votos ni resultado por su cuenta.
