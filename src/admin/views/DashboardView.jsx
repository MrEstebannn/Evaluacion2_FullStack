import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { formatoCLP } from '../../utils/formato';
import { contarPorEstado, formatoFecha, productosCriticos, totalVentas, ventasPorMes } from '../adminStats';
import PageHeader from '../components/PageHeader';
import KpiCard from '../components/KpiCard';
import EstadoBadge from '../components/EstadoBadge';
import BarrasMensuales from '../components/BarrasMensuales';

const ACCESOS = [
  { vista: 'producto-form', icono: 'plus-circle', texto: 'Nuevo producto' },
  { vista: 'usuario-form', icono: 'person-plus', texto: 'Nuevo usuario' },
  { vista: 'categorias', icono: 'tags', texto: 'Categorías' },
  { vista: 'reportes', icono: 'bar-chart-line', texto: 'Reportes' },
];

export default function DashboardView() {
  const { ordenes, productos, usuarios } = useTienda();
  const { ir } = useAdminNav();

  const criticos = productosCriticos(productos);
  const estados = contarPorEstado(ordenes);
  const recientes = [...ordenes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);

  return (
    <>
      <PageHeader titulo="Dashboard" subtitulo="Resumen de la actividad de la academia y la tienda." />

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard icono="cash-coin" color="success" titulo="Ventas totales" valor={formatoCLP(totalVentas(ordenes))} detalle="Órdenes pagadas" onClick={() => ir('reportes')} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard icono="receipt" color="primary" titulo="Órdenes" valor={ordenes.length} detalle={`${estados.Pendiente} pendientes`} onClick={() => ir('ordenes')} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard icono="box-seam" color="warning" titulo="Productos" valor={productos.length} detalle={`${criticos.length} en stock crítico`} onClick={() => ir('productos')} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard icono="people" color="info" titulo="Usuarios" valor={usuarios.length} detalle="Registrados" onClick={() => ir('usuarios')} />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card admin-card h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Ventas de los últimos 6 meses</h5>
              <BarrasMensuales datos={ventasPorMes(ordenes)} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card admin-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Stock crítico</h5>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => ir('criticos')}>Ver todos</button>
              </div>
              {criticos.length === 0 ? (
                <p className="text-muted mb-0"><i className="bi bi-check-circle text-success me-2" />Todo el inventario está en orden.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {criticos.slice(0, 4).map((p) => (
                    <li key={p.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                      <span className="small fw-semibold">{p.nombre}</span>
                      <span className="badge text-bg-danger">{p.stock} / {p.stockCritico}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card admin-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold mb-0">Últimas órdenes</h5>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => ir('ordenes')}>Ver todas</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr className="admin-th"><th>N°</th><th>Fecha</th><th>Cliente</th><th className="text-end">Total</th><th>Estado</th></tr>
                  </thead>
                  <tbody>
                    {recientes.map((o) => (
                      <tr key={o.id} role="button" onClick={() => ir('boleta', { id: o.id })}>
                        <td className="fw-bold">#{o.numero}</td>
                        <td>{formatoFecha(o.fecha)}</td>
                        <td>{o.cliente.nombre}</td>
                        <td className="text-end">{formatoCLP(o.total)}</td>
                        <td><EstadoBadge estado={o.estado} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card admin-card h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Accesos rápidos</h5>
              <div className="d-grid gap-2">
                {ACCESOS.map((a) => (
                  <button key={a.vista} type="button" className="btn btn-light text-start fw-semibold" onClick={() => ir(a.vista)}>
                    <i className={`bi bi-${a.icono} me-2 text-primary`} />{a.texto}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
