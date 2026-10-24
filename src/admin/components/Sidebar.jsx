import { useState } from 'react';

const MENU = [
  { vista: 'dashboard', icono: 'speedometer2', etiqueta: 'Dashboard' },
  { vista: 'ordenes', icono: 'receipt', etiqueta: 'Órdenes / Boletas', activas: ['ordenes', 'boleta'] },
  {
    etiqueta: 'Productos',
    icono: 'box-seam',
    activas: ['productos', 'producto-form', 'criticos', 'productos-reporte'],
    hijos: [
      { vista: 'productos', etiqueta: 'Listado' },
      { vista: 'producto-form', etiqueta: 'Nuevo producto', nuevo: true },
      { vista: 'criticos', etiqueta: 'Stock crítico' },
      { vista: 'productos-reporte', etiqueta: 'Reportes de productos' },
    ],
  },
  { vista: 'categorias', icono: 'tags', etiqueta: 'Categorías' },
  { vista: 'usuarios', icono: 'people', etiqueta: 'Usuarios', activas: ['usuarios', 'usuario-form', 'usuario-detalle'] },
  { vista: 'reportes', icono: 'bar-chart-line', etiqueta: 'Reportes' },
  { vista: 'perfil', icono: 'person-circle', etiqueta: 'Perfil' },
];

export default function Sidebar({ ruta, ir, abierto, onSalirATienda, onCerrar }) {
  const [grupoAbierto, setGrupoAbierto] = useState(true);
  const estaActivo = (item) => (item.activas ?? [item.vista]).includes(ruta.vista);

  return (
    <>
      {abierto && <div className="admin-overlay d-lg-none" onClick={onCerrar} />}
      <aside className={`admin-sidebar p-3 ${abierto ? 'abierto' : ''}`}>
        <div className="d-flex align-items-center gap-2 px-2 mb-4">
          <img src="/img/logo-pagina.png" alt="Hype Academic" width="40" height="40" className="rounded-3 bg-white p-1" />
          <div className="lh-1">
            <div className="fw-bold text-white">HYPE ACADEMIC</div>
            <small className="text-white-50">Panel de administración</small>
          </div>
        </div>

        <nav className="d-grid gap-1 flex-grow-1 align-content-start overflow-auto">
          {MENU.map((item) =>
            item.hijos ? (
              <div key={item.etiqueta}>
                <button type="button" className={`admin-link ${estaActivo(item) ? 'activo' : ''}`} onClick={() => setGrupoAbierto(!grupoAbierto)}>
                  <i className={`bi bi-${item.icono}`} />
                  <span className="flex-grow-1">{item.etiqueta}</span>
                  <i className={`bi bi-chevron-${grupoAbierto ? 'up' : 'down'} small`} />
                </button>
                {grupoAbierto && (
                  <div className="mt-1">
                    {item.hijos.map((h) => {
                      const activo = ruta.vista === h.vista && (!h.nuevo || !ruta.id);
                      return (
                        <button key={h.etiqueta} type="button" className={`admin-sublink ${activo ? 'activo' : ''}`} onClick={() => ir(h.vista)}>
                          {h.etiqueta}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <button key={item.vista} type="button" className={`admin-link ${estaActivo(item) ? 'activo' : ''}`} onClick={() => ir(item.vista)}>
                <i className={`bi bi-${item.icono}`} />
                {item.etiqueta}
              </button>
            )
          )}
        </nav>

        <div className="d-grid gap-2 pt-3 border-top border-secondary-subtle border-opacity-25">
          <button type="button" className="btn btn-light fw-semibold" onClick={onSalirATienda}>
            <i className="bi bi-shop me-2" />Ver tienda
          </button>
          <button type="button" className="btn btn-outline-danger fw-semibold" onClick={onSalirATienda}>
            <i className="bi bi-box-arrow-left me-2" />Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
