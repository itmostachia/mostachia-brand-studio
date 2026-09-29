#!/usr/bin/env node
// Smoke test del pipeline completo sobre la marca de prueba "Ejemplo" (tests/fixture), en una carpeta temporal:
// nuevo-expediente → galeria-data → EXPLORACION.pdf → qa-layout → pdf-contact-sheet → board-index → contraste
// → build-brand-kit → qa-layout brand book → validate-kit → empaquetar (incluye prueba de rechazo de secretos).
// Uso: npm run smoke   (PYTHON=… para elegir intérprete; --conservar deja la carpeta temporal)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixture = path.join(repo, 'tests', 'fixture');
const keep = process.argv.includes('--conservar') || process.env.SMOKE_CONSERVAR === '1';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'brand-studio-smoke-'));
const exp = path.join(tmp, 'ejemplo');
const t04 = path.join(exp, '04-territorios');
const qa = path.join(exp, '08-qa');
const env = { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' };

function findPython() {
  const candidates = [process.env.PYTHON, ...(process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python'])].filter(Boolean);
  for (const cmd of candidates) {
    const r = spawnSync(cmd, ['-c', 'import sys; assert sys.version_info >= (3, 10); import PIL, pypdfium2'], { encoding: 'utf8' });
    if (r.status === 0) return cmd;
  }
  throw new Error('No hay Python ≥ 3.10 con Pillow y pypdfium2 (python -m pip install Pillow pypdfium2). Definí PYTHON si hace falta.');
}
const PY = findPython();

let step = 0;
const results = [];
function run(label, cmd, args, { expectFail = false } = {}) {
  step += 1;
  const started = Date.now();
  const r = spawnSync(cmd, args, { cwd: repo, env, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
  const ok = expectFail ? r.status !== 0 : r.status === 0;
  console.log(`\n[${String(step).padStart(2, '0')}] ${ok ? 'PASS' : 'FAIL'} ${label} (${secs}s)`);
  if (out) console.log(out.split('\n').slice(0, 14).map((l) => `     ${l}`).join('\n'));
  results.push({ label, ok });
  if (!ok) {
    console.error(`\nSMOKE FAIL en "${label}" (exit ${r.status}${r.error ? `, ${r.error.message}` : ''}). Carpeta: ${tmp}`);
    process.exit(1);
  }
  return out;
}
const node = (script, ...args) => [process.execPath, [path.join('tools', script), ...args]];
const py = (script, ...args) => [PY, [path.join('tools', script), ...args]];

console.log(`Smoke · repo ${repo}\nTemporal: ${tmp}\nPython: ${PY}`);

run('nuevo-expediente', ...node('nuevo-expediente.mjs', '--nombre', 'Ejemplo', '--dir', tmp));
fs.copyFileSync(path.join(fixture, 'territorios.json'), path.join(t04, 'territorios.json'));
fs.cpSync(path.join(fixture, 'boards'), path.join(t04, 'boards'), { recursive: true });
run('galeria-data (galería + exploración)', ...node('galeria-data.mjs', path.join(t04, 'territorios.json')));
run('render galería (captura)', ...node('render.mjs', path.join(t04, 'galeria', 'index.html'), path.join(qa, 'galeria.png'), '--width', '1440', '--height', '900'));
run('render EXPLORACION.pdf', ...node('render.mjs', path.join(t04, 'exploracion', 'index.html'), path.join(t04, 'EXPLORACION.pdf')));
run('qa-layout exploración', ...node('qa-layout.mjs', path.join(t04, 'exploracion', 'index.html'), '--json', path.join(qa, 'qa-layout-exploracion.json')));
run('pdf-contact-sheet exploración', ...py('pdf-contact-sheet.py', path.join(t04, 'EXPLORACION.pdf'), path.join(qa, 'exploracion')));
run('board-index', ...py('board-index.py', path.join(qa, 'board-index.jpg'), '--carpeta', path.join(qa, 'exploracion', 'pages'), '--titulo', 'Ejemplo · exploración', '--cols', '3'));
run('contraste territorios', ...py('contraste.py', path.join(t04, 'territorios.json'), '--out', qa));

// Fase kit: se fusionan los campos elegidos (fixture) y se copian los logos a la ruta del contrato.
const configPath = path.join(exp, 'brand.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const kitFields = JSON.parse(fs.readFileSync(path.join(fixture, 'brand.config.kit.json'), 'utf8'));
delete kitFields._nota;
fs.writeFileSync(configPath, `${JSON.stringify({ ...config, ...kitFields }, null, 2)}\n`, 'utf8');
const vectorDir = path.join(exp, '06-kit', '01_LOGOS', 'vector');
fs.mkdirSync(vectorDir, { recursive: true });
fs.copyFileSync(path.join(fixture, 'logos', 'simbolo.svg'), path.join(vectorDir, 'simbolo.svg'));
fs.copyFileSync(path.join(fixture, 'logos', 'wordmark.svg'), path.join(vectorDir, 'wordmark.svg'));

run('build-brand-kit', ...node('build-brand-kit.mjs', configPath));
run('qa-layout brand book', ...node('qa-layout.mjs', path.join(exp, '06-kit', 'FUENTES_EDITABLES', 'brandbook', 'index.html')));
run('pdf-contact-sheet brand book', ...py('pdf-contact-sheet.py', path.join(exp, '06-kit', 'BRAND-BOOK.pdf'), path.join(qa, 'brandbook')));
run('validate-kit', ...py('validate-kit.py', path.join(exp, '06-kit'), '--config', configPath));
run('contraste kit (matriz)', ...py('contraste.py', configPath, '--out', qa, '--prefijo', 'contrastes-kit'));

// empaquetar debe rechazar una URL firmada; después se limpia y empaqueta de verdad.
const leak = path.join(qa, 'fuga-de-prueba.md');
fs.writeFileSync(leak, 'https://bucket.example/archivo.zip?X-Amz-Credential=abc&X-Amz-Signature=0123456789abcdef\n', 'utf8');
run('empaquetar rechaza URL firmada', ...py('empaquetar.py', exp), { expectFail: true });
fs.unlinkSync(leak);
run('empaquetar', ...py('empaquetar.py', exp));

const zip = fs.readdirSync(path.join(exp, '09-entrega')).find((f) => f.endsWith('.zip'));
const shaLine = fs.readFileSync(path.join(exp, '09-entrega', `${zip}.sha256`), 'utf8').trim();
if (!/^[0-9a-f]{64} {2}\S+\.zip$/.test(shaLine)) { console.error(`SMOKE FAIL: .sha256 inválido: ${shaLine}`); process.exit(1); }

console.log(`\nSMOKE PASS · ${results.length} pasos OK`);
if (keep) {
  console.log(`Carpeta conservada: ${tmp}`);
  console.log(`Revisá a ojo: ${path.join(qa, 'exploracion', 'contact-sheet-1.jpg')}`);
  console.log(`              ${path.join(qa, 'brandbook', 'contact-sheet-1.jpg')}`);
} else {
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('Carpeta temporal borrada (npm run smoke -- --conservar para inspeccionar los renders).');
}
