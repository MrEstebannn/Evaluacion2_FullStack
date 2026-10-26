import { screen, fireEvent } from '@testing-library/react';
import ProductoFormView from '../../../src/admin/views/ProductoFormView';
import { productosDB } from '../../../src/data/db';
import { limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/ProductoFormView', () => {
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
  const llenar = () => {
    escribir('Código', 'PROD-99');
    escribir('Nombre', 'Cinta para el pelo');
    escribir('Categoría', 'Accesorios');
    escribir('Precio ($)', '5000');
    escribir('Stock', '10');
  };

  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  it('en modo nuevo muestra el formulario vacío con las categorías como opciones', () => {
    renderVista(ProductoFormView, { ruta: { vista: 'producto-form' } });
    expect(screen.getByRole('heading', { name: 'Nuevo producto' })).not.toBeNull();
    expect(screen.getByLabelText('Nombre').value).toBe('');
    expect(screen.getByLabelText('Categoría').querySelectorAll('option').length).toBe(4); // 3 + "Seleccione"
  });

  it('enviar vacío marca errores y no guarda', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(ProductoFormView, { ruta: { vista: 'producto-form' }, ir });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByLabelText('Código').classList.contains('is-invalid')).toBeTrue();
    expect(productosDB.listar().length).toBe(6);
    expect(ir).not.toHaveBeenCalled();
  });

  it('un descuento mayor a 90 es inválido', () => {
    renderVista(ProductoFormView, { ruta: { vista: 'producto-form' } });
    llenar();
    escribir('Oferta: descuento (%)', '95');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByLabelText('Oferta: descuento (%)').classList.contains('is-invalid')).toBeTrue();
    expect(productosDB.listar().length).toBe(6);
  });

  it('guarda un producto válido con valores numéricos y vuelve al listado', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(ProductoFormView, { ruta: { vista: 'producto-form' }, ir });
    llenar();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    const guardado = productosDB.listar().find((p) => p.codigo === 'PROD-99');
    expect(guardado.precio).toBe(5000);
    expect(guardado.stock).toBe(10);
    expect(ir).toHaveBeenCalledWith('productos');
  });

  it('en modo edición precarga los datos del producto', () => {
    renderVista(ProductoFormView, { ruta: { vista: 'producto-form', id: 101 } });
    expect(screen.getByRole('heading', { name: 'Editar producto' })).not.toBeNull();
    expect(screen.getByLabelText('Código').value).toBe('PROD-01');
    expect(screen.getByLabelText('Precio ($)').value).toBe('35000');
  });

  it('guarda los cambios de un producto existente', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(ProductoFormView, { ruta: { vista: 'producto-form', id: 101 }, ir });
    escribir('Stock', '40');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(productosDB.obtener(101).stock).toBe(40);
    expect(ir).toHaveBeenCalledWith('productos');
  });

  it('si el producto no existe muestra un aviso con enlace para volver', () => {
    const ir = jasmine.createSpy('ir');
    renderVista(ProductoFormView, { ruta: { vista: 'producto-form', id: 99999 }, ir });
    expect(screen.queryByText(/No se encontró el producto/)).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Volver al listado' }));
    expect(ir).toHaveBeenCalledWith('productos');
  });
});