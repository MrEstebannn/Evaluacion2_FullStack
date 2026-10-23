import { render, screen, fireEvent } from '@testing-library/react';
import LoginModal from '../../src/components/auth/LoginModal';

describe('components/auth/LoginModal', () => {
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  it('no se muestra cuando abierto=false', () => {
    const { container } = render(<LoginModal abierto={false} onCerrar={() => {}} onLoginExitoso={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('con campos vacíos marca los errores y NO llama a onLoginExitoso', () => {
    const onLoginExitoso = jasmine.createSpy('onLoginExitoso');
    render(<LoginModal abierto onCerrar={() => {}} onLoginExitoso={onLoginExitoso} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByLabelText('Correo Electrónico')).toHaveClass('is-invalid');
    expect(screen.getByLabelText('Contraseña')).toHaveClass('is-invalid');
    expect(onLoginExitoso).not.toHaveBeenCalled();
  });

  it('actualiza su estado mientras el usuario escribe', () => {
    render(<LoginModal abierto onCerrar={() => {}} onLoginExitoso={() => {}} />);
    escribir('Correo Electrónico', 'maria@hotmail.com');
    expect(screen.getByLabelText('Correo Electrónico').value).toBe('maria@hotmail.com');
  });

  it('con datos válidos llama a onLoginExitoso con las credenciales', () => {
    const onLoginExitoso = jasmine.createSpy('onLoginExitoso');
    render(<LoginModal abierto onCerrar={() => {}} onLoginExitoso={onLoginExitoso} />);
    escribir('Correo Electrónico', 'maria@hotmail.com');
    escribir('Contraseña', '1234');
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(onLoginExitoso).toHaveBeenCalledWith({ correo: 'maria@hotmail.com', password: '1234' });
  });
});