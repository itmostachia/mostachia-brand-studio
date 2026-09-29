# boards/

Una carpeta por territorio, con el mismo `id` que en `territorios.json`:

```
boards/T01/
  board.(html|svg|png)        página A: brandboard completo
  aplicacion.(html|svg|png)   página B: aplicaciones
  simbolo.svg                 opcional: símbolo vectorial (lo usan galería y exploración si no hay board)
  descartes/                  versiones descartadas (no se borran)
```

Rutas en `territorios.json → archivos` relativas a `04-territorios/`.
