import { screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';

describe('App (búsqueda desde el navbar)', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const buscarEnNavbar = (texto) => {
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: texto } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
  };

  it('buscar en el navbar abre la tienda con el resultado filtrado', () => {
    renderConTienda(<App />);
    buscarEnNavbar('malla');
    expect(screen.queryByText('Tienda de Productos')).not.toBeNull();
    expect(screen.getAllByRole('button', { name: 'Añadir al Carrito' }).length).toBe(1);
    expect(screen.getByLabelText('Buscar por nombre').value).toBe('malla');
  });

  it('una segunda búsqueda reemplaza los filtros anteriores', () => {
    renderConTienda(<App />);
    buscarEnNavbar('malla');
    buscarEnNavbar('botella');
    expect(screen.getAllByRole('button', { name: 'Añadir al Carrito' }).length).toBe(1);
    expect(screen.queryByText('Botella Térmica 750ml')).not.toBeNull();
  });
});
