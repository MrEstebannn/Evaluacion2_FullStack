import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { formatoCLP } from '../../utils/formato';
import { comprasDeUsuario, formatoFecha } from '../adminStats';
import PageHeader from '../components/PageHeader';
import EstadoBadge from '../components/EstadoBadge';
import KpiCard from '../components/KpiCard';
import { iniciales } from '../components/Topbar';

export default function UsuarioDetalleView() {
  const { usuarios, ordenes } = useTienda();
  const { ruta, ir } = useAdminNav();
  const usuario = usuarios.find((u) => u.run === ruta.run);

  if (!usuario) {
    return <div className="alert alert-warning">No se encontró el usuario. <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => ir('usuarios')}>Volver al listado</button></div>;
  }

  const compras = comprasDeUsuario(ordenes, usuario).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const gastado = compras.filter((o) => o.estado === 'Pagada').reduce((s, o) => s + o.total, 0);

  return (
    <>
      <PageHeader titulo="Detalle de usuario">
        <button type="button" className="btn btn-outline-secondary" onClick={() => ir('usuarios')}><i className="bi bi-arrow-left me-2" />Volver</button>
        <button type="button" className="btn btn-primary" onClick={() => ir('usuario-form', { run: usuario.run })}><i className="bi bi-pencil me-2" />Editar</button>
      </PageHeader>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card admin-card h-100">
            <div className="card-body text-center">
              <span className="avatar-iniciales avatar-grande mx-auto mb-3">{iniciales(usuario)}</span>
              <h5 className="fw-bold mb-0">{usuario.nombre} {usuario.apellidos}</h5>
              <span className="badge text-bg-primary mb-3">{usuario.tipo}</span>
              <ul className="list-unstyled text-start small mb-0">
                <li className="mb-2"><i className="bi bi-person-badge me-2 text-muted" />{usuario.run}</li>
                <li className="mb-2"><i className="bi bi-envelope me-2 text-muted" />{usuario.correo}</li>
                <li className="mb-2"><i className="bi bi-geo-alt me-2 text-muted" />{usuario.comuna}, {usuario.region}</li>
                {usuario.direccion && <li><i className="bi bi-house me-2 text-muted" />{usuario.direccion}</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row g-3 mb-3">
            <div className="col-sm-6"><KpiCard icono="bag-check" color="primary" titulo="Compras" valor={compras.length} /></div>
            <div className="col-sm-6"><KpiCard icono="cash-coin" color="success" titulo="Total gastado" valor={formatoCLP(gastado)} detalle="Solo órdenes pagadas" /></div>
          </div>
          <div className="card admin-card">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Historial de compras</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead><tr className="admin-th"><th>N°</th><th>Fecha</th><th className="text-end">Total</th><th>Estado</th><th /></tr></thead>
                  <tbody>
                    {compras.map((o) => (
                      <tr key={o.id}>
                        <td className="fw-bold">#{o.numero}</td>
                        <td>{formatoFecha(o.fecha)}</td>
                        <td className="text-end">{formatoCLP(o.total)}</td>
                        <td><EstadoBadge estado={o.estado} /></td>
                        <td className="text-end"><button type="button" className="btn btn-sm btn-outline-primary" onClick={() => ir('boleta', { id: o.id })}>Ver boleta</button></td>
                      </tr>
                    ))}
                    {compras.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">Este usuario aún no tiene compras.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
