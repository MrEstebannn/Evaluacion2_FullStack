import { render, screen, fireEvent } from '@testing-library/react';
import LoginModal from '../../src/components/auth/LoginModal';

describe('components/auth/LoginModal (credenciales)', () => {
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
  const ingresar = () => fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

  it('muestra el error cuando las credenciales no coinciden con ninguna cuenta', () => {
    const onLoginExitoso = jasmine.createSpy('onLoginExitoso').and.returnValue({ ok: false, error: 'Contraseña incorrecta.' });
    render(<LoginModal abierto onCerrar={() => {}} onLoginExitoso={onLoginExitoso} />);
    escribir('Correo Electrónico', 'ana@gmail.com');
    escribir('Contraseña', 'zzzz');
    ingresar();
    expect(screen.queryByText('Contraseña incorrecta.')).not.toBeNull();
  });

  it('el error desaparece cuando el usuario vuelve a escribir', () => {
    const onLoginExitoso = jasmine.createSpy('onLoginExitoso').and.returnValue({ ok: false, error: 'Contraseña incorrecta.' });
    render(<LoginModal abierto onCerrar={() => {}} onLoginExitoso={onLoginExitoso} />);
    escribir('Correo Electrónico', 'ana@gmail.com');
    escribir('Contraseña', 'zzzz');
    ingresar();
    escribir('Contraseña', 'abcd');
    expect(screen.queryByText('Contraseña incorrecta.')).toBeNull();
  });

  it('no muestra ningún error cuando el ingreso es exitoso', () => {
    const onLoginExitoso = jasmine.createSpy('onLoginExitoso').and.returnValue({ ok: true });
    const { container } = render(<LoginModal abierto onCerrar={() => {}} onLoginExitoso={onLoginExitoso} />);
    escribir('Correo Electrónico', 'ana@gmail.com');
    escribir('Contraseña', 'abcd');
    ingresar();
    expect(onLoginExitoso).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.alert-danger')).toBeNull();
  });
});