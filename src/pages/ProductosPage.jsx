import { useState } from 'react';
import { useTienda } from '../context/TiendaContext';
import ProductoCard from '../components/productos/ProductoCard';
import ProductoDetalleModal from '../components/productos/ProductoDetalleModal';

export default function ProductosPage() {
  const { productos, carrito } = useTienda();
  const [productoDetalle, setProductoDetalle] = useState(null);

  const agregar = (producto, talla) => carrito.agregarProducto(producto.id, talla);

  return (
    <div className="container my-5 pt-4" id="productos-seccion">
      <h1 className="text-center fw-bold mb-2">Tienda de Productos</h1>
      <h5 className="text-center text-muted mb-4 fs-6">Encuentra ropa, accesorios y calzado para tus entrenamientos.</h5>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {productos.map((p) => (
          <ProductoCard key={p.id} producto={p} onVerDetalle={setProductoDetalle} onAgregar={agregar} />
        ))}
      </div>

      <ProductoDetalleModal producto={productoDetalle} onCerrar={() => setProductoDetalle(null)} onAgregar={agregar} />
    </div>
  );
}
