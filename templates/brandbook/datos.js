// Datos de DEMO para previsualizar la plantilla. tools/build-brand-kit.mjs escribe el datos.js real.
window.BRANDBOOK = {
  marca: { nombre: 'Marca', slug: 'marca', eslogan: 'Un eslogan claro y corto.' },
  version: '1.0',
  fecha: '',
  colores: [
    { id: 'fondo', hex: '#F3F1EC', rol: 'fondo principal' },
    { id: 'texto', hex: '#1C1C1A', rol: 'texto' },
    { id: 'acento', hex: '#3552D8', rol: 'acento' },
    { id: 'apoyo', hex: '#E4B363', rol: 'secundario' }
  ],
  tipografias: [
    { rol: 'display', familia: 'Georgia', fuente: 'sistema', licencia: '—' },
    { rol: 'texto', familia: 'Arial', fuente: 'sistema', licencia: '—' }
  ],
  logos: { horizontal: 'logo.svg', simbolo: 'simbolo.svg', horizontal_texto: 'logo.svg', horizontal_blanco: 'logo-blanco.svg' },
  patrones: [],
  aplicaciones: [],
  secciones: [
    { titulo: 'Propósito', kicker: 'Esencia', texto: 'Sección libre: se agrega desde un JSON de secciones extra.', posicion: 'inicio' }
  ]
};
