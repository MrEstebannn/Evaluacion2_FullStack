import { useState } from 'react';
import { ordenesDB } from '../data/db';

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState(() => ordenesDB.listar());

  const crearOrden = (datos) => {
    const nueva = ordenesDB.crear(datos);
    setOrdenes(ordenesDB.listar());
    return nueva;
  };

  const actualizarOrden = (id, cambios) => {
    ordenesDB.actualizar(id, cambios);
    setOrdenes(ordenesDB.listar());
  };

  const eliminarOrden = (id) => {
    ordenesDB.eliminar(id);
    setOrdenes(ordenesDB.listar());
  };

  return { ordenes, crearOrden, actualizarOrden, eliminarOrden };
}
