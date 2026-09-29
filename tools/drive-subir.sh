#!/usr/bin/env bash
# OPCIONAL — sube archivos de un expediente a una carpeta de Google Drive con un CLI estilo `gws`
# (Google Workspace CLI: `<cli> drive files create --json … --upload <archivo>`).
# Nada del pipeline depende de este script: el ZIP de 09-entrega se puede subir a mano.
#
# Uso:
#   tools/drive-subir.sh <expediente> <archivo|carpeta> [...] [--dry-run]
# Config (nunca hardcodeada):
#   carpeta destino: env DRIVE_FOLDER_ID, o brand.config.json → drive.carpeta_id
#   comando CLI:     env DRIVE_CLI (default "gws"), p. ej. un wrapper por cuenta
#   cuenta:          brand.config.json → drive.cuenta (solo informativo; elegí el wrapper con DRIVE_CLI)
# Reanudable: registra cada subida en <expediente>/09-entrega/.drive-subidos.tsv (sha256, ruta, id) y
# saltea lo ya subido con el mismo contenido. Nunca borra, mueve ni cambia permisos en Drive.
# Sube los archivos planos a la carpeta destino (no recrea subcarpetas).
set -euo pipefail

usage() { sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }
[ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ] && usage 0
[ $# -lt 2 ] && usage 1

EXP="$1"; shift
DRY=0
TARGETS=()
for arg in "$@"; do
  if [ "$arg" = "--dry-run" ]; then DRY=1; else TARGETS+=("$arg"); fi
done
[ -f "$EXP/brand.config.json" ] || { echo "ERROR: no existe $EXP/brand.config.json" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "ERROR: se necesita node para leer brand.config.json" >&2; exit 1; }

cfg() { node -e 'const c=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8").replace(/^﻿/,""));const v=process.argv[2].split(".").reduce((o,k)=>o==null?o:o[k],c);process.stdout.write(v==null?"":String(v))' "$EXP/brand.config.json" "$1"; }

CLI="${DRIVE_CLI:-gws}"
FOLDER="${DRIVE_FOLDER_ID:-$(cfg drive.carpeta_id)}"
ACCOUNT="$(cfg drive.cuenta)"
[ -n "$FOLDER" ] || { echo "ERROR: falta la carpeta destino (DRIVE_FOLDER_ID o drive.carpeta_id en brand.config.json)" >&2; exit 1; }
if [ "$DRY" = 0 ]; then
  command -v "$CLI" >/dev/null 2>&1 || { echo "ERROR: no se encuentra el CLI '$CLI' (definí DRIVE_CLI)" >&2; exit 1; }
fi

LOG_DIR="$EXP/09-entrega"
LOG="$LOG_DIR/.drive-subidos.tsv"
mkdir -p "$LOG_DIR"
touch "$LOG"

hash_file() {
  if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1 | tr 'A-F' 'a-f'
  else node -e 'const c=require("crypto").createHash("sha256");c.update(require("fs").readFileSync(process.argv[1]));process.stdout.write(c.digest("hex"))' "$1"; fi
}
json_str() { node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$1"; }

FILES=()
for t in "${TARGETS[@]}"; do
  if [ -d "$t" ]; then
    while IFS= read -r -d '' f; do FILES+=("$f"); done < <(find "$t" -type f ! -name '.gitkeep' ! -name '.drive-subidos.tsv' -print0 | sort -z)
  elif [ -f "$t" ]; then FILES+=("$t")
  else echo "AVISO: no existe $t" >&2; fi
done
[ ${#FILES[@]} -gt 0 ] || { echo "ERROR: nada para subir" >&2; exit 1; }

echo "Destino: carpeta $FOLDER · CLI: $CLI${ACCOUNT:+ · cuenta: $ACCOUNT}"
[ "$DRY" = 1 ] && echo "(dry-run: no se sube nada)"
ok=0; skip=0; fail=0
for f in "${FILES[@]}"; do
  sum="$(hash_file "$f")"
  if grep -q "^$sum	" "$LOG"; then echo "SKIP $f (ya subido)"; skip=$((skip+1)); continue; fi
  base="$(basename "$f")"
  if [ "$DRY" = 1 ]; then echo "SUBIRÍA $f"; ok=$((ok+1)); continue; fi
  # El CLI sube desde el directorio del archivo con el nombre base (evita problemas de rutas en Windows).
  if out="$(cd "$(dirname "$f")" && "$CLI" drive files create \
        --params '{"supportsAllDrives":true,"fields":"id,name"}' \
        --json "{\"name\":$(json_str "$base"),\"parents\":[$(json_str "$FOLDER")]}" \
        --upload "$base" 2>&1)"; then
    id="$(printf '%s' "$out" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const m=s.match(/"id"\s*:\s*"([^"]+)"/);process.stdout.write(m?m[1]:"")})')"
    printf '%s\t%s\t%s\n' "$sum" "$f" "$id" >> "$LOG"
    echo "OK   $f${id:+ → $id}"; ok=$((ok+1))
  else
    echo "FAIL $f: $(printf '%s' "$out" | head -c 300)" >&2; fail=$((fail+1))
  fi
done
echo "Listo: $ok subidos · $skip salteados · $fail con error. Registro: $LOG"
[ "$fail" = 0 ]
