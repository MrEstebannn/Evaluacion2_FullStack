import { screen, fireEvent, within } from '@testing-library/react';
import CategoriasView from '../../../src/admin/views/CategoriasView';
import { categoriasDB } from '../../../src/data/db';
import { limpiarAlmacenamiento, renderVista } from '../../helpers';

describe('admin/views/CategoriasView', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  const abrirNueva = () => fireEvent.click(screen.getByRole('button', { name: /Nueva categoría/ }));
  const modal = () => within(screen.getByRole('dialog'));

  it('muestra una tarjeta por categoría con su cantidad de productos', () => {
    renderVista(CategoriasView);
    categoriasDB.listar().forEach((c) => expect(screen.queryByRole('heading', { name: c.nombre })).not.toBeNull());
    expect(screen.getAllByText(/\d+ productos$/).length).toBe(categoriasDB.listar().length);
  });

  it('el modal está cerrado al inicio y "Nueva categoría" lo abre', () => {
    renderVista(CategoriasView);
    expect(screen.queryByRole('dialog')).toBeNull();
    abrirNueva();
    expect(modal().queryByText('Nueva categoría')).not.toBeNull();
  });

  it('crea una categoría válida, la guarda y cierra el modal', () => {
    renderVista(CategoriasView);
    abrirNueva();
    fireEvent.change(modal().getByLabelText('Nombre'), { target: { value: 'Música' } });
    fireEvent.click(modal().getByRole('button', { name: 'Crear categoría' }));
    expect(categoriasDB.listar().some((c) => c.nombre === 'Música')).toBeTrue();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('rechaza un nombre vacío y deja el modal abierto', () => {
    renderVista(CategoriasView);
    abrirNueva();
    fireEvent.click(modal().getByRole('button', { name: 'Crear categoría' }));
    expect(modal().getByLabelText('Nombre').classList.contains('is-invalid')).toBeTrue();
    expect(categoriasDB.listar().length).toBe(3);
  });

  it('rechaza un nombre repetido', () => {
    renderVista(CategoriasView);
    abrirNueva();
    fireEvent.change(modal().getByLabelText('Nombre'), { target: { value: 'calzado' } });
    fireEvent.click(modal().getByRole('button', { name: 'Crear categoría' }));
    expect(categoriasDB.listar().length).toBe(3);
  });

  it('"Editar" abre el formulario con los datos de la categoría', () => {
    renderVista(CategoriasView);
    fireEvent.click(screen.getAllByRole('button', { name: /Editar/ })[0]);
    expect(modal().queryByText('Editar categoría')).not.toBeNull();
    expect(modal().getByLabelText('Nombre').value).toBe(categoriasDB.listar()[0].nombre);
  });

  it('no deja eliminar una categoría con productos (no pide confirmación)', () => {
    spyOn(window, 'confirm');
    renderVista(CategoriasView);
    fireEvent.click(screen.getAllByRole('button', { name: /Eliminar/ })[0]);
    expect(window.confirm).not.toHaveBeenCalled();
    expect(categoriasDB.listar().length).toBe(3);
  });

  it('elimina una categoría sin productos al confirmar', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const vacia = categoriasDB.crear({ nombre: 'Vacía', descripcion: '' });
    renderVista(CategoriasView);
    const tarjeta = screen.getByRole('heading', { name: 'Vacía' }).closest('.card');
    fireEvent.click(within(tarjeta).getByRole('button', { name: /Eliminar/ }));
    expect(categoriasDB.obtener(vacia.id)).toBeNull();
  });
});