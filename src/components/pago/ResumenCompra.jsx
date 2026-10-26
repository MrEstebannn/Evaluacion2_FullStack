import { formatoCLP } from '../../utils/formato';

export default function ResumenCompra({ resumen, items = [] }) {
  return (
    <section className="card p-3 mb-3">
      <h2 className="h5 fw-bold">Resumen de la compra</h2>
      <ul className="list-group list-group-flush">
        {items.map((item) => (
          <li className="list-group-item d-flex justify-content-between" key={item.id ?? item.nombre}>
            <span>{item.nombre} × {item.cantidad}</span>
            <span>{formatoCLP(item.precio * item.cantidad)}</span>
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-between mt-2">
        <span>Subtotal</span><span>{formatoCLP(resumen.subtotal)}</span>
      </div>
      <div className="d-flex justify-content-between text-success">
        <span>Descuento</span><span>-{formatoCLP(resumen.descuento)}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Envío</span><span>{resumen.envio ? formatoCLP(resumen.envio) : 'Gratis'}</span>
      </div>
      <hr />
      <div className="d-flex justify-content-between fw-bold">
        <span>Total</span><span>{formatoCLP(resumen.total)}</span>
      </div>
    </section>
  );
}