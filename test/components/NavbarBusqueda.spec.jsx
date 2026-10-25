import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../src/components/layout/Navbar';

describe('components/layout/Navbar (barra de búsqueda)', () => {
  let onBuscar;

  beforeEach(() => {
    onBuscar = jasmine.createSpy('onBuscar');
    render(<Navbar cantidadCarrito={0} onBuscar={onBuscar} />);
  });

  it('envía el texto escrito al presionar el botón Buscar', () => {
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'malla' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onBuscar).toHaveBeenCalledOnceWith('malla');
  });

  it('quita los espacios sobrantes del texto', () => {
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: '  toalla  ' } });
    fireEvent.submit(screen.getByRole('search'));
    expect(onBuscar).toHaveBeenCalledOnceWith('toalla');
  });

  it('también busca al enviar el formulario con el campo vacío', () => {
    fireEvent.submit(screen.getByRole('search'));
    expect(onBuscar).toHaveBeenCalledOnceWith('');
  });
});
