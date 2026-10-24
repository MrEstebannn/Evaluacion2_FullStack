import { render, screen } from '@testing-library/react';
import BannerCupon from '../../src/components/home/BannerCupon';

describe('components/home/BannerCupon', () => {
  it('muestra el cupón durante septiembre', () => {
    render(<BannerCupon fecha={new Date(2026, 8, 15)} />);
    expect(screen.queryByText('SEPTIEMBRE10')).not.toBeNull();
  });

  it('no renderiza nada fuera de septiembre', () => {
    const { container } = render(<BannerCupon fecha={new Date(2026, 9, 23)} />);
    expect(container.firstChild).toBeNull();
  });
});