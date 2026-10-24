import { render, screen, fireEvent } from '@testing-library/react';
import BlogCard from '../../src/components/blogs/BlogCard';

describe('components/blogs/BlogCard', () => {
  const BLOG = { id: 1, titulo: 'Beneficios del baile', resumen: 'Bailar libera endorfinas.', imagen: '/img/beneficios-del-baile.jpg', texto: 'Texto largo' };

  it('muestra título y resumen', () => {
    render(<BlogCard blog={BLOG} onVer={() => {}} />);
    expect(screen.queryByText('Beneficios del baile')).not.toBeNull();
    expect(screen.queryByText('Bailar libera endorfinas.')).not.toBeNull();
  });

  it('"Ver Caso" entrega el blog al padre', () => {
    const onVer = jasmine.createSpy('onVer');
    render(<BlogCard blog={BLOG} onVer={onVer} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ver Caso' }));
    expect(onVer).toHaveBeenCalledWith(BLOG);
  });
});