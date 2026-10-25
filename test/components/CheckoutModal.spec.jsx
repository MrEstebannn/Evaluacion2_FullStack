import { screen, fireEvent } from '@testing-library/react';
import CheckoutModal from '../../src/components/pago/CheckoutModal';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

describe('components/pago/CheckoutModal', () => {
  const USUARIO = {
    run: '111111111', nombre: 'Ana', apellidos: 'Soto', correo: 'ana@gmail.com',
    region: 'Región Metropolitana de Santiago', comuna: 'Maipú', direccion: 'Los Olmos 123',
  };
  const ITEMS = [{ id: 'a1', idProducto: 105, nombre: 'Toalla Microfibra Hype', precio: 12000, cantidad: 2 }];

  beforeEach(() => {
    limpiarAlmacenamiento();
    localStorage.setItem('hype_cart', JSON.stringify(ITEMS));
  });
  afterAll(limpiarAlmacenamiento);

  const abrir = (props = {}) => renderConTienda(<CheckoutModal abierto onCerrar={() => {}} onContinuar={() => {}} {...props} />);
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
  const pagar = () => fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

  it('no se muestra cuando abierto=false', () => {
    const { container } = renderConTienda(<CheckoutModal abierto={false} onCerrar={() => {}} onContinuar={() => {}} />);
    expect(container.querySelector('form')).toBeNull();
  });

  it('muestra el resumen del carrito y el total a pagar', () => {
    abrir();
    expect(screen.queryByText('Toalla Microfibra Hype')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Pagar ahora $24.000' })).not.toBeNull();
  });

  it('sin sesión el formulario parte vacío', () => {
    abrir();
    expect(screen.getByLabelText('Nombre').value).toBe('');
    expect(screen.getByLabelText('Calle').value).toBe('');
    expect(screen.queryByText(/Sesión iniciada como/)).toBeNull();
  });

  it('con sesión rellena automáticamente los datos y la dirección del usuario', () => {
    abrir({ usuario: USUARIO });
    expect(screen.getByLabelText('Nombre').value).toBe('Ana');
    expect(screen.getByLabelText('Apellidos').value).toBe('Soto');
    expect(screen.getByLabelText('Correo Electrónico').value).toBe('ana@gmail.com');
    expect(screen.getByLabelText('Calle').value).toBe('Los Olmos 123');
    expect(screen.getByLabelText('Región').value).toBe('Región Metropolitana de Santiago');
    expect(screen.getByLabelText('Comuna').value).toBe('Maipú');
    expect(screen.queryByText(/Sesión iniciada como/)).not.toBeNull();
  });

  it('con sesión permite continuar sin escribir nada y entrega los datos', () => {
    const onContinuar = jasmine.createSpy('onContinuar');
    abrir({ usuario: USUARIO, onContinuar });
    pagar();
    expect(onContinuar).toHaveBeenCalledWith(jasmine.objectContaining({ nombre: 'Ana', calle: 'Los Olmos 123', comuna: 'Maipú' }));
  });

  it('sin datos marca los campos obligatorios y no continúa', () => {
    const onContinuar = jasmine.createSpy('onContinuar');
    abrir({ onContinuar });
    pagar();
    expect(screen.getByLabelText('Nombre')).toHaveClass('is-invalid');
    expect(screen.getByLabelText('Calle')).toHaveClass('is-invalid');
    expect(screen.getByLabelText('Comuna')).toHaveClass('is-invalid');
    expect(onContinuar).not.toHaveBeenCalled();
  });

  it('un invitado puede completar los datos manualmente y continuar', () => {
    const onContinuar = jasmine.createSpy('onContinuar');
    abrir({ onContinuar });
    escribir('Nombre', 'Pedro');
    escribir('Apellidos', 'Hacker');
    escribir('Correo Electrónico', 'pedro@gmail.com');
    escribir('Calle', 'Los Crisantemos 45');
    escribir('Comuna', 'Cerrillos');
    pagar();
    expect(onContinuar).toHaveBeenCalledWith(jasmine.objectContaining({ nombre: 'Pedro', comuna: 'Cerrillos' }));
  });

  it('al cambiar la región se reinicia la comuna', () => {
    abrir({ usuario: USUARIO });
    escribir('Región', '');
    expect(screen.getByLabelText('Comuna').value).toBe('');
    expect(screen.getByLabelText('Comuna').disabled).toBeTrue();
  });
});