export function enOferta(producto) {
  return Number(producto?.precioOferta) > 0
    && Number(producto.precioOferta) < Number(producto.precio);
}

export function precioFinal(producto) {
  return enOferta(producto)
    ? Number(producto.precioOferta)
    : Number(producto?.precio ?? 0);
}

export function porcentajeDescuento(producto) {
  return enOferta(producto)
    ? Math.round((1 - producto.precioOferta / producto.precio) * 100)
    : 0;
}

export function productosEnOferta(productos = []) {
  return productos.filter(enOferta);
}