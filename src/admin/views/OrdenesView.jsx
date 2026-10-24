import { useState } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { formatoCLP } from '../../utils/formato';
import { descargarCSV, formatoFecha } from '../adminStats';
import PageHeader from '../components/PageHeader';
import EstadoBadge from '../components/EstadoBadge';

export default function OrdenesView() {
  const { ordenes } = useTienda();
  const { ir } = useAdminNav();
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('Todas');

  const texto = busqueda.trim().toLowerCase();
  const filtradas = [...ordenes]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .filter((o) => estado === 'Todas' || o.estado === estado)
    .filter((o) => !texto || o.numero.includes(texto) || o.cliente.nombre.toLowerCase().includes(texto) || o.cliente.correo.toLowerCase().includes(texto));

  const exportar = () =>
    descargarCSV('ordenes-hype.csv', [
      ['N°', 'Fecha', 'Cliente', 'Correo', 'Total', 'Estado'],
      ...filtradas.map((o) => [o.numero, formatoFecha(o.fecha), o.cliente.nombre, o.cliente.correo, o.total, o.estado]),
    ]);

  return (
    <>
      <PageHeader titulo="Órdenes / Boletas" subtitulo="Revisa las compras realizadas y abre su boleta.">
        <button type="button" className="btn btn-outline-secondary" onClick={exportar}><i className="bi bi-download me-2" />Exportar CSV</button>
      </PageHeader>

      <div className="card admin-card">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
                <input type="search" className="form-control" placeholder="Buscar por N° de orden, cliente o correo" aria-label="Buscar órdenes" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select" aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                {['Todas', 'Pagada', 'Pendiente', 'Cancelada'].map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="admin-th"><th>N°</th><th>Fecha</th><th>Cliente</th><th>Ítems</th><th className="text-end">Total</th><th>Estado</th><th /></tr>
              </thead>
              <tbody>
                {filtradas.map((o) => (
                  <tr key={o.id}>
                    <td className="fw-bold">#{o.numero}</td>
                    <td>{formatoFecha(o.fecha)}</td>
                    <td>{o.cliente.nombre}<div className="small text-muted">{o.cliente.correo}</div></td>
                    <td>{o.items.reduce((s, i) => s + i.cantidad, 0)}</td>
                    <td className="text-end">{formatoCLP(o.total)}</td>
                    <td><EstadoBadge estado={o.estado} /></td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => ir('boleta', { id: o.id })}>
                        <i className="bi bi-file-earmark-text me-1" />Ver boleta
                      </button>
                    </td>
                  </tr>
                ))}
                {filtradas.length === 0 && (
                  <tr><td colSpan="7" className="text-center text-muted py-4">No hay órdenes que coincidan con la búsqueda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
