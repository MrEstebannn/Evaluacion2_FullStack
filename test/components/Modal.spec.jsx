import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../src/components/common/Modal';

describe('components/common/Modal', () => {
  it('no renderiza nada cuando abierto=false', () => {
    const { container } = render(<Modal abierto={false} titulo="T" onCerrar={() => {}}>Contenido</Modal>);
    expect(container.firstChild).toBeNull();
  });

  it('muestra título, contenido y footer cuando abierto=true', () => {
    render(<Modal abierto titulo="Mi título" onCerrar={() => {}} footer={<button type="button">Aceptar</button>}>Contenido</Modal>);
    expect(screen.queryByText('Mi título')).not.toBeNull();
    expect(screen.queryByText('Contenido')).not.toBeNull();
    expect(screen.queryByText('Aceptar')).not.toBeNull();
  });

  it('cierra con el botón X', () => {
    const onCerrar = jasmine.createSpy('onCerrar');
    render(<Modal abierto titulo="T" onCerrar={onCerrar}>x</Modal>);
    fireEvent.click(screen.getByLabelText('Cerrar'));
    expect(onCerrar).toHaveBeenCalledTimes(1);
  });

  it('cierra con la tecla Escape', () => {
    const onCerrar = jasmine.createSpy('onCerrar');
    render(<Modal abierto titulo="T" onCerrar={onCerrar}>x</Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCerrar).toHaveBeenCalled();
  });

  it('cierra al hacer clic en el fondo pero no al hacer clic dentro del contenido', () => {
    const onCerrar = jasmine.createSpy('onCerrar');
    render(<Modal abierto titulo="T" onCerrar={onCerrar}>Contenido</Modal>);
    fireEvent.mouseDown(screen.getByText('Contenido'));
    expect(onCerrar).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(onCerrar).toHaveBeenCalledTimes(1);
  });

  it('agrega la clase modal-open al body y la quita al desmontarse', () => {
    const { unmount } = render(<Modal abierto titulo="T" onCerrar={() => {}}>x</Modal>);
    expect(document.body.classList.contains('modal-open')).toBeTrue();
    unmount();
    expect(document.body.classList.contains('modal-open')).toBeFalse();
  });
});