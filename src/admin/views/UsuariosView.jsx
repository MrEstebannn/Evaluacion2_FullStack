import { useState } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { TIPOS_USUARIO } from '../../data/catalogo';
import PageHeader from '../components/PageHeader';
import { iniciales } from '../components/Topbar';

const COLOR_TIPO = { Administrador: 'danger', Vendedor: 'warning', Cliente: 'info' };

export default function UsuariosView() {
  const { usuarios, eliminarUsuario, notificar } = useTienda();
  const { ir } = useAdminNav();
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('Todos');

  const texto = busqueda.trim().toLowerCase();
  const filtrados = usuarios
    .filter((u) => tipo === 'Todos' || u.tipo === tipo)
    .filter((u) => !texto || `${u.nombre} ${u.apellidos}`.toLowerCase().includes(texto) || u.correo.toLowerCase().includes(texto) || u.run.toLowerCase().includes(texto));

  const borrar = (u) => {
    const admins = usuarios.filter((x) => x.tipo === 'Administrador').length;
    if (u.tipo === 'Administrador' && admins === 1) {
      notificar('No puedes eliminar al único administrador.', 'danger');
      return;
    }
    if (window.confirm(`¿Eliminar al usuario ${u.nombre} ${u.apellidos}?`)) {
      eliminarUsuario(u.run);
      notificar('Usuario eliminado.');
    }
  };

  return (
    <>
      <PageHeader titulo="Usuarios" subtitulo={`${usuarios.length} usuarios registrados.`}>
        <button type="button" className="btn btn-primary" onClick={() => ir('usuario-form')}><i className="bi bi-person-plus me-2" />Nuevo usuario</button>
      </PageHeader>

      <div className="card admin-card">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
                <input type="search" className="form-control" placeholder="Buscar por nombre, correo o RUN" aria-label="Buscar usuarios" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select" aria-label="Filtrar por tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Todos</option>
                {TIPOS_USUARIO.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead><tr className="admin-th"><th>Usuario</th><th>RUN</th><th>Tipo</th><th>Comuna</th><th /></tr></thead>
              <tbody>
                {filtrados.map((u) => (
                  <tr key={u.run}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <span className="avatar-iniciales">{iniciales(u)}</span>
                        <div><div className="fw-semibold">{u.nombre} {u.apellidos}</div><small className="text-muted">{u.correo}</small></div>
                      </div>
                    </td>
                    <td className="fw-semibold">{u.run}</td>
                    <td><span className={`badge text-bg-${COLOR_TIPO[u.tipo] ?? 'secondary'}`}>{u.tipo}</span></td>
                    <td>{u.comuna}</td>
                    <td className="text-end text-nowrap">
                      <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => ir('usuario-detalle', { run: u.run })}><i className="bi bi-eye" /> Ver</button>
                      <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => ir('usuario-form', { run: u.run })}><i className="bi bi-pencil" /> Editar</button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => borrar(u)}><i className="bi bi-trash" /> Eliminar</button>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No hay usuarios que coincidan.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
