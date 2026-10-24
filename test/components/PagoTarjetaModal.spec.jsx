import { render, screen, fireEvent } from '@testing-library/react';
import PagoTarjetaModal from '../../src/components/pago/PagoTarjetaModal';

describe('components/pago/PagoTarjetaModal', () => {
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  it('con datos inválidos marca los campos y no procesa el pago', () => {
    const onPagoExitoso = jasmine.createSpy('onPagoExitoso');
    render(<PagoTarjetaModal abierto onCerrar={() => {}} onPagoExitoso={onPagoExitoso} />);
    escribir('Número de Tarjeta', '1234');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Pago' }));
    expect(screen.getByLabelText('Número de Tarjeta')).toHaveClass('is-invalid');
    expect(screen.getByLabelText('CVV')).toHaveClass('is-invalid');
    expect(onPagoExitoso).not.toHaveBeenCalled();
  });

  it('con una tarjeta válida procesa el pago', () => {
    const onPagoExitoso = jasmine.createSpy('onPagoExitoso');
    render(<PagoTarjetaModal abierto onCerrar={() => {}} onPagoExitoso={onPagoExitoso} />);
    escribir('Titular de la Tarjeta', 'Juan Pérez');
    escribir('Número de Tarjeta', '4111111111111111');
    escribir('Expiración (MM/AA)', '12/28');
    escribir('CVV', '123');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Pago' }));
    expect(onPagoExitoso).toHaveBeenCalledTimes(1);
  });
});