/* Galería offline de territorios. Lee window.TERRITORIOS_DATA (data.js, generado por tools/galeria-data.mjs).
   Notas y votos se guardan en localStorage de este navegador y se exportan a JSON. Nunca son aprobaciones. */
(() => {
  'use strict';
  const data = window.TERRITORIOS_DATA;
  const main = document.querySelector('#main');
  if (!data || !Array.isArray(data.territorios) || !data.territorios.length) {
    main.innerHTML = '<p class="empty">No hay territorios para mostrar. Generá <code>data.js</code> con <code>node tools/galeria-data.mjs &lt;territorios.json&gt;</code> y mantené los archivos de la galería juntos.</p>';
    return;
  }
  const territorios = data.territorios;
  const marca = data.marca || 'Marca';
  const storageKey = `galeria-territorios.${String(marca).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.v1`;
  const VOTOS = { si: 'Sí', 'tal-vez': 'Tal vez', no: 'No' };

  // ---------- utilidades ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = (id) => territorios.find((t) => t.id === id);
  const color = (t, rol, fallback) => (t.paleta || []).find((c) => c.rol === rol)?.hex || fallback;
  const luminance = (hex) => {
    const [r, g, b] = hex.slice(1).match(/.{2}/g).map((h) => {
      const v = parseInt(h, 16) / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const genericFamily = (clasificacion = '') => {
    const c = clasificacion.toLowerCase();
    if (c.includes('mono')) return 'monospace';
    if (c.includes('serif') && !c.includes('sans')) return 'serif';
    return 'sans-serif';
  };
  const font = (t, roles) => {
    const f = (t.tipografias || []).find((x) => roles.some((r) => String(x.rol || '').toLowerCase().startsWith(r)));
    return f ? `"${f.familia}", ${genericFamily(f.clasificacion)}` : 'system-ui, sans-serif';
  };
  function themeVars(t) {
    const base = color(t, 'base', '#F4F3EF');
    const ink = color(t, 'ink', '#1D1D1B');
    const brand = color(t, 'brand', ink);
    const action = color(t, 'action', brand);
    const onBrand = contrast(brand, base) > contrast(brand, ink) ? base : ink;
    return [
      `--t-base:${base}`, `--t-surface:${color(t, 'surface', base)}`, `--t-ink:${ink}`,
      `--t-muted:${color(t, 'muted', ink)}`, `--t-line:${color(t, 'line', 'rgba(127,127,127,.3)')}`,
      `--t-brand:${brand}`, `--t-on-brand:${onBrand}`, `--t-action:${action}`,
      `--t-on-action:${color(t, 'on_action', onBrand)}`,
      `--t-display:${font(t, ['display'])}`, `--t-text:${font(t, ['texto', 'text', 'ui', 'cuerpo', 'body'])}`,
    ].join(';').replace(/"/g, "'");
  }
  const symbolHtml = (t, cls) => (t._rutas?.simbolo
    ? `<div class="${cls}"><img src="${esc(t._rutas.simbolo)}" alt=""></div>`
    : `<div class="auto-initial">${esc((t.nombre || '?').trim().charAt(0).toUpperCase())}</div>`);

  // Board / aplicación: archivo del territorio si existe; si no, una versión generada desde los datos.
  function mediaHtml(t, kind) {
    const src = t._rutas?.[kind];
    if (src) {
      if (/\.html?$/i.test(src)) return `<iframe class="media-frame" src="${esc(src)}" title="${esc(t.nombre)} · ${kind}" loading="lazy"></iframe>`;
      return `<img class="media" src="${esc(src)}" alt="${esc(t.nombre)} · ${kind}" loading="lazy">`;
    }
    const strip = (t.paleta || []).filter((c) => ['base', 'surface', 'ink', 'brand', 'action', 'muted'].includes(c.rol));
    if (kind === 'aplicacion') {
      return `<div class="auto app" style="${themeVars(t)}"><div class="auto-inner">
        <div class="auto-symbol">${t._rutas?.simbolo ? `<img src="${esc(t._rutas.simbolo)}" alt="">` : ''}</div>
        <div class="app-row">
          <div class="app-post"><small>${esc(marca)}</small><b>${esc(t.idea || t.nombre)}</b><small>${esc(t.nombre)}</small></div>
          <div class="app-ui"><div class="ui-head">${t._rutas?.simbolo ? `<img src="${esc(t._rutas.simbolo)}" alt="">` : ''}${esc(marca)}</div>
            <div class="ui-line"></div><div class="ui-line short"></div><div class="ui-line"></div>
            <span class="ui-btn">Acción principal</span></div>
        </div></div></div>`;
    }
    return `<div class="auto" style="${themeVars(t)}"><div class="auto-bar"></div><div class="auto-inner">
      ${symbolHtml(t, 'auto-symbol')}
      <div><p class="auto-name">${esc(marca)}</p><p class="auto-idea">${esc(t.idea || '')}</p></div>
      <div class="auto-strip">${strip.map((c) => `<span style="background:${c.hex}" title="${esc(c.rol)}"></span>`).join('')}</div>
    </div></div>`;
  }

  // ---------- estado ----------
  const empty = () => ({ version: 1, marca, evaluador: '', notas: {}, favoritos: [], general: '', comparar: [territorios[0].id, (territorios[1] || territorios[0]).id], actualizado: null });
  let state = empty();
  let storageOk = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') state = sanitize(saved);
  } catch { storageOk = false; }

  function sanitize(input) {
    const out = empty();
    out.evaluador = typeof input.evaluador === 'string' ? input.evaluador.slice(0, 120) : '';
    out.general = typeof input.general === 'string' ? input.general.slice(0, 20000) : '';
    out.favoritos = Array.isArray(input.favoritos) ? input.favoritos.filter(byId) : [];
    for (const t of territorios) {
      const n = input.notas?.[t.id];
      if (!n || typeof n !== 'object') continue;
      out.notas[t.id] = {
        voto: VOTOS[n.voto] ? n.voto : '',
        puntaje: Number.isInteger(n.puntaje) && n.puntaje >= 1 && n.puntaje <= 5 ? n.puntaje : 0,
        nota: typeof n.nota === 'string' ? n.nota.slice(0, 12000) : '',
      };
    }
    if (Array.isArray(input.comparar) && input.comparar.length === 2 && input.comparar.every(byId)) out.comparar = input.comparar;
    out.actualizado = typeof input.actualizado === 'string' ? input.actualizado : null;
    return out;
  }
  const nota = (id) => state.notas[id] || (state.notas[id] = { voto: '', puntaje: 0, nota: '' });
  function save() {
    state.actualizado = new Date().toISOString();
    try { localStorage.setItem(storageKey, JSON.stringify(state)); storageOk = true; } catch { storageOk = false; }
    $('#storage-status').textContent = storageOk ? 'Notas guardadas en este navegador · exportalas para compartirlas.' : 'Este navegador no permite guardar: exportá tus notas antes de cerrar.';
    $('#notas-count').textContent = territorios.filter((t) => state.notas[t.id]?.voto || state.notas[t.id]?.nota?.trim()).length;
  }
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 2400);
  }

  // ---------- explorar ----------
  let filtro = 'todos';
  function renderGrid() {
    const visibles = territorios.filter((t) => {
      const v = state.notas[t.id]?.voto || '';
      return filtro === 'todos' || (filtro === 'sin-voto' ? !v : v === filtro);
    });
    $('#grid').innerHTML = visibles.length ? visibles.map((t) => {
      const n = state.notas[t.id];
      const fav = state.favoritos.includes(t.id);
      const strip = (t.paleta || []).filter((c) => !['success', 'warning', 'error'].includes(c.rol));
      return `<article class="card">
        <button type="button" class="card-media" data-open="${esc(t.id)}" aria-label="Abrir ${esc(t.nombre)}">${mediaHtml(t, 'board')}</button>
        <div class="card-body">
          <div class="card-head"><span class="id">${esc(t.id)}</span><h3>${esc(t.nombre)}</h3>
            <button type="button" class="fav" data-fav="${esc(t.id)}" aria-pressed="${fav}" aria-label="Favorito">${fav ? '★' : '☆'}</button></div>
          <p class="card-idea">${esc(t.idea || '')}</p>
          <div class="card-foot"><div class="strip">${strip.map((c) => `<span style="background:${c.hex}" title="${esc(c.rol)} ${c.hex}"></span>`).join('')}</div>
            <span class="badge ${n?.voto || ''}">${n?.voto ? VOTOS[n.voto] : 'Sin voto'}${n?.puntaje ? ` · ${n.puntaje}/5` : ''}</span></div>
        </div></article>`;
    }).join('') : '<p class="empty">Ningún territorio con ese filtro.</p>';
  }

  // ---------- detalle ----------
  const dialog = $('#detalle');
  let actual = null;
  let detailMedia = 'board';
  function section(title, body) { return body ? `<div class="section"><h4>${title}</h4>${body}</div>` : ''; }
  function infoHtml(t, { compact = false } = {}) {
    const paleta = (t.paleta || []).map((c) => `<button type="button" class="swatch" data-copy="${c.hex}" title="${esc(c.uso || '')}"><i style="background:${c.hex}"></i><span><b>${esc(c.nombre || c.rol)}</b>${esc(c.rol)} · ${c.hex}</span></button>`).join('');
    const tipos = (t.tipografias || []).map((f) => `<div class="type-row"><b style="font-family:'${esc(f.familia)}',${genericFamily(f.clasificacion)}">${esc(f.familia)}</b><small>${esc(f.rol)} · ${esc(f.pesos || '')}<br>${esc(f.licencia || '')}</small></div>`).join('');
    const lista = (arr) => (Array.isArray(arr) && arr.length ? `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
    const cr = t.critica || {};
    return [
      section('Idea', t.idea ? `<p>${esc(t.idea)}</p>` : ''),
      section('Lectura estratégica', t.lectura ? `<p>${esc(t.lectura)}</p>` : ''),
      section('Paleta', paleta ? `<div class="swatches">${paleta}</div>` : ''),
      section('Tipografía', tipos),
      compact ? '' : section('Símbolo', [t.simbolo, t.wordmark && `Wordmark: ${t.wordmark}`, t.gesto && `Gesto: ${t.gesto}`].filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join('')),
      section('Gramática', lista(t.gramatica)),
      compact ? '' : section('Imagen y movimiento', [t.imagen, t.movimiento].filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join('')),
      section('Pre-crítica', [['Fortaleza', cr.fortaleza], ['Riesgo', cr.riesgo], ['Señal de fracaso', cr.fracaso], ['Prueba decisiva', cr.prueba]].filter(([, v]) => v).map(([k, v]) => `<p><b>${k}:</b> ${esc(v)}</p>`).join('')),
      compact || !t.rubrica ? '' : section('Rúbrica', `<p><b>${esc(t.rubrica.total)}/20</b>${t.rubrica.detalle ? ' · ' + Object.entries(t.rubrica.detalle).map(([k, v]) => `${esc(k)} ${esc(v)}`).join(' · ') : ''}</p>`),
    ].join('');
  }
  function openDetail(id) {
    actual = byId(id);
    if (!actual) return;
    $('#detalle-id').textContent = `${actual.id} · ${marca}`;
    $('#detalle-titulo').textContent = actual.nombre;
    $('#detalle-body').innerHTML = infoHtml(actual);
    renderDetailMedia();
    renderVote();
    if (!dialog.open) dialog.showModal();
  }
  function renderDetailMedia() {
    $('#detalle-stage').innerHTML = mediaHtml(actual, detailMedia);
    $$('[data-detail-media]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.detailMedia === detailMedia)));
  }
  function renderVote() {
    const n = nota(actual.id);
    $$('.vote').forEach((b) => b.setAttribute('aria-pressed', String(n.voto === b.dataset.vote)));
    $('#detalle-stars').innerHTML = [1, 2, 3, 4, 5].map((i) => `<button type="button" class="star" data-star="${i}" aria-pressed="${i <= n.puntaje}" aria-label="${i} de 5">★</button>`).join('');
    $('#detalle-nota').value = n.nota;
  }

  // ---------- comparar ----------
  let cmpMedia = 'board';
  function renderCompare() {
    const options = territorios.map((t) => `<option value="${esc(t.id)}">${esc(t.id)} · ${esc(t.nombre)}</option>`).join('');
    ['a', 'b'].forEach((k, i) => { const s = $(`#cmp-${k}`); s.innerHTML = options; s.value = state.comparar[i]; });
    $('#compare').innerHTML = state.comparar.map((id) => {
      const t = byId(id);
      const n = state.notas[id];
      return `<div class="cmp-col"><div class="cmp-media" data-zoom-id="${esc(id)}" data-zoom-kind="${cmpMedia}">${mediaHtml(t, cmpMedia)}</div>
        <div class="cmp-body"><p class="eyebrow">${esc(t.id)}${n?.voto ? ` · ${VOTOS[n.voto]}` : ''}</p><h3>${esc(t.nombre)}</h3>${infoHtml(t, { compact: true })}</div></div>`;
    }).join('');
    $$('[data-media]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.media === cmpMedia)));
  }

  // ---------- notas ----------
  function renderNotes() {
    $('#notes-table').innerHTML = `<thead><tr><th>Territorio</th><th>Voto</th><th>Puntaje</th><th>Favorito</th><th>Nota</th></tr></thead><tbody>${territorios.map((t) => {
      const n = state.notas[t.id] || {};
      return `<tr><td><button type="button" data-open="${esc(t.id)}">${esc(t.id)} · ${esc(t.nombre)}</button></td><td>${n.voto ? VOTOS[n.voto] : '—'}</td><td>${n.puntaje ? `${n.puntaje}/5` : '—'}</td><td>${state.favoritos.includes(t.id) ? '★' : ''}</td><td class="nota">${esc(n.nota || '')}</td></tr>`;
    }).join('')}</tbody>`;
    $('#nota-general').value = state.general;
  }

  // ---------- zoom ----------
  const zoom = { scale: 1, x: 0, y: 0, w: 1600, h: 1000 };
  function openZoom(t, kind) {
    const content = $('#zoom-content');
    content.innerHTML = mediaHtml(t, kind);
    const img = content.querySelector('img.media');
    const setSize = (w, h) => { zoom.w = w; zoom.h = h; content.style.width = `${w}px`; content.style.height = `${h}px`; fitZoom(); };
    if (img) {
      img.loading = 'eager';
      img.complete && img.naturalWidth ? setSize(img.naturalWidth, img.naturalHeight) : img.addEventListener('load', () => setSize(img.naturalWidth || 1600, img.naturalHeight || 1000), { once: true });
    } else setSize(1600, 1000);
    $('#zoom-label').textContent = `${t.id} · ${t.nombre} · ${kind === 'board' ? 'Board' : 'Aplicación'}`;
    if (!$('#zoom').open) $('#zoom').showModal();
    requestAnimationFrame(fitZoom);
  }
  function applyZoom() { $('#zoom-content').style.transform = `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`; }
  function fitZoom() {
    const box = $('#zoom-canvas').getBoundingClientRect();
    zoom.scale = Math.min(box.width / zoom.w, box.height / zoom.h) * 0.95;
    zoom.x = (box.width - zoom.w * zoom.scale) / 2;
    zoom.y = (box.height - zoom.h * zoom.scale) / 2;
    applyZoom();
  }
  function zoomAt(factor, cx, cy) {
    const next = Math.min(8, Math.max(0.1, zoom.scale * factor));
    zoom.x = cx - ((cx - zoom.x) * next) / zoom.scale;
    zoom.y = cy - ((cy - zoom.y) * next) / zoom.scale;
    zoom.scale = next;
    applyZoom();
  }
  const canvas = $('#zoom-canvas');
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX - zoom.x, y: e.clientY - zoom.y }; canvas.classList.add('dragging'); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => { if (!drag) return; zoom.x = e.clientX - drag.x; zoom.y = e.clientY - drag.y; applyZoom(); });
  canvas.addEventListener('pointerup', () => { drag = null; canvas.classList.remove('dragging'); });
  const closeZoom = () => { if ($('#zoom').open) $('#zoom').close(); };
  $('#zoom').addEventListener('close', () => { $('#zoom-content').innerHTML = ''; });

  // ---------- exportar / importar ----------
  function exportar() {
    const payload = {
      tipo: 'notas-galeria-territorios', version: 1, marca, evaluador: state.evaluador, exportado: new Date().toISOString(),
      general: state.general, favoritos: state.favoritos,
      notas: Object.fromEntries(territorios.map((t) => [t.id, { nombre: t.nombre, ...(state.notas[t.id] || { voto: '', puntaje: 0, nota: '' }) }])),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    const quien = (state.evaluador || 'anonimo').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');
    a.href = URL.createObjectURL(blob);
    a.download = `notas-${quien}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Notas exportadas');
  }
  $('#importar').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const input = JSON.parse(await file.text());
      const notas = Object.fromEntries(Object.entries(input.notas || {}).map(([id, n]) => [id, n]));
      state = sanitize({ ...state, ...input, notas, comparar: state.comparar });
      save();
      renderAll();
      toast('Notas importadas');
    } catch { toast('No se pudo leer el archivo JSON'); }
    e.target.value = '';
  });

  // ---------- eventos ----------
  function setView(view) {
    $$('.tab').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    $$('.view').forEach((v) => { v.hidden = v.id !== `view-${view}`; });
    if (view === 'comparar') renderCompare();
    if (view === 'notas') renderNotes();
  }
  function renderAll() {
    $('#evaluador').value = state.evaluador;
    renderGrid();
    renderCompare();
    renderNotes();
  }
  document.addEventListener('click', async (e) => {
    const el = e.target.closest('button, [data-zoom-id], .stage');
    if (!el) return;
    if (el.dataset.view) setView(el.dataset.view);
    else if (el.dataset.open) openDetail(el.dataset.open);
    else if (el.dataset.fav) {
      const id = el.dataset.fav;
      state.favoritos = state.favoritos.includes(id) ? state.favoritos.filter((x) => x !== id) : [...state.favoritos, id];
      save(); renderGrid();
    } else if (el.dataset.filter) {
      filtro = el.dataset.filter;
      $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === el)));
      renderGrid();
    } else if (el.dataset.detailMedia) { detailMedia = el.dataset.detailMedia; renderDetailMedia(); }
    else if (el.dataset.vote) {
      const n = nota(actual.id);
      n.voto = n.voto === el.dataset.vote ? '' : el.dataset.vote;
      save(); renderVote(); renderGrid();
    } else if (el.dataset.star) {
      const n = nota(actual.id);
      const v = Number(el.dataset.star);
      n.puntaje = n.puntaje === v ? 0 : v;
      save(); renderVote(); renderGrid();
    } else if (el.dataset.step) {
      const i = territorios.indexOf(actual);
      openDetail(territorios[(i + Number(el.dataset.step) + territorios.length) % territorios.length].id);
    } else if (el.hasAttribute('data-close')) dialog.close();
    else if (el.dataset.copy) {
      try { await navigator.clipboard.writeText(el.dataset.copy); toast(`Copiado ${el.dataset.copy}`); } catch { toast(el.dataset.copy); }
    } else if (el.dataset.media) { cmpMedia = el.dataset.media; renderCompare(); }
    else if (el.id === 'cmp-swap') { state.comparar.reverse(); save(); renderCompare(); }
    else if (el.id === 'exportar') exportar();
    else if (el.dataset.zoom) {
      const box = canvas.getBoundingClientRect();
      if (el.dataset.zoom === 'close') closeZoom();
      else if (el.dataset.zoom === '0') fitZoom();
      else zoomAt(el.dataset.zoom === '1' ? 1.25 : 0.8, box.width / 2, box.height / 2);
    } else if (el.dataset.zoomId) openZoom(byId(el.dataset.zoomId), el.dataset.zoomKind);
    else if (el.classList.contains('stage')) openZoom(actual, detailMedia);
  });
  ['a', 'b'].forEach((k, i) => $(`#cmp-${k}`).addEventListener('change', (e) => { state.comparar[i] = e.target.value; save(); renderCompare(); }));
  $('#detalle-nota').addEventListener('input', (e) => { nota(actual.id).nota = e.target.value; save(); });
  $('#nota-general').addEventListener('input', (e) => { state.general = e.target.value; save(); });
  $('#evaluador').addEventListener('input', (e) => { state.evaluador = e.target.value; save(); });
  dialog.addEventListener('close', () => { renderGrid(); renderNotes(); });
  document.addEventListener('keydown', (e) => {
    if ($('#zoom').open) {
      if (e.key === '+' || e.key === '=') zoomAt(1.25, canvas.clientWidth / 2, canvas.clientHeight / 2);
      if (e.key === '-') zoomAt(0.8, canvas.clientWidth / 2, canvas.clientHeight / 2);
      return;
    }
    if (dialog.open && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && document.activeElement?.tagName !== 'TEXTAREA') {
      const i = territorios.indexOf(actual);
      openDetail(territorios[(i + (e.key === 'ArrowRight' ? 1 : -1) + territorios.length) % territorios.length].id);
    }
  });
  window.addEventListener('resize', () => { if ($('#zoom').open) fitZoom(); });

  document.title = `${marca} · Territorios`;
  $('#titulo').textContent = `${marca} · ${territorios.length} territorios`;
  save();
  renderAll();
})();
