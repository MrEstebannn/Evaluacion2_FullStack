import { useState } from 'react';
import PrecioProducto from './PrecioProducto';

export default function ProductoCard({ producto, onVerDetalle, onAgregar }) {
  const [talla, setTalla] = useState(producto.tallas?.[0] ?? '');

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0">
        <img
          src={producto.imagen}
          className="card-img-top img-cover-180"
          alt={producto.nombre}
        />
        <div className="card-body d-flex flex-column">
          <span className="badge bg-secondary mb-2 align-self-start">
            {producto.categoria}
          </span>
          <h5 className="h6 fw-bold mb-1">{producto.nombre}</h5>
          <PrecioProducto producto={producto} />
          {producto.tallas?.length > 0 && (
            <div className="mb-2">
              <label
                htmlFor={'talla-' + producto.id}
                className="form-label small fw-semibold mb-1"
              >
                Talla:
              </label>
              <select
                id={'talla-' + producto.id}
                className="form-select form-select-sm"
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
              >
                {producto.tallas.map((opcion) => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </div>
          )}
          <div className="mt-auto d-grid gap-2">
            <button
              className="btn btn-outline-dark btn-sm fw-semibold"
              onClick={() => onVerDetalle(producto)}
            >
              Ver Detalle
            </button>
            <button
              className="btn btn-hype text-white btn-sm fw-semibold"
              onClick={() => onAgregar(producto, talla)}
            >
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}