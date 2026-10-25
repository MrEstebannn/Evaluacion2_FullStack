import { createContext, useContext } from 'react';
import { useProductos } from '../hooks/useProductos';
import { useUsuarios } from '../hooks/useUsuarios';
import { useCarrito } from '../hooks/useCarrito';
import { useOrdenes } from '../hooks/useOrdenes';
import { useCategorias } from '../hooks/useCategorias';
import { useNotificacion } from './NotificacionContext';

const TiendaContext = createContext(null);

export function TiendaProvider({ children }) {
  const { notificar } = useNotificacion();
  const productosApi = useProductos();
  const usuariosApi = useUsuarios();
  const ordenesApi = useOrdenes();
  const categoriasApi = useCategorias();
  const carritoApi = useCarrito(productosApi.productos, notificar);

  return (
    <TiendaContext.Provider value={{ ...productosApi, ...usuariosApi, ...ordenesApi, ...categoriasApi, carrito: carritoApi, notificar }}>
      {children}
    </TiendaContext.Provider>
  );
}

export function useTienda() {
  const ctx = useContext(TiendaContext);
  if (!ctx) throw new Error('useTienda debe usarse dentro de <TiendaProvider>');
  return ctx;
}
