import { screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

describe('App (historial del navegador)', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const irANosotros = () => {
    fireEvent.click(screen.getByLabelText('Abrir menú'));
    fireEvent.click(screen.getByText(/Nosotros/));
  };

  it('al ir a Nosotros se agrega una entrada al historial', () => {
    renderConTienda(<App />);
    irANosotros();
    expect(window.history.state.seccion).toBe('nosotros');
  });

  it('Atrás (popstate) vuelve al Inicio', () => {
    renderConTienda(<App />);
    irANosotros();
    expect(screen.queryByText('Sobre HYPE ACADEMIC')).not.toBeNull();
    fireEvent(window, new PopStateEvent('popstate', { state: { seccion: 'inicio' } }));
    expect(screen.queryByText('Nuestras clases')).not.toBeNull();
    expect(screen.queryByText('Sobre HYPE ACADEMIC')).toBeNull();
  });

  it('Adelante (popstate) vuelve a la sección guardada en el historial', () => {
    renderConTienda(<App />);
    fireEvent(window, new PopStateEvent('popstate', { state: { seccion: 'blogs' } }));
    expect(screen.queryByText('Noticias y Casos Curiosos')).not.toBeNull();
  });

  it('Atrás cierra los modales abiertos', () => {
    renderConTienda(<App />);
    fireEvent.click(screen.getByText('Iniciar Sesión'));
    expect(screen.queryByRole('dialog')).not.toBeNull();
    fireEvent(window, new PopStateEvent('popstate', { state: { seccion: 'inicio' } }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
