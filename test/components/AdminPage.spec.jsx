import { screen, fireEvent } from '@testing-library/react';
import AdminPage from '../../src/pages/AdminPage';
import { productosDB } from '../../src/data/db';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

// Prueba de INTEGRACIÓN del panel: pestañas, CRUD y mock de window.confirm.
describe('pages/AdminPage', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const irAProductos = () => fireEvent.click(screen.getByRole('tab', { name: 'Gestión de Productos' }));

  it('muestra por defecto la gestión de usuarios', () => {
    renderConTienda(<AdminPage />);
    expect(screen.queryByText('Usuarios Registrados')).not.toBeNull();
    expect(screen.getAllByRole('row').length).toBe(4); // encabezado + 3 usuarios iniciales
  });

  it('cambia a la pestaña de productos (estado)', () => {
    renderConTienda(<AdminPage />);
    irAProductos();
    expect(screen.queryByText('Listado de Productos')).not.toBeNull();
    expect(screen.getAllByRole('row').length).toBe(7); // encabezado + 6 productos
  });

  it('elimina un producto cuando el usuario confirma (mock de window.confirm)', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    renderConTienda(<AdminPage />);
    irAProductos();
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);
    expect(window.confirm).toHaveBeenCalled();
    expect(screen.getAllByRole('row').length).toBe(6);
    expect(productosDB.listar().length).toBe(5);
    expect(screen.queryByText('Producto eliminado.')).not.toBeNull();
  });

  it('NO elimina el producto si el usuario cancela', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    renderConTienda(<AdminPage />);
    irAProductos();
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);
    expect(productosDB.listar().length).toBe(6);
  });

  it('crea un producto desde el formulario del modal', () => {
    renderConTienda(<AdminPage />);
    irAProductos();
    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo Producto' }));
    const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
    escribir('Código', 'PROD-50');
    escribir('Nombre', 'Cinta para el pelo');
    escribir('Categoría', 'Accesorios');
    escribir('Precio ($)', '3000');
    escribir('Stock', '8');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Producto' }));
    expect(productosDB.listar().length).toBe(7);
    expect(screen.queryByText('Producto guardado correctamente.')).not.toBeNull();
    expect(screen.queryByText('Cinta para el pelo')).not.toBeNull();
  });

  it('el formulario de producto marca errores si faltan datos', () => {
    renderConTienda(<AdminPage />);
    irAProductos();
    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo Producto' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Producto' }));
    expect(screen.getByLabelText('Código')).toHaveClass('is-invalid');
    expect(productosDB.listar().length).toBe(6);
  });
});