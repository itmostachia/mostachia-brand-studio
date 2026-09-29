#!/usr/bin/env node
// Crea el expediente de una marca desde templates/expediente (estructura de docs/CONTRATO.md §1).
//
// Uso:
//   node tools/nuevo-expediente.mjs --nombre "Estudio Norte" [--slug estudio-norte] [--dir ./marcas]
// Crea <dir>/<slug>/. Nunca pisa: si la carpeta existe y no está vacía, aborta.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, fail, isMain } from './lib/args.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = path.join(repoRoot, 'templates', 'expediente');
const TEXT_EXT = new Set(['.md', '.json', '.csv', '.txt']);

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function copyTree(from, to, vars) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(src, dst, vars);
    else if (TEXT_EXT.has(path.extname(entry.name).toLowerCase()) && entry.name !== 'brand.config.json') {
      const text = fs.readFileSync(src, 'utf8').replace(/\{\{(\w+)\}\}/g, (m, key) => (key in vars ? vars[key] : m));
      fs.writeFileSync(dst, text, 'utf8');
    } else if (entry.name !== 'brand.config.json') {
      fs.copyFileSync(src, dst);
    }
  }
}

export function nuevoExpediente({ nombre, slug, dir = 'marcas' }) {
  if (!nombre) throw new Error('Falta --nombre');
  const finalSlug = slug ? slugify(slug) : slugify(nombre);
  if (!finalSlug) throw new Error('No se pudo derivar un slug válido');
  const target = path.resolve(dir, finalSlug);
  if (fs.existsSync(target) && fs.readdirSync(target).length) {
    throw new Error(`Ya existe y no está vacía: ${target} (no se pisa nada)`);
  }
  const vars = { nombre, slug: finalSlug, fecha: today() };
  copyTree(TEMPLATE, target, vars);
  // brand.config.json se completa por JSON (no por reemplazo de texto) para escapar bien el nombre.
  const config = JSON.parse(fs.readFileSync(path.join(TEMPLATE, 'brand.config.json'), 'utf8'));
  config.slug = finalSlug;
  config.nombre = nombre;
  fs.writeFileSync(path.join(target, 'brand.config.json'), `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  return target;
}

if (isMain(import.meta.url)) {
  const { positional, options } = parseArgs(process.argv.slice(2));
  const nombre = options.nombre || positional[0];
  if (!nombre) fail('Uso: node tools/nuevo-expediente.mjs --nombre "Nombre de marca" [--slug slug] [--dir ./marcas]');
  try {
    const target = nuevoExpediente({ nombre, slug: options.slug, dir: options.dir || 'marcas' });
    console.log(`OK expediente creado: ${target}`);
    console.log('Siguiente: completar 00-control/PEDIDO-ORIGINAL.md y 01-brief/BRIEF.md');
  } catch (error) {
    fail(`ERROR: ${error.message}`);
  }
}
