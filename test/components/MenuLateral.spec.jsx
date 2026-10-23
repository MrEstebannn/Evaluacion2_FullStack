import { render, screen, fireEvent } from '@testing-library/react';
import MenuLateral from '../../src/components/layout/MenuLateral';

describe('components/layout/MenuLateral', () => {
  const ITEMS = [
    { etiqueta: 'Clases', tipo: 'ancla', destino: 'clases' },
    { etiqueta: 'Nosotros', tipo: 'seccion', destino: 'nosotros' },
  ];

  it('no se muestra si abierto=false', () => {
    const { container } = render(<MenuLateral abierto={false} items={ITEMS} onCerrar={() => {}} onSeleccionar={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('lista todas las opciones recibidas', () => {
    render(<MenuLateral abierto items={ITEMS} onCerrar={() => {}} onSeleccionar={() => {}} />);
    expect(screen.queryByText(/Clases/)).not.toBeNull();
    expect(screen.queryByText(/Nosotros/)).not.toBeNull();
  });

  it('al elegir una opción entrega el ítem completo', () => {
    const onSeleccionar = jasmine.createSpy('onSeleccionar');
    render(<MenuLateral abierto items={ITEMS} onCerrar={() => {}} onSeleccionar={onSeleccionar} />);
    fireEvent.click(screen.getByText(/Nosotros/));
    expect(onSeleccionar).toHaveBeenCalledWith(ITEMS[1]);
  });

  it('el botón de cierre llama a onCerrar', () => {
    const onCerrar = jasmine.createSpy('onCerrar');
    render(<MenuLateral abierto items={ITEMS} onCerrar={onCerrar} onSeleccionar={() => {}} />);
    fireEvent.click(screen.getByLabelText('Cerrar'));
    expect(onCerrar).toHaveBeenCalled();
  });
});