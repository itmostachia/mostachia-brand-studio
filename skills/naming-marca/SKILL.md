---
name: naming-marca
description: Genera 10–15 nombres de marca en estrategias distintas, con fundamento, pronunciación en español e inglés, eslóganes para finalistas y un chequeo PRELIMINAR de disponibilidad (marcas en INPI/WIPO/USPTO, dominios, handles). Escribe 02-naming/NAMING.md del expediente. Usar cuando digan "naming", "ponerle nombre", "ideas de nombre", "cómo le ponemos", "no tenemos nombre", "nombre para la marca", "eslogan", "tagline", o cuando crear-marca detecta que no hay nombre.
---

# naming-marca

## Antes

1. `<repo>` = `$BRAND_STUDIO_HOME` o subir desde la ruta real de este SKILL.md hasta `docs/CONTRATO.md`.
2. Leé `01-brief/BRIEF.md` del expediente (si no hay brief, pedí lo mínimo: qué hace, para quién, mercado,
   idiomas, 3 adjetivos sí/no, competidores).
3. Anotá restricciones: idiomas donde tiene que funcionar, largo máximo, si debe decir el rubro o no.

## 1. Generar 10–15 candidatos en estrategias distintas

Mínimo 5 estrategias, 2–3 nombres por estrategia:

| Estrategia | Qué es | Riesgo |
|---|---|---|
| Descriptivo | dice lo que hace | genérico, difícil de registrar |
| Evocativo | sugiere la experiencia/beneficio con una palabra real | ya registrado en muchas clases |
| Inventado | palabra nueva con fonética propia | vacío de significado al inicio |
| Compuesto / fusión | dos raíces unidas | forzado o ilegible |
| Metáfora | objeto/acción de otro mundo que explica el mecanismo | cliché si es obvia |
| Nombre propio / lugar | persona, calle, geografía con historia | poco escalable |
| Préstamo de otro idioma | latín, guaraní, italiano, etc. | significado no deseado |

**Evitar:** siglas y acrónimos (no se recuerdan ni se registran bien), sufijos gastados (-ify, -ly, -io,
-IA forzado, -hub, -lab), juegos de palabras que solo funcionan escritos, nombres de 4+ sílabas difíciles de
dictar, y cualquier cosa que suene a una marca existente del rubro.

## 2. Filtrar

Para cada candidato, puntaje 1–5 en: distintividad, pronunciación (se dicta por teléfono sin deletrear),
memoria, adecuación al brief, extensibilidad, riesgo de significado negativo (español rioplatense,
LATAM, España, inglés). Quedate con **3–5 finalistas**.

## 3. Por candidato (los 10–15)

- Nombre, estrategia, **fundamento** (1–2 líneas, por qué encaja con el mecanismo).
- Pronunciación: español `[aproximación fonética]` e inglés `/IPA simple/`; si cambia el sentido entre
  idiomas, decirlo.
- Riesgos semánticos.

## 4. Por finalista

- 3 opciones de eslogan en español (y en inglés si el mercado lo pide): una funcional, una emocional, una
  de campaña. Cortas, sin "revolucionario", "mágico", "transformación".
- Wordmark rápido (solo tipografía, sin diseño) para ver cómo se lee escrito en minúsculas y mayúsculas.
- **Chequeo preliminar** (ver abajo).

## 5. Chequeo preliminar de disponibilidad

Rotulá la sección, literal: **"Chequeo PRELIMINAR — no es asesoramiento legal ni clearance marcario.
Antes de registrar, lanzar o invertir en pauta, hace falta búsqueda profesional."**

Por finalista, con fecha y fuente:
- **Marcas:** INPI Argentina (búsqueda de marcas / fonética) si el mercado incluye AR; WIPO Global Brand
  Database para internacional; USPTO si hay EE.UU.; EUIPO/OEPM si hay España/UE. Anotá clases de Niza
  relevantes (p. ej. 9, 35, 42 para software/servicios) y homónimos o similares **en la misma categoría**.
- **Empresas activas** con ese nombre en el rubro (búsqueda web abierta).
- **Dominios:** `.com`, `.com.ar` / TLD del mercado, `.app`/`.io` si aplica — vía RDAP/whois
  (`https://rdap.org/domain/<dominio>`) o buscador de un registrar. "Registrado" ≠ "en uso": anotá ambos.
- **Handles:** Instagram, X, LinkedIn (company), TikTok — abrir la URL del perfil; "libre" solo si da 404
  o la plataforma lo confirma. Marcar variantes posibles.
- Semáforo: 🟢 sin conflictos visibles · 🟡 homónimos en otras categorías / dominio tomado · 🔴 conflicto en
  la misma categoría o mercado.

Si una búsqueda no se pudo hacer (captcha, sitio caído), decilo: "no verificado". Nunca completar
CAPTCHAs ni crear cuentas.

## 6. Salida — `02-naming/NAMING.md`

```
# Naming — <proyecto>
Fecha · Estado: propuesta | elegido: <nombre> por <quién>

## Criterios (del brief)
## Candidatos (tabla: nombre · estrategia · fundamento · pronunciación ES/EN · riesgos · puntaje)
## Finalistas (3–5): eslóganes, lectura escrita, chequeo preliminar con semáforo, fuentes y fecha
## Recomendación (con razones) — la decisión es del equipo
## Próximo paso legal
```

## Gate

Entregá y **esperá** la elección del equipo. Registrá en `brand.config.json` (`nombre`, `eslogan`) y en
`DECISIONES.md` solo cuando el equipo decida. Pueden viajar 2–3 finalistas a territorios si el equipo lo pide.
Actualizá ESTADO/RETOMAR.
