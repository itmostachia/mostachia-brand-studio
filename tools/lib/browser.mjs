// Lanzador de Chromium compartido por render, qa-layout y build-brand-kit.
// Orden: CHROME_PATH → Chromium de Playwright (default) → chrome-headless-shell del caché de Playwright
//        → Chrome instalado (channel "chrome") → rutas comunes de Chrome/Chromium. Error claro si nada anda.
// Opción gl: WebGL por software (SwiftShader) para escenas Three.js/WebGL que si no salen en blanco.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  throw new Error('Falta la dependencia "playwright". Corré `npm install` en la raíz del repo.');
}

const LAUNCH_TIMEOUT = Number(process.env.CHROME_LAUNCH_TIMEOUT || 30000);
const GL_ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'];

const COMMON_CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

// Busca chrome-headless-shell en el caché de Playwright (la versión más nueva primero).
function findHeadlessShell() {
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'ms-playwright'),
    path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright'),
    path.join(os.homedir(), '.cache', 'ms-playwright'),
  ].filter((root) => root && fs.existsSync(root));
  const exes = ['chrome-headless-shell.exe', 'chrome-headless-shell'];
  for (const root of roots) {
    const dirs = fs.readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
    for (const dir of dirs) {
      for (const sub of fs.readdirSync(path.join(root, dir))) {
        for (const exe of exes) {
          const candidate = path.join(root, dir, sub, exe);
          if (fs.existsSync(candidate)) return candidate;
        }
      }
    }
  }
  return null;
}

export async function launchBrowser({ gl = false } = {}) {
  const base = { headless: true, timeout: LAUNCH_TIMEOUT, args: gl ? GL_ARGS : [] };
  const errors = [];
  const attempt = async (label, options) => {
    try {
      return await chromium.launch({ ...base, ...options });
    } catch (error) {
      errors.push(`- ${label}: ${error.message.split('\n')[0]}`);
      return null;
    }
  };
  if (process.env.CHROME_PATH) {
    if (!fs.existsSync(process.env.CHROME_PATH)) throw new Error(`CHROME_PATH no existe: ${process.env.CHROME_PATH}`);
    const browser = await attempt(`CHROME_PATH (${process.env.CHROME_PATH})`, { executablePath: process.env.CHROME_PATH });
    if (browser) return browser;
    throw new Error(`No se pudo lanzar CHROME_PATH.\n${errors.join('\n')}`);
  }
  let browser = await attempt('Chromium de Playwright', {});
  if (browser) return browser;
  const shell = findHeadlessShell();
  if (shell) {
    browser = await attempt(`chrome-headless-shell (${shell})`, { executablePath: shell });
    if (browser) return browser;
  }
  browser = await attempt('Chrome instalado (channel chrome)', { channel: 'chrome' });
  if (browser) return browser;
  for (const candidate of COMMON_CHROME_PATHS.filter((p) => fs.existsSync(p))) {
    browser = await attempt(candidate, { executablePath: candidate });
    if (browser) return browser;
  }
  throw new Error(
    'No se pudo lanzar Chromium. Probá una de estas opciones:\n' +
      '  1) npx playwright install chromium\n' +
      '  2) definir CHROME_PATH con la ruta a Chrome/Chromium o a chrome-headless-shell\n' +
      `Intentos:\n${errors.join('\n')}`,
  );
}

export function toUrl(input) {
  return /^(https?|file):/i.test(input) ? input : pathToFileURL(path.resolve(input)).href;
}

// Espera fuentes e imágenes para no capturar con tipografía de reemplazo o huecos.
// Las imágenes loading="lazy" fuera de pantalla nunca cargan: se pasan a eager. Tope de 20 s.
export async function waitForAssets(page, timeout = 20000) {
  await page.evaluate(async (limit) => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
    document.querySelectorAll('iframe[loading="lazy"]').forEach((frame) => { frame.loading = 'eager'; });
    const deadline = new Promise((resolve) => setTimeout(resolve, limit));
    if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, deadline]);
    const images = [...document.images].filter((img) => !img.complete);
    await Promise.race([deadline, Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }),
      ),
    )]);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, timeout);
}

export async function openPage(browser, input, { width = 1280, height = 720, scale = 1 } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.goto(toUrl(input), { waitUntil: 'load', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await waitForAssets(page);
  return page;
}
