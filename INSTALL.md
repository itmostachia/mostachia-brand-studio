# Instalación — runbook para el agente

> Pensado para que **Claude Code o Codex lo ejecuten solos**. El humano solo aprueba.

## 1. Requisitos

`git`, Node ≥ 20, Python ≥ 3.10. El instalador los chequea y dice cómo instalar lo que falte.

## 2. Clonar

```bash
git clone https://github.com/itmostachia/mostachia-brand-studio.git
cd mostachia-brand-studio
```

## 3. Instalar

Windows (PowerShell 5.1+):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 -Playwright
```

macOS / Linux / Git Bash:

```bash
./install.sh --playwright
```

Qué hace:

1. Instala las dependencias de las herramientas (`npm i`, `pip install Pillow pypdfium2`; con el flag, Chromium de Playwright).
2. Clona cada skill de terceros **fijada a un commit** desde su repo original (`upstream.json`) en `.upstream/`.
   Este repo no redistribuye código ajeno: ver `THIRD_PARTY.md`.
3. Enlaza (junction en Windows, symlink en mac/linux) las skills propias de `skills/` y las de terceros en:
   `~/.claude/skills` (Claude Code) y `~/.agents/skills` + `~/.codex/skills` (Codex).
4. **Nunca pisa** una skill que ya tengas con el mismo nombre: la saltea y lo reporta.

| Flag (ps1 / sh) | Para qué |
|---|---|
| `-Target claude\|codex\|all` / `--target` | dónde enlazar (default `all`) |
| `-All` / `--all` | incluye opcionales (Impeccable actual, Three.js y shaders) |
| `-Only a,b` / `--only` | solo esas entradas de `upstream.json` |
| `-Update` / `--update` | vuelve a bajar los commits fijados |
| `-Force` / `--force` | reemplaza solo links que ya apuntan a este repo |
| `-DryRun` / `--dry-run` | muestra qué haría |
| `-SkipDeps` / `--skip-deps` | no instala npm/pip |
| `-HomeDir` / `--home` | home alternativo (tests) |

## 4. Verificar

```bash
node scripts/verify-install.mjs
npm run smoke
```

`verify-install` confirma cada link y el commit fijado. `smoke` corre el pipeline completo con una marca ficticia.

## 5. Aparte (no lo hace el instalador)

- **Skills de documentos de Anthropic (pptx / pdf / docx / xlsx):** licencia propietaria, no se copian.
  En Claude Code: `/plugin marketplace add anthropics/skills` y `/plugin install document-skills@anthropic-agent-skills`.
  En claude.ai vienen incluidas. Sin ellas, las presentaciones salen en HTML → PDF (plantilla `templates/deck`).
- **gstack** (QA visual, `browse`, `design-review`): tiene su propio setup con Bun — https://github.com/garrytan/gstack.
- Reiniciá Claude Code / Codex después de instalar para que tome las skills nuevas.

## 6. Instrucción para el agente del equipo

Agregá a tu `~/.claude/CLAUDE.md` (o `AGENTS.md` de Codex):

```md
## Marcas y webs
Para cualquier marca nueva, rebranding, identidad visual, naming, brandboard, kit, web, flyers o
presentaciones de una marca: seguí `<ruta>/mostachia-brand-studio/CLAUDE.md` e invocá la skill `crear-marca`.
```
