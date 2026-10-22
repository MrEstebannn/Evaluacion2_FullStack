import { useState } from 'react';
import Modal from '../common/Modal';
import { formatoCLP } from '../../utils/formato';

/** Contenido del detalle. Vive dentro del Modal, así su estado (talla) se reinicia en cada apertura. */
function DetalleProducto({ producto, onAgregar }) {
  const [talla, setTalla] = useState(producto.tallas?.[0] ?? '');

  return (
    <div className="row g-4 align-items-center">
      <div className="col-md-6">
        <img src={producto.imagen} className="img-fluid rounded shadow w-100" alt={producto.nombre} style={{ maxHeight: 280, objectFit: 'cover' }} />
      </div>
      <div className="col-md-6">
        <span className="badge bg-primary mb-2">{producto.categoria}</span>
        <h3 className="fw-bold mb-2">{formatoCLP(producto.precio)}</h3>
        <p className="text-muted">{producto.desc}</p>

        {producto.tallas?.length > 0 && (
          <div className="mb-3">
            <label htmlFor="talla-detalle" className="form-label fw-semibold">Seleccionar Talla:</label>
            <select id="talla-detalle" className="form-select" value={talla} onChange={(e) => setTalla(e.target.value)}>
              {producto.tallas.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        <p className="small text-secondary mb-3">
          Stock disponible: <strong>{producto.stock} unidades</strong>
        </p>
        <button type="button" className="btn btn-hype text-white fw-bold w-100" onClick={() => onAgregar(producto, talla)}>
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
}

export default function ProductoDetalleModal({ producto, onCerrar, onAgregar }) {
  return (
    <Modal abierto={Boolean(producto)} titulo={producto?.nombre ?? 'Detalle de Producto'} onCerrar={onCerrar} tamano="modal-lg">
      {producto && <DetalleProducto key={producto.id} producto={producto} onAgregar={onAgregar} />}
    </Modal>
  );
}
