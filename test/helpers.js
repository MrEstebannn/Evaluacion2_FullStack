import { render } from '@testing-library/react';
import { NotificacionProvider } from '../src/context/NotificacionContext';
import { TiendaProvider } from '../src/context/TiendaContext';

export function limpiarAlmacenamiento() {
  localStorage.clear();
}

export function renderConTienda(ui) {
  return render(
    <NotificacionProvider>
      <TiendaProvider>{ui}</TiendaProvider>
    </NotificacionProvider>
  );
}