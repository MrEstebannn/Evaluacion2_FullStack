import { render, screen, fireEvent, within } from '@testing-library/react';
import BlogsPage from '../../src/pages/BlogsPage';
import { BLOGS } from '../../src/data/catalogo';

describe('pages/BlogsPage', () => {
  const botonesVer = () => screen.getAllByRole('button', { name: 'Ver Caso' });

  it('muestra el título de la sección', () => {
    render(<BlogsPage />);
    expect(screen.getByRole('heading', { name: 'Noticias y Casos Curiosos' })).not.toBeNull();
  });

  it('renderiza una tarjeta por cada blog del catálogo', () => {
    render(<BlogsPage />);
    expect(botonesVer().length).toBe(BLOGS.length);
    BLOGS.forEach((b) => expect(screen.queryByText(b.titulo)).not.toBeNull());
  });

  it('el modal está cerrado al inicio', () => {
    render(<BlogsPage />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('"Ver Caso" abre el modal con el título y el texto del blog elegido', () => {
    render(<BlogsPage />);
    fireEvent.click(botonesVer()[0]);
    const modal = screen.getByRole('dialog');
    expect(within(modal).queryByText(BLOGS[0].titulo)).not.toBeNull();
    expect(modal.textContent).toContain(BLOGS[0].texto);
  });

  it('cada botón abre SU blog (el estado guarda el blog seleccionado)', () => {
    render(<BlogsPage />);
    fireEvent.click(botonesVer()[1]);
    const modal = screen.getByRole('dialog');
    expect(within(modal).queryByText(BLOGS[1].titulo)).not.toBeNull();
    expect(modal.textContent).not.toContain(BLOGS[0].texto);
  });

  it('el botón X cierra el modal', () => {
    render(<BlogsPage />);
    fireEvent.click(botonesVer()[0]);
    fireEvent.click(screen.getByLabelText('Cerrar'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('la tecla Escape cierra el modal', () => {
    render(<BlogsPage />);
    fireEvent.click(botonesVer()[0]);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});