#!/usr/bin/env node
// QA de maquetación: detecta desbordes y recortes dentro de cada página (o del selector dado).
// Sale con código 1 si encuentra problemas, e imprime un reporte legible (y JSON con --json).
//
// Uso:
//   node tools/qa-layout.mjs <archivo.html> [--selector ".page"] [--width 1280 --height 720]
//                             [--tolerancia 2] [--json reporte.json]
// Ignora elementos con clase .fullbleed o atributo [data-qa-ignore] (y todo lo que está dentro de un <svg>).
import fs from 'node:fs';
import path from 'node:path';
import { launchBrowser, openPage } from './lib/browser.mjs';
import { parseArgs, fail, isMain } from './lib/args.mjs';

export async function qaLayout(input, { selector = '.page', width = 1280, height = 720, tolerance = 2 } = {}) {
  const browser = await launchBrowser();
  try {
    const page = await openPage(browser, input, { width, height });
    return await page.evaluate(
      ({ selector, tolerance }) => {
        const describe = (el) => {
          const cls = typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
          return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls}`;
        };
        const visible = (el) => {
          const style = getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0;
        };
        const ignored = (el) => el.closest('svg, .fullbleed, [data-qa-ignore]');
        const containers = [...document.querySelectorAll(selector)];
        return containers.map((container, index) => {
          const box = container.getBoundingClientRect();
          const issues = [];
          // Los sangrados intencionales (.fullbleed / data-qa-ignore) no cuentan para el desborde del contenedor.
          const bleeds = [...container.querySelectorAll('.fullbleed, [data-qa-ignore]')];
          const saved = bleeds.map((el) => el.style.display);
          bleeds.forEach((el) => { el.style.display = 'none'; });
          const scroll = { w: container.scrollWidth, h: container.scrollHeight };
          bleeds.forEach((el, i) => { el.style.display = saved[i]; });
          if (scroll.w > container.clientWidth + tolerance) {
            issues.push({ tipo: 'desborde-horizontal', detalle: `scrollWidth ${scroll.w} > ${container.clientWidth}` });
          }
          if (scroll.h > container.clientHeight + tolerance) {
            issues.push({ tipo: 'desborde-vertical', detalle: `scrollHeight ${scroll.h} > ${container.clientHeight}` });
          }
          for (const el of container.querySelectorAll('*')) {
            if (ignored(el) || !visible(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
            if (r.left < box.left - tolerance || r.right > box.right + tolerance || r.top < box.top - tolerance || r.bottom > box.bottom + tolerance) {
              issues.push({ tipo: 'fuera-de-pagina', elemento: describe(el), texto: text });
            }
            // Texto recortado por un contenedor con overflow oculto.
            const style = getComputedStyle(el);
            const clips = /(hidden|clip)/.test(style.overflow + style.overflowX + style.overflowY);
            const hasText = [...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim());
            if (clips && hasText && (el.scrollWidth > el.clientWidth + tolerance || el.scrollHeight > el.clientHeight + tolerance)) {
              issues.push({ tipo: 'texto-recortado', elemento: describe(el), texto: text });
            }
          }
          return { pagina: index + 1, id: container.id || null, problemas: issues.slice(0, 12), total: issues.length };
        });
      },
      { selector, tolerance },
    ).then((pages) => ({ selector, paginas: pages.length, conProblemas: pages.filter((p) => p.total > 0) }));
  } finally {
    await browser.close();
  }
}

if (isMain(import.meta.url)) {
  const { positional, options } = parseArgs(process.argv.slice(2));
  const [input] = positional;
  if (!input) fail('Uso: node tools/qa-layout.mjs <archivo.html> [--selector .page] [--width 1280 --height 720] [--tolerancia 2] [--json out.json]');
  if (!fs.existsSync(input)) fail(`No existe: ${input}`);
  const report = await qaLayout(input, {
    selector: options.selector || '.page',
    width: Number(options.width || 1280),
    height: Number(options.height || 720),
    tolerance: Number(options.tolerancia || 2),
  }).catch((error) => fail(error.stack || String(error)));
  if (options.json) {
    fs.mkdirSync(path.dirname(path.resolve(options.json)), { recursive: true });
    fs.writeFileSync(options.json, JSON.stringify(report, null, 2), 'utf8');
  }
  if (report.paginas === 0) fail(`FAIL: ningún elemento coincide con "${report.selector}"`);
  if (report.conProblemas.length) {
    console.log(`FAIL qa-layout: ${report.conProblemas.length}/${report.paginas} páginas con problemas`);
    for (const pageReport of report.conProblemas) {
      console.log(`- página ${pageReport.pagina}${pageReport.id ? ` (#${pageReport.id})` : ''}: ${pageReport.total} problema(s)`);
      for (const issue of pageReport.problemas) {
        console.log(`    ${issue.tipo} ${issue.elemento || ''} ${issue.detalle || ''} ${issue.texto ? `"${issue.texto}"` : ''}`.trimEnd());
      }
    }
    process.exit(1);
  }
  console.log(`PASS qa-layout: ${report.paginas} páginas sin desbordes (${report.selector})`);
}
