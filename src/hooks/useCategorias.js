import { useState } from 'react';
import { categoriasDB } from '../data/db';

export function useCategorias() {
  const [categorias, setCategorias] = useState(() => categoriasDB.listar());

  const agregarCategoria = (datos) => {
    const nueva = categoriasDB.crear(datos);
    setCategorias(categoriasDB.listar());
    return nueva;
  };

  const actualizarCategoria = (id, cambios) => {
    categoriasDB.actualizar(id, cambios);
    setCategorias(categoriasDB.listar());
  };

  const eliminarCategoria = (id) => {
    categoriasDB.eliminar(id);
    setCategorias(categoriasDB.listar());
  };

  return { categorias, agregarCategoria, actualizarCategoria, eliminarCategoria };
}
