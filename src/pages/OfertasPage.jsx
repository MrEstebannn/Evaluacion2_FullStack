import { useTienda } from '../context/TiendaContext';
import { productosEnOferta } from '../utils/ofertas';
import ProductoCard from '../components/productos/ProductoCard';

export default function OfertasPage({ onVerDetalle }) {
  const { productos, carrito } = useTienda();
  const ofertas = productosEnOferta(productos);

  return (
    <div className="container my-5 pt-5">
      <h1 className="fw-bold text-center mb-4">Ofertas</h1>
      {!ofertas.length ? (
        <div className="alert alert-info">Por ahora no hay productos en oferta.</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {ofertas.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              onVerDetalle={() => onVerDetalle(producto.id)}
              onAgregar={(seleccionado, talla) => carrito.agregarProducto(seleccionado.id, talla)}
            />
          ))}
        </div>
      )}
    </div>
  );
}