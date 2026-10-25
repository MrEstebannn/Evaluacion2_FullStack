import { renderHook, act } from '@testing-library/react';
import { NotificacionProvider } from '../../src/context/NotificacionContext';
import { TiendaProvider } from '../../src/context/TiendaContext';
import { useSesionCliente } from '../../src/hooks/useSesionCliente';
import { usuariosDB } from '../../src/data/db';
import { guardarSesionCliente, leerSesionCliente } from '../../src/utils/sesion';
import { limpiarAlmacenamiento } from '../helpers';

describe('hooks/useSesionCliente', () => {
  const wrapper = ({ children }) => (
    <NotificacionProvider>
      <TiendaProvider>{children}</TiendaProvider>
    </NotificacionProvider>
  );
  const ANA = { run: '111111111', nombre: 'Ana', apellidos: 'Soto', correo: 'ana@gmail.com', password: 'abcd', tipo: 'Cliente', region: 'Región Metropolitana de Santiago', comuna: 'Maipú', direccion: 'Los Olmos 123' };

  beforeEach(() => {
    limpiarAlmacenamiento();
    sessionStorage.clear();
    usuariosDB.crear(ANA);
  });
  afterAll(() => {
    limpiarAlmacenamiento();
    sessionStorage.clear();
  });

  it('sin sesión guardada no hay usuario activo', () => {
    const { result } = renderHook(() => useSesionCliente(), { wrapper });
    expect(result.current.usuario).toBeNull();
  });

  it('iniciarSesion con credenciales correctas guarda quién entró', () => {
    const { result } = renderHook(() => useSesionCliente(), { wrapper });
    let resultado;
    act(() => { resultado = result.current.iniciarSesion({ correo: 'ana@gmail.com', password: 'abcd' }); });
    expect(resultado.ok).toBeTrue();
    expect(result.current.usuario.nombre).toBe('Ana');
    expect(leerSesionCliente()).toBe('111111111');
  });

  it('iniciarSesion con contraseña incorrecta no abre sesión', () => {
    const { result } = renderHook(() => useSesionCliente(), { wrapper });
    let resultado;
    act(() => { resultado = result.current.iniciarSesion({ correo: 'ana@gmail.com', password: 'zzzz' }); });
    expect(resultado.ok).toBeFalse();
    expect(result.current.usuario).toBeNull();
    expect(leerSesionCliente()).toBeNull();
  });

  it('restaura la sesión al volver a montar (recarga de la página)', () => {
    guardarSesionCliente('111111111');
    const { result } = renderHook(() => useSesionCliente(), { wrapper });
    expect(result.current.usuario.correo).toBe('ana@gmail.com');
  });

  it('abrirSesion inicia sesión directamente con un RUN (usado al registrarse)', () => {
    const { result } = renderHook(() => useSesionCliente(), { wrapper });
    act(() => result.current.abrirSesion('111111111'));
    expect(result.current.usuario.run).toBe('111111111');
  });

  it('cerrarSesion elimina al usuario activo y la sesión guardada', () => {
    guardarSesionCliente('111111111');
    const { result } = renderHook(() => useSesionCliente(), { wrapper });
    act(() => result.current.cerrarSesion());
    expect(result.current.usuario).toBeNull();
    expect(leerSesionCliente()).toBeNull();
  });

  it('si el usuario de la sesión ya no existe, no hay usuario activo', () => {
    guardarSesionCliente('999999999');
    const { result } = renderHook(() => useSesionCliente(), { wrapper });
    expect(result.current.usuario).toBeNull();
  });
});