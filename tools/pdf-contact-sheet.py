#!/usr/bin/env python3
"""Rasteriza las páginas de un PDF → <out>/pages/page-NN.png + contact sheets (16 por hoja).

Uso:
  python tools/pdf-contact-sheet.py <archivo.pdf> <carpeta-salida> [--escala 1.5] [--cols 4] [--por-hoja 16]

La contact sheet es para MIRARLA: un script que sale con código 0 no es QA visual.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

try:
    import pypdfium2 as pdfium
    from PIL import Image, ImageDraw, ImageFont
except ImportError as error:  # pragma: no cover
    print(f"ERROR: falta dependencia ({error}). Instalá: python -m pip install Pillow pypdfium2")
    sys.exit(2)


def fuente(size: int):
    try:
        return ImageFont.load_default(size=size)
    except TypeError:  # Pillow < 10.1
        return ImageFont.load_default()


def contact_sheets(images: list[Path], out_dir: Path, nombre: str, cols: int, por_hoja: int) -> list[Path]:
    thumb_w, thumb_h, gap, label_h = 360, 240, 16, 22
    outputs = []
    font = fuente(14)
    for sheet_index in range((len(images) + por_hoja - 1) // por_hoja):
        batch = images[sheet_index * por_hoja : (sheet_index + 1) * por_hoja]
        rows = (len(batch) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * gap, rows * (thumb_h + label_h) + (rows + 1) * gap), "#1b1b19")
        draw = ImageDraw.Draw(sheet)
        for i, path in enumerate(batch):
            number = sheet_index * por_hoja + i + 1
            x = gap + (i % cols) * (thumb_w + gap)
            y = gap + (i // cols) * (thumb_h + label_h + gap)
            with Image.open(path) as page:
                page = page.convert("RGB")
                page.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
                sheet.paste(page, (x + (thumb_w - page.width) // 2, y + label_h + (thumb_h - page.height) // 2))
            draw.text((x, y + 2), f"{number:02d}", fill="#f4f3ef", font=font)
        target = out_dir / f"{nombre}-{sheet_index + 1}.jpg"
        sheet.save(target, quality=90, optimize=True)
        outputs.append(target)
    return outputs


def main() -> int:
    parser = argparse.ArgumentParser(description="PDF → páginas PNG + contact sheet")
    parser.add_argument("pdf", type=Path)
    parser.add_argument("salida", type=Path)
    parser.add_argument("--escala", type=float, default=1.5, help="1.0 = 72 dpi")
    parser.add_argument("--cols", type=int, default=4)
    parser.add_argument("--por-hoja", type=int, default=16)
    parser.add_argument("--nombre", default="contact-sheet")
    args = parser.parse_args()
    if not args.pdf.exists():
        print(f"ERROR: no existe {args.pdf}")
        return 2
    pages_dir = args.salida / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    pdf = pdfium.PdfDocument(str(args.pdf))
    images = []
    try:
        for index in range(len(pdf)):
            image = pdf[index].render(scale=args.escala).to_pil().convert("RGB")
            target = pages_dir / f"page-{index + 1:02d}.png"
            image.save(target, optimize=True)
            images.append(target)
    finally:
        pdf.close()
    if not images:
        print("ERROR: el PDF no tiene páginas")
        return 1
    sheets = contact_sheets(images, args.salida, args.nombre, args.cols, args.por_hoja)
    print(f"OK {len(images)} páginas → {pages_dir}")
    for sheet in sheets:
        print(f"OK {sheet}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
