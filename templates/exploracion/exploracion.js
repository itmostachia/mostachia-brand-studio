/* Exploración comparativa (PDF). Lee window.TERRITORIOS_DATA (data.js, tools/galeria-data.mjs).
   Orden: portada → por territorio página A (brandboard) + página B (aplicaciones) → matriz → votación. */
(() => {
  'use strict';
  const data = window.TERRITORIOS_DATA;
  const doc = document.querySelector('#doc');
  if (!data || !Array.isArray(data.territorios) || !data.territorios.length) {
    doc.innerHTML = '<section class="page"><div class="pg-body"><h1>Sin datos</h1><p>Generá data.js con tools/galeria-data.mjs.</p></div></section>';
    return;
  }
  const T = data.territorios;
  const marca = data.marca || 'Marca';
  const fecha = data.fecha || new Date().toISOString().slice(0, 10);
  const MATRIZ_POR_PAGINA = 6;
  const VOTOS_POR_PAGINA = 8;
  const votantes = Array.isArray(data.votantes) && data.votantes.length ? data.votantes.slice(0, 6) : ['Votante 1', 'Votante 2', 'Votante 3', 'Votante 4', 'Votante 5'];

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const color = (t, rol, fb) => (t.paleta || []).find((c) => c.rol === rol)?.hex || fb;
  const lum = (hex) => {
    const [r, g, b] = hex.slice(1).match(/.{2}/g).map((h) => { const v = parseInt(h, 16) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const generic = (c = '') => (/mono/i.test(c) ? 'monospace' : /serif/i.test(c) && !/sans/i.test(c) ? 'serif' : 'sans-serif');
  const fontOf = (t, roles) => (t.tipografias || []).find((f) => roles.some((r) => String(f.rol || '').toLowerCase().startsWith(r)));
  const stack = (f) => (f ? `'${f.familia}', ${generic(f.clasificacion)}` : 'system-ui, sans-serif');
  const trunc = (s, n) => { const x = String(s ?? ''); return x.length > n ? `${x.slice(0, n - 1).trimEnd()}…` : x; };

  function vars(t) {
    const base = color(t, 'base', '#F4F3EF');
    const ink = color(t, 'ink', '#1D1D1B');
    const brand = color(t, 'brand', ink);
    const dark = color(t, 'dark_surface', ratio(ink, '#FFFFFF') > 7 ? ink : '#1D1D1B');
    return {
      '--t-base': base, '--t-surface': color(t, 'surface', base), '--t-ink': ink, '--t-muted': color(t, 'muted', ink),
      '--t-line': color(t, 'line', '#D9D6CE'), '--t-brand': brand, '--t-action': color(t, 'action', brand),
      '--t-on-action': color(t, 'on_action', ratio(brand, base) > ratio(brand, ink) ? base : ink),
      '--t-on-brand': ratio(brand, base) > ratio(brand, ink) ? base : ink, '--t-dark': dark,
      '--t-brand-on-dark': ratio(brand, dark) >= 3 ? brand : base,
      '--t-display': stack(fontOf(t, ['display'])), '--t-text': stack(fontOf(t, ['texto', 'text', 'ui', 'cuerpo', 'body'])),
    };
  }
  const style = (t) => Object.entries(vars(t)).map(([k, v]) => `${k}:${v}`).join(';').replace(/"/g, "'");
  const sym = (t) => t._rutas?.simbolo;
  const symbolOrInitial = (t, cls = 'symbol') => (sym(t)
    ? `<div class="${cls}"><img src="${esc(sym(t))}" alt=""></div>`
    : `<div class="initial">${esc((t.nombre || '?').charAt(0).toUpperCase())}</div>`);
  const head = (left, right) => `<div class="pg-head"><span>${left}</span><span>${right}</span></div>`;
  let pageNo = 0;
  const foot = (left) => `<div class="pg-foot"><span>${left}</span><span>${String(++pageNo).padStart(2, '0')}</span></div>`;
  const media = (src, alt) => (/\.html?$/i.test(src) ? `<iframe src="${esc(src)}" title="${esc(alt)}"></iframe>` : `<img src="${esc(src)}" alt="${esc(alt)}">`);

  const pages = [];

  // Portada
  pages.push(`<section class="page cover">${head(`${esc(marca)} · exploración de identidad`, esc(fecha))}
    <div class="cover-title"><p class="eyebrow" style="color:#8f8c84">Exploración de identidad</p><h1>${esc(marca)}</h1>
      <p class="lead">${T.length} territorios comparados con el mismo marco: brandboard, aplicaciones, matriz y votación del equipo.</p></div>
    <div class="cover-meta">${data.marco?.escena_demo ? `<span>Escena de prueba: ${esc(data.marco.escena_demo)}</span>` : ''}<span>Documento de trabajo · no es una aprobación</span></div>
    <div class="cover-grid">${T.slice(0, 18).map((t) => `<div style="${style(t)};background:var(--t-base)">${sym(t) ? `<img src="${esc(sym(t))}" alt="">` : `<b style="color:var(--t-brand)">${esc(t.nombre.charAt(0))}</b>`}</div>`).join('')}</div>
    ${foot(`${T.length} territorios`)}</section>`);

  for (const t of T) {
    const display = fontOf(t, ['display']);
    const texto = fontOf(t, ['texto', 'text', 'ui', 'cuerpo', 'body']);
    const principales = (t.paleta || []).filter((c) => !['success', 'warning', 'error'].includes(c.rol)).slice(0, 8);
    const estados = (t.paleta || []).filter((c) => ['success', 'warning', 'error'].includes(c.rol));
    const swatch = (c) => `<div class="sw" style="background:${c.hex};color:${ratio(c.hex, '#FFFFFF') > ratio(c.hex, '#111111') ? '#FFFFFF' : '#111111'}"><b>${esc(c.nombre || c.rol)}</b>${esc(c.rol)}<br>${c.hex}</div>`;
    const patron = /grill|grid|ret[ií]cula/i.test((t.gramatica || []).join(' ')) ? 'grid' : /l[ií]nea|rengl|trazo|onda/i.test((t.gramatica || []).join(' ')) ? 'lines' : '';
    const titulo = `${esc(t.id)} · ${esc(t.nombre)}`;

    // Página A: brandboard (archivo provisto o generado desde los datos)
    if (t._rutas?.board) {
      pages.push(`<section class="page pa" style="${style(t)}">${head(titulo, 'A · brandboard')}
        <div class="provided">${media(t._rutas.board, `${t.nombre} board`)}</div>${foot(esc(trunc(t.idea, 110)))}</section>`);
    } else {
      pages.push(`<section class="page pa" style="${style(t)}">${head(titulo, 'A · brandboard')}
        <div class="board">
          <div class="tile t-logo">${symbolOrInitial(t)}
            <div><div class="lockup">${sym(t) ? `<img src="${esc(sym(t))}" alt="">` : ''}<b>${esc(marca)}</b></div>
              <p class="idea">${esc(trunc(t.idea, 150))}</p></div>
            <p class="t-name">${esc(trunc([t.simbolo, t.gesto && `Gesto: ${t.gesto}`].filter(Boolean).join(' · '), 150))}</p></div>
          <div class="tile t-palette"><p class="eyebrow">Paleta por roles</p><div class="sw-grid">${principales.map(swatch).join('')}</div>
            ${estados.length ? `<div class="sw-grid" style="margin-top:6px;grid-template-columns:repeat(${estados.length},1fr)">${estados.map((c) => `<div class="sw" style="height:22px;background:${c.hex};color:${ratio(c.hex, '#FFFFFF') > ratio(c.hex, '#111111') ? '#FFFFFF' : '#111111'}">${esc(c.rol)}</div>`).join('')}</div>` : ''}</div>
          <div class="tile t-type"><p class="eyebrow">Tipografía</p><div class="specimen">Aa Bb 12</div>
            <div class="type-meta">${display ? `<span><b>${esc(display.familia)}</b> · display ${esc(display.pesos || '')} · ${esc(display.licencia || '')}</span>` : ''}${texto ? `<span style="font-family:var(--t-text)"><b>${esc(texto.familia)}</b> · texto ${esc(texto.pesos || '')} · ${esc(texto.licencia || '')}</span>` : ''}</div></div>
          <div class="tile t-graphic"><div class="pattern ${patron}"></div><p class="eyebrow">Gramática gráfica</p><ul>${(t.gramatica || []).slice(0, 5).map((g) => `<li>${esc(trunc(g, 90))}</li>`).join('')}</ul></div>
          <div class="tile t-image">${t._rutas?.imagen ? media(t._rutas.imagen, `${t.nombre} imagen`) : `${sym(t) ? `<img class="glyph" src="${esc(sym(t))}" alt="" style="position:absolute;inset:auto -30px -40px auto;width:180px;height:180px;opacity:.22;object-fit:contain">` : ''}<p class="eyebrow">Imagen</p><p>${esc(trunc(t.imagen, 170))}</p>${t.movimiento ? `<p style="margin-top:8px;opacity:.75">Movimiento: ${esc(trunc(t.movimiento, 90))}</p>` : ''}`}</div>
        </div>${foot(esc(trunc(t.lectura, 120)))}</section>`);
    }

    // Página B: aplicaciones (archivo provisto o maquetas generadas)
    if (t._rutas?.aplicacion) {
      pages.push(`<section class="page pb" style="${style(t)}">${head(titulo, 'B · aplicaciones')}
        <div class="provided">${media(t._rutas.aplicacion, `${t.nombre} aplicaciones`)}</div>${foot(esc(marca))}</section>`);
    } else {
      const cr = t.critica || {};
      const lk = `<div class="lockup">${sym(t) ? `<img src="${esc(sym(t))}" alt="">` : ''}<b>${esc(marca)}</b></div>`;
      pages.push(`<section class="page pb" style="${style(t)}">${head(titulo, 'B · aplicaciones')}
        <div class="apps">
          <div class="mock mock-post"><div class="row">${sym(t) ? `<img src="${esc(sym(t))}" alt="">` : ''}${esc(marca)}</div><b>${esc(trunc(t.idea, 90))}</b><small>Post 4:5 · ${esc(t.nombre)}</small></div>
          <div class="mock mock-ui"><div class="ui-side"><div class="lk">${sym(t) ? `<img src="${esc(sym(t))}" alt="">` : ''}${esc(marca)}</div><span class="on">Inicio</span><span>Pedidos</span><span>Clientes</span><span>Ajustes</span></div>
            <div class="ui-main"><h3>Resumen de hoy</h3>
              <div class="ui-cards"><div class="ui-card">Ventas<b>128</b></div><div class="ui-card">Nuevos<b>24</b></div><div class="ui-card">Pendientes<b>6</b></div></div>
              <div class="ui-bars">${[40, 55, 48, 70, 62, 85, 78].map((h, i) => `<i class="${i === 5 ? 'hi' : ''}" style="height:${h}%"></i>`).join('')}</div>
              <div class="ui-actions"><span class="ui-btn">Acción principal</span><span class="ui-btn ghost">Secundaria</span></div></div></div>
          <div class="mock mock-story"><small>Story 9:16</small>${symbolOrInitial(t)}<b>${esc(trunc(t.nombre, 40))}</b></div>
          <div class="mock-card"><div class="card-face">${lk}<small>Tarjeta · frente</small></div>
            <div class="card-face back"><b style="font-family:var(--t-display);font-size:18px">${esc(marca)}</b><small>nombre@dominio · +00 000 000 000</small></div></div>
          <div class="apps-list">${(t.aplicaciones || []).slice(0, 4).map((a) => `<p><b>${esc(a.superficie)}:</b> ${esc(trunc(a.aplicacion, 60))}</p>`).join('')}${cr.fortaleza ? `<p><b>Fortaleza:</b> ${esc(trunc(cr.fortaleza, 50))}</p>` : ''}${cr.riesgo ? `<p><b>Riesgo:</b> ${esc(trunc(cr.riesgo, 50))}</p>` : ''}</div>
        </div>${foot(esc(marca))}</section>`);
    }
  }

  // Matriz comparativa
  const mini = (t) => `<div class="mini" style="${style(t)}"><div class="sym" style="background:var(--t-base);border:1px solid var(--t-line)">${sym(t) ? `<img src="${esc(sym(t))}" alt="">` : `<b style="color:var(--t-brand)">${esc(t.nombre.charAt(0))}</b>`}</div><div class="who">${esc(t.nombre)}<small>${esc(t.id)}</small></div></div>`;
  for (let i = 0; i < T.length; i += MATRIZ_POR_PAGINA) {
    const chunk = T.slice(i, i + MATRIZ_POR_PAGINA);
    const total = Math.ceil(T.length / MATRIZ_POR_PAGINA);
    pages.push(`<section class="page sheet">${head(`${esc(marca)} · matriz comparativa`, total > 1 ? `${i / MATRIZ_POR_PAGINA + 1}/${total}` : '')}
      <div class="pg-body"><h2>Matriz comparativa</h2><table>
        <colgroup><col style="width:190px"><col style="width:150px"><col style="width:150px"><col><col style="width:170px"><col style="width:170px"><col style="width:70px"></colgroup>
        <thead><tr><th>Territorio</th><th>Paleta</th><th>Tipografía</th><th>Idea</th><th>Fortaleza</th><th>Riesgo</th><th>Rúbrica</th></tr></thead>
        <tbody>${chunk.map((t) => `<tr><td class="who">${mini(t)}</td>
          <td><div class="chips">${(t.paleta || []).filter((c) => !['success', 'warning', 'error'].includes(c.rol)).slice(0, 8).map((c) => `<i style="background:${c.hex}" title="${esc(c.rol)}"></i>`).join('')}</div></td>
          <td>${(t.tipografias || []).slice(0, 2).map((f) => esc(f.familia)).join(' + ')}</td>
          <td>${esc(trunc(t.idea, 120))}</td><td>${esc(trunc(t.critica?.fortaleza, 70))}</td><td>${esc(trunc(t.critica?.riesgo, 70))}</td>
          <td>${t.rubrica?.total != null ? `<b>${esc(t.rubrica.total)}</b>/20` : '—'}</td></tr>`).join('')}</tbody></table></div>
      ${foot('Documento de trabajo')}</section>`);
  }

  // Votación del equipo
  for (let i = 0; i < T.length; i += VOTOS_POR_PAGINA) {
    const chunk = T.slice(i, i + VOTOS_POR_PAGINA);
    const total = Math.ceil(T.length / VOTOS_POR_PAGINA);
    const last = i + VOTOS_POR_PAGINA >= T.length;
    pages.push(`<section class="page sheet">${head(`${esc(marca)} · votación del equipo`, total > 1 ? `${i / VOTOS_POR_PAGINA + 1}/${total}` : '')}
      <div class="pg-body"><h2>Votación del equipo</h2>
        <table class="vote-table"><colgroup><col style="width:230px">${votantes.map(() => '<col>').join('')}<col style="width:260px"></colgroup>
          <thead><tr><th>Territorio</th>${votantes.map((v) => `<th>${esc(v)}</th>`).join('')}<th>Comentario</th></tr></thead>
          <tbody>${chunk.map((t) => `<tr><td class="who">${mini(t)}</td>${votantes.map(() => '<td class="box"></td>').join('')}<td class="box"></td></tr>`).join('')}</tbody></table></div>
      ${last ? '<div class="decision"><div>Ruta elegida o fusión</div><div>Ajustes pedidos</div></div>' : ''}
      ${foot('Marcar: 1ª opción · 2ª opción · descartada. Registrar en 05-eleccion/VOTACION.md')}</section>`);
  }

  doc.innerHTML = pages.join('\n');
  document.title = `${marca} · Exploración de identidad`;
})();
