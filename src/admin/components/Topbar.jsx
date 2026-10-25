import { useState } from 'react';

export const iniciales = (usuario) => `${usuario?.nombre?.[0] ?? ''}${usuario?.apellidos?.[0] ?? ''}`.toUpperCase() || 'A';

export default function Topbar({ migas, admin, ir, onMenu, onSalirATienda, onCerrarSesion }) {
  const [menu, setMenu] = useState(false);

  return (
    <header className="admin-topbar px-3 px-lg-4 py-3 d-flex align-items-center gap-3">
      <button type="button" className="btn btn-outline-secondary d-lg-none" aria-label="Abrir menú del panel" onClick={onMenu}>
        <i className="bi bi-list" />
      </button>

      <nav aria-label="breadcrumb" className="flex-grow-1">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item text-muted">Admin</li>
          {migas.map((m, i) => (
            <li key={m} className={`breadcrumb-item ${i === migas.length - 1 ? 'active fw-semibold' : ''}`}>{m}</li>
          ))}
        </ol>
      </nav>

      <div className="position-relative">
        <button type="button" className="btn btn-white border-0 d-flex align-items-center gap-2 bg-white shadow-sm rounded-pill ps-2 pe-3" onClick={() => setMenu(!menu)}>
          <span className="avatar-iniciales">{iniciales(admin)}</span>
          <span className="d-none d-sm-inline fw-semibold small">{admin ? `${admin.nombre} ${admin.apellidos}` : 'Administrador'}</span>
          <i className="bi bi-chevron-down small" />
        </button>
        {menu && (
          <ul className="dropdown-menu dropdown-menu-end show mt-2 shadow border-0 rounded-3">
            <li><button type="button" className="dropdown-item" onClick={() => { ir('perfil'); setMenu(false); }}><i className="bi bi-person me-2" />Mi perfil</button></li>
            <li><button type="button" className="dropdown-item" onClick={onSalirATienda}><i className="bi bi-shop me-2" />Ver tienda</button></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button type="button" className="dropdown-item text-danger" onClick={onCerrarSesion}><i className="bi bi-box-arrow-left me-2" />Cerrar sesión</button></li>
          </ul>
        )}
      </div>
    </header>
  );
}
