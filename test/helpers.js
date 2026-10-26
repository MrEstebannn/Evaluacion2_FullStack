import { render } from '@testing-library/react';
import { NotificacionProvider } from '../src/context/NotificacionContext';
import { TiendaProvider } from '../src/context/TiendaContext';
import { AdminNavContext } from '../src/admin/AdminNavContext';

export function limpiarAlmacenamiento() {
  localStorage.clear();
  window.history.replaceState({ seccion: 'inicio', params: {} }, '');
}

export function renderConTienda(ui) {
  return render(
    <NotificacionProvider>
      <TiendaProvider>{ui}</TiendaProvider>
    </NotificacionProvider>
  );
}

export function renderVista(Vista, { ruta = {}, ir = () => {}, admin = null } = {}) {
  return renderConTienda(
    <AdminNavContext.Provider value={{ ruta: { vista: 'prueba', ...ruta }, ir, admin }}>
      <Vista />
    </AdminNavContext.Provider>
  );
}

export function espiarDescargas() {
  spyOn(URL, 'createObjectURL').and.returnValue('blob:prueba');
  spyOn(URL, 'revokeObjectURL');
  spyOn(HTMLAnchorElement.prototype, 'click');
}