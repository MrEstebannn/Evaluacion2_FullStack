import { useState } from 'react';
import { productosDB } from '../data/db';

export function useProductos() {
  const [productos, setProductos] = useState(() => productosDB.listar());

  const agregarProducto = (datos) => {
    const nuevo = productosDB.crear(datos);
    setProductos(productosDB.listar());
    return nuevo;
  };

  const actualizarProducto = (id, cambios) => {
    productosDB.actualizar(id, cambios);
    setProductos(productosDB.listar());
  };

  const eliminarProducto = (id) => {
    productosDB.eliminar(id);
    setProductos(productosDB.listar());
  };

  return { productos, agregarProducto, actualizarProducto, eliminarProducto };
}
