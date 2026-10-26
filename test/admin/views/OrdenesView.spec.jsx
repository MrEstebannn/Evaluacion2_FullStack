import { screen, fireEvent } from '@testing-library/react';
import OrdenesView from '../../../src/admin/views/OrdenesView';
import { ordenesDB } from '../../../src/data/db';
import { espiarDescargas, limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/OrdenesView', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const verBoletas = () => screen.queryAllByRole('button', { name: /Ver boleta/ });
  const elegirEstado = (valor) => fireEvent.change(screen.getByLabelText('Filtrar por estado'), { target: { value: valor } });

  it('lista todas las órdenes con un botón "Ver boleta" cada una', () => {
    renderVista(OrdenesView);
    expect(screen.getByRole('heading', { name: 'Órdenes / Boletas' })).not.toBeNull();
    expect(verBoletas().length).toBe(ordenesDB.listar().length);
  });

  it('filtra por estado (estado del componente)', () => {
    renderVista(OrdenesView);
    elegirEstado('Cancelada');
    expect(verBoletas().length).toBe(ordenesDB.listar().filter((o) => o.estado === 'Cancelada').length);
  });

  it('busca por nombre de cliente sin distinguir mayúsculas', () => {
    renderVista(OrdenesView);
    fireEvent.change(screen.getByLabelText('Buscar órdenes'), { target: { value: 'CARLOS' } });
    expect(verBoletas().length).toBe(ordenesDB.listar().filter((o) => o.cliente.nombre.includes('Carlos')).length);
  });

  it('muestra un mensaje cuando nada coincide', () => {
    renderVista(OrdenesView);
    fireEvent.change(screen.getByLabelText('Buscar órdenes'), { target: { value: 'zzzz' } });
    expect(verBoletas().length).toBe(0);
    expect(screen.queryByText('No hay órdenes que coincidan con la búsqueda.')).not.toBeNull();
  });

  it('"Ver boleta" de la primera fila abre la orden más reciente', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(OrdenesView, { ir });
    fireEvent.click(verBoletas()[0]);
    expect(ir).toHaveBeenCalledWith('boleta', { id: 10 });
  });

  it('"Exportar CSV" genera la descarga (mock de URL y del enlace)', () => {
    espiarDescargas();
    renderVista(OrdenesView);
    fireEvent.click(screen.getByRole('button', { name: /Exportar CSV/ }));
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1);
  });
});