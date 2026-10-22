export default function TablaUsuarios({ usuarios, onEliminar }) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Usuarios Registrados</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo Usuario</th>
              <th>Región</th>
              <th>Comuna</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.run}>
                <td className="fw-bold">{u.run}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td><span className="badge bg-info text-dark">{u.tipo}</span></td>
                <td>{u.region}</td>
                <td>{u.comuna}</td>
                <td>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(u)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
