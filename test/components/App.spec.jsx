import { screen, fireEvent, within } from '@testing-library/react';
import App from '../../src/App';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

// Pruebas de navegación y flujo completo de la aplicación
describe('App (navegación e integración)', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  it('inicia en la página de Inicio', () => {
    renderConTienda(<App />);
    expect(screen.queryByText('Nuestras clases')).not.toBeNull();
    expect(screen.queryByText('Tipos de membresía')).not.toBeNull();
  });

  it('navega a Nosotros desde el menú lateral', () => {
    renderConTienda(<App />);
    fireEvent.click(screen.getByLabelText('Abrir menú'));
    fireEvent.click(screen.getByText(/Nosotros/));
    expect(screen.queryByText('Sobre HYPE ACADEMIC')).not.toBeNull();
    expect(screen.queryByText('Nuestras clases')).toBeNull();
  });

  it('abre el modal de inicio de sesión', () => {
    renderConTienda(<App />);
    fireEvent.click(screen.getByText('Iniciar Sesión'));
    expect(within(screen.getByRole('dialog')).queryByText('Ingresar')).not.toBeNull();
  });

  it('inscribirse a una clase actualiza el contador y abre el carrito', () => {
    renderConTienda(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Inscribirme' })[0]);
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(within(screen.getByRole('dialog')).queryByText('Ballet Principiante')).not.toBeNull();
  });
});