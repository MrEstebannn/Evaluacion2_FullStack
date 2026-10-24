import { screen, fireEvent, within } from '@testing-library/react';
import AdminPage from '../../src/pages/AdminPage';
import { productosDB, categoriasDB } from '../../src/data/db';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

// Pruebas de INTEGRACIÓN del panel de administración (navegación interna, CRUD y filtros).
describe('pages/AdminPage (panel de administración)', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const menu = () => within(screen.getByRole('complementary'));
  const irA = (nombre) => fireEvent.click(menu().getByRole('button', { name: nombre }));
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  it('muestra el dashboard por defecto con sus indicadores', () => {
    renderConTienda(<AdminPage />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).not.toBeNull();
    expect(screen.queryByText('Ventas totales')).not.toBeNull();
    expect(screen.queryByText('Últimas órdenes')).not.toBeNull();
  });

  it('navega a Usuarios y lista los 3 usuarios iniciales', () => {
    renderConTienda(<AdminPage />);
    irA('Usuarios');
    expect(screen.getAllByRole('row').length).toBe(4); // encabezado + 3
  });

  it('filtra usuarios por texto de búsqueda (estado)', () => {
    renderConTienda(<AdminPage />);
    irA('Usuarios');
    fireEvent.change(screen.getByLabelText('Buscar usuarios'), { target: { value: 'maria' } });
    expect(screen.getAllByRole('row').length).toBe(2);
  });

  it('abre la boleta de la orden más reciente desde Órdenes / Boletas', () => {
    renderConTienda(<AdminPage />);
    irA('Órdenes / Boletas');
    fireEvent.click(screen.getAllByRole('button', { name: /Ver boleta/ })[0]);
    expect(screen.getByRole('heading', { name: 'Boleta #20260010' })).not.toBeNull();
  });

  it('lista los productos con stock crítico', () => {
    renderConTienda(<AdminPage />);
    irA('Stock crítico');
    expect(screen.queryByText('Malla de Danza Elástica')).not.toBeNull();
    expect(screen.queryByText('Zapatos de Salsa Cuero')).not.toBeNull();
    expect(screen.queryByText('Toalla Microfibra Hype')).toBeNull();
  });

  it('elimina un producto cuando el usuario confirma (mock de window.confirm)', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    renderConTienda(<AdminPage />);
    irA('Listado');
    fireEvent.click(screen.getAllByRole('button', { name: /Eliminar/ })[0]);
    expect(window.confirm).toHaveBeenCalled();
    expect(productosDB.listar().length).toBe(5);
  });

  it('NO elimina el producto si el usuario cancela', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    renderConTienda(<AdminPage />);
    irA('Listado');
    fireEvent.click(screen.getAllByRole('button', { name: /Eliminar/ })[0]);
    expect(productosDB.listar().length).toBe(6);
  });

  it('crea un producto desde el formulario', () => {
    renderConTienda(<AdminPage />);
    irA('Nuevo producto');
    escribir('Código', 'PROD-50');
    escribir('Nombre', 'Cinta para el pelo');
    escribir('Categoría', 'Accesorios');
    escribir('Precio ($)', '3000');
    escribir('Stock', '8');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(productosDB.listar().length).toBe(7);
    expect(screen.queryByText('Producto guardado correctamente.')).not.toBeNull();
  });

  it('el formulario de producto muestra errores si faltan datos', () => {
    renderConTienda(<AdminPage />);
    irA('Nuevo producto');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.queryByText('Código requerido (mínimo 3 caracteres).')).not.toBeNull();
    expect(productosDB.listar().length).toBe(6);
  });

  it('crea una categoría nueva', () => {
    renderConTienda(<AdminPage />);
    irA('Categorías');
    fireEvent.click(screen.getByRole('button', { name: /Nueva categoría/ }));
    escribir('Nombre', 'Equipamiento');
    fireEvent.click(screen.getByRole('button', { name: 'Crear categoría' }));
    expect(categoriasDB.listar().length).toBe(4);
  });

  it('no permite eliminar una categoría que tiene productos', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    renderConTienda(<AdminPage />);
    irA('Categorías');
    fireEvent.click(screen.getAllByRole('button', { name: /Eliminar/ })[0]);
    expect(categoriasDB.listar().length).toBe(3);
    expect(screen.queryByText('No puedes eliminar una categoría que tiene productos asociados.')).not.toBeNull();
  });
});
