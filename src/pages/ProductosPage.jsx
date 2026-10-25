import { useMemo, useState } from 'react';
import { useTienda } from '../context/TiendaContext';
import { FILTROS_INICIALES, filtrarProductos } from '../utils/filtros';
import ProductoCard from '../components/productos/ProductoCard';
import ProductoDetalleModal from '../components/productos/ProductoDetalleModal';
import FiltrosProductos from '../components/productos/FiltrosProductos';

export default function ProductosPage({ busqueda = '' }) {
  const { productos, categorias, carrito } = useTienda();
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [filtros, setFiltros] = useState({ ...FILTROS_INICIALES, texto: busqueda });

  const filtrados = useMemo(() => filtrarProductos(productos, filtros), [productos, filtros]);

  const cambiarFiltros = (cambios) => setFiltros((anteriores) => ({ ...anteriores, ...cambios }));
  const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);
  const agregar = (producto, talla) => carrito.agregarProducto(producto.id, talla);

  return (
    <div className="container my-5 pt-4" id="productos-seccion">
      <h1 className="text-center fw-bold mb-2">Tienda de Productos</h1>
      <h5 className="text-center text-muted mb-4 fs-6">Encuentra ropa, accesorios y calzado para tus entrenamientos.</h5>

      <FiltrosProductos
        filtros={filtros}
        categorias={categorias}
        mostrados={filtrados.length}
        total={productos.length}
        onCambiar={cambiarFiltros}
        onLimpiar={limpiarFiltros}
      />

      {filtrados.length === 0 ? (
        <div className="alert alert-info text-center">
          No encontramos productos con esos filtros.{' '}
          <button type="button" className="btn btn-link p-0 align-baseline" onClick={limpiarFiltros}>Limpiar filtros</button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filtrados.map((p) => (
            <ProductoCard key={p.id} producto={p} onVerDetalle={setProductoDetalle} onAgregar={agregar} />
          ))}
        </div>
      )}

      <ProductoDetalleModal producto={productoDetalle} onCerrar={() => setProductoDetalle(null)} onAgregar={agregar} />
    </div>
  );
}
