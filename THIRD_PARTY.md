# Third-party skills

**This repository does not redistribute third-party code.** None of the skills below are copied into
this repo. `install.ps1` / `install.sh` clone each upstream repository at the commit pinned in
[`upstream.json`](upstream.json) into `.upstream/` (gitignored, local to your machine) and link the skill
folders into your own `~/.claude/skills`, `~/.agents/skills` and `~/.codex/skills`. Each skill stays under
its own license, which you accept by installing it. Pins were resolved on 2026-09-29.

| Name (upstream.json) | Upstream | Pinned commit | License | Group | Default | Notes |
|---|---|---|---|---|---|---|
| impeccable-legacy | [pbakaus/impeccable](https://github.com/pbakaus/impeccable/tree/209444a9d552c18bcaa74e26bf66a25fc568a767/.claude/skills) | `209444a` | Apache-2.0 | design | yes | Last commit with the 21 separate commands (frontend-design, adapt, animate, polish…) |
| impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `114ea1d` | Apache-2.0 | design | no | Current single `/impeccable` skill |
| taste-skill | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `ce26fc2` | MIT | design | yes | 13 skills |
| gsap-skills | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | `aed9cfd` | MIT | motion | yes | Official GreenSock |
| motion-design | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | `f9a8a04` | MIT | motion | yes | Official LottieFiles |
| wondelai-design | [wondelai/skills](https://github.com/wondelai/skills) | `c172996` | MIT | design | yes | refactoring-ui, web-typography, top-design, microinteractions, ux-heuristics, design-everyday-things |
| wondelai-strategy | [wondelai/skills](https://github.com/wondelai/skills) | `c172996` | MIT | strategy | yes | obviously-awesome, storybrand-messaging, made-to-stick, blue-ocean-strategy, jobs-to-be-done, contagious |
| marketingskills | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | `5b2c000` | MIT | marketing | yes | copywriting, product-marketing, cro, site-architecture, launch, social, ad-creative (upstream renamed some) |
| anthropic-design | [anthropics/skills](https://github.com/anthropics/skills) | `8a1541c` | Apache-2.0 (per-skill LICENSE.txt) | design | yes | theme-factory, canvas-design, brand-guidelines, web-artifacts-builder |
| ui-ux-pro-max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `09170ee` | MIT | design | yes | |
| threejs-graphics | [scottstts/Threejs-Awesome-Graphics-Agent-Skills](https://github.com/scottstts/Threejs-Awesome-Graphics-Agent-Skills) | `d1cb23d` | MIT | 3d | no (opt-in) | Some bundled assets have their own THIRD_PARTY_LICENSES.md |
| shader-for-interfaces | [v2space-labs/shader-for-interfaces](https://github.com/v2space-labs/shader-for-interfaces) | `08fe6fc` | MIT | 3d | no (opt-in) | |
| excalidraw-diagram | [coleam00/excalidraw-diagram-skill](https://github.com/coleam00/excalidraw-diagram-skill) | `8646fcc` | **none declared** | design | no | `status: unverified` — no license file means all rights reserved; only installed with an explicit `-Only` |

## Not installed by this repo

| Name | Upstream | License | How to get it |
|---|---|---|---|
| Anthropic document skills (pptx, pdf, docx, xlsx) | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills) | Proprietary, source-available (© Anthropic). Use is governed by your own agreement with Anthropic; the license forbids retaining copies outside Anthropic's services, copying and redistributing. | Through your own Claude plan: built into claude.ai file creation; in Claude Code run `/plugin marketplace add anthropics/skills` then `/plugin install document-skills@anthropic-agent-skills`. There is no sanctioned route for Codex. |
| gstack | [garrytan/gstack](https://github.com/garrytan/gstack) | MIT | Has its own installer (requires Bun). Claude Code: `git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup`. Other hosts: `./setup --host codex`. |

## Updating a pin

Change `ref` in `upstream.json` (and this table), then run the installer with `-Update` / `--update`
and `node scripts/verify-install.mjs`.
