import { screen, fireEvent, within } from '@testing-library/react';
import App from '../../src/App';
import { ordenesDB, usuariosDB } from '../../src/data/db';
import { comprasDeUsuario } from '../../src/admin/adminStats';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

describe('App (sesión del cliente y compra)', () => {
  const ANA = {
    run: '111111111', nombre: 'Ana', apellidos: 'Soto', correo: 'ana@gmail.com', password: 'abcd', tipo: 'Cliente',
    region: 'Región Metropolitana de Santiago', comuna: 'Maipú', direccion: 'Los Olmos 123',
  };
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  const iniciarSesion = (correo, password) => {
    fireEvent.click(screen.getByText('Iniciar Sesión'));
    escribir('Correo Electrónico', correo);
    escribir('Contraseña', password);
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
  };

  const pagarConTarjeta = () => {
    escribir('Titular de la Tarjeta', 'Ana Soto');
    escribir('Número de Tarjeta', '4111111111111111');
    escribir('Expiración (MM/AA)', '12/28');
    escribir('CVV', '123');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Pago' }));
  };

  beforeEach(() => {
    limpiarAlmacenamiento();
    sessionStorage.clear();
    usuariosDB.crear(ANA);
  });
  afterEach(() => sessionStorage.clear());
  afterAll(limpiarAlmacenamiento);

  it('el login con contraseña incorrecta muestra el error y no abre sesión', () => {
    renderConTienda(<App />);
    iniciarSesion('ana@gmail.com', 'zzzz');
    expect(screen.queryByText('Contraseña incorrecta.')).not.toBeNull();
    expect(screen.queryByText('Iniciar Sesión')).not.toBeNull();
  });

  it('el login correcto muestra el saludo y permite cerrar sesión', () => {
    renderConTienda(<App />);
    iniciarSesion('ana@gmail.com', 'abcd');
    expect(screen.getByTestId('usuario-activo').textContent).toBe('Hola, Ana');
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(screen.queryByTestId('usuario-activo')).toBeNull();
    expect(screen.queryByText('Iniciar Sesión')).not.toBeNull();
  });

  it('la sesión se mantiene al recargar la aplicación', () => {
    const primera = renderConTienda(<App />);
    iniciarSesion('ana@gmail.com', 'abcd');
    primera.unmount();
    renderConTienda(<App />);
    expect(screen.getByTestId('usuario-activo').textContent).toBe('Hola, Ana');
  });

  it('con sesión, el checkout trae los datos y la orden queda a nombre del cliente real', () => {
    renderConTienda(<App />);
    iniciarSesion('ana@gmail.com', 'abcd');
    fireEvent.click(screen.getAllByRole('button', { name: 'Inscribirme' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'PAGAR' }));

    const checkout = screen.getByRole('dialog');
    expect(within(checkout).getByLabelText('Calle').value).toBe('Los Olmos 123');
    fireEvent.click(within(checkout).getByRole('button', { name: /Pagar ahora/ }));
    pagarConTarjeta();

    const orden = ordenesDB.listar().at(-1);
    expect(orden.cliente.run).toBe('111111111');
    expect(orden.cliente.nombre).toBe('Ana Soto');
    expect(orden.cliente.correo).toBe('ana@gmail.com');
    expect(orden.cliente.entrega.calle).toBe('Los Olmos 123');
    expect(comprasDeUsuario(ordenesDB.listar(), ANA).length).toBe(1);
  });

  it('sin sesión el cliente completa el checkout y la orden queda con RUN "—"', () => {
    renderConTienda(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Inscribirme' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'PAGAR' }));
    escribir('Nombre', 'Pedro');
    escribir('Apellidos', 'Hacker');
    escribir('Correo Electrónico', 'pedro@gmail.com');
    escribir('Calle', 'Los Crisantemos 45');
    escribir('Comuna', 'Cerrillos');
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));
    pagarConTarjeta();

    const orden = ordenesDB.listar().at(-1);
    expect(orden.cliente.run).toBe('—');
    expect(orden.cliente.nombre).toBe('Pedro Hacker');
    expect(orden.cliente.correo).toBe('pedro@gmail.com');
  });
});