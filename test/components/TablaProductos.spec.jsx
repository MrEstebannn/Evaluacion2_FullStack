import { render, screen, fireEvent } from '@testing-library/react';
import TablaProductos from '../../src/components/admin/TablaProductos';

describe('components/admin/TablaProductos', () => {
  const PRODUCTOS = [
    { id: 1, codigo: 'P1', nombre: 'Zapatillas', categoria: 'Calzado', precio: 35000, stock: 2, stockCritico: 3 },
    { id: 2, codigo: 'P2', nombre: 'Toalla', categoria: 'Accesorios', precio: 12000, stock: 20, stockCritico: 4 },
    { id: 3, codigo: 'P3', nombre: 'Botella', categoria: 'Accesorios', precio: 15000, stock: 5, stockCritico: 0 },
  ];

  it('renderiza una fila por producto (más el encabezado)', () => {
    render(<TablaProductos productos={PRODUCTOS} onNuevo={() => {}} onEliminar={() => {}} />);
    expect(screen.getAllByRole('row').length).toBe(4);
    expect(screen.queryByText('$35.000')).not.toBeNull();
  });

  it('muestra la insignia "Stock Crítico" solo en productos bajo su límite', () => {
    const { container } = render(<TablaProductos productos={PRODUCTOS} onNuevo={() => {}} onEliminar={() => {}} />);
    expect(container.querySelectorAll('.badge.bg-danger').length).toBe(1);
    expect(screen.queryByText('N/A')).not.toBeNull();
  });

  it('"Eliminar" entrega el producto de esa fila', () => {
    const onEliminar = jasmine.createSpy('onEliminar');
    render(<TablaProductos productos={PRODUCTOS} onNuevo={() => {}} onEliminar={onEliminar} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[1]);
    expect(onEliminar).toHaveBeenCalledWith(PRODUCTOS[1]);
  });

  it('"+ Nuevo Producto" llama a onNuevo', () => {
    const onNuevo = jasmine.createSpy('onNuevo');
    render(<TablaProductos productos={PRODUCTOS} onNuevo={onNuevo} onEliminar={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo Producto' }));
    expect(onNuevo).toHaveBeenCalled();
  });
});