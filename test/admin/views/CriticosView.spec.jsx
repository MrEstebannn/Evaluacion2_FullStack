import { screen, fireEvent } from '@testing-library/react';
import CriticosView from '../../../src/admin/views/CriticosView';
import { productosDB } from '../../../src/data/db';
import { limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/CriticosView', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  it('lista solo los productos con stock igual o menor al mínimo', () => {
    renderVista(CriticosView);
    expect(screen.queryByText('Malla de Danza Elástica')).not.toBeNull();
    expect(screen.queryByText('Zapatos de Salsa Cuero')).not.toBeNull();
    expect(screen.queryByText('Toalla Microfibra Hype')).toBeNull();
  });

  it('muestra un mensaje cuando no hay productos críticos', () => {
    productosDB.actualizar(102, { stock: 50 });
    productosDB.actualizar(104, { stock: 50 });
    renderVista(CriticosView);
    expect(screen.queryByText('No hay productos en stock crítico.')).not.toBeNull();
  });

  it('"Reponer" suma 10 unidades por defecto y saca al producto de la lista', () => {
    renderVista(CriticosView);
    fireEvent.click(screen.getAllByRole('button', { name: 'Reponer' })[0]);
    expect(productosDB.obtener(102).stock).toBe(15);
    expect(screen.queryByText('Malla de Danza Elástica')).toBeNull();
  });

  it('usa la cantidad escrita por el usuario (estado de la fila)', () => {
    renderVista(CriticosView);
    fireEvent.change(screen.getByLabelText('Unidades a reponer de Zapatos de Salsa Cuero'), { target: { value: '7' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Reponer' })[1]);
    expect(productosDB.obtener(104).stock).toBe(9);
  });

  it('ignora una cantidad inválida', () => {
    renderVista(CriticosView);
    fireEvent.change(screen.getByLabelText('Unidades a reponer de Malla de Danza Elástica'), { target: { value: '0' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Reponer' })[0]);
    expect(productosDB.obtener(102).stock).toBe(5);
  });

  it('"Editar" abre el formulario del producto', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(CriticosView, { ir });
    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0]);
    expect(ir).toHaveBeenCalledWith('producto-form', { id: 102 });
  });
});