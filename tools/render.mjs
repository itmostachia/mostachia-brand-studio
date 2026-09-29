#!/usr/bin/env node
// HTML → PNG (viewport, página completa o elemento) o PDF (tamaño de página del CSS).
const HELP = `Uso:
  node tools/render.mjs <entrada.html|url> <salida.png|salida.pdf> [opciones]

Opciones:
  --width 1280 --height 720   viewport en px (default 1280×720)
  --scale 2                   deviceScaleFactor para PNG (default 1)
  --selector ".page"          PNG de un elemento; con --all, uno por coincidencia (salida-01.png…)
  --all                       ver --selector
  --full-page                 PNG de toda la página
  --wait 300                  ms extra antes de capturar (animaciones, escenas WebGL)
  --gl                        WebGL por software (SwiftShader): Three.js/WebGL no sale en blanco
  --help                      esta ayuda

PDF: usa el @page del CSS (preferCSSPageSize), sin encabezado/pie de Chrome y con @page margin 0.

Navegador (en este orden):
  1. CHROME_PATH si está definida (Chrome, Chromium o chrome-headless-shell)
  2. Chromium de Playwright (npx playwright install chromium)
  3. chrome-headless-shell del caché de Playwright
  4. Chrome instalado en el sistema
  CHROME_LAUNCH_TIMEOUT (ms, default 30000) limita cada intento: si uno se cuelga, pasa al siguiente.`;
import fs from 'node:fs';
import path from 'node:path';
import { launchBrowser, openPage } from './lib/browser.mjs';
import { parseArgs, fail, isMain } from './lib/args.mjs';

// Lección Chrome PDF: sin encabezado/pie (fecha y file:/// impresos) y @page sin márgenes.
const PRINT_CSS = '@page{margin:0}html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}';

export async function render(input, output, opts = {}, sharedBrowser = null) {
  const { width = 1280, height = 720, scale = 1, selector = null, all = false, fullPage = false, wait = 0, gl = false } = opts;
  const browser = sharedBrowser || (await launchBrowser({ gl }));
  const outputs = [];
  try {
    const page = await openPage(browser, input, { width, height, scale });
    if (wait) await page.waitForTimeout(wait);
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    if (output.toLowerCase().endsWith('.pdf')) {
      await page.emulateMedia({ media: 'print' });
      await page.addStyleTag({ content: PRINT_CSS });
      await page.pdf({
        path: output,
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      outputs.push(output);
    } else if (selector) {
      const handles = await page.$$(selector);
      if (!handles.length) throw new Error(`Ningún elemento coincide con ${selector}`);
      const targets = all ? handles : handles.slice(0, 1);
      const ext = path.extname(output);
      const base = output.slice(0, output.length - ext.length);
      for (const [index, handle] of targets.entries()) {
        const file = all ? `${base}-${String(index + 1).padStart(2, '0')}${ext}` : output;
        await handle.screenshot({ path: file, timeout: 60000 });
        outputs.push(file);
      }
    } else {
      await page.screenshot({ path: output, fullPage, timeout: 60000 });
      outputs.push(output);
    }
    await page.close();
  } finally {
    if (!sharedBrowser) await browser.close();
  }
  return outputs;
}

if (isMain(import.meta.url)) {
  const { positional, options } = parseArgs(process.argv.slice(2), { booleans: ['all', 'full-page', 'gl', 'help'] });
  const [input, output] = positional;
  if (options.help) { console.log(HELP); process.exit(0); }
  if (!input || !output) fail(HELP);
  if (!/^(https?|file):/i.test(input) && !fs.existsSync(input)) fail(`No existe: ${input}`);
  render(input, output, {
    width: Number(options.width || 1280),
    height: Number(options.height || 720),
    scale: Number(options.scale || 1),
    selector: options.selector || null,
    all: Boolean(options.all),
    fullPage: Boolean(options['full-page']),
    wait: Number(options.wait || 0),
    gl: Boolean(options.gl),
  })
    .then((files) => files.forEach((file) => console.log(`OK ${file}`)))
    .catch((error) => fail(error.stack || String(error)));
}
