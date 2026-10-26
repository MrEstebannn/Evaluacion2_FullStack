import { screen, fireEvent } from '@testing-library/react';
import ProductosView from '../../../src/admin/views/ProductosView';
import { productosDB } from '../../../src/data/db';
import { limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/ProductosView', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const filas = () => screen.queryAllByRole('button', { name: /Editar/ });

  it('lista todos los productos y muestra el total en el subtítulo', () => {
    renderVista(ProductosView);
    expect(filas().length).toBe(6);
    expect(screen.queryByText('6 productos en el catálogo.')).not.toBeNull();
  });

  it('marca como "Crítico" los productos bajo su stock mínimo', () => {
    renderVista(ProductosView);
    expect(screen.getAllByText('Crítico').length).toBe(2);
  });

  it('filtra por texto (nombre o código)', () => {
    renderVista(ProductosView);
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'toalla' } });
    expect(filas().length).toBe(1);
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'PROD-04' } });
    expect(filas().length).toBe(1);
  });

  it('filtra por categoría', () => {
    renderVista(ProductosView);
    fireEvent.change(screen.getByLabelText('Filtrar por categoría'), { target: { value: 'Calzado' } });
    expect(filas().length).toBe(2);
  });

  it('muestra un mensaje cuando nada coincide', () => {
    renderVista(ProductosView);
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'zzzz' } });
    expect(screen.queryByText('No hay productos que coincidan.')).not.toBeNull();
  });

  it('"Nuevo producto" y "Editar" navegan al formulario', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(ProductosView, { ir });
    fireEvent.click(screen.getByRole('button', { name: /Nuevo producto/ }));
    fireEvent.click(filas()[0]);
    expect(ir.calls.allArgs()).toEqual([['producto-form'], ['producto-form', { id: 101 }]]);
  });

  it('"Eliminar" borra el producto solo si se confirma', () => {
    const confirmar = spyOn(window, 'confirm').and.returnValue(false);
    renderVista(ProductosView);
    const eliminar = () => fireEvent.click(screen.getAllByRole('button', { name: /Eliminar/ })[0]);
    eliminar();
    expect(productosDB.listar().length).toBe(6);
    confirmar.and.returnValue(true);
    eliminar();
    expect(productosDB.listar().length).toBe(5);
    expect(productosDB.obtener(101)).toBeNull();
  });
});