/* Brand book generado desde window.BRANDBOOK (datos.js). Esquema:
   { marca:{nombre,slug,eslogan}, version, fecha,
     colores:[{id,hex,rol}], tipografias:[{rol,familia,fuente,licencia}],
     logos:{horizontal, vertical, simbolo, horizontal_texto, horizontal_blanco, simbolo_blanco},
     patrones:[{archivo,nombre}], aplicaciones:[{archivo,nombre}],
     reglas:{simbolo_min_px, logo_min_px, area_respeto},
     secciones:[{titulo, kicker, texto:(string|string[]), imagen, posicion:"inicio"|"final"}] }
   Todas las rutas son relativas a esta carpeta. */
(() => {
  'use strict';
  const D = window.BRANDBOOK;
  const book = document.querySelector('#book');
  if (!D || !D.marca) {
    book.innerHTML = '<section class="page"><div class="body"><h2>Falta datos.js</h2><p>Lo genera tools/build-brand-kit.mjs.</p></div></section>';
    return;
  }
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lum = (hex) => {
    const [r, g, b] = hex.slice(1).match(/.{2}/g).map((h) => { const v = parseInt(h, 16) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const rgb = (hex) => hex.slice(1).match(/.{2}/g).map((h) => parseInt(h, 16)).join(' · ');
  const nombre = D.marca.nombre;
  const L = D.logos || {};
  const R = { simbolo_min_px: 24, logo_min_px: 120, area_respeto: 'la altura del símbolo × 0,5', ...(D.reglas || {}) };
  let n = 0;
  const frame = (cls, kicker, inner) => `<section class="page ${cls}"><div class="head"><span>${esc(nombre)} · brand book</span><span>${esc(kicker || '')}</span></div>
    <div class="body">${inner}</div><div class="foot"><span>${esc(D.version ? `v${D.version}` : '')} ${esc(D.fecha || '')}</span><span>${String(++n).padStart(2, '0')}</span></div></section>`;
  const textBlock = (t) => (Array.isArray(t) ? t : String(t || '').split(/\n{2,}/)).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');
  const seccion = (s) => frame('', s.kicker || s.titulo, `<div class="free ${s.imagen ? '' : 'solo'}"><div class="text">${s.kicker ? `<p class="kicker">${esc(s.kicker)}</p>` : ''}<h2>${esc(s.titulo)}</h2><div class="lead">${textBlock(s.texto)}</div></div>${s.imagen ? `<img src="${esc(s.imagen)}" alt="">` : ''}</div>`);
  const secciones = Array.isArray(D.secciones) ? D.secciones : [];
  const pages = [];

  // Portada
  pages.push(frame('cover', 'Identidad de marca', `
    ${L.simbolo ? `<img class="symbol-bg fullbleed" src="${esc(L.simbolo)}" alt="">` : ''}
    <div>${L.horizontal ? `<img class="logo" src="${esc(L.horizontal)}" alt="${esc(nombre)}">` : `<h1>${esc(nombre)}</h1>`}</div>
    <div><p class="kicker">Manual de identidad</p><h1>${esc(D.marca.eslogan || nombre)}</h1></div>`));

  secciones.filter((s) => s.posicion === 'inicio').forEach((s) => pages.push(seccion(s)));

  // Símbolo y logo
  if (L.simbolo || L.horizontal) {
    pages.push(frame('', 'Logo', `<div class="two"><div><p class="kicker">Logo</p><h2>Símbolo y logotipo</h2>
      <p class="lead">El logo principal combina el símbolo con el logotipo. El símbolo solo se usa cuando la marca ya está presente o el espacio es mínimo (avatar, favicon, app).</p></div>
      <div class="grid4" style="grid-template-columns:1fr;grid-template-rows:1.2fr 1fr">
        <figure style="background:var(--superficie)">${L.horizontal ? `<img src="${esc(L.horizontal)}" alt="">` : ''}<figcaption>Logo principal</figcaption></figure>
        <figure style="background:var(--superficie)">${L.simbolo ? `<img src="${esc(L.simbolo)}" alt="" style="max-height:62%">` : ''}<figcaption>Símbolo</figcaption></figure>
      </div></div>`));
    pages.push(frame('', 'Área de respeto', `<p class="kicker">Uso</p><h2>Área de respeto y tamaño mínimo</h2>
      <div class="clear"><span class="t">x</span><span class="l">x</span>${L.horizontal ? `<img src="${esc(L.horizontal)}" alt="">` : ''}</div>
      <div class="specs"><div><b>x</b><small>área de respeto: ${esc(R.area_respeto)}</small></div>
        <div><b>${esc(R.logo_min_px)} px</b><small>ancho mínimo del logo en pantalla</small></div>
        <div><b>${esc(R.simbolo_min_px)} px</b><small>tamaño mínimo del símbolo</small></div></div>`));
    pages.push(frame('', 'Versiones', `<div class="grid4">
      <figure style="background:var(--fondo)">${L.horizontal ? `<img src="${esc(L.horizontal)}" alt="">` : ''}<figcaption>Color sobre fondo</figcaption></figure>
      <figure style="background:var(--superficie)">${L.horizontal_texto ? `<img src="${esc(L.horizontal_texto)}" alt="">` : ''}<figcaption>Monocromo</figcaption></figure>
      <figure style="background:var(--oscuro);color:var(--fondo)">${L.horizontal_blanco ? `<img src="${esc(L.horizontal_blanco)}" alt="">` : ''}<figcaption>Negativo</figcaption></figure>
      <figure style="background:var(--acento);color:var(--sobre-acento)">${L.horizontal_blanco ? `<img src="${esc(L.horizontal_blanco)}" alt="">` : ''}<figcaption>Sobre acento (verificar contraste)</figcaption></figure></div>`));
    const src = esc(L.horizontal || L.simbolo);
    pages.push(frame('', 'Usos incorrectos', `<p class="kicker">Uso</p><h2>Usos incorrectos</h2>
      <div class="donts">
        <figure><img src="${src}" alt="" style="transform:scaleX(1.5)"><figcaption>No deformar</figcaption></figure>
        <figure><img src="${src}" alt="" style="transform:rotate(-14deg)"><figcaption>No rotar</figcaption></figure>
        <figure><img src="${src}" alt="" style="filter:hue-rotate(140deg)"><figcaption>No cambiar colores</figcaption></figure>
        <figure style="background:repeating-linear-gradient(45deg,var(--acento) 0 14px,var(--fondo) 14px 28px)"><img src="${src}" alt=""><figcaption style="background:var(--fondo);padding:2px 6px;border-radius:4px">No usar sobre fondos cargados</figcaption></figure>
        <figure><img src="${src}" alt="" style="filter:drop-shadow(8px 8px 4px rgba(0,0,0,.5))"><figcaption>No agregar efectos</figcaption></figure>
        <figure><img src="${src}" alt="" style="opacity:.35"><figcaption>No bajar la opacidad</figcaption></figure>
      </div>`));
  }

  // Paleta
  const colores = (D.colores || []).filter((c) => /^#[0-9a-f]{6}$/i.test(c.hex));
  if (colores.length) {
    const fondo = getComputedStyle(document.documentElement).getPropertyValue('--fondo').trim() || '#FFFFFF';
    const cols = Math.min(colores.length, 4);
    pages.push(frame('', 'Color', `<div style="display:grid;grid-template-rows:auto minmax(0,1fr);height:100%;gap:20px"><div><p class="kicker">Color</p><h2>Paleta</h2></div>
      <div class="palette" style="grid-template-columns:repeat(${cols},1fr)">${colores.map((c) => {
        const ink = ratio(c.hex, '#FFFFFF') >= ratio(c.hex, '#111111') ? '#FFFFFF' : '#111111';
        return `<div class="chip" style="background:${c.hex};color:${ink}"><b>${esc(c.id)}</b><span>${c.hex.toUpperCase()}<br>RGB ${rgb(c.hex)}<br>${esc(c.rol || '')}<br>vs fondo ${/^#/.test(fondo) ? ratio(c.hex, fondo).toFixed(2) : '—'}:1</span></div>`;
      }).join('')}</div></div>`));
  }

  // Tipografía
  const tipos = D.tipografias || [];
  if (tipos.length) {
    pages.push(frame('', 'Tipografía', `<div style="display:grid;grid-template-rows:auto minmax(0,1fr);height:100%;gap:18px"><div><p class="kicker">Tipografía</p><h2>Familias</h2></div>
      <div class="types">${tipos.slice(0, 3).map((t) => `<div class="type"><div><h3>${esc(t.familia)}</h3><small>${esc(t.rol)} · ${esc(t.fuente || '')} · ${esc(t.licencia || '')}</small></div>
        <div><div class="spec" style="font-family:'${esc(t.familia)}',var(--font-texto)">Aa Bb Cc 0123</div><div class="abc" style="font-family:'${esc(t.familia)}',var(--font-texto)">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ abcdefghijklmnñopqrstuvwxyz áéíóú ¿?¡! $%&amp;</div></div></div>`).join('')}</div></div>`));
  }

  // Galerías (patrones y aplicaciones), de a 4 por página
  const galeria = (items, kicker, titulo, cover) => {
    for (let i = 0; i < items.length; i += 4) {
      const chunk = items.slice(i, i + 4);
      const cols = chunk.length === 1 ? 1 : 2;
      pages.push(frame('', kicker, `<div style="display:grid;grid-template-rows:auto minmax(0,1fr);height:100%;gap:18px"><div><p class="kicker">${esc(kicker)}</p><h2>${esc(titulo)}</h2></div>
        <div class="gallery" style="grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${Math.ceil(chunk.length / cols)},minmax(0,1fr))">${chunk.map((it) => `<figure><img class="${cover ? 'cover' : ''}" src="${esc(it.archivo)}" alt=""><figcaption>${esc(it.nombre || '')}</figcaption></figure>`).join('')}</div></div>`));
    }
  };
  galeria(D.patrones || [], 'Gráfica', 'Fondos y patrones', true);
  galeria(D.aplicaciones || [], 'Aplicaciones', 'Plantillas y aplicaciones', false);

  secciones.filter((s) => s.posicion !== 'inicio').forEach((s) => pages.push(seccion(s)));

  // Cierre
  pages.push(frame('dark', 'Contacto', `<div style="display:flex;flex-direction:column;justify-content:space-between;height:100%">
    ${L.horizontal_blanco ? `<img src="${esc(L.horizontal_blanco)}" alt="" style="width:420px;max-height:200px;object-fit:contain;object-position:left">` : `<h1>${esc(nombre)}</h1>`}
    <div><p class="kicker">Dudas sobre el uso de la marca</p><p class="lead">Ante cualquier caso no previsto en este manual, consultar antes de publicar.</p></div></div>`));

  book.innerHTML = pages.join('\n');
  document.title = `${nombre} · Brand book`;
})();
