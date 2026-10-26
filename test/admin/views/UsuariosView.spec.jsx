import { screen, fireEvent } from '@testing-library/react';
import UsuariosView from '../../../src/admin/views/UsuariosView';
import { usuariosDB } from '../../../src/data/db';
import { limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/UsuariosView', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const filas = () => screen.queryAllByRole('button', { name: /Eliminar/ });

  it('lista los 3 usuarios iniciales', () => {
    renderVista(UsuariosView);
    expect(filas().length).toBe(3);
    expect(screen.queryByText('3 usuarios registrados.')).not.toBeNull();
  });

  it('busca por nombre, correo o RUN', () => {
    renderVista(UsuariosView);
    fireEvent.change(screen.getByLabelText('Buscar usuarios'), { target: { value: 'maria' } });
    expect(filas().length).toBe(1);
    fireEvent.change(screen.getByLabelText('Buscar usuarios'), { target: { value: '201234567' } });
    expect(filas().length).toBe(1);
  });

  it('filtra por tipo de usuario', () => {
    renderVista(UsuariosView);
    fireEvent.change(screen.getByLabelText('Filtrar por tipo'), { target: { value: 'Cliente' } });
    expect(filas().length).toBe(1);
  });

  it('muestra un mensaje cuando nada coincide', () => {
    renderVista(UsuariosView);
    fireEvent.change(screen.getByLabelText('Buscar usuarios'), { target: { value: 'zzzz' } });
    expect(screen.queryByText('No hay usuarios que coincidan.')).not.toBeNull();
  });

  it('los botones navegan a nuevo, detalle y edición con el RUN', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(UsuariosView, { ir });
    fireEvent.click(screen.getByRole('button', { name: /Nuevo usuario/ }));
    fireEvent.click(screen.getAllByRole('button', { name: /Ver/ })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /Editar/ })[0]);
    expect(ir.calls.allArgs()).toEqual([['usuario-form'], ['usuario-detalle', { run: '19011022K' }], ['usuario-form', { run: '19011022K' }]]);
  });

  it('no permite eliminar al único administrador (sin pedir confirmación)', () => {
    spyOn(window, 'confirm');
    renderVista(UsuariosView);
    fireEvent.click(filas()[0]);
    expect(window.confirm).not.toHaveBeenCalled();
    expect(usuariosDB.listar().length).toBe(3);
  });

  it('elimina a un usuario normal solo si se confirma', () => {
    const confirmar = spyOn(window, 'confirm').and.returnValue(false);
    renderVista(UsuariosView);
    fireEvent.click(filas()[1]);
    expect(usuariosDB.listar().length).toBe(3);
    confirmar.and.returnValue(true);
    fireEvent.click(filas()[1]);
    expect(usuariosDB.obtener('182345678')).toBeNull();
    expect(usuariosDB.listar().length).toBe(2);
  });
});