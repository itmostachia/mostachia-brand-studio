import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Parser mínimo de argumentos: posicionales + --clave valor + --flag.
export function parseArgs(argv, { booleans = [] } = {}) {
  const positional = [];
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const [rawKey, inline] = token.slice(2).split(/=(.*)/s, 2);
      if (inline !== undefined) options[rawKey] = inline;
      else if (booleans.includes(rawKey) || argv[i + 1] === undefined || argv[i + 1].startsWith('--')) options[rawKey] = true;
      else options[rawKey] = argv[(i += 1)];
    } else {
      positional.push(token);
    }
  }
  return { positional, options };
}

export function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

// true si el módulo se ejecuta directo (no importado). Tolera mayúsculas de unidad en Windows.
export function isMain(metaUrl) {
  if (!process.argv[1]) return false;
  const norm = (p) => (process.platform === 'win32' ? p.toLowerCase() : p);
  return norm(path.resolve(process.argv[1])) === norm(fileURLToPath(metaUrl));
}
