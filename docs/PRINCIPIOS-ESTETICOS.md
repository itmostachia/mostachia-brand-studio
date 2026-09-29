# Principios estéticos — doctrina anti-genérica

> Toda skill que produce algo visible lee esto antes. Si una decisión no se puede justificar con estos
> principios, no va.

## 1. Principios

1. **Mundos completos, no bocetos sueltos.** Cada territorio es un mundo inevitable: forma, color, tipo,
   imagen, interfaz y ritmo salen de **una** idea central. Se entiende en segundos y se sostiene al mirarlo
   largo rato.
2. **Mismo marco, expresión radicalmente distinta.** El marco de comparación es fijo (formato, módulos,
   escena de demo). Adentro cambian escala, densidad, geometría y materia. Dos territorios que solo difieren
   en el HEX son uno solo.
3. **La marca se prueba aplicada.** Un logo lindo en fondo blanco no prueba nada. Cada idea tiene que
   sobrevivir en producto, web, social, mail y un soporte físico o de campaña del rubro.
4. **Un gesto gráfico propietario.** Una sola operación formal que funciona como logo **y** como elemento de
   interfaz/layout (un corte, una franja, un anillo abierto, un pliegue, una marca de registro). Si el gesto
   no se puede usar en un botón, un divisor o una transición, no es sistema: es adorno.
5. **El color es sintaxis.** Cada color tiene un rol (fondo, texto, acción, señal, estado). Dos acentos como
   máximo, con roles distintos y nunca con el mismo peso. Contraste medido, no estimado.
6. **Tipografía real y licenciada.** La tipo cambia la categoría percibida (editorial, instrumento, servicio
   financiero, organismo, herramienta radical). Familias reales, preferentemente OFL / Google Fonts, con
   licencia verificada en fuente primaria.
7. **Pocas palabras, decisivas.** El nombre, una promesa y unas etiquetas. La explicación larga no
   reemplaza a un artefacto convincente.
8. **Materia antes que futurismo.** Papel, tinta, relieve, metal mate, textura fotográfica, luz localizada
   hacen tangible lo digital. Visualizaciones que se sienten construidas, no generadas.
9. **Concepto ≠ prototipo.** El board es arte conceptual para decidir; la web es un prototipo funcional. No
   confundirlos, no prometer lo que el producto no hace, y **no implementar más plano de lo aprobado**.
10. **El contenido del cliente es del cliente.** En mockups de producto, las piezas/fotos/logos de terceros
    conservan su estilo; no se tiñen con la paleta de la marca.

## 2. Clichés prohibidos por industria

Aplican a símbolo, imagen, mockups y copy. Si el rubro no está, deducí sus clichés antes de diseñar y
anotalos en el brief.

| Rubro | No usar |
|---|---|
| **Todos** | Tazas, mesas de café, comida decorativa, plantas de relleno, laptops inclinadas en escritorio de madera, apretones de manos, gente genérica sonriendo a cámara, bolsas de compra, playas/montañas de fondo, blobs brillantes sin motivo, bento redondeado en todo, "stacks" de dispositivos flotando |
| **Legal / abogados** | Balanza, mazo, columnas griegas, Temis, libros de cuero, pluma estilográfica, escudos heráldicos, azul marino + dorado por defecto, serif "de estudio antiguo" como única voz |
| **Finanzas / fintech** | Gráficos subiendo con flecha, monedas y billetes, alcancías, candados, escudos, cohetes, verde dólar + negro, tarjetas de crédito flotando, "crecimiento %" inventado |
| **Salud** | Cruz médica, corazón con pulso ECG, estetoscopio, hojas/gotas "wellness", batas y sonrisas de stock, celeste hospital + blanco, ADN decorativo, manos formando corazón |
| **Tech / IA** | Glow violeta/azul, gradientes violeta genéricos, robots, cerebros, hologramas, circuitos, código falso de fondo, redes de nodos brillando, chispitas ✦ de "IA", ojos, orbes, "revolucionario/mágico" |
| **Gastronomía** | Gorro de chef, cubiertos cruzados, vapor humeante, pizarra con tiza, tablas de madera con ingredientes esparcidos, kraft + sello "artesanal", tipografía script de pizarra |
| **Inmobiliaria** | Casita con techo triangular, llave, skyline genérico, flecha hacia arriba en techo, familia frente a la casa, azul + naranja "confianza", renders de living beige |

## 3. Cómo encontrar el gesto propietario

1. **Partí del mecanismo, no del rubro.** ¿Qué hace el producto/servicio? (ordenar, abrir, traducir,
   ajustar, verificar, acompañar). Elegí el verbo más específico.
2. **Traducilo a una operación formal simple:** cortar, plegar, desplazar, abrir un hueco, repetir a
   intervalo, superponer, registrar, encuadrar.
3. **Aplicalo a una letra o a una figura mínima** (el corte en una t, un anillo con centro vacío, una franja
   que encaja). Una sola operación; si necesitás dos, elegí una.
4. **Prueba de sistema:** el mismo gesto tiene que resolver al menos tres cosas no-logo: selección en UI,
   divisor/marco de layout, transición/movimiento, patrón de fondo, estado de progreso.
5. **Prueba de reducción:** favicon 16/24 px en negro sólido, sin color ni sombra. Si se pierde, simplificar.
6. **Prueba de legibilidad del nombre:** el gesto nunca se inserta **dentro** de la palabra de forma que
   cambie la lectura (una barra entre letras puede leerse como otra letra). El wordmark se lee a la primera.
7. **Prueba de genericidad:** buscá la forma aislada; si es frecuente en el rubro (anillos, hexágonos,
   hojas), la propiedad tiene que venir de la segmentación exacta + paleta + wordmark, y se declara como
   riesgo en la auditoría.

## 4. Tipografía

- Máximo **tres registros**: display (identidad), texto/UI (explica sin ruido), números o mono (evidencia).
  Una serif de contrapunto solo en frases cortas.
- Licencia verificada en fuente primaria (archivo `OFL.txt` del repo de la familia). Registrar familia,
  fuente, licencia y fecha. No comprar ni usar fuentes sin licencia por inferencia.
- Probar en español real: ñ, tildes, ¿¡, cifras (`24,8 mil`, `1.234`), títulos largos, el nombre de la marca
  en caja alta y baja.
- Mono para párrafos largos: no. Tracking negativo en display sí; en texto chico, no.
- En imagen generada nunca inventar nombres de fuentes; se describen cualidades ("grotesk robusta, aperturas
  amplias").

## 5. Color

- Paleta **por roles**: `base`, `surface`, `ink`, `muted`, `line`, `brand`, `action`, `on_action`,
  `dark_surface`, estados (`success`, `warning`, `error`) — el error nunca igual al color de marca.
- **Dos acentos máximo**, con funciones distintas (p. ej. uno = dato/acción, otro = validación/excepción).
- Contraste WCAG medido con `tools/contraste.py` para cada par real: texto normal ≥ 4.5:1, texto grande y
  componentes ≥ 3:1. Un acento que no llega a 4.5 sobre claro queda **solo gráfico** y se documenta así.
- Nada de gradientes "de ambiente" por defecto. Si hay gradiente, es parte del gesto y tiene rol.

## 6. Símbolo y wordmark

- Símbolo legible a **24 px** y reconocible en **monocromo** (negro sólido y blanco sobre oscuro).
- Wordmark con el nombre **escrito exactamente** (verificar letra por letra en cada render).
- Versión horizontal, apilada, solo símbolo, claro/oscuro. SVG como master; PNG son exportaciones.
- Área de seguridad y tamaño mínimo definidos en la guía.

## 7. Checklist anti-slop (antes de mostrar cualquier cosa)

- [ ] ¿Hay algún objeto de la lista de clichés (general o del rubro)?
- [ ] ¿La estética podría ser de cualquier marca de IA/tech/SaaS? (violeta, glow, glass, chispitas)
- [ ] ¿Cada territorio tiene idea, paleta por roles, tipo con licencia, símbolo, gramática y aplicaciones?
- [ ] ¿Todos los territorios usan el mismo formato y la misma escena de demo?
- [ ] ¿Hay dos territorios que comparten familia de paleta + clasificación tipográfica + gesto?
- [ ] ¿El gesto aparece en al menos tres usos no-logo?
- [ ] ¿El nombre se lee exacto en cada wordmark, en cada aplicación?
- [ ] ¿Símbolo probado a 24 px y en mono?
- [ ] ¿Contrastes medidos (no estimados) y acentos solo-gráficos marcados?
- [ ] ¿Texto en español correcto, sin lorem, sin microtexto ilegible de relleno, sin cifras de éxito
      inventadas ni métricas presentadas como reales?
- [ ] ¿Las aplicaciones muestran el producto/servicio real (vistas múltiples, detalle, uso), no una foto
      lifestyle con logo pegado?
- [ ] ¿El contenido de terceros en mockups conserva su propio estilo?
- [ ] ¿La implementación conserva la riqueza del board aprobado? (comparar lado a lado)
- [ ] ¿Miré el render final (contact sheet), no solo el log del script?
