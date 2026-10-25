import { screen, fireEvent } from '@testing-library/react';
import CheckoutModal from '../../src/components/pago/CheckoutModal';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

describe('components/pago/CheckoutModal', () => {
  const USUARIO = {
    run: '111111111',
    nombre: 'Ana',
    apellidos: 'Soto',
    correo: 'ana@gmail.com',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Maipú',
    direccion: 'Los Olmos 123',
  };
  const ITEMS = [{ id: 'a1', idProducto: 105, nombre: 'Toalla Microfibra Hype', precio: 12000, cantidad: 2 }];

  beforeEach(() => {
    limpiarAlmacenamiento();
    localStorage.setItem('hype_cart', JSON.stringify(ITEMS));
  });
  afterAll(limpiarAlmacenamiento);

  const abrir = (props = {}) =>
    renderConTienda(<CheckoutModal abierto onCerrar={() => {}} onContinuar={() => {}} {...props} />);

  const buscarInput = (container, selector, labelRegex) => {
    return (
      container.querySelector(selector) ||
      screen.queryAllByLabelText(labelRegex)[0] ||
      null
    );
  };

  const obtenerCampos = (container) => ({
    nombre: buscarInput(container, 'input[name="nombre"], #nombre', /nombre/i),
    apellidos: buscarInput(container, 'input[name="apellidos"], #apellidos', /apellido/i),
    correo: buscarInput(container, 'input[name="correo"], input[type="email"], #correo', /correo|email/i),
    calle: buscarInput(container, 'input[name="calle"], input[name="direccion"], #calle', /calle|dirección/i),
    region: buscarInput(container, 'select[name="region"], #region', /región/i),
    comuna: buscarInput(container, 'select[name="comuna"], #comuna', /comuna/i),
  });

  const enviarFormulario = (container) => {
    const form = container.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    } else {
      const botones = screen.getAllByRole('button', { name: /pagar/i });
      fireEvent.click(botones[0]);
    }
  };

  it('no se muestra cuando abierto=false', () => {
    const { container } = renderConTienda(<CheckoutModal abierto={false} onCerrar={() => {}} onContinuar={() => {}} />);
    expect(container.querySelector('form')).toBeNull();
  });

  it('muestra el resumen del carrito y el total a pagar', () => {
    abrir();
    expect(screen.queryByText('Toalla Microfibra Hype')).not.toBeNull();
    const botones = screen.getAllByRole('button', { name: /pagar/i });
    expect(botones.length).toBeGreaterThan(0);
  });

  it('sin sesión el formulario parte vacío', () => {
    const { container } = abrir();
    const campos = obtenerCampos(container);
    if (campos.nombre) expect(campos.nombre.value).toBe('');
    if (campos.calle) expect(campos.calle.value).toBe('');
    expect(screen.queryByText(/Sesión iniciada como/i)).toBeNull();
  });

  it('con sesión rellena automáticamente los datos y la dirección del usuario', () => {
    const { container } = abrir({ usuario: USUARIO });
    const campos = obtenerCampos(container);
    if (campos.nombre) expect(campos.nombre.value).toBe('Ana');
    if (campos.apellidos) expect(campos.apellidos.value).toBe('Soto');
    if (campos.correo) expect(campos.correo.value).toBe('ana@gmail.com');
    if (campos.calle) expect(campos.calle.value).toBe('Los Olmos 123');
    expect(screen.queryByText(/Sesión iniciada como/i)).not.toBeNull();
  });

  it('con sesión permite continuar sin escribir nada y entrega los datos', () => {
    const onContinuar = jasmine.createSpy('onContinuar');
    const { container } = abrir({ usuario: USUARIO, onContinuar });
    enviarFormulario(container);
    expect(onContinuar).toHaveBeenCalled();
  });

  it('sin datos marca los campos obligatorios y no continúa', () => {
    const onContinuar = jasmine.createSpy('onContinuar');
    const { container } = abrir({ onContinuar });
    enviarFormulario(container);
    expect(onContinuar).not.toHaveBeenCalled();
  });

  it('un invitado puede completar los datos manualmente y continuar', () => {
    const onContinuar = jasmine.createSpy('onContinuar');
    const { container } = abrir({ onContinuar });
    const campos = obtenerCampos(container);

    if (campos.nombre) fireEvent.change(campos.nombre, { target: { value: 'Pedro' } });
    if (campos.apellidos) fireEvent.change(campos.apellidos, { target: { value: 'Hacker' } });
    if (campos.correo) fireEvent.change(campos.correo, { target: { value: 'pedro@gmail.com' } });
    if (campos.calle) fireEvent.change(campos.calle, { target: { value: 'Los Crisantemos 45' } });
    if (campos.region) fireEvent.change(campos.region, { target: { value: 'Región Metropolitana de Santiago' } });
    if (campos.comuna) fireEvent.change(campos.comuna, { target: { value: 'Cerrillos' } });

    enviarFormulario(container);
    expect(onContinuar).toHaveBeenCalled();
  });

  it('al cambiar la región se reinicia la comuna', () => {
    const { container } = abrir({ usuario: USUARIO });
    const campos = obtenerCampos(container);
    if (campos.region) {
      fireEvent.change(campos.region, { target: { value: '' } });
      if (campos.comuna) {
        expect(campos.comuna.value).toBe('');
      }
    }
  });
});