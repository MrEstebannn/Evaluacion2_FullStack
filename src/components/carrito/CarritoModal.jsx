import { useState } from 'react';
import Modal from '../common/Modal';
import CarritoItem from './CarritoItem';
import { useTienda } from '../../context/TiendaContext';
import { formatoCLP } from '../../utils/formato';

function ContenidoCarrito() {
  const { carrito } = useTienda();
  const [cupon, setCupon] = useState('');
  const [feedback, setFeedback] = useState(null);

  const aplicar = () => {
    const valido = carrito.aplicarCupon(cupon);
    setFeedback(
      valido
        ? { ok: true, mensaje: '¡Cupón de $5.000 aplicado correctamente!' }
        : { ok: false, mensaje: 'Cupón inválido. Intente con SEPTIEMBRE10 u HYPE10' }
    );
  };

  return (
    <>
      {carrito.items.length === 0 ? (
        <p className="text-center text-muted my-4">El carrito está vacío.</p>
      ) : (
        <div className="list-group list-group-flush">
          {carrito.items.map((item) => (
            <CarritoItem key={item.id} item={item} onCambiarCantidad={carrito.cambiarCantidad} onEliminar={carrito.eliminarItem} />
          ))}
        </div>
      )}

      <hr />
      <div className="row align-items-center g-3">
        <div className="col-md-6">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Ingrese cupón de descuento" value={cupon} onChange={(e) => setCupon(e.target.value)} />
            <button className="btn btn-outline-secondary" type="button" onClick={aplicar}>APLICAR</button>
          </div>
          {feedback && (
            <div className={`small mt-1 fw-bold ${feedback.ok ? 'text-success' : 'text-danger'}`}>{feedback.mensaje}</div>
          )}
        </div>
        <div className="col-md-6 text-end">
          <h4 className="fw-bold mb-0">TOTAL: <span>{formatoCLP(carrito.total)}</span></h4>
          {carrito.descuento > 0 && (
            <div className="small text-success fw-bold">Descuento aplicado: -{formatoCLP(carrito.descuento)}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default function CarritoModal({ abierto, onCerrar, onPagar }) {
  const { carrito } = useTienda();

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onCerrar}>Seguir Comprando</button>
      <button type="button" className="btn btn-success fw-bold px-4" disabled={carrito.items.length === 0} onClick={onPagar}>
        PAGAR
      </button>
    </>
  );

  return (
    <Modal abierto={abierto} titulo="Mi Carrito de Compras" onCerrar={onCerrar} tamano="modal-lg" footer={footer}>
      <ContenidoCarrito />
    </Modal>
  );
}
