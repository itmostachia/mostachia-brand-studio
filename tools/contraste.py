#!/usr/bin/env python3
"""Matriz de contraste WCAG 2.x desde territorios.json o brand.config.json → CSV + Markdown.

Uso:
  python tools/contraste.py <territorios.json | brand.config.json> [--out 08-qa] [--prefijo contrastes]

territorios.json (esquema en skills/territorios-marca/references/ficha-territorio.md):
  evalúa `pares_contraste` de cada territorio (si falta, usa pares por defecto).
  Umbrales por `uso`: texto ≥ 4.5 · texto-grande / boton / ui ≥ 3 · grafico se reporta y no bloquea.
  Sale con código 1 si algún par bloqueante no cumple o referencia un rol inexistente.
brand.config.json:
  matriz completa de todos los pares de `colores` con su nivel (AAA / AA / AA grande / falla). Informativa.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from itertools import permutations
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

UMBRALES = {"texto": 4.5, "texto-grande": 3.0, "boton": 3.0, "ui": 3.0, "grafico": 3.0}
NO_BLOQUEA = {"grafico"}
PARES_DEFAULT = [
    {"fg": "ink", "bg": "base", "uso": "texto"},
    {"fg": "muted", "bg": "base", "uso": "texto"},
    {"fg": "ink", "bg": "surface", "uso": "texto"},
    {"fg": "on_action", "bg": "action", "uso": "boton"},
]


def luminancia(hex_color: str) -> float:
    value = hex_color.strip().lstrip("#")
    if len(value) != 6:
        raise ValueError(f"HEX inválido: {hex_color}")
    channels = []
    for i in (0, 2, 4):
        c = int(value[i : i + 2], 16) / 255
        channels.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


def ratio(a: str, b: str) -> float:
    la, lb = sorted((luminancia(a), luminancia(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def nivel(r: float) -> str:
    if r >= 7:
        return "AAA"
    if r >= 4.5:
        return "AA"
    if r >= 3:
        return "AA grande / UI"
    return "falla"


def evaluar_territorios(doc: dict) -> list[dict]:
    filas = []
    for t in doc.get("territorios", []):
        colores = {c.get("rol"): c.get("hex") for c in t.get("paleta", [])}
        pares = t.get("pares_contraste") or PARES_DEFAULT
        for par in pares:
            fg, bg, uso = par.get("fg"), par.get("bg"), (par.get("uso") or "texto").lower()
            umbral = UMBRALES.get(uso, 4.5)
            bloquea = uso not in NO_BLOQUEA
            fila = {
                "territorio": t.get("id", ""), "nombre": t.get("nombre", ""),
                "fg_rol": fg, "fg_hex": colores.get(fg, ""), "bg_rol": bg, "bg_hex": colores.get(bg, ""),
                "uso": uso, "umbral": umbral, "bloquea": "si" if bloquea else "no",
            }
            if fg not in colores or bg not in colores:
                faltan = [r for r in (fg, bg) if r not in colores]
                fila.update(ratio="", nivel="", cumple="no", nota=f"rol inexistente: {', '.join(faltan)}")
                if not bloquea:
                    fila["nota"] += " (no bloquea)"
            else:
                r = ratio(colores[fg], colores[bg])
                fila.update(ratio=f"{r:.2f}", nivel=nivel(r), cumple="si" if r >= umbral else "no", nota="")
            filas.append(fila)
    return filas


def evaluar_config(doc: dict) -> list[dict]:
    colores = [c for c in doc.get("colores", []) if c.get("hex")]
    filas = []
    for a, b in permutations(colores, 2):
        r = ratio(a["hex"], b["hex"])
        filas.append({
            "territorio": doc.get("slug", ""), "nombre": doc.get("nombre", ""),
            "fg_rol": a.get("id", ""), "fg_hex": a["hex"], "bg_rol": b.get("id", ""), "bg_hex": b["hex"],
            "uso": "matriz", "umbral": 4.5, "bloquea": "no", "ratio": f"{r:.2f}", "nivel": nivel(r),
            "cumple": "si" if r >= 4.5 else "no", "nota": "",
        })
    return filas


CAMPOS = ["territorio", "nombre", "fg_rol", "fg_hex", "bg_rol", "bg_hex", "uso", "ratio", "umbral", "nivel", "cumple", "bloquea", "nota"]


def escribir(filas: list[dict], out_dir: Path, prefijo: str, fuente: Path, modo: str) -> tuple[Path, Path, list[dict]]:
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / f"{prefijo}.csv"
    md_path = out_dir / f"{prefijo}.md"
    with csv_path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=CAMPOS)
        writer.writeheader()
        writer.writerows(filas)
    fallas = [f for f in filas if f["cumple"] == "no" and f["bloquea"] == "si"]
    avisos = [f for f in filas if f["cumple"] == "no" and f["bloquea"] == "no"]
    lines = [f"# Contrastes WCAG — {fuente.name}", ""]
    if modo == "territorios":
        lines += [
            f"- Pares evaluados: {len(filas)}",
            f"- Fallas bloqueantes: **{len(fallas)}**",
            f"- Avisos (uso gráfico, no bloquean): {len(avisos)}",
            "- Umbrales: texto ≥ 4.5 · texto-grande / boton / ui ≥ 3 · grafico se reporta",
            "",
            "| Territorio | Par | Uso | Ratio | Umbral | Resultado |",
            "|---|---|---|---|---|---|",
        ]
        for f in filas:
            estado = "OK" if f["cumple"] == "si" else ("FALLA" if f["bloquea"] == "si" else "aviso")
            par = f"{f['fg_rol']} {f['fg_hex']} / {f['bg_rol']} {f['bg_hex']}"
            lines.append(f"| {f['territorio']} {f['nombre']} | {par} | {f['uso']} | {f['ratio'] or '—'} | {f['umbral']} | {estado}{(' · ' + f['nota']) if f['nota'] else ''} |")
    else:
        ids = []
        for f in filas:
            for rol in (f["fg_rol"], f["bg_rol"]):
                if rol not in ids:
                    ids.append(rol)
        lookup = {(f["fg_rol"], f["bg_rol"]): f for f in filas}
        lines += ["Matriz texto (fila) sobre fondo (columna). Informativa: elegí los pares de uso real.", "",
                  "| texto \\ fondo | " + " | ".join(ids) + " |", "|---" * (len(ids) + 1) + "|"]
        for fg in ids:
            cells = ["—" if fg == bg else f"{lookup[(fg, bg)]['ratio']} {lookup[(fg, bg)]['nivel']}" for bg in ids]
            lines.append(f"| **{fg}** | " + " | ".join(cells) + " |")
    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return csv_path, md_path, fallas


def main() -> int:
    parser = argparse.ArgumentParser(description="Matriz de contraste WCAG")
    parser.add_argument("entrada", type=Path)
    parser.add_argument("--out", type=Path, default=None, help="carpeta de salida (default: junto a la entrada)")
    parser.add_argument("--prefijo", default="contrastes")
    args = parser.parse_args()
    doc = json.loads(args.entrada.read_text(encoding="utf-8-sig"))
    modo = "territorios" if isinstance(doc.get("territorios"), list) else "config" if isinstance(doc.get("colores"), list) else ""
    if not modo:
        print("ERROR: la entrada no tiene 'territorios' ni 'colores'")
        return 2
    try:
        filas = evaluar_territorios(doc) if modo == "territorios" else evaluar_config(doc)
    except ValueError as error:
        print(f"ERROR: {error}")
        return 2
    csv_path, md_path, fallas = escribir(filas, args.out or args.entrada.parent, args.prefijo, args.entrada, modo)
    print(f"OK {csv_path}")
    print(f"OK {md_path}")
    if fallas:
        print(f"FAIL contraste: {len(fallas)} par(es) bloqueante(s) no cumplen")
        for f in fallas:
            print(f"- {f['territorio']} {f['fg_rol']}/{f['bg_rol']} ({f['uso']}): {f['ratio'] or f['nota']} < {f['umbral']}")
        return 1
    print(f"PASS contraste: {len(filas)} pares evaluados, sin fallas bloqueantes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
