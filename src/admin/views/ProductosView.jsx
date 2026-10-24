import { useState } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { formatoCLP } from '../../utils/formato';
import PageHeader from '../components/PageHeader';

export default function ProductosView() {
  const { productos, categorias, eliminarProducto, notificar } = useTienda();
  const { ir } = useAdminNav();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  const texto = busqueda.trim().toLowerCase();
  const filtrados = productos
    .filter((p) => categoria === 'Todas' || p.categoria === categoria)
    .filter((p) => !texto || p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto));

  const borrar = (p) => {
    if (window.confirm(`¿Eliminar el producto "${p.nombre}"?`)) {
      eliminarProducto(p.id);
      notificar('Producto eliminado.');
    }
  };

  return (
    <>
      <PageHeader titulo="Productos" subtitulo={`${productos.length} productos en el catálogo.`}>
        <button type="button" className="btn btn-primary" onClick={() => ir('producto-form')}><i className="bi bi-plus-lg me-2" />Nuevo producto</button>
      </PageHeader>

      <div className="card admin-card">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
                <input type="search" className="form-control" placeholder="Buscar por nombre o código" aria-label="Buscar productos" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select" aria-label="Filtrar por categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option>Todas</option>
                {categorias.map((c) => <option key={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead><tr className="admin-th"><th>Producto</th><th>Categoría</th><th className="text-end">Precio</th><th>Stock</th><th /></tr></thead>
              <tbody>
                {filtrados.map((p) => {
                  const critico = p.stockCritico > 0 && p.stock <= p.stockCritico;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img src={p.imagen} alt="" className="miniatura" />
                          <div>
                            <div className="fw-semibold">{p.nombre}</div>
                            <small className="text-muted">{p.codigo}</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge text-bg-secondary">{p.categoria}</span></td>
                      <td className="text-end">
                        {formatoCLP(p.precio)}
                        {p.descuento > 0 && <span className="badge text-bg-success ms-2">-{p.descuento}%</span>}
                      </td>
                      <td>{p.stock} {critico && <span className="badge text-bg-danger ms-1">Crítico</span>}</td>
                      <td className="text-end text-nowrap">
                        <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => ir('producto-form', { id: p.id })}><i className="bi bi-pencil" /> Editar</button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => borrar(p)}><i className="bi bi-trash" /> Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
                {filtrados.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No hay productos que coincidan.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
