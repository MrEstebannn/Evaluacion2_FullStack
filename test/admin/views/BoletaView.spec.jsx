import { screen, fireEvent } from '@testing-library/react';
import BoletaView from '../../../src/admin/views/BoletaView';
import { ordenesDB } from '../../../src/data/db';
import { formatoCLP } from '../../../src/utils/formato';
import { limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/BoletaView', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  it('muestra el número, el cliente y el detalle de la orden indicada en la ruta', () => {
    renderVista(BoletaView, { ruta: { vista: 'boleta', id: 10 } });
    expect(screen.getByRole('heading', { name: 'Boleta #20260010' })).not.toBeNull();
    expect(screen.queryByText('Juan Pérez')).not.toBeNull();
    expect(screen.queryByText('Pants Urban Hip-Hop (Talla L)')).not.toBeNull();
    expect(screen.queryAllByText(formatoCLP(56000)).length).toBeGreaterThan(0);
  });

  it('el selector parte con el estado actual de la orden', () => {
    renderVista(BoletaView, { ruta: { vista: 'boleta', id: 10 } });
    expect(screen.getByLabelText('Cambiar estado').value).toBe(ordenesDB.obtener(10).estado);
  });

  it('cambiar el estado actualiza y guarda la orden', () => {
    renderVista(BoletaView, { ruta: { vista: 'boleta', id: 10 } });
    fireEvent.change(screen.getByLabelText('Cambiar estado'), { target: { value: 'Cancelada' } });
    expect(ordenesDB.obtener(10).estado).toBe('Cancelada');
    expect(screen.getByLabelText('Cambiar estado').value).toBe('Cancelada');
  });

  it('"Imprimir" llama a window.print (mock)', () => {
    spyOn(window, 'print');
    renderVista(BoletaView, { ruta: { vista: 'boleta', id: 10 } });
    fireEvent.click(screen.getByRole('button', { name: /Imprimir/ }));
    expect(window.print).toHaveBeenCalled();
  });

  it('"Volver" regresa al listado de órdenes', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(BoletaView, { ruta: { vista: 'boleta', id: 10 }, ir });
    fireEvent.click(screen.getByRole('button', { name: /Volver/ }));
    expect(ir).toHaveBeenCalledWith('ordenes');
  });

  it('si la orden no existe muestra un aviso y permite volver', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(BoletaView, { ruta: { vista: 'boleta', id: 99999 }, ir });
    expect(screen.queryByText(/No se encontró la orden/)).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Volver a órdenes' }));
    expect(ir).toHaveBeenCalledWith('ordenes');
  });
});