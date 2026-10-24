import { useTienda } from '../../context/TiendaContext';
import { formatoCLP } from '../../utils/formato';
import { descargarCSV, masVendidos, productosCriticos, valorInventario, ventasPorCategoria } from '../adminStats';
import PageHeader from '../components/PageHeader';
import KpiCard from '../components/KpiCard';
import BarraProgreso from '../components/BarraProgreso';

export default function ProductosReporteView() {
  const { productos, ordenes, categorias } = useTienda();

  const ranking = masVendidos(ordenes, 6);
  const maxUnidades = Math.max(...ranking.map((r) => r.unidades), 1);
  const porCategoria = ventasPorCategoria(ordenes, productos);
  const maxCategoria = Math.max(...porCategoria.map((c) => c.total), 1);

  const exportar = () =>
    descargarCSV('inventario-hype.csv', [
      ['Código', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Stock crítico'],
      ...productos.map((p) => [p.codigo, p.nombre, p.categoria, p.precio, p.stock, p.stockCritico]),
    ]);

  return (
    <>
      <PageHeader titulo="Reportes de productos" subtitulo="Inventario y rendimiento de ventas del catálogo.">
        <button type="button" className="btn btn-outline-secondary" onClick={exportar}><i className="bi bi-download me-2" />Exportar inventario</button>
      </PageHeader>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><KpiCard icono="boxes" color="primary" titulo="Unidades en stock" valor={productos.reduce((s, p) => s + p.stock, 0)} /></div>
        <div className="col-sm-6 col-xl-3"><KpiCard icono="wallet2" color="success" titulo="Valor del inventario" valor={formatoCLP(valorInventario(productos))} /></div>
        <div className="col-sm-6 col-xl-3"><KpiCard icono="exclamation-triangle" color="danger" titulo="En stock crítico" valor={productosCriticos(productos).length} /></div>
        <div className="col-sm-6 col-xl-3"><KpiCard icono="tags" color="info" titulo="Categorías" valor={categorias.length} /></div>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card admin-card h-100"><div className="card-body">
            <h5 className="fw-bold mb-3">Más vendidos (unidades)</h5>
            {ranking.length === 0 && <p className="text-muted">Aún no hay ventas registradas.</p>}
            {ranking.map((r) => <BarraProgreso key={r.nombre} etiqueta={r.nombre} valorTexto={`${r.unidades} u. · ${formatoCLP(r.ingresos)}`} porcentaje={(r.unidades / maxUnidades) * 100} />)}
          </div></div>
        </div>
        <div className="col-lg-6">
          <div className="card admin-card h-100"><div className="card-body">
            <h5 className="fw-bold mb-3">Ingresos por categoría</h5>
            {porCategoria.map((c) => <BarraProgreso key={c.categoria} etiqueta={c.categoria} valorTexto={formatoCLP(c.total)} porcentaje={(c.total / maxCategoria) * 100} color="success" />)}
          </div></div>
        </div>
      </div>
    </>
  );
}
