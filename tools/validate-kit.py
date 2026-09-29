#!/usr/bin/env python3
"""Valida un kit de marca (docs/CONTRATO.md §3): archivos requeridos, dimensiones y restos sospechosos.

Uso:
  python tools/validate-kit.py <expediente>/06-kit [--config <expediente>/brand.config.json] [--sin-brandbook]

Chequea:
  - estructura del contrato (carpetas y archivos clave, BRAND-BOOK.pdf con páginas)
  - símbolo PNG de 32 a 2048 px y lockups de 2400 px, con el ancho declarado en el nombre
  - plantillas sociales en 1080x1350, 1080x1920, 1200x627 y 1920x1080
  - kit-manifest.json (si existe): cada archivo presente y con sus dimensiones
  - archivos vacíos, marcadores {{…}} sin completar y rutas locales (file:///, C:\\Users…) en archivos de texto
  - con --config: los colores de tokens.json coinciden con brand.config.json
Sale con código 1 si hay errores.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

try:
    from PIL import Image
except ImportError as error:  # pragma: no cover
    print(f"ERROR: falta Pillow ({error}). Instalá: python -m pip install Pillow pypdfium2")
    sys.exit(2)

TEXT_EXT = {".md", ".txt", ".html", ".htm", ".css", ".js", ".json", ".svg", ".csv"}
SOCIAL_SIZES = [(1080, 1350), (1080, 1920), (1200, 627), (1920, 1080)]
SYMBOL_SIZES = [32, 64, 128, 256, 512, 1024, 2048]
LOCAL_PATH = re.compile(r"file:///|[A-Za-z]:(?:\\{1,2}|/)Users|/Users/[^/\s]+/|/home/[^/\s]+/")
PLACEHOLDER = re.compile(r"\{\{\s*\w+\s*\}\}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validación de kit de marca")
    parser.add_argument("kit", type=Path)
    parser.add_argument("--config", type=Path)
    parser.add_argument("--sin-brandbook", action="store_true")
    args = parser.parse_args()
    kit: Path = args.kit
    errors: list[str] = []
    notes: list[str] = []
    if not kit.is_dir():
        print(f"FAIL: no existe la carpeta {kit}")
        return 1

    def need(relative: str) -> Path:
        path = kit / relative
        if not path.exists():
            errors.append(f"Falta: {relative}")
        return path

    for relative in [
        "01_LOGOS/vector", "01_LOGOS/png", "02_COLORES_Y_TIPOGRAFIA/tokens.json", "02_COLORES_Y_TIPOGRAFIA/tokens.css",
        "02_COLORES_Y_TIPOGRAFIA/fonts", "02_COLORES_Y_TIPOGRAFIA/LICENCIAS-TIPOGRAFIAS.md", "03_FONDOS_Y_PATRONES",
        "04_PLANTILLAS_SOCIALES", "05_MOCKUPS_Y_CAMPANA", "06_GUIAS/GUIA-RAPIDA.md", "06_GUIAS/AUDITORIA-IDENTIDAD.md",
        "07_PRODUCT_UI", "FUENTES_EDITABLES", "README.md",
    ]:
        need(relative)

    vectors = list((kit / "01_LOGOS/vector").glob("*.svg")) if (kit / "01_LOGOS/vector").exists() else []
    if not vectors:
        errors.append("01_LOGOS/vector no tiene SVG")
    png_dir = kit / "01_LOGOS/png"
    pngs = list(png_dir.glob("*.png")) if png_dir.exists() else []

    def width_of(path: Path) -> tuple[int, int]:
        with Image.open(path) as image:
            return image.size

    for size in SYMBOL_SIZES:
        matches = [p for p in pngs if re.search(rf"simbolo-{size}\.png$", p.name)]
        if not matches:
            errors.append(f"Falta el símbolo PNG de {size} px (…simbolo-{size}.png)")
        for p in matches:
            if width_of(p)[0] != size:
                errors.append(f"{p.name}: ancho {width_of(p)[0]}, esperado {size}")
    lockups = [p for p in pngs if re.search(r"logo-.*-2400\.png$", p.name)]
    if not lockups:
        errors.append("Falta al menos un lockup PNG de 2400 px (…logo-…-2400.png)")
    for p in lockups:
        if width_of(p)[0] != 2400:
            errors.append(f"{p.name}: ancho {width_of(p)[0]}, esperado 2400")
    for p in pngs:
        with Image.open(p) as image:
            if image.mode not in ("RGBA", "LA", "P"):
                notes.append(f"{p.name}: sin canal alfa ({image.mode})")

    social = kit / "04_PLANTILLAS_SOCIALES"
    found = {}
    if social.exists():
        for p in social.glob("*.png"):
            found.setdefault(width_of(p), []).append(p.name)
    for size in SOCIAL_SIZES:
        if size not in found:
            errors.append(f"Falta plantilla social {size[0]}x{size[1]} en 04_PLANTILLAS_SOCIALES/")

    if not args.sin_brandbook:
        pdf = need("BRAND-BOOK.pdf")
        if pdf.exists():
            try:
                import pypdfium2 as pdfium
                doc = pdfium.PdfDocument(str(pdf))
                pages = len(doc)
                doc.close()
                if pages == 0:
                    errors.append("BRAND-BOOK.pdf no tiene páginas")
                else:
                    notes.append(f"BRAND-BOOK.pdf: {pages} páginas")
            except ImportError:
                notes.append("pypdfium2 no instalado: no se contaron páginas del brand book")

    manifest_path = kit / "kit-manifest.json"
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        for item in manifest.get("archivos", []):
            path = kit / item["ruta"]
            if not path.exists():
                errors.append(f"Manifiesto: falta {item['ruta']}")
                continue
            if path.suffix.lower() == ".png" and ("ancho" in item or "alto" in item):
                w, h = width_of(path)
                if "ancho" in item and w != item["ancho"]:
                    errors.append(f"{item['ruta']}: ancho {w}, esperado {item['ancho']}")
                if "alto" in item and h != item["alto"]:
                    errors.append(f"{item['ruta']}: alto {h}, esperado {item['alto']}")
    else:
        notes.append("Sin kit-manifest.json (kit no generado por build-brand-kit): solo chequeos estructurales")

    for path in kit.rglob("*"):
        if not path.is_file() or path.name == ".gitkeep":
            continue
        rel = path.relative_to(kit).as_posix()
        if path.stat().st_size == 0:
            errors.append(f"Archivo vacío: {rel}")
            continue
        if path.suffix.lower() in TEXT_EXT and path.stat().st_size < 5_000_000:
            text = path.read_text(encoding="utf-8", errors="replace")
            if PLACEHOLDER.search(text):
                errors.append(f"Marcador sin completar {PLACEHOLDER.search(text).group(0)} en {rel}")
            if LOCAL_PATH.search(text):
                errors.append(f"Ruta local de una máquina en {rel}: {LOCAL_PATH.search(text).group(0)}")

    if args.config and (kit / "02_COLORES_Y_TIPOGRAFIA/tokens.json").exists():
        config = json.loads(args.config.read_text(encoding="utf-8-sig"))
        tokens = json.loads((kit / "02_COLORES_Y_TIPOGRAFIA/tokens.json").read_text(encoding="utf-8"))
        for color in config.get("colores", []):
            token = tokens.get("colores", {}).get(color.get("id"))
            if not token:
                errors.append(f"tokens.json no tiene el color '{color.get('id')}' de brand.config.json")
            elif token.get("hex", "").upper() != color.get("hex", "").upper():
                errors.append(f"Color '{color.get('id')}': tokens {token.get('hex')} ≠ config {color.get('hex')}")

    if errors:
        print(f"FAIL validate-kit: {len(errors)} error(es)")
        for error in errors:
            print(f"- {error}")
        return 1
    total = sum(1 for p in kit.rglob("*") if p.is_file())
    print(f"PASS validate-kit: {total} archivos · símbolo {SYMBOL_SIZES[0]}–{SYMBOL_SIZES[-1]} px · 4 plantillas sociales · {len(vectors)} SVG")
    for note in notes:
        print(f"  nota: {note}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
