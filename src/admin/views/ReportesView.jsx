import { useTienda } from '../../context/TiendaContext';
import { formatoCLP } from '../../utils/formato';
import { contarPorEstado, descargarCSV, formatoFecha, masVendidos, ticketPromedio, totalVentas, ventasPorMes } from '../adminStats';
import PageHeader from '../components/PageHeader';
import KpiCard from '../components/KpiCard';
import BarrasMensuales from '../components/BarrasMensuales';
import BarraProgreso from '../components/BarraProgreso';

const COLOR_ESTADO = { Pagada: 'success', Pendiente: 'warning', Cancelada: 'danger' };
const COLOR_TIPO = { Administrador: 'danger', Vendedor: 'warning', Cliente: 'info' };

export default function ReportesView() {
  const { ordenes, usuarios } = useTienda();

  const estados = contarPorEstado(ordenes);
  const ranking = masVendidos(ordenes, 5);
  const maxUnidades = Math.max(...ranking.map((r) => r.unidades), 1);
  const tipos = ['Cliente', 'Vendedor', 'Administrador'].map((t) => ({ tipo: t, cantidad: usuarios.filter((u) => u.tipo === t).length }));

  const exportar = () =>
    descargarCSV('reporte-ventas-hype.csv', [
      ['N°', 'Fecha', 'Cliente', 'Subtotal', 'Descuento', 'Total', 'Estado'],
      ...ordenes.map((o) => [o.numero, formatoFecha(o.fecha), o.cliente.nombre, o.subtotal, o.descuento, o.total, o.estado]),
    ]);

  return (
    <>
      <PageHeader titulo="Reportes" subtitulo="Ventas, órdenes y usuarios de la academia.">
        <button type="button" className="btn btn-outline-secondary" onClick={exportar}><i className="bi bi-download me-2" />Exportar ventas</button>
      </PageHeader>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><KpiCard icono="cash-coin" color="success" titulo="Ventas totales" valor={formatoCLP(totalVentas(ordenes))} /></div>
        <div className="col-sm-6 col-xl-3"><KpiCard icono="receipt-cutoff" color="primary" titulo="Ticket promedio" valor={formatoCLP(ticketPromedio(ordenes))} /></div>
        <div className="col-sm-6 col-xl-3"><KpiCard icono="check2-circle" color="success" titulo="Órdenes pagadas" valor={estados.Pagada} /></div>
        <div className="col-sm-6 col-xl-3"><KpiCard icono="x-circle" color="danger" titulo="Canceladas" valor={estados.Cancelada} /></div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-8">
          <div className="card admin-card h-100"><div className="card-body">
            <h5 className="fw-bold mb-3">Ventas mensuales</h5>
            <BarrasMensuales datos={ventasPorMes(ordenes, 6)} />
          </div></div>
        </div>
        <div className="col-lg-4">
          <div className="card admin-card h-100"><div className="card-body">
            <h5 className="fw-bold mb-3">Órdenes por estado</h5>
            {Object.entries(estados).map(([estado, n]) => (
              <BarraProgreso key={estado} etiqueta={estado} valorTexto={n} porcentaje={ordenes.length ? (n / ordenes.length) * 100 : 0} color={COLOR_ESTADO[estado]} />
            ))}
          </div></div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card admin-card h-100"><div className="card-body">
            <h5 className="fw-bold mb-3">Lo más vendido</h5>
            {ranking.map((r) => <BarraProgreso key={r.nombre} etiqueta={r.nombre} valorTexto={`${r.unidades} u.`} porcentaje={(r.unidades / maxUnidades) * 100} />)}
          </div></div>
        </div>
        <div className="col-lg-6">
          <div className="card admin-card h-100"><div className="card-body">
            <h5 className="fw-bold mb-3">Usuarios por tipo</h5>
            {tipos.map((t) => <BarraProgreso key={t.tipo} etiqueta={t.tipo} valorTexto={t.cantidad} porcentaje={usuarios.length ? (t.cantidad / usuarios.length) * 100 : 0} color={COLOR_TIPO[t.tipo]} />)}
          </div></div>
        </div>
      </div>
    </>
  );
}
