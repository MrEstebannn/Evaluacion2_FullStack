export function productosDeCategoria(productos = [], categoria) {
  const nombre = typeof categoria === 'object' ? categoria?.nombre : categoria;
  const id = typeof categoria === 'object' ? categoria?.id : categoria;

  return productos.filter(
    (producto) =>
      String(producto.categoria) === String(nombre) ||
      String(producto.categoriaId) === String(id)
  );
}

export function contarPorCategoria(productos = [], categorias = []) {
  return categorias.map((categoria) => ({
    ...categoria,
    cantidadProductos: productosDeCategoria(productos, categoria).length,
  }));
}