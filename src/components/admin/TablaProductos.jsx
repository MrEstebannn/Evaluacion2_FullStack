import { formatoCLP } from '../../utils/formato';

export default function TablaProductos({ productos, onNuevo, onEliminar }) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Listado de Productos</h4>
        <button type="button" className="btn btn-sm btn-success fw-bold" onClick={onNuevo}>+ Nuevo Producto</button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Stock Crítico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const enCritico = p.stockCritico && p.stock <= p.stockCritico;
              return (
                <tr key={p.id}>
                  <td className="fw-bold">{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{formatoCLP(p.precio)}</td>
                  <td>
                    {p.stock} {enCritico && <span className="badge bg-danger ms-2">Stock Crítico</span>}
                  </td>
                  <td>{p.stockCritico || 'N/A'}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(p)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
