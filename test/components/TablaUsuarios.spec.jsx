import { render, screen, fireEvent } from '@testing-library/react';
import TablaUsuarios from '../../src/components/admin/TablaUsuarios';

describe('components/admin/TablaUsuarios', () => {
  const USUARIOS = [
    { run: '19011022K', nombre: 'Juan', apellidos: 'Pérez', correo: 'juan@duocuc.cl', tipo: 'Administrador', region: 'RM', comuna: 'Santiago' },
    { run: '201234567', nombre: 'Carlos', apellidos: 'López', correo: 'carlos@gmail.com', tipo: 'Cliente', region: 'RM', comuna: 'Maipú' },
  ];

  it('renderiza todos los usuarios con nombre completo, correo y tipo', () => {
    render(<TablaUsuarios usuarios={USUARIOS} onEliminar={() => {}} />);
    expect(screen.getAllByRole('row').length).toBe(3);
    expect(screen.queryByText('Juan Pérez')).not.toBeNull();
    expect(screen.queryByText('carlos@gmail.com')).not.toBeNull();
    expect(screen.queryByText('Administrador')).not.toBeNull();
  });

  it('"Eliminar" entrega el usuario de esa fila', () => {
    const onEliminar = jasmine.createSpy('onEliminar');
    render(<TablaUsuarios usuarios={USUARIOS} onEliminar={onEliminar} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);
    expect(onEliminar).toHaveBeenCalledWith(USUARIOS[0]);
  });
});