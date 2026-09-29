#!/usr/bin/env python3
"""Índice visual (hoja de contacto) de N boards, con número y nombre debajo de cada uno.

Uso:
  python tools/board-index.py <salida.jpg> <img1> <img2> ... [--etiquetas "T01 · A,T02 · B"] [--titulo "..."] [--cols 6]
  python tools/board-index.py <salida.jpg> --territorios 04-territorios/territorios.json [--archivo board] [--titulo "..."]
  python tools/board-index.py <salida.jpg> --carpeta 08-qa/exploracion/pages [--patron "page-*.png"]

Con --territorios toma `archivos.<archivo>` (board por defecto) de cada territorio; los que no tengan
imagen raster (png/jpg/webp) se omiten con aviso. Rasterizá antes los board.html/svg con tools/render.mjs.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError as error:  # pragma: no cover
    print(f"ERROR: falta Pillow ({error}). Instalá: python -m pip install Pillow")
    sys.exit(2)

RASTER = {".png", ".jpg", ".jpeg", ".webp"}


def fuente(size: int):
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def desde_territorios(json_path: Path, clave: str) -> list[tuple[Path, str]]:
    doc = json.loads(json_path.read_text(encoding="utf-8-sig"))
    items = []
    for t in doc.get("territorios", []):
        rel = (t.get("archivos") or {}).get(clave)
        path = json_path.parent / rel if rel else None
        if not path or not path.exists() or path.suffix.lower() not in RASTER:
            print(f"AVISO {t.get('id')}: sin {clave} raster ({rel or 'no declarado'}), se omite")
            continue
        items.append((path, f"{t.get('id', '')} · {t.get('nombre', '')}"))
    return items


def main() -> int:
    parser = argparse.ArgumentParser(description="Índice visual de boards")
    parser.add_argument("salida", type=Path)
    parser.add_argument("imagenes", nargs="*", type=Path)
    parser.add_argument("--etiquetas", default="")
    parser.add_argument("--territorios", type=Path)
    parser.add_argument("--archivo", default="board")
    parser.add_argument("--carpeta", type=Path)
    parser.add_argument("--patron", default="*.png")
    parser.add_argument("--titulo", default="")
    parser.add_argument("--cols", type=int, default=6)
    parser.add_argument("--celda", type=int, default=560, help="ancho de cada miniatura en px")
    args = parser.parse_args()

    items: list[tuple[Path, str]] = []
    if args.territorios:
        items = desde_territorios(args.territorios, args.archivo)
    elif args.carpeta:
        items = [(p, p.stem) for p in sorted(args.carpeta.glob(args.patron))]
    else:
        labels = [x.strip() for x in args.etiquetas.split(",")] if args.etiquetas else []
        items = [(p, labels[i] if i < len(labels) else p.stem) for i, p in enumerate(args.imagenes)]
    items = [(p, label) for p, label in items if p.exists()]
    if not items:
        print("ERROR: no hay imágenes para indexar")
        return 1

    cols = max(1, min(args.cols, len(items)))
    rows = (len(items) + cols - 1) // cols
    cell_w = args.celda
    cell_h = int(cell_w * 0.5625)
    gap, label_h, margin = 28, 40, 60
    title_h = 90 if args.titulo else 0
    width = margin * 2 + cols * cell_w + (cols - 1) * gap
    height = margin * 2 + title_h + rows * (cell_h + label_h) + (rows - 1) * gap
    canvas = Image.new("RGB", (width, height), "#161614")
    draw = ImageDraw.Draw(canvas)
    if args.titulo:
        draw.text((margin, margin), args.titulo, fill="#f4f3ef", font=fuente(40))
    label_font = fuente(22)
    for index, (path, label) in enumerate(items):
        x = margin + (index % cols) * (cell_w + gap)
        y = margin + title_h + (index // cols) * (cell_h + label_h + gap)
        draw.rounded_rectangle((x, y, x + cell_w, y + cell_h), radius=12, fill="#e9e7e1")
        with Image.open(path) as image:
            image = image.convert("RGB")
            image.thumbnail((cell_w - 12, cell_h - 12), Image.Resampling.LANCZOS)
            canvas.paste(image, (x + (cell_w - image.width) // 2, y + (cell_h - image.height) // 2))
        draw.text((x + 2, y + cell_h + 10), f"{index + 1:02d}  {label}", fill="#f4f3ef", font=label_font)
    args.salida.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(args.salida, quality=92, subsampling=0)
    print(f"OK {args.salida} ({len(items)} boards)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
