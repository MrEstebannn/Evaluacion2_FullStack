import { useMemo, useState } from 'react';
import { useTienda } from '../context/TiendaContext';
import { FILTROS_INICIALES, filtrarProductos } from '../utils/filtros';
import ProductoCard from '../components/productos/ProductoCard';
import FiltrosProductos from '../components/productos/FiltrosProductos';

export default function ProductosPage({ busqueda = '', onVerDetalle = () => {} }) {
  const { productos, categorias, carrito } = useTienda();
  const [filtros, setFiltros] = useState({ ...FILTROS_INICIALES, texto: busqueda });
  const filtrados = useMemo(
    () => filtrarProductos(productos, filtros),
    [productos, filtros]
  );
  const cambiarFiltros = (cambios) => setFiltros((actuales) => ({ ...actuales, ...cambios }));
  const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);

  return (
    <div className="container my-5 pt-4" id="productos-seccion">
      <h1 className="text-center fw-bold mb-2">Tienda de Productos</h1>
      <h5 className="text-center text-muted mb-4 fs-6">
        Encuentra ropa, accesorios y calzado para tus entrenamientos.
      </h5>
      <FiltrosProductos
        filtros={filtros}
        categorias={categorias}
        mostrados={filtrados.length}
        total={productos.length}
        onCambiar={cambiarFiltros}
        onLimpiar={limpiarFiltros}
      />

      {!filtrados.length ? (
        <div className="alert alert-info text-center">
          No encontramos productos con esos filtros.{' '}
          <button
            className="btn btn-link p-0 align-baseline"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filtrados.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              onVerDetalle={() => onVerDetalle(producto.id)}
              onAgregar={(seleccionado, talla) =>
                carrito.agregarProducto(seleccionado.id, talla)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}