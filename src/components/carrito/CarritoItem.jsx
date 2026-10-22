import { formatoCLP } from '../../utils/formato';

export default function CarritoItem({ item, onCambiarCantidad, onEliminar }) {
  return (
    <div className="list-group-item d-flex justify-content-between align-items-center py-3">
      <div>
        <h6 className="mb-0 fw-bold">{item.nombre}</h6>
        <small className="text-muted">{formatoCLP(item.precio)} c/u</small>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button type="button" className="btn btn-sm btn-outline-secondary" aria-label="Quitar una unidad" onClick={() => onCambiarCantidad(item.id, -1)}>-</button>
        <span className="fw-bold px-2">{item.cantidad}</span>
        <button type="button" className="btn btn-sm btn-outline-secondary" aria-label="Agregar una unidad" onClick={() => onCambiarCantidad(item.id, 1)}>+</button>
        <span className="fw-bold ms-3 text-end" style={{ minWidth: 80 }}>{formatoCLP(item.precio * item.cantidad)}</span>
        <button type="button" className="btn btn-sm btn-outline-danger ms-2" aria-label="Eliminar del carrito" onClick={() => onEliminar(item.id)}>✕</button>
      </div>
    </div>
  );
}
