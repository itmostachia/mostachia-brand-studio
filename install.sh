#!/usr/bin/env bash
# Instalador de skills de terceros (mac / linux / Git Bash en Windows).
# No redistribuye codigo ajeno: clona cada upstream en el SHA fijado de upstream.json
# dentro de .upstream/ (gitignored) y crea links en las carpetas de skills del usuario.
#
# Uso: ./install.sh [--target claude|codex|all] [--home DIR] [--all] [--only a,b]
#                   [--force] [--update] [--dry-run] [--skip-deps] [--playwright]
set -u

REPO_DIR="$(cd "$(dirname "$0")" && pwd -P)"
TARGET="all"; HOME_DIR="${HOME}"; ALL=0; ONLY=""; FORCE=0; UPDATE=0; DRY=0; SKIP_DEPS=0; PLAYWRIGHT=0

while [ $# -gt 0 ]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    --home) HOME_DIR="$2"; shift 2 ;;
    --all) ALL=1; shift ;;
    --only) ONLY="$2"; shift 2 ;;
    --force) FORCE=1; shift ;;
    --update) UPDATE=1; shift ;;
    --dry-run) DRY=1; shift ;;
    --skip-deps) SKIP_DEPS=1; shift ;;
    --playwright) PLAYWRIGHT=1; shift ;;
    -h|--help) sed -n 2,8p "$0"; exit 0 ;;
    *) echo "Flag desconocido: $1"; exit 2 ;;
  esac
done

case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) IS_WIN=1 ;; *) IS_WIN=0 ;; esac
say() { printf '%s\n' "$*"; }
run() { if [ "$DRY" = 1 ]; then say "  [dry-run] $*"; else "$@"; fi; }

# ---------- 1. Dependencias ----------
say "== Dependencias"
MISSING=0
ver_ge() { [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]; }

if command -v git >/dev/null 2>&1; then say "  git: $(git --version | awk '{print $3}')"
else say "  FALTA git -> https://git-scm.com/downloads (mac: xcode-select --install; linux: apt/dnf install git)"; MISSING=1; fi

NODE_V=""
if command -v node >/dev/null 2>&1; then NODE_V="$(node -p 'process.versions.node')"; fi
if [ -n "$NODE_V" ] && ver_ge "$NODE_V" "20.0.0"; then say "  node: $NODE_V"
else say "  FALTA node >= 20 (tenes: ${NODE_V:-ninguno}) -> https://nodejs.org (o nvm / winget install OpenJS.NodeJS.LTS)"; MISSING=1; fi

PY=""
for c in python3 python "py -3"; do
  v="$($c -c 'import sys;print("%d.%d.%d"%sys.version_info[:3])' 2>/dev/null)" || continue
  if [ -n "$v" ] && ver_ge "$v" "3.10.0"; then PY="$c"; say "  python: $v ($c)"; break; fi
done
[ -z "$PY" ] && { say "  FALTA python >= 3.10 -> https://www.python.org/downloads (o brew/apt/winget install Python.Python.3.12)"; MISSING=1; }

if [ "$MISSING" = 1 ]; then say "Instala lo que falta y volve a correr."; exit 1; fi

if [ "$SKIP_DEPS" = 0 ]; then
  if [ -f "$REPO_DIR/package.json" ]; then say "  npm install (repo)"; (cd "$REPO_DIR" && run npm install --no-audit --no-fund) || say "  AVISO: npm install fallo"; fi
  say "  pip install Pillow pypdfium2"; run $PY -m pip install --quiet Pillow pypdfium2 || say "  AVISO: pip install fallo"
  if [ "$PLAYWRIGHT" = 1 ]; then (cd "$REPO_DIR" && run npx --yes playwright install chromium) || say "  AVISO: playwright install fallo"; fi
else
  say "  (--skip-deps: no se instalan paquetes)"
fi

# ---------- 2. .gitignore ----------
GI="$REPO_DIR/.gitignore"
for line in ".upstream/" "node_modules/"; do
  if ! { [ -f "$GI" ] && grep -qxF "$line" "$GI"; }; then run sh -c "printf '%s\n' '$line' >> '$GI'"; fi
done

# ---------- 3. Leer upstream.json (con node; Git Bash no trae jq) ----------
ENTRIES="$(node -e '
const fs=require("fs");const a=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
for(const e of a){console.log([e.name,e.repo,e.ref,e.path,e.root_skill?1:0,e.skills.join(","),e.default?1:0,e.status,e.install||"clone",(e.notes||"").replace(/\s+/g," ")].join("\t"));}
' "$REPO_DIR/upstream.json" | tr -d '\r')" || { say "No pude leer upstream.json"; exit 1; }

selected() { # name default status install
  if [ -n "$ONLY" ]; then case ",$ONLY," in *",$1,"*) return 0 ;; *) return 1 ;; esac; fi
  [ "$4" = "clone" ] || return 1
  [ "$3" = "verified" ] || return 1
  [ "$2" = 1 ] || [ "$ALL" = 1 ]
}

# ---------- 4. Targets ----------
TARGETS=()
case "$TARGET" in
  claude) TARGETS=("$HOME_DIR/.claude/skills") ;;
  codex)  TARGETS=("$HOME_DIR/.agents/skills" "$HOME_DIR/.codex/skills") ;;
  all)    TARGETS=("$HOME_DIR/.claude/skills" "$HOME_DIR/.agents/skills" "$HOME_DIR/.codex/skills") ;;
  *) say "--target debe ser claude|codex|all"; exit 2 ;;
esac

RESULTS=""   # lineas: status<TAB>skill<TAB>target<TAB>detalle
add() { RESULTS="${RESULTS}$1	$2	$3	$4
"; }

resolve() { # ruta real de un dir (sigue links y junctions)
  (cd "$1" 2>/dev/null && pwd -P) || true
}

make_link() { # src dest
  if [ "$IS_WIN" = 1 ]; then
    MSYS2_ARG_CONV_EXCL="*" cmd /c mklink /J "$(cygpath -w "$2")" "$(cygpath -w "$1")" >/dev/null
  else
    ln -s "$1" "$2"
  fi
}
remove_link() { # borra SOLO el link, nunca el contenido
  if [ "$IS_WIN" = 1 ]; then MSYS2_ARG_CONV_EXCL="*" cmd /c rmdir "$(cygpath -w "$1")" >/dev/null; else rm "$1"; fi
}

link_skill() { # src skill_name
  local src="$1" name="$2" t dest cur
  local real_src; real_src="$(resolve "$src")"
  if [ ! -f "$src/SKILL.md" ] && [ "$DRY" = 0 ]; then
    for t in "${TARGETS[@]}"; do add failed "$name" "$t" "sin SKILL.md en $src"; done; return
  fi
  for t in "${TARGETS[@]}"; do
    dest="$t/$name"
    [ "$DRY" = 1 ] || mkdir -p "$t"
    if [ -e "$dest" ] || [ -L "$dest" ]; then
      cur="$(resolve "$dest")"
      if [ -n "$cur" ] && [ "$cur" = "$real_src" ]; then add already "$name" "$t" ""; continue; fi
      case "$cur" in
        "$REPO_DIR"/.upstream/*|"$REPO_DIR"/skills/*)
          if [ "$FORCE" = 1 ]; then
            if [ "$DRY" = 1 ]; then add replaced "$name" "$t" "(dry-run)"; continue; fi
            if remove_link "$dest" && make_link "$src" "$dest"; then add replaced "$name" "$t" "era $cur"; else add failed "$name" "$t" "no pude reemplazar"; fi
            continue
          fi ;;
      esac
      add skipped-existing "$name" "$t" "${cur:-link roto o no resoluble}"; continue
    fi
    if [ "$DRY" = 1 ]; then add installed "$name" "$t" "(dry-run)"; continue; fi
    if make_link "$src" "$dest"; then add installed "$name" "$t" ""; else add failed "$name" "$t" "no pude crear link"; fi
  done
}

fetch_upstream() { # name repo ref path root skills_csv
  local name="$1" repo="$2" ref="$3" path="$4" root="$5" skills="$6" dir="$REPO_DIR/.upstream/$1"
  if [ -d "$dir/.git" ] && [ "$UPDATE" = 0 ] && [ "$(git -C "$dir" rev-parse HEAD 2>/dev/null)" = "$ref" ]; then
    say "  $name: ya en ${ref:0:10}"; return 0
  fi
  say "  $name: fetch $repo@${ref:0:10}"
  [ "$DRY" = 1 ] && return 0
  mkdir -p "$dir"
  git -C "$dir" init -q 2>/dev/null || return 1
  git -C "$dir" config core.longpaths true
  git -C "$dir" remote remove origin 2>/dev/null
  git -C "$dir" remote add origin "https://github.com/$repo.git" || return 1
  if [ "$root" = 1 ]; then
    git -C "$dir" sparse-checkout disable 2>/dev/null
  else
    local dirs=() s
    IFS=',' read -r -a arr <<< "$skills"
    for s in "${arr[@]}"; do if [ "$path" = "." ]; then dirs+=("$s"); else dirs+=("$path/$s"); fi; done
    git -C "$dir" sparse-checkout set --cone "${dirs[@]}" || return 1
  fi
  git -C "$dir" fetch -q --depth 1 --filter=blob:none origin "$ref" || return 1
  git -C "$dir" -c advice.detachedHead=false checkout -q --force FETCH_HEAD || return 1
}

# ---------- 5. Upstreams ----------
say "== Upstreams (.upstream/)"
MANUAL=""
while IFS=$'\t' read -r name repo ref path root skills def status install notes; do
  [ -z "$name" ] && continue
  if [ "$install" != "clone" ]; then
    if [ "$install" = "manual" ] || [ "$install" = "external" ]; then MANUAL="${MANUAL}- $name ($repo): $notes
"; fi
    continue
  fi
  selected "$name" "$def" "$status" "$install" || continue
  [ "$status" != "verified" ] && say "  AVISO: $name esta marcado '$status' (lo pediste con --only)"
  if ! fetch_upstream "$name" "$repo" "$ref" "$path" "$root" "$skills"; then
    IFS=',' read -r -a arr <<< "$skills"
    for s in "${arr[@]}"; do for t in "${TARGETS[@]}"; do add failed "$s" "$t" "fetch de $repo fallo"; done; done
    continue
  fi
  IFS=',' read -r -a arr <<< "$skills"
  for s in "${arr[@]}"; do
    if [ "$root" = 1 ]; then src="$REPO_DIR/.upstream/$name"
    elif [ "$path" = "." ]; then src="$REPO_DIR/.upstream/$name/$s"
    else src="$REPO_DIR/.upstream/$name/$path/$s"; fi
    link_skill "$src" "$s"
  done
done <<< "$ENTRIES"

# ---------- 6. Skills propias del repo ----------
say "== Skills propias (skills/)"
for d in "$REPO_DIR"/skills/*/; do
  [ -f "${d}SKILL.md" ] || continue
  d="${d%/}"; link_skill "$d" "$(basename "$d")"
done

# ---------- 7. Resumen ----------
say ""
say "== Resumen"
printf '%-18s' "estado"; for t in "${TARGETS[@]}"; do printf '%-24s' "${t#$HOME_DIR/}"; done; printf '\n'
for st in installed already replaced skipped-existing failed; do
  printf '%-18s' "$st"
  for t in "${TARGETS[@]}"; do
    n="$(printf '%s' "$RESULTS" | awk -F'\t' -v s="$st" -v t="$t" '$1==s && $3==t' | wc -l | tr -d ' ')"
    printf '%-24s' "$n"
  done; printf '\n'
done
DETAIL="$(printf '%s' "$RESULTS" | awk -F'\t' '$1=="skipped-existing"||$1=="failed"')"
if [ -n "$DETAIL" ]; then
  say ""; say "Detalle (skipped-existing / failed):"
  printf '%s\n' "$DETAIL" | awk -F'\t' -v h="$HOME_DIR/" '{t=$3; sub(h,"",t); printf "  %-17s %-28s %-16s %s\n",$1,$2,t,$4}'
fi
if [ -n "$MANUAL" ]; then say ""; say "Se instalan aparte (no se clonan):"; printf '%s' "$MANUAL"; fi
say ""
say "Verificar: node scripts/verify-install.mjs --home \"$HOME_DIR\" --target $TARGET"
if printf '%s' "$RESULTS" | grep -q '^failed'; then exit 1; fi
exit 0
