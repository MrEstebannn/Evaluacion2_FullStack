import { screen, fireEvent } from '@testing-library/react';
import DashboardView from '../../../src/admin/views/DashboardView';
import { limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/DashboardView', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  it('muestra el título y los 4 indicadores principales', () => {
    renderVista(DashboardView);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).not.toBeNull();
    ['Ventas totales', 'Órdenes', 'Productos', 'Usuarios'].forEach((t) => expect(screen.queryByRole('button', { name: `Ver ${t}` })).not.toBeNull());
  });

  it('calcula el detalle de productos en stock crítico desde los datos', () => {
    renderVista(DashboardView);
    expect(screen.queryByText('2 en stock crítico')).not.toBeNull();
  });

  it('lista solo los productos críticos', () => {
    renderVista(DashboardView);
    expect(screen.queryByText('Malla de Danza Elástica')).not.toBeNull();
    expect(screen.queryByText('Zapatos de Salsa Cuero')).not.toBeNull();
    expect(screen.queryByText('Toalla Microfibra Hype')).toBeNull();
  });

  it('muestra las 5 últimas órdenes, la más reciente primero', () => {
    renderVista(DashboardView);
    const filas = screen.getAllByRole('button', { name: /^#2026/ });
    expect(filas.length).toBe(5);
    expect(filas[0].textContent).toContain('#20260010');
  });

  it('los indicadores navegan a su sección', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(DashboardView, { ir });
    fireEvent.click(screen.getByRole('button', { name: 'Ver Órdenes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ver Productos' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ver Usuarios' }));
    expect(ir.calls.allArgs()).toEqual([['ordenes'], ['productos'], ['usuarios']]);
  });

  it('los accesos rápidos navegan a su formulario o vista', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(DashboardView, { ir });
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo producto' }));
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo usuario' }));
    expect(ir.calls.allArgs()).toEqual([['producto-form'], ['usuario-form']]);
  });

  it('al tocar una orden reciente abre su boleta con el id', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(DashboardView, { ir });
    fireEvent.click(screen.getAllByRole('button', { name: /^#2026/ })[0]);
    expect(ir).toHaveBeenCalledWith('boleta', { id: 10 });
  });
});