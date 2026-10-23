import { screen, fireEvent, within } from '@testing-library/react';
import ProductosPage from '../../src/pages/ProductosPage';
import { productosDB } from '../../src/data/db';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

// Prueba de INTEGRACIÓN: página + contexto + hook + db.js (localStorage).
describe('pages/ProductosPage', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  it('renderiza una tarjeta por cada producto de la base de datos', () => {
    renderConTienda(<ProductosPage />);
    expect(screen.queryByText('Tienda de Productos')).not.toBeNull();
    expect(screen.getAllByRole('button', { name: 'Añadir al Carrito' }).length).toBe(6);
  });

  it('muestra un producto creado en db.js', () => {
    productosDB.crear({ codigo: 'PROD-99', nombre: 'Cinta para el pelo', categoria: 'Accesorios', precio: 3000, stock: 4 });
    renderConTienda(<ProductosPage />);
    expect(screen.queryByText('Cinta para el pelo')).not.toBeNull();
    expect(screen.getAllByRole('button', { name: 'Añadir al Carrito' }).length).toBe(7);
  });

  it('añadir al carrito muestra una notificación y guarda el carrito', () => {
    renderConTienda(<ProductosPage />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir al Carrito' })[0]);
    expect(screen.queryByText('Producto agregado al carrito.')).not.toBeNull();
    expect(JSON.parse(localStorage.getItem('hype_cart')).length).toBe(1);
  });

  it('"Ver Detalle" abre el modal con el stock del producto', () => {
    renderConTienda(<ProductosPage />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Ver Detalle' })[0]);
    const dialogo = screen.getByRole('dialog');
    expect(within(dialogo).queryByText('Stock disponible:')).not.toBeNull();
    expect(within(dialogo).queryByText('12 unidades')).not.toBeNull();
  });
});