#!/usr/bin/env node
// territorios.json → galeria/data.js (+ exploracion/data.js) y copia de las plantillas.
// Esquema: skills/territorios-marca/references/ficha-territorio.md
//
// Uso:
//   node tools/galeria-data.mjs <04-territorios/territorios.json> [--solo-galeria] [--solo-exploracion]
// Salida (al lado del JSON): galeria/ (templates/galeria) y exploracion/ (templates/exploracion),
// cada una con data.js. Funcionan por file:// (sin servidor). No toca boards ni el JSON fuente.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, fail, isMain } from './lib/args.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HEX = /^#[0-9A-Fa-f]{6}$/;

function copyTemplate(name, destination) {
  const source = path.join(repoRoot, 'templates', name);
  fs.cpSync(source, destination, {
    recursive: true,
    filter: (src) => path.basename(src) !== 'data.js' && path.basename(src) !== '.gitkeep',
  });
}

// Valida lo mínimo que las plantillas necesitan; devuelve advertencias (no bloquean) y errores (bloquean).
export function validar(doc) {
  const errores = [];
  const avisos = [];
  if (!doc || !Array.isArray(doc.territorios)) errores.push('Falta el arreglo "territorios"');
  const ids = new Set();
  for (const [i, t] of (doc?.territorios || []).entries()) {
    const ref = t.id || `#${i + 1}`;
    if (!t.id) errores.push(`Territorio ${ref}: falta "id"`);
    if (ids.has(t.id)) errores.push(`Territorio ${ref}: id duplicado`);
    ids.add(t.id);
    if (!t.nombre) errores.push(`Territorio ${ref}: falta "nombre"`);
    if (!Array.isArray(t.paleta) || !t.paleta.length) errores.push(`Territorio ${ref}: falta "paleta"`);
    for (const c of t.paleta || []) {
      if (!HEX.test(c.hex || '')) errores.push(`Territorio ${ref}: HEX inválido en rol "${c.rol}": ${c.hex}`);
    }
    const roles = new Set((t.paleta || []).map((c) => c.rol));
    for (const rol of ['base', 'ink', 'brand']) if (!roles.has(rol)) avisos.push(`Territorio ${ref}: sin rol "${rol}" (se usa un reemplazo)`);
    if (!Array.isArray(t.tipografias) || !t.tipografias.length) avisos.push(`Territorio ${ref}: sin "tipografias"`);
  }
  return { errores, avisos };
}

// Resuelve rutas de archivos (relativas a 04-territorios/) a rutas relativas a la carpeta de salida.
function resolverArchivos(t, baseDir) {
  const archivos = { ...(t.archivos || {}) };
  if (!archivos.simbolo) {
    const guess = `boards/${t.id}/simbolo.svg`;
    if (fs.existsSync(path.join(baseDir, guess))) archivos.simbolo = guess;
  }
  const rutas = {};
  const faltan = [];
  for (const [clave, rel] of Object.entries(archivos)) {
    if (!rel) continue;
    if (!fs.existsSync(path.join(baseDir, rel))) {
      faltan.push(`${t.id}: ${clave} → ${rel}`);
      continue;
    }
    rutas[clave] = `../${rel.replace(/\\/g, '/')}`;
  }
  return { rutas, faltan };
}

export function galeriaData(jsonPath, { galeria = true, exploracion = true } = {}) {
  const baseDir = path.dirname(path.resolve(jsonPath));
  const raw = fs.readFileSync(jsonPath, 'utf8').replace(/^﻿/, '');
  const doc = JSON.parse(raw);
  const { errores, avisos } = validar(doc);
  if (errores.length) throw new Error(`territorios.json inválido:\n- ${errores.join('\n- ')}`);
  const faltantes = [];
  const data = {
    ...doc,
    generado: new Date().toISOString(),
    territorios: doc.territorios.map((t) => {
      const { rutas, faltan } = resolverArchivos(t, baseDir);
      faltantes.push(...faltan);
      return { ...t, _rutas: rutas };
    }),
  };
  const js = `// Generado por tools/galeria-data.mjs desde territorios.json. No editar a mano: regenerar.\nwindow.TERRITORIOS_DATA = ${JSON.stringify(data, null, 2)};\n`;
  const salidas = [];
  for (const [activo, nombre] of [[galeria, 'galeria'], [exploracion, 'exploracion']]) {
    if (!activo) continue;
    const destino = path.join(baseDir, nombre);
    copyTemplate(nombre, destino);
    fs.writeFileSync(path.join(destino, 'data.js'), js, 'utf8');
    salidas.push(destino);
  }
  return { salidas, avisos, faltantes, total: data.territorios.length };
}

if (isMain(import.meta.url)) {
  const { positional, options } = parseArgs(process.argv.slice(2), { booleans: ['solo-galeria', 'solo-exploracion'] });
  const [jsonPath] = positional;
  if (!jsonPath) fail('Uso: node tools/galeria-data.mjs <territorios.json> [--solo-galeria|--solo-exploracion]');
  if (!fs.existsSync(jsonPath)) fail(`No existe: ${jsonPath}`);
  try {
    const result = galeriaData(jsonPath, {
      galeria: !options['solo-exploracion'],
      exploracion: !options['solo-galeria'],
    });
    result.avisos.forEach((a) => console.log(`AVISO ${a}`));
    result.faltantes.forEach((f) => console.log(`AVISO archivo inexistente (se omite): ${f}`));
    result.salidas.forEach((s) => console.log(`OK ${s} (${result.total} territorios)`));
  } catch (error) {
    fail(`ERROR: ${error.message}`);
  }
}
