import { screen, fireEvent } from '@testing-library/react';
import ProductosReporteView from '../../../src/admin/views/ProductosReporteView';
import { ordenesDB, productosDB } from '../../../src/data/db';
import { formatoCLP } from '../../../src/utils/formato';
import { valorInventario } from '../../../src/admin/adminStats';
import { espiarDescargas, limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/ProductosReporteView', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  it('muestra los indicadores calculados desde el inventario', () => {
    renderVista(ProductosReporteView);
    expect(screen.getByRole('heading', { name: 'Reportes de productos' })).not.toBeNull();
    expect(screen.queryByText('84')).not.toBeNull(); // 12+5+20+2+30+15 unidades
    expect(screen.queryByText(formatoCLP(valorInventario(productosDB.listar())))).not.toBeNull();
  });

  it('muestra los rankings "Más vendidos" e "Ingresos por categoría"', () => {
    renderVista(ProductosReporteView);
    expect(screen.queryByText('Más vendidos (unidades)')).not.toBeNull();
    expect(screen.queryByText('Ingresos por categoría')).not.toBeNull();
    expect(screen.queryByText('Aún no hay ventas registradas.')).toBeNull();
  });

  it('sin órdenes muestra el aviso de que no hay ventas', () => {
    ordenesDB.listar().forEach((o) => ordenesDB.eliminar(o.id));
    renderVista(ProductosReporteView);
    expect(screen.queryByText('Aún no hay ventas registradas.')).not.toBeNull();
  });

  it('"Exportar inventario" genera la descarga (mock)', () => {
    espiarDescargas();
    renderVista(ProductosReporteView);
    fireEvent.click(screen.getByRole('button', { name: /Exportar inventario/ }));
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
  });
});