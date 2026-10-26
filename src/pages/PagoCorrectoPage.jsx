import ResumenCompra from '../components/pago/ResumenCompra';

export default function PagoCorrectoPage({ orden, resumen, items, onIrTienda, onNotificar }) {
  return (
    <div className="container my-5 pt-5">
      <div className="alert alert-success">
        <h1 className="h2 fw-bold">¡Pago correcto!</h1>
        <p className="mb-0">
          Tu pedido número <strong>{orden?.numero ?? '—'}</strong> fue procesado.
        </p>
      </div>
      <ResumenCompra resumen={resumen} items={items} />
      <div className="d-flex flex-wrap gap-2 no-print">
        <button className="btn btn-outline-dark" onClick={() => window.print()}>
          Imprimir boleta
        </button>
        <button className="btn btn-outline-primary" onClick={onNotificar}>
          Enviar boleta por correo
        </button>
        <button className="btn btn-hype text-white" onClick={onIrTienda}>
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}