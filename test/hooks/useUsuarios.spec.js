import { renderHook, act } from '@testing-library/react';
import { useUsuarios } from '../../src/hooks/useUsuarios';
import { usuariosDB } from '../../src/data/db';
import { limpiarAlmacenamiento } from '../helpers';

describe('hooks/useUsuarios', () => {
  const NUEVO = { run: '123456789', nombre: 'Ana', apellidos: 'Soto', correo: 'ana@gmail.com', tipo: 'Cliente', region: 'Región Metropolitana de Santiago', comuna: 'Maipú' };

  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  it('parte con los 3 usuarios iniciales', () => {
    const { result } = renderHook(() => useUsuarios());
    expect(result.current.usuarios.length).toBe(3);
  });

  it('registrarUsuario agrega al estado y lo guarda en la base simulada', () => {
    const { result } = renderHook(() => useUsuarios());
    let respuesta;
    act(() => { respuesta = result.current.registrarUsuario(NUEVO); });
    expect(respuesta.ok).toBeTrue();
    expect(result.current.usuarios.length).toBe(4);
    expect(usuariosDB.obtener('123456789').nombre).toBe('Ana');
  });

  it('registrarUsuario rechaza un RUN repetido y no cambia la lista', () => {
    const { result } = renderHook(() => useUsuarios());
    let respuesta;
    act(() => { respuesta = result.current.registrarUsuario({ ...NUEVO, run: '201234567' }); });
    expect(respuesta.ok).toBeFalse();
    expect(respuesta.error).toBe('Ya existe un usuario registrado con ese RUN.');
    expect(result.current.usuarios.length).toBe(3);
  });

  it('actualizarUsuario cambia los datos en el estado y en la base', () => {
    const { result } = renderHook(() => useUsuarios());
    act(() => result.current.actualizarUsuario('201234567', { nombre: 'Carlitos' }));
    expect(result.current.usuarios.find((u) => u.run === '201234567').nombre).toBe('Carlitos');
    expect(usuariosDB.obtener('201234567').nombre).toBe('Carlitos');
  });

  it('eliminarUsuario lo quita del estado y de la base', () => {
    const { result } = renderHook(() => useUsuarios());
    act(() => result.current.eliminarUsuario('201234567'));
    expect(result.current.usuarios.length).toBe(2);
    expect(usuariosDB.obtener('201234567')).toBeNull();
  });
});