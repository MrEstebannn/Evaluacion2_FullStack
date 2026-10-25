import { screen, fireEvent } from '@testing-library/react';
import ProductosPage from '../../src/pages/ProductosPage';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

describe('pages/ProductosPage (filtros de búsqueda)', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const tarjetas = () => screen.queryAllByRole('button', { name: 'Añadir al Carrito' });
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  it('sin filtros muestra los 6 productos y el contador', () => {
    renderConTienda(<ProductosPage />);
    expect(tarjetas().length).toBe(6);
    expect(screen.queryByText('Mostrando 6 de 6 productos')).not.toBeNull();
  });

  it('busca por nombre sin distinguir mayúsculas ni tildes', () => {
    renderConTienda(<ProductosPage />);
    escribir('Buscar por nombre', 'ELASTICA');
    expect(tarjetas().length).toBe(1);
    expect(screen.queryByText('Malla de Danza Elástica')).not.toBeNull();
    expect(screen.queryByText('Mostrando 1 de 6 productos')).not.toBeNull();
  });

  it('filtra por categoría', () => {
    renderConTienda(<ProductosPage />);
    escribir('Categoría', 'Calzado');
    expect(tarjetas().length).toBe(2);
  });

  it('filtra por precio mínimo y luego por rango', () => {
    renderConTienda(<ProductosPage />);
    escribir('Precio mínimo', '20000');
    expect(tarjetas().length).toBe(4);
    escribir('Precio máximo', '30000');
    expect(tarjetas().length).toBe(2);
  });

  it('un rango invertido muestra el aviso y no oculta productos', () => {
    renderConTienda(<ProductosPage />);
    escribir('Precio mínimo', '50000');
    escribir('Precio máximo', '10000');
    expect(screen.queryByText('El mínimo no puede ser mayor que el máximo.')).not.toBeNull();
    expect(tarjetas().length).toBe(6);
  });

  it('ordena por precio de menor a mayor', () => {
    const { container } = renderConTienda(<ProductosPage />);
    escribir('Ordenar por', 'precio-asc');
    expect(container.querySelector('.card h5').textContent).toBe('Toalla Microfibra Hype');
  });

  it('muestra un mensaje cuando no hay resultados y permite limpiar', () => {
    renderConTienda(<ProductosPage />);
    escribir('Buscar por nombre', 'zzzz');
    expect(tarjetas().length).toBe(0);
    expect(screen.queryByText(/No encontramos productos con esos filtros./)).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(tarjetas().length).toBe(6);
  });

  it('cada filtro activo aparece como etiqueta que se puede quitar', () => {
    renderConTienda(<ProductosPage />);
    escribir('Buscar por nombre', 'malla');
    expect(tarjetas().length).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'Quitar filtro de texto' }));
    expect(tarjetas().length).toBe(6);
  });

  it('el botón Limpiar reinicia todos los filtros', () => {
    renderConTienda(<ProductosPage />);
    escribir('Categoría', 'Accesorios');
    escribir('Precio mínimo', '13000');
    expect(tarjetas().length).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(tarjetas().length).toBe(6);
  });

  it('usa la búsqueda recibida por props como filtro inicial', () => {
    renderConTienda(<ProductosPage busqueda="botella" />);
    expect(tarjetas().length).toBe(1);
    expect(screen.getByLabelText('Buscar por nombre').value).toBe('botella');
  });
});
