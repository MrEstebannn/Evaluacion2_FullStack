import { screen, fireEvent } from '@testing-library/react';
import UsuarioFormView from '../../../src/admin/views/UsuarioFormView';
import { usuariosDB } from '../../../src/data/db';
import { limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/UsuarioFormView', () => {
  const REGION = 'Región Metropolitana de Santiago';
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
  const llenar = (run = '123456789') => {
    escribir('RUN (9 dígitos)', run);
    escribir('Nombre', 'Ana');
    escribir('Apellidos', 'Soto');
    escribir('Correo electrónico', 'ana@gmail.com');
    escribir('Región', REGION);
    escribir('Comuna', 'Maipú');
    escribir('Dirección', 'Los Olmos 123');
  };

  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  it('en modo nuevo muestra el formulario vacío y el botón "Crear usuario"', () => {
    renderVista(UsuarioFormView, { ruta: { vista: 'usuario-form' } });
    expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).not.toBeNull();
    expect(screen.getByLabelText('Nombre').value).toBe('');
    expect(screen.queryByRole('button', { name: 'Crear usuario' })).not.toBeNull();
  });

  it('la comuna está deshabilitada hasta elegir una región (estado)', () => {
    renderVista(UsuarioFormView, { ruta: { vista: 'usuario-form' } });
    expect(screen.getByLabelText('Comuna').disabled).toBeTrue();
    escribir('Región', REGION);
    expect(screen.getByLabelText('Comuna').disabled).toBeFalse();
  });

  it('enviar vacío marca errores y no crea nada', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(UsuarioFormView, { ruta: { vista: 'usuario-form' }, ir });
    fireEvent.click(screen.getByRole('button', { name: 'Crear usuario' }));
    expect(screen.getByLabelText('RUN (9 dígitos)').classList.contains('is-invalid')).toBeTrue();
    expect(usuariosDB.listar().length).toBe(3);
    expect(ir).not.toHaveBeenCalled();
  });

  it('crea el usuario con datos válidos y vuelve al listado', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(UsuarioFormView, { ruta: { vista: 'usuario-form' }, ir });
    llenar();
    fireEvent.click(screen.getByRole('button', { name: 'Crear usuario' }));
    expect(usuariosDB.obtener('123456789').nombre).toBe('Ana');
    expect(ir).toHaveBeenCalledWith('usuarios');
  });

  it('un RUN repetido muestra el error y no navega', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(UsuarioFormView, { ruta: { vista: 'usuario-form' }, ir });
    llenar('201234567');
    fireEvent.click(screen.getByRole('button', { name: 'Crear usuario' }));
    expect(screen.queryByText('Ya existe un usuario registrado con ese RUN.')).not.toBeNull();
    expect(ir).not.toHaveBeenCalled();
  });

  it('en modo edición precarga los datos y bloquea el RUN', () => {
    renderVista(UsuarioFormView, { ruta: { vista: 'usuario-form', run: '201234567' } });
    expect(screen.getByRole('heading', { name: 'Editar usuario' })).not.toBeNull();
    expect(screen.getByLabelText('Nombre').value).toBe('Carlos');
    expect(screen.getByLabelText('RUN (9 dígitos)').disabled).toBeTrue();
  });

  it('guarda los cambios de un usuario existente', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(UsuarioFormView, { ruta: { vista: 'usuario-form', run: '201234567' }, ir });
    escribir('Nombre', 'Carlitos');
    escribir('Dirección', 'Los Olmos 123');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(usuariosDB.obtener('201234567').nombre).toBe('Carlitos');
    expect(ir).toHaveBeenCalledWith('usuarios');
  });

  it('"Cancelar" vuelve al listado sin guardar', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(UsuarioFormView, { ruta: { vista: 'usuario-form' }, ir });
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(ir).toHaveBeenCalledWith('usuarios');
  });

  it('si el usuario a editar no existe muestra un aviso', () => {
    renderVista(UsuarioFormView, { ruta: { vista: 'usuario-form', run: 'no-existe' } });
    expect(screen.queryByText(/No se encontró el usuario/)).not.toBeNull();
  });
});