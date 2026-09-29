#!/usr/bin/env node
// Kit final de marca (docs/CONTRATO.md §3) desde brand.config.json + SVG de símbolo y wordmark.
// Paleta y textos salen SOLO de la config; nada de colores o nombres fijos en este script.
//
// Uso:
//   node tools/build-brand-kit.mjs <expediente>/brand.config.json [--out <dir>] [--fonts <dir>]
//                                  [--secciones secciones.json] [--sin-brandbook]
// Roles de color: ids "fondo", "texto", "acento" (y opcionales "superficie", "oscuro") los fijan;
// si no existen se infieren (más claro = fondo, más oscuro = texto, más saturado = acento).
// Fuentes: archivos .ttf/.otf/.woff/.woff2 en --fonts o en 02_COLORES_Y_TIPOGRAFIA/fonts/ cuyo nombre
// empiece con la familia (sin espacios). Sin archivos, se usa la familia instalada o la genérica.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, fail, isMain } from './lib/args.mjs';
import { launchBrowser } from './lib/browser.mjs';
import { render } from './render.mjs';

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  fail('Falta la dependencia "sharp". Corré `npm install` en la raíz del repo.');
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HEX = /^#[0-9A-Fa-f]{6}$/;
const FONT_EXT = new Set(['.ttf', '.otf', '.woff', '.woff2']);
const SYMBOL_SIZES = [32, 64, 128, 256, 512, 1024, 2048];
const SOCIAL = [
  { file: 'post-1080x1350.html', w: 1080, h: 1350 },
  { file: 'story-1080x1920.html', w: 1080, h: 1920 },
  { file: 'linkedin-1200x627.html', w: 1200, h: 627 },
  { file: 'slide-1920x1080.html', w: 1920, h: 1080 },
];

// ---------- color ----------
const hexToRgb = (hex) => hex.slice(1).match(/.{2}/g).map((h) => parseInt(h, 16));
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
function saturation(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}
export function pickRoles(colores) {
  const byId = (...ids) => colores.find((c) => ids.includes(String(c.id).toLowerCase()));
  const sorted = [...colores].sort((a, b) => luminance(b.hex) - luminance(a.hex));
  const fondo = byId('fondo', 'base', 'background', 'papel') || sorted[0];
  const texto = byId('texto', 'ink', 'tinta') || sorted[sorted.length - 1];
  const resto = colores.filter((c) => c !== fondo && c !== texto);
  const acento = byId('acento', 'accent', 'brand', 'marca') || [...resto].sort((a, b) => saturation(b.hex) - saturation(a.hex))[0] || texto;
  const superficie = byId('superficie', 'surface') || { hex: luminance(fondo.hex) > 0.5 ? '#FFFFFF' : fondo.hex };
  const oscuro = byId('oscuro', 'dark', 'dark_surface') || (luminance(texto.hex) < 0.1 ? texto : { hex: '#111111' });
  const sobreAcento = contrast(acento.hex, fondo.hex) >= contrast(acento.hex, texto.hex) ? fondo : texto;
  const acentoSobreOscuro = contrast(acento.hex, oscuro.hex) >= 3 ? acento : fondo;
  return {
    fondo: fondo.hex.toUpperCase(), texto: texto.hex.toUpperCase(), acento: acento.hex.toUpperCase(),
    sobre_acento: sobreAcento.hex.toUpperCase(), superficie: superficie.hex.toUpperCase(),
    oscuro: oscuro.hex.toUpperCase(), acento_sobre_oscuro: acentoSobreOscuro.hex.toUpperCase(),
  };
}

// ---------- SVG ----------
function parseSvg(text, label) {
  const open = text.match(/<svg\b[^>]*>/i);
  const closeIndex = text.toLowerCase().lastIndexOf('</svg>');
  if (!open || closeIndex < 0) throw new Error(`${label}: no parece un SVG válido`);
  const attrs = open[0];
  const inner = text.slice(open.index + open[0].length, closeIndex);
  const vb = attrs.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  let box;
  if (vb) box = vb[1].trim().split(/[\s,]+/).map(Number);
  else {
    const w = parseFloat(attrs.match(/\bwidth\s*=\s*["']([\d.]+)/i)?.[1]);
    const h = parseFloat(attrs.match(/\bheight\s*=\s*["']([\d.]+)/i)?.[1]);
    if (!w || !h) throw new Error(`${label}: el SVG necesita viewBox o width/height`);
    box = [0, 0, w, h];
  }
  if (box.length !== 4 || box.some((n) => !Number.isFinite(n)) || box[2] <= 0 || box[3] <= 0) throw new Error(`${label}: viewBox inválido`);
  return { box, inner };
}
const svgDoc = (w, h, body, label) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escXml(label)}">\n${body}\n</svg>\n`;
const escXml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nest = (svg, x, y, w, h, prefix) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${svg.box.join(' ')}">${prefixIds(svg.inner, prefix)}</svg>`;
// Evita choques de id al combinar símbolo y wordmark en un mismo SVG.
function prefixIds(inner, prefix) {
  return inner
    .replace(/\bid\s*=\s*"([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/(xlink:href|href)\s*=\s*"#([^"]+)"/g, `$1="#${prefix}-$2"`);
}
// Versión monocroma: reemplaza fill/stroke/stop-color (salvo none/url) y hereda el color al resto.
function monochrome(svg, color) {
  const inner = svg.inner
    .replace(/\b(fill|stroke|stop-color)\s*=\s*"(?!none|url\(|transparent)[^"]*"/gi, `$1="${color}"`)
    .replace(/\b(fill|stroke|stop-color)\s*:\s*(?!none|url\(|transparent)[^;"']+/gi, `$1:${color}`);
  return { box: svg.box, inner: `<g fill="${color}">${inner}</g>` };
}
function lockups(simbolo, wordmark) {
  const H = 200;
  const sw = (simbolo.box[2] / simbolo.box[3]) * H;
  const wh = H * 0.56;
  const ww = (wordmark.box[2] / wordmark.box[3]) * wh;
  const gap = H * 0.26;
  const horizontal = {
    w: Math.round(sw + gap + ww), h: H,
    body: (s, m) => `${nest(s, 0, 0, sw, H, 's')}\n${nest(m, Math.round(sw + gap), Math.round((H - wh) / 2), ww, wh, 'w')}`,
  };
  const vw = Math.max(sw, ww);
  const vertical = {
    w: Math.round(vw), h: Math.round(H + gap + wh),
    body: (s, m) => `${nest(s, Math.round((vw - sw) / 2), 0, sw, H, 's')}\n${nest(m, Math.round((vw - ww) / 2), Math.round(H + gap), ww, wh, 'w')}`,
  };
  return { horizontal, vertical };
}
async function svgToPng(svgText, outPath, width) {
  const { box } = parseSvg(svgText, outPath);
  const density = Math.min(2400, Math.max(1, (72 * width) / box[2]));
  await sharp(Buffer.from(svgText), { density }).resize({ width }).png({ compressionLevel: 9 }).toFile(outPath);
}

// ---------- fuentes ----------
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
function fontFaces(tipografias, fontDir, urlBase) {
  if (!fs.existsSync(fontDir)) return { css: '', found: [] };
  const files = fs.readdirSync(fontDir).filter((f) => FONT_EXT.has(path.extname(f).toLowerCase()));
  const found = [];
  const css = [];
  for (const t of tipografias) {
    for (const file of files.filter((f) => norm(f).startsWith(norm(t.familia)))) {
      const ext = path.extname(file).toLowerCase();
      const format = { '.ttf': 'truetype', '.otf': 'opentype', '.woff': 'woff', '.woff2': 'woff2' }[ext];
      const italic = /italic/i.test(file);
      const variable = /variable|\[/i.test(file);
      const weight = variable ? '100 900' : /bold/i.test(file) ? '700' : /medium/i.test(file) ? '500' : /light/i.test(file) ? '300' : '400';
      css.push(`@font-face { font-family: "${t.familia}"; src: url("${urlBase}${file}") format("${format}"); font-weight: ${weight}; font-style: ${italic ? 'italic' : 'normal'}; font-display: swap; }`);
      found.push(file);
    }
  }
  return { css: css.join('\n'), found };
}
const genericFor = (familia, rol) => (/mono|code/i.test(familia) ? 'monospace' : /display|titul/i.test(rol) && /serif|georgia|times|garamond|playfair|instrument/i.test(familia) ? 'serif' : /serif|georgia|times|garamond/i.test(familia) && !/sans/i.test(familia) ? 'serif' : 'sans-serif');

function tokensCss(config, roles, fontCss) {
  const display = config.tipografias.find((t) => /display|titul/i.test(t.rol)) || config.tipografias[0];
  const texto = config.tipografias.find((t) => /texto|text|cuerpo|body|ui/i.test(t.rol)) || config.tipografias[config.tipografias.length - 1];
  const lines = config.colores.map((c) => `  --color-${norm(c.id) || 'color'}: ${c.hex.toUpperCase()};`);
  return `/* ${config.nombre} — tokens generados por tools/build-brand-kit.mjs desde brand.config.json. No editar a mano. */
${fontCss ? `${fontCss}\n` : ''}:root {
${lines.join('\n')}
  --fondo: ${roles.fondo};
  --texto: ${roles.texto};
  --acento: ${roles.acento};
  --sobre-acento: ${roles.sobre_acento};
  --superficie: ${roles.superficie};
  --oscuro: ${roles.oscuro};
  --acento-sobre-oscuro: ${roles.acento_sobre_oscuro};
  --apagado: color-mix(in srgb, var(--texto) 62%, var(--fondo));
  --linea: color-mix(in srgb, var(--texto) 16%, var(--fondo));
  --font-display: "${display.familia}", ${genericFor(display.familia, display.rol)};
  --font-texto: "${texto.familia}", ${genericFor(texto.familia, texto.rol)};
  --radio: 10px;
}
`;
}

// ---------- utilidades ----------
const write = (file, content) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content, 'utf8'); };
const today = () => new Date().toISOString().slice(0, 10);
const rel = (from, to) => path.relative(from, to).split(path.sep).join('/');
function fill(text, vars) { return text.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m)); }

export function validarConfig(config, root) {
  const errores = [];
  if (!config.nombre) errores.push('falta "nombre"');
  if (!config.slug) errores.push('falta "slug"');
  if (!Array.isArray(config.colores) || config.colores.length < 2) errores.push('"colores" necesita al menos 2 colores (se completa en fase kit)');
  for (const c of config.colores || []) if (!HEX.test(c.hex || '')) errores.push(`color "${c.id}": HEX inválido ${c.hex}`);
  if (!Array.isArray(config.tipografias) || !config.tipografias.length) errores.push('"tipografias" vacío');
  for (const key of ['simbolo_svg', 'wordmark_svg']) {
    const p = config.logo?.[key];
    if (!p) errores.push(`falta logo.${key}`);
    else if (!fs.existsSync(path.resolve(root, p))) errores.push(`logo.${key} no existe: ${p}`);
  }
  return errores;
}

export async function buildBrandKit(configPath, { out, fonts, secciones, brandbook = true } = {}) {
  const root = path.dirname(path.resolve(configPath));
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8').replace(/^﻿/, ''));
  const errores = validarConfig(config, root);
  if (errores.length) throw new Error(`brand.config.json incompleto para el kit:\n- ${errores.join('\n- ')}`);
  const kit = path.resolve(out || path.join(root, '06-kit'));
  const slug = config.slug;
  const D = {
    vector: path.join(kit, '01_LOGOS', 'vector'), png: path.join(kit, '01_LOGOS', 'png'),
    tokens: path.join(kit, '02_COLORES_Y_TIPOGRAFIA'), fonts: path.join(kit, '02_COLORES_Y_TIPOGRAFIA', 'fonts'),
    patterns: path.join(kit, '03_FONDOS_Y_PATRONES'), social: path.join(kit, '04_PLANTILLAS_SOCIALES'),
    socialSrc: path.join(kit, '04_PLANTILLAS_SOCIALES', 'fuente'), mockups: path.join(kit, '05_MOCKUPS_Y_CAMPANA'),
    guides: path.join(kit, '06_GUIAS'), product: path.join(kit, '07_PRODUCT_UI'), sources: path.join(kit, 'FUENTES_EDITABLES'),
  };
  Object.values(D).forEach((d) => fs.mkdirSync(d, { recursive: true }));
  const manifest = { marca: config.nombre, slug, generado: new Date().toISOString(), archivos: [] };
  const add = (file, extra = {}) => manifest.archivos.push({ ruta: rel(kit, file), ...extra });
  const roles = pickRoles(config.colores);

  // 1) Logos vectoriales
  const simboloSrc = fs.readFileSync(path.resolve(root, config.logo.simbolo_svg), 'utf8');
  const wordmarkSrc = fs.readFileSync(path.resolve(root, config.logo.wordmark_svg), 'utf8');
  const simbolo = parseSvg(simboloSrc, 'símbolo');
  const wordmark = parseSvg(wordmarkSrc, 'wordmark');
  const { horizontal, vertical } = lockups(simbolo, wordmark);
  const variants = {
    color: [simbolo, wordmark],
    'mono-texto': [monochrome(simbolo, roles.texto), monochrome(wordmark, roles.texto)],
    'mono-blanco': [monochrome(simbolo, '#FFFFFF'), monochrome(wordmark, '#FFFFFF')],
  };
  const vec = {};
  for (const [variant, [s, m]] of Object.entries(variants)) {
    const suffix = variant === 'color' ? '' : `-${variant}`;
    const sw = Math.round(s.box[2]);
    const sh = Math.round(s.box[3]);
    vec[`simbolo${suffix}`] = svgDoc(sw, sh, nest(s, 0, 0, sw, sh, 's'), `${config.nombre} símbolo ${variant}`);
    vec[`wordmark${suffix}`] = svgDoc(Math.round(m.box[2]), Math.round(m.box[3]), nest(m, 0, 0, Math.round(m.box[2]), Math.round(m.box[3]), 'w'), `${config.nombre} logotipo ${variant}`);
    vec[`logo-horizontal${suffix}`] = svgDoc(horizontal.w, horizontal.h, horizontal.body(s, m), `${config.nombre} logo horizontal ${variant}`);
    vec[`logo-vertical${suffix}`] = svgDoc(vertical.w, vertical.h, vertical.body(s, m), `${config.nombre} logo vertical ${variant}`);
  }
  const vecPath = (key) => path.join(D.vector, `${slug}-${key}.svg`);
  for (const [key, text] of Object.entries(vec)) { write(vecPath(key), text); add(vecPath(key)); }

  // 2) PNG transparentes
  for (const size of SYMBOL_SIZES) {
    const file = path.join(D.png, `${slug}-simbolo-${size}.png`);
    await svgToPng(vec.simbolo, file, size);
    add(file, { ancho: size });
  }
  for (const key of ['simbolo-mono-texto', 'simbolo-mono-blanco']) {
    const file = path.join(D.png, `${slug}-${key}-1024.png`);
    await svgToPng(vec[key], file, 1024);
    add(file, { ancho: 1024 });
  }
  for (const key of ['logo-horizontal', 'logo-horizontal-mono-texto', 'logo-horizontal-mono-blanco', 'logo-vertical', 'logo-vertical-mono-blanco']) {
    const file = path.join(D.png, `${slug}-${key}-2400.png`);
    await svgToPng(vec[key], file, 2400);
    add(file, { ancho: 2400 });
  }

  // 3) Tokens, fuentes y licencias
  if (fonts && fs.existsSync(fonts)) {
    for (const f of fs.readdirSync(fonts)) if (FONT_EXT.has(path.extname(f).toLowerCase()) || /^(OFL|LICENSE)/i.test(f)) fs.copyFileSync(path.join(fonts, f), path.join(D.fonts, f));
  }
  const fontKit = fontFaces(config.tipografias, D.fonts, 'fonts/');
  if (!fontKit.found.length) write(path.join(D.fonts, 'LEEME.md'), `# Fuentes\n\nColocá acá los archivos de las familias (${config.tipografias.map((t) => t.familia).join(', ')}) con su licencia (OFL.txt o equivalente) y regenerá el kit: \`tokens.css\` incluirá los @font-face.\n`);
  const tokensJson = {
    marca: config.nombre, slug, version: '1.0', generado: today(),
    colores: Object.fromEntries(config.colores.map((c) => [c.id, { hex: c.hex.toUpperCase(), rgb: hexToRgb(c.hex), rol: c.rol || '' }])),
    roles, tipografias: config.tipografias, fuentes_incluidas: fontKit.found,
    radio: { sm: 6, md: 10, lg: 16 }, espaciado: [4, 8, 12, 16, 24, 32, 48, 64, 96],
  };
  write(path.join(D.tokens, 'tokens.json'), `${JSON.stringify(tokensJson, null, 2)}\n`);
  write(path.join(D.tokens, 'tokens.css'), tokensCss(config, roles, fontKit.css));
  add(path.join(D.tokens, 'tokens.json'));
  add(path.join(D.tokens, 'tokens.css'));
  write(path.join(D.tokens, 'LICENCIAS-TIPOGRAFIAS.md'), `# Licencias tipográficas — ${config.nombre}\n\n| Rol | Familia | Fuente | Licencia |\n|---|---|---|---|\n${config.tipografias.map((t) => `| ${t.rol} | ${t.familia} | ${t.fuente || '—'} | ${t.licencia || 'VERIFICAR'} |`).join('\n')}\n\nArchivos incluidos en \`fonts/\`: ${fontKit.found.length ? fontKit.found.join(', ') : 'ninguno'}.\nAntes de distribuir, confirmá que cada licencia permite uso comercial y embebido (web/PDF/app).\n`);
  add(path.join(D.tokens, 'LICENCIAS-TIPOGRAFIAS.md'));

  // 4) Fondos y patrones (SVG + PNG 1920×1080, sin texto)
  const W = 1920;
  const H = 1080;
  const tile = 44;
  const patterns = {
    'grilla-clara': `<defs><pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="${roles.texto}" stroke-opacity=".10"/></pattern></defs><rect width="${W}" height="${H}" fill="${roles.fondo}"/><rect width="${W}" height="${H}" fill="url(#g)"/>`,
    'grilla-oscura': `<defs><pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="${roles.fondo}" stroke-opacity=".08"/></pattern></defs><rect width="${W}" height="${H}" fill="${roles.oscuro}"/><rect width="${W}" height="${H}" fill="url(#g)"/>`,
    puntos: `<defs><pattern id="p" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse"><circle cx="${tile / 2}" cy="${tile / 2}" r="3" fill="${roles.acento}" fill-opacity=".45"/></pattern></defs><rect width="${W}" height="${H}" fill="${roles.fondo}"/><rect width="${W}" height="${H}" fill="url(#p)"/>`,
    'simbolo-repetido': `<rect width="${W}" height="${H}" fill="${roles.acento}"/><g opacity=".16">${Array.from({ length: 6 * 4 }, (_, i) => {
      const x = (i % 6) * 340 + ((Math.floor(i / 6) % 2) * 170) - 60;
      const y = Math.floor(i / 6) * 290 - 40;
      return nest(monochrome(simbolo, roles.sobre_acento), x, y, 200, 200, `p${i}`);
    }).join('')}</g>`,
    'campo-acento': `<rect width="${W}" height="${H}" fill="${roles.fondo}"/><circle cx="${W * 0.82}" cy="${H * 0.78}" r="${H * 0.62}" fill="${roles.acento}"/><circle cx="${W * 0.82}" cy="${H * 0.78}" r="${H * 0.36}" fill="${roles.fondo}" fill-opacity=".18"/>`,
  };
  const patternFiles = [];
  for (const [name, body] of Object.entries(patterns)) {
    const svgText = svgDoc(W, H, body, `${config.nombre} ${name}`);
    const svgFile = path.join(D.patterns, `${slug}-${name}.svg`);
    const pngFile = path.join(D.patterns, `${slug}-${name}.png`);
    write(svgFile, svgText);
    await svgToPng(svgText, pngFile, W);
    add(svgFile);
    add(pngFile, { ancho: W, alto: H });
    patternFiles.push(pngFile);
  }

  // 5) Plantillas sociales: fuente editable (HTML + tokens + logos) → PNG / PDF
  const socialTemplates = path.join(repoRoot, 'templates', 'social');
  for (const f of fs.readdirSync(socialTemplates)) {
    if (/\.svg$|^tokens\.css$/i.test(f)) continue;
    const src = path.join(socialTemplates, f);
    const text = fs.readFileSync(src, 'utf8');
    write(path.join(D.socialSrc, f), f.endsWith('.html') ? fill(text, { nombre: escXml(config.nombre), eslogan: escXml(config.eslogan || config.nombre), slug }) : text);
  }
  write(path.join(D.socialSrc, 'tokens.css'), tokensCss(config, roles, fontFaces(config.tipografias, D.fonts, '../../02_COLORES_Y_TIPOGRAFIA/fonts/').css));
  write(path.join(D.socialSrc, 'logo.svg'), vec['logo-horizontal']);
  write(path.join(D.socialSrc, 'logo-blanco.svg'), vec['logo-horizontal-mono-blanco']);
  write(path.join(D.socialSrc, 'simbolo.svg'), vec.simbolo);
  write(path.join(D.socialSrc, 'simbolo-blanco.svg'), vec['simbolo-mono-blanco']);

  const browser = await launchBrowser();
  const aplicaciones = [];
  try {
    for (const s of SOCIAL) {
      const png = path.join(D.social, `${slug}-${s.file.replace('.html', '.png')}`);
      await render(path.join(D.socialSrc, s.file), png, { width: s.w, height: s.h, selector: '.canvas' }, browser);
      add(png, { ancho: s.w, alto: s.h });
      aplicaciones.push(png);
    }
    const flyer = path.join(D.social, `${slug}-flyer-a4.pdf`);
    await render(path.join(D.socialSrc, 'flyer-a4.html'), flyer, { width: 794, height: 1123 }, browser);
    add(flyer);

    // 6) Guías
    const pares = [
      ['texto', roles.texto, 'fondo', roles.fondo, 4.5], ['texto', roles.texto, 'superficie', roles.superficie, 4.5],
      ['sobre-acento', roles.sobre_acento, 'acento', roles.acento, 4.5], ['acento', roles.acento, 'fondo', roles.fondo, 3],
      ['fondo', roles.fondo, 'oscuro', roles.oscuro, 4.5], ['acento-sobre-oscuro', roles.acento_sobre_oscuro, 'oscuro', roles.oscuro, 3],
    ];
    write(path.join(D.guides, 'GUIA-RAPIDA.md'), `# Guía rápida — ${config.nombre}\n\n${config.eslogan ? `> ${config.eslogan}\n\n` : ''}## Logo\n- Principal: \`01_LOGOS/vector/${slug}-logo-horizontal.svg\` (PNG 2400 px en \`01_LOGOS/png/\`).\n- Sobre fondos oscuros o de acento: \`${slug}-logo-horizontal-mono-blanco.svg\`.\n- Espacios chicos (avatar, favicon): \`${slug}-simbolo.svg\` / PNG de 32 a 2048 px.\n- Área de respeto: la mitad de la altura del símbolo alrededor del logo. Ancho mínimo en pantalla: 120 px.\n\n## Color (roles)\n| Rol | HEX |\n|---|---|\n${Object.entries(roles).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}\n\nPaleta completa y usos: \`02_COLORES_Y_TIPOGRAFIA/tokens.json\`.\n\n## Tipografía\n${config.tipografias.map((t) => `- **${t.rol}:** ${t.familia} (${t.licencia || 'licencia a verificar'})`).join('\n')}\n\n## Plantillas\nEditables en \`04_PLANTILLAS_SOCIALES/fuente/\` (HTML). Re-render: \`node <repo>/tools/render.mjs <plantilla>.html salida.png --width W --height H --selector .canvas\`.\n`);
    write(path.join(D.guides, 'AUDITORIA-IDENTIDAD.md'), `# Auditoría de identidad — ${config.nombre}\n\nGenerada el ${today()} por build-brand-kit. Completar la columna "revisado" a ojo, mirando los PNG.\n\n## Contrastes de los roles (WCAG 2.x)\n| Par | Ratio | Umbral | Resultado |\n|---|---|---|---|\n${pares.map(([a, ah, b, bh, u]) => { const r = contrast(ah, bh); return `| ${a} ${ah} / ${b} ${bh} | ${r.toFixed(2)} | ${u} | ${r >= u ? 'OK' : 'REVISAR'} |`; }).join('\n')}\n\nMatriz completa: \`python <repo>/tools/contraste.py brand.config.json --out 08-qa\`.\n\n## Checklist\n| Punto | Revisado |\n|---|---|\n| El símbolo se lee a 32 px | |\n| Las versiones mono y negativo conservan la forma | |\n| El wordmark está en curvas (no depende de fuentes instaladas) | |\n| Las licencias tipográficas permiten el uso previsto | |\n| Las plantillas no tienen texto cortado ni desbordado | |\n| El brand book no tiene páginas vacías ni pies con rutas locales | |\n`);
    add(path.join(D.guides, 'GUIA-RAPIDA.md'));
    add(path.join(D.guides, 'AUDITORIA-IDENTIDAD.md'));
    for (const [dir, text] of [
      [D.mockups, 'Mockups y piezas de campaña de la marca (PNG/JPG + fuente editable). Registrar origen y licencia de fotos en 03-referencias/FUENTES.csv.'],
      [D.product, 'Componentes y pantallas de producto (UI) con los tokens de 02_COLORES_Y_TIPOGRAFIA.'],
    ]) if (!fs.readdirSync(dir).length) write(path.join(dir, 'LEEME.md'), `# ${path.basename(dir)}\n\n${text}\n`);

    // 7) Brand book (HTML editable en FUENTES_EDITABLES/brandbook → BRAND-BOOK.pdf)
    if (brandbook) {
      const bbDir = path.join(D.sources, 'brandbook');
      const tpl = path.join(repoRoot, 'templates', 'brandbook');
      fs.mkdirSync(bbDir, { recursive: true });
      for (const f of fs.readdirSync(tpl)) if (!/\.svg$|^datos\.js$|^tokens\.css$/i.test(f)) fs.copyFileSync(path.join(tpl, f), path.join(bbDir, f));
      write(path.join(bbDir, 'tokens.css'), tokensCss(config, roles, fontFaces(config.tipografias, D.fonts, '../../02_COLORES_Y_TIPOGRAFIA/fonts/').css));
      const extra = secciones && fs.existsSync(secciones) ? JSON.parse(fs.readFileSync(secciones, 'utf8').replace(/^﻿/, '')) : [];
      const datos = {
        marca: { nombre: config.nombre, slug, eslogan: config.eslogan || '' }, version: '1.0', fecha: today(),
        colores: config.colores, tipografias: config.tipografias,
        logos: {
          horizontal: rel(bbDir, vecPath('logo-horizontal')), vertical: rel(bbDir, vecPath('logo-vertical')),
          simbolo: rel(bbDir, vecPath('simbolo')), horizontal_texto: rel(bbDir, vecPath('logo-horizontal-mono-texto')),
          horizontal_blanco: rel(bbDir, vecPath('logo-horizontal-mono-blanco')), simbolo_blanco: rel(bbDir, vecPath('simbolo-mono-blanco')),
        },
        patrones: patternFiles.map((f) => ({ archivo: rel(bbDir, f), nombre: path.basename(f, '.png').replace(`${slug}-`, '') })),
        aplicaciones: aplicaciones.map((f) => ({ archivo: rel(bbDir, f), nombre: path.basename(f, '.png').replace(`${slug}-`, '') })),
        secciones: Array.isArray(extra) ? extra : extra.secciones || [],
      };
      write(path.join(bbDir, 'datos.js'), `// Generado por tools/build-brand-kit.mjs. Editá brand.config.json / secciones y regenerá.\nwindow.BRANDBOOK = ${JSON.stringify(datos, null, 2)};\n`);
      const pdf = path.join(kit, 'BRAND-BOOK.pdf');
      await render(path.join(bbDir, 'index.html'), pdf, { width: 1280, height: 720 }, browser);
      add(pdf);
    }
  } finally {
    await browser.close();
  }

  // 8) README y manifiesto
  const readme = fill(fs.readFileSync(path.join(repoRoot, 'templates', 'kit', 'README.md'), 'utf8'), {
    nombre: config.nombre, fecha: today(),
    colores_tabla: `| id | HEX | Rol |\n|---|---|---|\n${config.colores.map((c) => `| ${c.id} | ${c.hex.toUpperCase()} | ${c.rol || ''} |`).join('\n')}`,
    tipografias_tabla: `| Rol | Familia | Licencia |\n|---|---|---|\n${config.tipografias.map((t) => `| ${t.rol} | ${t.familia} | ${t.licencia || 'VERIFICAR'} |`).join('\n')}`,
  });
  write(path.join(kit, 'README.md'), readme);
  add(path.join(kit, 'README.md'));
  write(path.join(kit, 'kit-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return { kit, total: manifest.archivos.length, roles };
}

if (isMain(import.meta.url)) {
  const { positional, options } = parseArgs(process.argv.slice(2), { booleans: ['sin-brandbook'] });
  const [configPath] = positional;
  if (!configPath) fail('Uso: node tools/build-brand-kit.mjs <brand.config.json> [--out dir] [--fonts dir] [--secciones secciones.json] [--sin-brandbook]');
  if (!fs.existsSync(configPath)) fail(`No existe: ${configPath}`);
  try {
    const result = await buildBrandKit(configPath, { out: options.out, fonts: options.fonts, secciones: options.secciones, brandbook: !options['sin-brandbook'] });
    console.log(`OK kit: ${result.kit} (${result.total} archivos)`);
    console.log(`Roles: ${Object.entries(result.roles).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
    console.log('Siguiente: python tools/validate-kit.py <kit> y mirar los PNG/PDF.');
  } catch (error) {
    fail(`ERROR: ${error.message}`);
  }
}
