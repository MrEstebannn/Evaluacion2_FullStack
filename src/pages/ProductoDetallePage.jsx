import { useState } from 'react';
import { useTienda } from '../context/TiendaContext';
import PrecioProducto from '../components/productos/PrecioProducto';

export default function ProductoDetallePage({ id, onVolver }) {
  const { productos, carrito } = useTienda();
  const producto = productos.find((p) => String(p.id) === String(id));
  const [talla, setTalla] = useState(producto?.tallas?.[0] ?? '');

  if (!producto) {
    return (
      <div className="container my-5 pt-5">
        <div className="alert alert-warning">No encontramos ese producto.</div>
        <button className="btn btn-outline-dark" onClick={onVolver}>
          ← Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5 pt-5">
      <button className="btn btn-link px-0 mb-3" onClick={onVolver}>
        ← Volver a la tienda
      </button>
      <div className="row g-4 align-items-center">
        <div className="col-md-6">
          <img
            src={producto.imagen}
            className="img-fluid rounded shadow w-100"
            alt={producto.nombre}
          />
        </div>
        <div className="col-md-6">
          <span className="badge bg-primary mb-2">{producto.categoria}</span>
          <h1 className="fw-bold">{producto.nombre}</h1>
          <PrecioProducto producto={producto} />
          <p className="text-muted">{producto.desc}</p>
          {producto.tallas?.length > 0 && (
            <div className="mb-3">
              <label htmlFor="talla-detalle" className="form-label fw-semibold">
                Seleccionar Talla:
              </label>
              <select
                id="talla-detalle"
                className="form-select"
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
              >
                {producto.tallas.map((opcion) => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </div>
          )}
          <p>
            Stock disponible: <strong>{producto.stock} unidades</strong>
          </p>
          <button
            className="btn btn-hype text-white fw-bold"
            onClick={() => carrito.agregarProducto(producto.id, talla)}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}