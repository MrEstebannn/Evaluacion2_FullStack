import { render, screen, fireEvent } from '@testing-library/react';
import BlogsPage from '../../src/pages/BlogsPage';
import { BLOGS } from '../../src/data/catalogo';

describe('pages/BlogsPage', () => {
  const botonesVer = () => screen.getAllByRole('button', { name: 'Ver Caso' });

  it('muestra los artículos del catálogo', () => {
    render(<BlogsPage />);
    expect(screen.getByRole('heading', { name: 'Noticias y Casos Curiosos' })).not.toBeNull();
    expect(botonesVer().length).toBe(BLOGS.length);
    BLOGS.forEach((blog) => expect(screen.queryByText(blog.titulo)).not.toBeNull());
  });

  it('envía el identificador del artículo seleccionado a la navegación', () => {
    const onVerBlog = jasmine.createSpy('onVerBlog');
    render(<BlogsPage onVerBlog={onVerBlog} />);
    fireEvent.click(botonesVer()[1]);
    expect(onVerBlog).toHaveBeenCalledWith(BLOGS[1].id);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});