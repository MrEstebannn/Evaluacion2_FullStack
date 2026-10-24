import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { formatoCLP } from '../../utils/formato';
import { formatoFecha } from '../adminStats';
import PageHeader from '../components/PageHeader';
import EstadoBadge from '../components/EstadoBadge';

export default function BoletaView() {
  const { ordenes, actualizarOrden, notificar } = useTienda();
  const { ruta, ir } = useAdminNav();
  const orden = ordenes.find((o) => o.id === ruta.id);

  if (!orden) {
    return (
      <div className="alert alert-warning">
        No se encontró la orden. <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => ir('ordenes')}>Volver a órdenes</button>
      </div>
    );
  }

  const cambiarEstado = (e) => {
    actualizarOrden(orden.id, { estado: e.target.value });
    notificar(`Orden #${orden.numero} marcada como ${e.target.value}.`);
  };

  return (
    <>
      <PageHeader titulo={`Boleta #${orden.numero}`} subtitulo={`Emitida el ${formatoFecha(orden.fecha)}`}>
        <button type="button" className="btn btn-outline-secondary" onClick={() => ir('ordenes')}><i className="bi bi-arrow-left me-2" />Volver</button>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}><i className="bi bi-printer me-2" />Imprimir</button>
      </PageHeader>

      <div className="card admin-card" style={{ maxWidth: 820 }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <div className="fw-bold fs-5">HYPE ACADEMIC</div>
              <div className="text-muted small">Av. Principal #123, Santiago, Chile</div>
            </div>
            <div className="text-end">
              <EstadoBadge estado={orden.estado} />
              <div className="no-print mt-2">
                <label htmlFor="estadoOrden" className="form-label small text-muted mb-1">Cambiar estado</label>
                <select id="estadoOrden" className="form-select form-select-sm" value={orden.estado} onChange={cambiarEstado}>
                  {['Pagada', 'Pendiente', 'Cancelada'].map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-body-tertiary rounded-3 p-3 mb-4">
            <div className="small text-muted">Cliente</div>
            <div className="fw-semibold">{orden.cliente.nombre}</div>
            <div className="small">{orden.cliente.correo} · RUN {orden.cliente.run}</div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr className="admin-th"><th>Detalle</th><th className="text-end">Precio</th><th className="text-center">Cant.</th><th className="text-end">Subtotal</th></tr></thead>
              <tbody>
                {orden.items.map((i) => (
                  <tr key={i.nombre}>
                    <td>{i.nombre}</td>
                    <td className="text-end">{formatoCLP(i.precio)}</td>
                    <td className="text-center">{i.cantidad}</td>
                    <td className="text-end">{formatoCLP(i.precio * i.cantidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ms-auto" style={{ maxWidth: 280 }}>
            <div className="d-flex justify-content-between"><span>Subtotal</span><span>{formatoCLP(orden.subtotal)}</span></div>
            {orden.descuento > 0 && <div className="d-flex justify-content-between text-success"><span>Descuento</span><span>-{formatoCLP(orden.descuento)}</span></div>}
            <hr className="my-2" />
            <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>{formatoCLP(orden.total)}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
