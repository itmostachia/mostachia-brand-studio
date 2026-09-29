#!/usr/bin/env python3
"""Empaqueta un expediente (o parte) en ZIP + MANIFIESTO.csv (path,size,sha256) + <zip>.sha256.

Uso:
  python tools/empaquetar.py <expediente> [--incluir 06-kit 04-territorios/EXPLORACION.pdf ...]
                             [--out <expediente>/09-entrega] [--nombre <slug>]

- Por defecto incluye todo el expediente salvo 09-entrega/, .git, node_modules, __pycache__ y ZIPs previos.
- Se NIEGA a empaquetar si encuentra archivos de secretos (.env, .pem, .key…) o, en archivos de texto,
  URLs firmadas (X-Amz-Signature, X-Goog-Signature, SAS sig=…) o tokens (sk-…, ghp_…, AIza…, xox…, JWT, Bearer…).
- No borra nada. Hashes SHA-256 en minúsculas. Verifica el ZIP (testzip) antes de terminar.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
import sys
import zipfile
from datetime import datetime
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

EXCLUDED_DIRS = {".git", "node_modules", "__pycache__", ".venv", ".next", ".autonomo"}
EXCLUDED_EXT = {".zip", ".pyc", ".log", ".pid", ".tmp"}
SECRET_FILES = re.compile(r"^(\.env(\..*)?|.*\.(pem|key|p12|pfx)|id_rsa.*|credentials.*\.json|client_secret.*\.json|(oauth|access)[-_]?token.*\.json)$", re.I)
TEXT_EXT = {".md", ".txt", ".csv", ".json", ".html", ".htm", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".css", ".svg", ".xml", ".yml", ".yaml", ".toml", ".ini", ".env", ".py", ".sh", ".ps1"}
SECRET_PATTERNS = [
    ("URL firmada S3", re.compile(r"X-Amz-(Signature|Credential)=", re.I)),
    ("URL firmada GCS", re.compile(r"X-Goog-(Signature|Credential)=", re.I)),
    ("URL firmada Azure SAS", re.compile(r"[?&]sv=\d{4}-\d{2}-\d{2}&.*\bsig=", re.I)),
    ("URL con token", re.compile(r"[?&](access_token|token|api_key|apikey|key|signature|sig)=[A-Za-z0-9%._\-]{16,}", re.I)),
    ("API key OpenAI/Anthropic", re.compile(r"\bsk-(ant-)?[A-Za-z0-9_\-]{20,}")),
    ("Token GitHub", re.compile(r"\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}")),
    ("API key Google", re.compile(r"\bAIza[0-9A-Za-z_\-]{35}\b")),
    ("OAuth Google", re.compile(r"\bya29\.[0-9A-Za-z_\-]{20,}")),
    ("Token Slack", re.compile(r"\bxox[baprs]-[0-9A-Za-z\-]{10,}")),
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("Clave privada", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
    ("JWT", re.compile(r"\beyJ[A-Za-z0-9_\-]{10,}\.eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}")),
    ("Bearer token", re.compile(r"Bearer\s+[A-Za-z0-9._\-]{24,}")),
]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest().lower()


def collect(root: Path, includes: list[str], out_dir: Path) -> list[Path]:
    bases = [root / inc for inc in includes] if includes else [root]
    files: list[Path] = []
    for base in bases:
        if not base.exists():
            raise SystemExit(f"ERROR: no existe {base}")
        candidates = [base] if base.is_file() else sorted(p for p in base.rglob("*") if p.is_file())
        for path in candidates:
            parts = set(path.relative_to(root).parts)
            if parts & EXCLUDED_DIRS or path.suffix.lower() in EXCLUDED_EXT:
                continue
            if out_dir in path.parents:
                continue
            files.append(path)
    return sorted(set(files))


def scan(root: Path, files: list[Path]) -> list[str]:
    problems = []
    for path in files:
        rel = path.relative_to(root).as_posix()
        if SECRET_FILES.match(path.name):
            problems.append(f"{rel}: archivo de secretos no admitido")
            continue
        if path.suffix.lower() in TEXT_EXT and path.stat().st_size < 20_000_000:
            text = path.read_text(encoding="utf-8", errors="replace")
            for label, pattern in SECRET_PATTERNS:
                match = pattern.search(text)
                if match:
                    line = text.count("\n", 0, match.start()) + 1
                    problems.append(f"{rel}:{line}: {label}")
    return problems


def main() -> int:
    parser = argparse.ArgumentParser(description="ZIP + manifiesto SHA-256 del expediente")
    parser.add_argument("expediente", type=Path)
    parser.add_argument("--incluir", nargs="*", default=[], help="rutas relativas al expediente (default: todo)")
    parser.add_argument("--out", type=Path, help="carpeta de salida (default: <expediente>/09-entrega)")
    parser.add_argument("--nombre", help="prefijo del ZIP (default: slug de brand.config.json o nombre de carpeta)")
    args = parser.parse_args()
    root = args.expediente.resolve()
    if not root.is_dir():
        print(f"ERROR: no existe {root}")
        return 2
    out_dir = (args.out or root / "09-entrega").resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    name = args.nombre
    if not name:
        config = root / "brand.config.json"
        name = json.loads(config.read_text(encoding="utf-8-sig")).get("slug") if config.exists() else None
        name = name or root.name
    files = collect(root, args.incluir, out_dir)
    if not files:
        print("ERROR: no hay archivos para empaquetar")
        return 1
    problems = scan(root, files)
    if problems:
        print(f"RECHAZADO: {len(problems)} posible(s) secreto(s) o URL(s) firmada(s). Limpialos y reintentá:")
        for problem in problems:
            print(f"- {problem}")
        return 1

    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    zip_path = out_dir / f"{name}-{stamp}.zip"
    manifest_path = out_dir / "MANIFIESTO.csv"
    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator="\n")
    writer.writerow(["path", "size", "sha256"])
    for path in files:
        writer.writerow([path.relative_to(root).as_posix(), path.stat().st_size, sha256_file(path)])
    manifest_text = buffer.getvalue()
    manifest_path.write_text(manifest_text, encoding="utf-8", newline="")
    with zipfile.ZipFile(zip_path, "x", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, path.relative_to(root).as_posix())
        archive.writestr("MANIFIESTO.csv", manifest_text)
    with zipfile.ZipFile(zip_path) as archive:
        bad = archive.testzip()
        if bad:
            print(f"ERROR: ZIP corrupto en {bad}")
            return 1
    digest = sha256_file(zip_path)
    sha_path = zip_path.with_name(zip_path.name + ".sha256")
    sha_path.write_text(f"{digest}  {zip_path.name}\n", encoding="ascii", newline="\n")
    print(f"OK {zip_path}")
    print(f"OK {manifest_path} ({len(files)} archivos)")
    print(f"OK {sha_path}")
    print(f"sha256 {digest} · {zip_path.stat().st_size} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
