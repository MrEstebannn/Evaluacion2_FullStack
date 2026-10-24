import { useState } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { productosCriticos } from '../adminStats';
import PageHeader from '../components/PageHeader';

function FilaCritico({ producto }) {
  const { actualizarProducto, notificar } = useTienda();
  const { ir } = useAdminNav();
  const [cantidad, setCantidad] = useState(10);

  const reponer = () => {
    const n = parseInt(cantidad, 10);
    if (!n || n < 1) return;
    actualizarProducto(producto.id, { stock: producto.stock + n });
    notificar(`Se repusieron ${n} unidades de ${producto.nombre}.`);
  };

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-3">
          <img src={producto.imagen} alt="" className="miniatura" />
          <div><div className="fw-semibold">{producto.nombre}</div><small className="text-muted">{producto.codigo}</small></div>
        </div>
      </td>
      <td><span className="badge text-bg-danger">{producto.stock}</span> <span className="text-muted small">de {producto.stockCritico} mínimo</span></td>
      <td style={{ maxWidth: 220 }}>
        <div className="input-group input-group-sm">
          <input type="number" min="1" className="form-control" aria-label={`Unidades a reponer de ${producto.nombre}`} value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          <button type="button" className="btn btn-success" onClick={reponer}>Reponer</button>
        </div>
      </td>
      <td className="text-end">
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => ir('producto-form', { id: producto.id })}>Editar</button>
      </td>
    </tr>
  );
}

export default function CriticosView() {
  const { productos } = useTienda();
  const criticos = productosCriticos(productos);

  return (
    <>
      <PageHeader titulo="Productos con stock crítico" subtitulo="Productos cuyo stock llegó o bajó del mínimo definido." />
      <div className="card admin-card">
        <div className="card-body">
          {criticos.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-check-circle fs-1 text-success d-block mb-2" />
              No hay productos en stock crítico.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead><tr className="admin-th"><th>Producto</th><th>Stock</th><th>Reposición rápida</th><th /></tr></thead>
                <tbody>{criticos.map((p) => <FilaCritico key={p.id} producto={p} />)}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
