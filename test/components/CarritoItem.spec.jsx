import { render, screen, fireEvent } from '@testing-library/react';
import CarritoItem from '../../src/components/carrito/CarritoItem';

describe('components/carrito/CarritoItem', () => {
  const ITEM = { id: 'a1', nombre: 'Zumba Fitness', precio: 18000, cantidad: 2 };
  let onCambiarCantidad;
  let onEliminar;

  beforeEach(() => {
    onCambiarCantidad = jasmine.createSpy('onCambiarCantidad');
    onEliminar = jasmine.createSpy('onEliminar');
    render(<CarritoItem item={ITEM} onCambiarCantidad={onCambiarCantidad} onEliminar={onEliminar} />);
  });

  it('muestra nombre, precio unitario, cantidad y subtotal', () => {
    expect(screen.queryByText('Zumba Fitness')).not.toBeNull();
    expect(screen.queryByText('$18.000 c/u')).not.toBeNull();
    expect(screen.queryByText('2')).not.toBeNull();
    expect(screen.queryByText('$36.000')).not.toBeNull();
  });

  it('el botón "-" pide restar una unidad', () => {
    fireEvent.click(screen.getByLabelText('Quitar una unidad'));
    expect(onCambiarCantidad).toHaveBeenCalledWith('a1', -1);
  });

  it('el botón "+" pide sumar una unidad', () => {
    fireEvent.click(screen.getByLabelText('Agregar una unidad'));
    expect(onCambiarCantidad).toHaveBeenCalledWith('a1', 1);
  });

  it('el botón ✕ pide eliminar el ítem', () => {
    fireEvent.click(screen.getByLabelText('Eliminar del carrito'));
    expect(onEliminar).toHaveBeenCalledWith('a1');
  });
});