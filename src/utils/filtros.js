export const FILTROS_INICIALES = { texto: '', categoria: '', min: '', max: '', orden: '' };

export const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const aNumero = (valor) => (valor !== '' && !Number.isNaN(Number(valor)) ? Number(valor) : null);

export function rangoValido(min, max) {
  const desde = aNumero(min);
  const hasta = aNumero(max);
  return desde === null || hasta === null || desde <= hasta;
}

export function filtrarProductos(productos, filtros) {
  const texto = normalizar(filtros.texto);
  const desde = aNumero(filtros.min);
  const hasta = aNumero(filtros.max);
  const aplicarRango = rangoValido(filtros.min, filtros.max);

  const resultado = productos.filter((p) => {
    if (texto && !normalizar(p.nombre).includes(texto)) return false;
    if (filtros.categoria && p.categoria !== filtros.categoria) return false;
    if (aplicarRango && desde !== null && p.precio < desde) return false;
    if (aplicarRango && hasta !== null && p.precio > hasta) return false;
    return true;
  });

  const ordenados = [...resultado];
  if (filtros.orden === 'precio-asc') ordenados.sort((a, b) => a.precio - b.precio);
  if (filtros.orden === 'precio-desc') ordenados.sort((a, b) => b.precio - a.precio);
  if (filtros.orden === 'nombre') ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return ordenados;
}

export const contarFiltrosActivos = (filtros) =>
  [filtros.texto.trim() !== '', filtros.categoria !== '', filtros.min !== '', filtros.max !== ''].filter(Boolean).length;
