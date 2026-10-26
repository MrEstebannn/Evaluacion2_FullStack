import { useTienda } from '../context/TiendaContext';
import { contarPorCategoria, productosDeCategoria } from '../utils/categorias';
import ProductoCard from '../components/productos/ProductoCard';

export default function CategoriasPage({ id, onVerCategoria, onVerDetalle }) {
  const { productos, categorias, carrito } = useTienda();
  const categoria = categorias.find((item) => String(item.id) === String(id));

  if (id != null) {
    return (
      <div className="container my-5 pt-5">
        <button className="btn btn-link px-0" onClick={() => onVerCategoria(null)}>
          ← Volver a categorías
        </button>
        <h1 className="fw-bold">{categoria?.nombre ?? 'Categoría'}</h1>
        {!categoria ? (
          <div className="alert alert-warning">No encontramos esa categoría.</div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {productosDeCategoria(productos, categoria).map((producto) => (
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

  return (
    <div className="container my-5 pt-5">
      <h1 className="fw-bold text-center mb-4">Categorías</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {contarPorCategoria(productos, categorias).map((item) => (
          <div className="col" key={item.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h2 className="h4 fw-bold">{item.nombre}</h2>
                <p>{item.descripcion}</p>
                <p className="text-muted">{item.cantidadProductos} productos</p>
                <button
                  className="btn btn-hype text-white"
                  onClick={() => onVerCategoria(item.id)}
                >
                  Ver productos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}