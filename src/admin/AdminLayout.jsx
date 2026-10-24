import { useEffect, useState } from 'react';
import { AdminNavContext } from './AdminNavContext';
import { useTienda } from '../context/TiendaContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardView from './views/DashboardView';
import OrdenesView from './views/OrdenesView';
import BoletaView from './views/BoletaView';
import ProductosView from './views/ProductosView';
import ProductoFormView from './views/ProductoFormView';
import CriticosView from './views/CriticosView';
import ProductosReporteView from './views/ProductosReporteView';
import CategoriasView from './views/CategoriasView';
import UsuariosView from './views/UsuariosView';
import UsuarioFormView from './views/UsuarioFormView';
import UsuarioDetalleView from './views/UsuarioDetalleView';
import ReportesView from './views/ReportesView';
import PerfilView from './views/PerfilView';

// vista -> componente y miga de pan que se muestra arriba
const VISTAS = {
  dashboard: { Componente: DashboardView, migas: ['Dashboard'] },
  ordenes: { Componente: OrdenesView, migas: ['Órdenes / Boletas'] },
  boleta: { Componente: BoletaView, migas: ['Órdenes / Boletas', 'Boleta'] },
  productos: { Componente: ProductosView, migas: ['Productos', 'Listado'] },
  'producto-form': { Componente: ProductoFormView, migas: ['Productos', 'Formulario'] },
  criticos: { Componente: CriticosView, migas: ['Productos', 'Stock crítico'] },
  'productos-reporte': { Componente: ProductosReporteView, migas: ['Productos', 'Reportes'] },
  categorias: { Componente: CategoriasView, migas: ['Categorías'] },
  usuarios: { Componente: UsuariosView, migas: ['Usuarios', 'Listado'] },
  'usuario-form': { Componente: UsuarioFormView, migas: ['Usuarios', 'Formulario'] },
  'usuario-detalle': { Componente: UsuarioDetalleView, migas: ['Usuarios', 'Detalle'] },
  reportes: { Componente: ReportesView, migas: ['Reportes'] },
  perfil: { Componente: PerfilView, migas: ['Perfil'] },
};

/**
 * Contenedor del panel. Tiene su propia navegación interna (estado `ruta`),
 * igual que App.jsx usa `seccion` para la tienda.
 */
export default function AdminLayout({ onSalirATienda }) {
  const { usuarios } = useTienda();
  const [ruta, setRuta] = useState({ vista: 'dashboard' });
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Quita el padding-top que usa la tienda por su navbar fija
  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => document.body.classList.remove('admin-mode');
  }, []);

  const ir = (vista, params = {}) => {
    setRuta({ vista, ...params });
    setMenuAbierto(false);
    window.scrollTo({ top: 0 });
  };

  const admin = usuarios.find((u) => u.tipo === 'Administrador');
  const { Componente, migas } = VISTAS[ruta.vista] ?? VISTAS.dashboard;

  return (
    <AdminNavContext.Provider value={{ ruta, ir, admin }}>
      <Sidebar ruta={ruta} ir={ir} abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} onSalirATienda={onSalirATienda} />
      <div className="admin-main">
        <Topbar migas={migas} admin={admin} ir={ir} onMenu={() => setMenuAbierto(true)} onSalirATienda={onSalirATienda} />
        <main className="px-3 px-lg-4 pb-5">
          <Componente />
        </main>
      </div>
    </AdminNavContext.Provider>
  );
}
