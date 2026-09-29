#!/usr/bin/env node
// Verifica la instalacion: cada skill esperada existe en cada target y resuelve a una carpeta con SKILL.md.
// Uso: node scripts/verify-install.mjs [--home DIR] [--target claude|codex|all] [--all] [--only a,b]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const home = path.resolve(opt("--home", os.homedir()));
const target = opt("--target", "all");
const all = args.includes("--all");
const only = (opt("--only", "") || "").split(",").filter(Boolean);

const targets = {
  claude: [".claude/skills"],
  codex: [".agents/skills", ".codex/skills"],
  all: [".claude/skills", ".agents/skills", ".codex/skills"],
}[target];
if (!targets) { console.error("--target debe ser claude|codex|all"); process.exit(2); }

const upstreams = JSON.parse(fs.readFileSync(path.join(repoDir, "upstream.json"), "utf8"));
const selected = (e) => only.length
  ? only.includes(e.name) && (e.install || "clone") === "clone"
  : (e.install || "clone") === "clone" && e.status === "verified" && (e.default || all);

// skill -> carpeta fuente esperada
const expected = [];
const pinProblems = [];
for (const e of upstreams.filter(selected)) {
  const clone = path.join(repoDir, ".upstream", e.name);
  try {
    const head = execFileSync("git", ["-C", clone, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    if (head !== e.ref) pinProblems.push(`${e.name}: HEAD ${head.slice(0, 10)} != ref ${e.ref.slice(0, 10)}`);
  } catch { pinProblems.push(`${e.name}: no hay clon en .upstream/${e.name}`); }
  for (const s of e.skills) {
    const src = e.root_skill ? clone : e.path === "." ? path.join(clone, s) : path.join(clone, e.path, s);
    expected.push({ skill: s, src, origin: e.name });
  }
}
const ownDir = path.join(repoDir, "skills");
if (fs.existsSync(ownDir)) {
  for (const d of fs.readdirSync(ownDir, { withFileTypes: true })) {
    const src = path.join(ownDir, d.name);
    if (d.isDirectory() && fs.existsSync(path.join(src, "SKILL.md"))) expected.push({ skill: d.name, src, origin: "repo" });
  }
}

const real = (p) => { try { return fs.realpathSync.native(p).toLowerCase(); } catch { return null; } };
const counts = { ok: 0, unmanaged: 0, missing: 0, broken: 0 };
const problems = [];

for (const t of targets) {
  for (const { skill, src, origin } of expected) {
    const dest = path.join(home, t, skill);
    let st = null;
    try { st = fs.lstatSync(dest); } catch { /* no existe */ }
    if (!st) { counts.missing++; problems.push(["missing", skill, t, origin]); continue; }
    const r = real(dest);
    if (!r || !fs.existsSync(path.join(dest, "SKILL.md"))) { counts.broken++; problems.push(["broken", skill, t, r || "no resuelve"]); continue; }
    if (r === real(src)) counts.ok++;
    else { counts.unmanaged++; problems.push(["unmanaged", skill, t, r]); }
  }
}

console.log(`Home: ${home}   skills esperadas: ${expected.length}   targets: ${targets.join(", ")}`);
console.log(`ok=${counts.ok}  unmanaged(existente, tiene SKILL.md)=${counts.unmanaged}  missing=${counts.missing}  broken=${counts.broken}`);
for (const p of pinProblems) console.log(`  PIN   ${p}`);
for (const [k, s, t, d] of problems) console.log(`  ${k.padEnd(9)} ${s.padEnd(28)} ${t.padEnd(16)} ${d}`);
process.exit(counts.missing || counts.broken || pinProblems.length ? 1 : 0);
