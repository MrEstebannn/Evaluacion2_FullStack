import { formatoCLP } from '../../utils/formato';
import { enOferta, precioFinal, porcentajeDescuento } from '../../utils/ofertas';

export default function PrecioProducto({ producto }) {
  if (!enOferta(producto)) {
    return <p className="fw-bold fs-5 mb-2">{formatoCLP(producto.precio)}</p>;
  }

  return (
    <div className="mb-2">
      <del className="text-muted me-2">{formatoCLP(producto.precio)}</del>
      <strong className="fs-5 text-danger">{formatoCLP(precioFinal(producto))}</strong>
      <span className="badge bg-danger ms-2">{porcentajeDescuento(producto)}% OFF</span>
    </div>
  );
}