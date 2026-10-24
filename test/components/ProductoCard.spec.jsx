import { render, screen, fireEvent } from '@testing-library/react';
import ProductoCard from '../../src/components/productos/ProductoCard';

describe('components/productos/ProductoCard', () => {
  const PRODUCTO = {
    id: 101, nombre: 'Zapatillas de Ballet', categoria: 'Calzado', precio: 35000,
    imagen: '/img/zapatillas-ballet.webp', tallas: ['35', '36', '37'],
  };

  it('renderiza nombre, categoría, precio formateado e imagen', () => {
    render(<ProductoCard producto={PRODUCTO} onVerDetalle={() => {}} onAgregar={() => {}} />);
    expect(screen.queryByText('Zapatillas de Ballet')).not.toBeNull();
    expect(screen.queryByText('Calzado')).not.toBeNull();
    expect(screen.queryByText('$35.000')).not.toBeNull();
    expect(screen.getByAltText('Zapatillas de Ballet').getAttribute('src')).toBe('/img/zapatillas-ballet.webp');
  });

  it('muestra el selector de talla solo si el producto tiene tallas (render condicional)', () => {
    const { rerender } = render(<ProductoCard producto={PRODUCTO} onVerDetalle={() => {}} onAgregar={() => {}} />);
    expect(screen.queryByLabelText('Talla:')).not.toBeNull();
    rerender(<ProductoCard producto={{ ...PRODUCTO, tallas: undefined }} onVerDetalle={() => {}} onAgregar={() => {}} />);
    expect(screen.queryByLabelText('Talla:')).toBeNull();
  });

  it('selecciona por defecto la primera talla (estado inicial)', () => {
    render(<ProductoCard producto={PRODUCTO} onVerDetalle={() => {}} onAgregar={() => {}} />);
    expect(screen.getByLabelText('Talla:').value).toBe('35');
  });

  it('al añadir al carrito envía el producto y la talla elegida (estado + evento)', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    render(<ProductoCard producto={PRODUCTO} onVerDetalle={() => {}} onAgregar={onAgregar} />);
    fireEvent.change(screen.getByLabelText('Talla:'), { target: { value: '36' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al Carrito' }));
    expect(onAgregar).toHaveBeenCalledWith(PRODUCTO, '36');
  });

  it('al presionar "Ver Detalle" envía el producto', () => {
    const onVerDetalle = jasmine.createSpy('onVerDetalle');
    render(<ProductoCard producto={PRODUCTO} onVerDetalle={onVerDetalle} onAgregar={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ver Detalle' }));
    expect(onVerDetalle).toHaveBeenCalledWith(PRODUCTO);
  });
});