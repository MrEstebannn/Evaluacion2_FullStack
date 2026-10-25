import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../src/components/layout/Navbar';

describe('components/layout/Navbar (sesión del cliente)', () => {
  const USUARIO = { run: '111111111', nombre: 'Ana', apellidos: 'Soto' };

  it('sin sesión muestra Iniciar Sesión e Inscribirse', () => {
    render(<Navbar cantidadCarrito={0} />);
    expect(screen.queryByText('Iniciar Sesión')).not.toBeNull();
    expect(screen.queryByText('Inscribirse')).not.toBeNull();
    expect(screen.queryByText('Cerrar sesión')).toBeNull();
  });

  it('con sesión muestra el saludo y oculta los botones de ingreso', () => {
    render(<Navbar cantidadCarrito={0} usuario={USUARIO} />);
    expect(screen.getByTestId('usuario-activo').textContent).toBe('Hola, Ana');
    expect(screen.queryByText('Iniciar Sesión')).toBeNull();
    expect(screen.queryByText('Inscribirse')).toBeNull();
  });

  it('"Cerrar sesión" llama al callback recibido por props', () => {
    const onCerrarSesion = jasmine.createSpy('onCerrarSesion');
    render(<Navbar cantidadCarrito={0} usuario={USUARIO} onCerrarSesion={onCerrarSesion} />);
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(onCerrarSesion).toHaveBeenCalledTimes(1);
  });
});