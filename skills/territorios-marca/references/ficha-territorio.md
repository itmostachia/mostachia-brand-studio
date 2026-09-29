# Ficha de territorio + esquema de `territorios.json`

## Ficha (TERRITORIOS.md, una sección por territorio)

```
## T07 — <nombre interno del territorio>

**Idea:** <una frase>. **Metáfora / mecanismo:** <cómo el gesto traduce lo que hace la marca>.
**Lectura estratégica:** <qué percibe la audiencia, frente a qué competidor se diferencia>.
**Anclaje:** <REF-xx que inspiran y qué principio se toma / qué se descarta>.

### Paleta por roles
| Rol | Nombre | HEX | Uso |
| base | … | #F5F1EB | fondo operativo |
| surface | | | |
| ink | | | texto principal, wordmark |
| muted | | | secundario (contraste medido) |
| line | | | separadores |
| brand | | | acento 1 — rol |
| action | | | acción primaria |
| on_action | | | texto sobre acción |
| dark_surface | | | |
| success / warning / error | | | error ≠ brand |

### Tipografía
| Rol | Familia · pesos | Clasificación | Fuente / licencia (URL al OFL.txt) |
| display | | | |
| texto/UI | | | |
| números/mono | | | |

### Símbolo y wordmark
Construcción del gesto (qué letra/figura, qué operación, dónde NO va). Reducción a 24 px. Prueba mono.
Qué evitar para no parecerse a marcas existentes.

### Gramática gráfica
4–5 reglas: cómo aparece el gesto en layout, UI (selección, divisores, progreso), fondos, retícula.

### Imagen
Tipo de fotografía/ilustración/materia, luz, encuadre, tratamiento. Qué no (clichés del rubro).

### Movimiento
Gesto de movimiento y propósito; versión ligera; versión con movimiento reducido.

### 8 aplicaciones
Tabla superficie → cómo se aplica (usar las 8 de la escena de demo común).

### Pre-crítica
Fortaleza · Riesgo · Señal de fracaso · Prueba decisiva.
```

## Esquema `territorios.json`

```json
{
  "marca": "<nombre>",
  "version": 1,
  "fecha": "AAAA-MM-DD",
  "marco": { "formato_a": "3:4", "formato_b": "16:10", "escena_demo": "…" },
  "territorios": [
    {
      "id": "T07",
      "nombre": "…",
      "idea": "…",
      "lectura": "…",
      "anclaje": ["REF-03", "REF-11"],
      "paleta": [
        { "rol": "base", "nombre": "…", "hex": "#F5F1EB", "uso": "…" }
      ],
      "pares_contraste": [
        { "fg": "ink", "bg": "base", "uso": "texto" },
        { "fg": "on_action", "bg": "action", "uso": "boton" },
        { "fg": "brand", "bg": "base", "uso": "grafico" }
      ],
      "tipografias": [
        { "rol": "display", "familia": "…", "pesos": "700–800", "clasificacion": "grotesk",
          "fuente": "Google Fonts", "licencia": "OFL", "url_licencia": "…" }
      ],
      "simbolo": "…",
      "wordmark": "…",
      "gesto": "…",
      "familia_paleta": "calidos-terrosos",
      "gramatica": ["…"],
      "imagen": "…",
      "movimiento": "…",
      "aplicaciones": [ { "superficie": "…", "aplicacion": "…" } ],
      "critica": { "fortaleza": "…", "riesgo": "…", "fracaso": "…", "prueba": "…" },
      "archivos": { "board": "boards/T07/board.png", "aplicacion": "boards/T07/aplicacion.png", "simbolo": "boards/T07/simbolo.svg" },
      "rubrica": { "total": 17, "detalle": { "idea": 4, "sistema": 4, "aplicacion": 3, "oficio": 3, "distincion": 3 }, "nota": "…" }
    }
  ]
}
```

- `hex` siempre `#RRGGBB` mayúsculas; rutas relativas a `04-territorios/`.
- `pares_contraste.uso`: `texto` (≥4.5), `texto-grande` / `boton` / `ui` (≥3), `grafico` (se reporta, no
  bloquea).
- Guardar con UTF-8 sin BOM.
