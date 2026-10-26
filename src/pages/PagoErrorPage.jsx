import ResumenCompra from '../components/pago/ResumenCompra';

export default function PagoErrorPage({
  motivo,
  resumen,
  items,
  onReintentar,
  onCarrito,
  onIrTienda,
}) {
  return (
    <div className="container my-5 pt-5">
      <div className="alert alert-danger">
        <h1 className="h2 fw-bold">No pudimos procesar el pago</h1>
        <p className="mb-0">{motivo}</p>
      </div>
      <ResumenCompra resumen={resumen} items={items} />
      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-danger" onClick={onReintentar}>
          Volver a realizar el pago
        </button>
        <button className="btn btn-outline-dark" onClick={onCarrito}>
          Revisar mi carrito
        </button>
        <button className="btn btn-hype text-white" onClick={onIrTienda}>
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}