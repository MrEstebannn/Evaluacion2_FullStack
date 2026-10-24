import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../src/components/layout/Navbar';

describe('components/layout/Navbar', () => {
  let props;

  beforeEach(() => {
    props = {
      cantidadCarrito: 3,
      onIrInicio: jasmine.createSpy('onIrInicio'),
      onAbrirLogin: jasmine.createSpy('onAbrirLogin'),
      onAbrirRegistro: jasmine.createSpy('onAbrirRegistro'),
      onAbrirCarrito: jasmine.createSpy('onAbrirCarrito'),
      onAbrirMenu: jasmine.createSpy('onAbrirMenu'),
    };
    render(<Navbar {...props} />);
  });

  it('muestra la cantidad de ítems del carrito recibida por props', () => {
    expect(screen.getByTestId('cart-count').textContent).toBe('3');
  });

  it('cada botón dispara su callback', () => {
    fireEvent.click(screen.getByText('Iniciar Sesión'));
    fireEvent.click(screen.getByText('Inscribirse'));
    fireEvent.click(screen.getByRole('button', { name: /Carrito/ }));
    fireEvent.click(screen.getByLabelText('Abrir menú'));
    expect(props.onAbrirLogin).toHaveBeenCalledTimes(1);
    expect(props.onAbrirRegistro).toHaveBeenCalledTimes(1);
    expect(props.onAbrirCarrito).toHaveBeenCalledTimes(1);
    expect(props.onAbrirMenu).toHaveBeenCalledTimes(1);
  });

  it('el logo vuelve al inicio', () => {
    fireEvent.click(screen.getByAltText('Logo'));
    expect(props.onIrInicio).toHaveBeenCalledTimes(1);
  });
});