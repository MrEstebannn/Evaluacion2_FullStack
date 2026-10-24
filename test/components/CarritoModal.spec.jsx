import { screen, fireEvent } from '@testing-library/react';
import CarritoModal from '../../src/components/carrito/CarritoModal';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

describe('components/carrito/CarritoModal', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const abrir = (props = {}) =>
    renderConTienda(<CarritoModal abierto onCerrar={() => {}} onPagar={() => {}} {...props} />);

  it('con el carrito vacío muestra el aviso y deshabilita PAGAR', () => {
    abrir();
    expect(screen.queryByText('El carrito está vacío.')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'PAGAR' }).disabled).toBeTrue();
  });

  it('un cupón inválido muestra el mensaje de error', () => {
    abrir();
    fireEvent.change(screen.getByPlaceholderText('Ingrese cupón de descuento'), { target: { value: 'FALSO' } });
    fireEvent.click(screen.getByRole('button', { name: 'APLICAR' }));
    expect(screen.queryByText(/Cupón inválido/)).not.toBeNull();
  });

  it('un cupón válido muestra la confirmación y el descuento', () => {
    abrir();
    fireEvent.change(screen.getByPlaceholderText('Ingrese cupón de descuento'), { target: { value: 'hype10' } });
    fireEvent.click(screen.getByRole('button', { name: 'APLICAR' }));
    expect(screen.queryByText('¡Cupón de $5.000 aplicado correctamente!')).not.toBeNull();
    expect(screen.queryByText(/Descuento aplicado/)).not.toBeNull();
  });

  it('"Seguir Comprando" cierra el modal', () => {
    const onCerrar = jasmine.createSpy('onCerrar');
    abrir({ onCerrar });
    fireEvent.click(screen.getByRole('button', { name: 'Seguir Comprando' }));
    expect(onCerrar).toHaveBeenCalled();
  });
});