import { screen, fireEvent } from '@testing-library/react';
import AdminPage from '../../src/pages/AdminPage';
import { usuariosDB } from '../../src/data/db';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

describe('pages/AdminPage (inicio de sesión del panel)', () => {
  const limpiar = () => {
    limpiarAlmacenamiento();
    sessionStorage.clear();
  };
  beforeEach(limpiar);
  afterAll(limpiar);

  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
  const iniciarSesion = () => fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

  it('muestra el login y NO el panel mientras no hay sesión', () => {
    renderConTienda(<AdminPage />);
    expect(screen.queryByRole('button', { name: 'Iniciar sesión' })).not.toBeNull();
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('al tocar al usuario de prueba se rellenan usuario y contraseña (sin iniciar sesión sola)', () => {
    renderConTienda(<AdminPage />);
    fireEvent.click(screen.getByRole('button', { name: /Don Carter/ }));
    expect(screen.getByLabelText('Usuario').value).toBe('Don Carter');
    expect(screen.getByLabelText('Contraseña').value).toBe('123456');
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('con las credenciales correctas muestra "Sesión Iniciada" y entra al panel', () => {
    renderConTienda(<AdminPage />);
    fireEvent.click(screen.getByRole('button', { name: /Don Carter/ }));
    iniciarSesion();
    expect(screen.queryByText('Sesión Iniciada')).not.toBeNull();
    expect(screen.queryByRole('complementary')).not.toBeNull();
    expect(usuariosDB.obtener('176543210').nombre).toBe('Don');
  });

  it('con credenciales incorrectas muestra un error y no entra', () => {
    renderConTienda(<AdminPage />);
    escribir('Usuario', 'Don Carter');
    escribir('Contraseña', 'incorrecta');
    iniciarSesion();
    expect(screen.queryByText('Usuario o contraseña incorrectos.')).not.toBeNull();
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('con los campos vacíos pide completar usuario y contraseña', () => {
    renderConTienda(<AdminPage />);
    iniciarSesion();
    expect(screen.queryByText('Ingresa tu usuario.')).not.toBeNull();
    expect(screen.queryByText('Ingresa tu contraseña.')).not.toBeNull();
  });

  it('"Cerrar sesión" vuelve a pedir el login y avisa a la tienda', () => {
    const salir = jasmine.createSpy('salir');
    renderConTienda(<AdminPage onSalirATienda={salir} />);
    fireEvent.click(screen.getByRole('button', { name: /Don Carter/ }));
    iniciarSesion();
    fireEvent.click(screen.getAllByRole('button', { name: 'Cerrar sesión' })[0]);
    expect(salir).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Iniciar sesión' })).not.toBeNull();
  });

  it('si ya hay una sesión guardada entra directo al panel', () => {
    sessionStorage.setItem('hype_admin_sesion', JSON.stringify({ run: '176543210', usuario: 'Don Carter' }));
    renderConTienda(<AdminPage />);
    expect(screen.queryByRole('complementary')).not.toBeNull();
  });
});
