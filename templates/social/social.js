// Vista previa: si la plantilla todavía tiene marcadores {{…}} (no pasó por build-brand-kit), los
// reemplaza por textos de demo. Con la plantilla ya completada no hace nada.
(() => {
  const demo = { nombre: 'Marca', eslogan: 'Un titular claro, en dos líneas como máximo.', slug: 'marca' };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) if (walker.currentNode.nodeValue.includes('{{')) nodes.push(walker.currentNode);
  nodes.forEach((node) => { node.nodeValue = node.nodeValue.replace(/\{\{(\w+)\}\}/g, (m, k) => demo[k] ?? m); });
})();
