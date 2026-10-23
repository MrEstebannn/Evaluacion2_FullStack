import { render, screen, fireEvent } from '@testing-library/react';
import ClaseCard from '../../src/components/home/ClaseCard';

describe('components/home/ClaseCard', () => {
  const CLASE = { id: 3, estilo: 'Hip-Hop', nombre: 'Hip-Hop Intermedio', imagen: '/img/foto-hiphop.jpg', duracion: 60, cupos: 20, precio: 22000, color: '#7e22ce' };

  it('renderiza los datos de la clase recibidos por props', () => {
    render(<ClaseCard clase={CLASE} onInscribir={() => {}} />);
    expect(screen.queryByText('Hip-Hop')).not.toBeNull();
    expect(screen.queryByText('Hip-Hop Intermedio')).not.toBeNull();
    expect(screen.queryByText('60 min · 20 cupos')).not.toBeNull();
    expect(screen.queryByText('$22.000')).not.toBeNull();
  });

  it('aplica el color de la clase al botón', () => {
    render(<ClaseCard clase={CLASE} onInscribir={() => {}} />);
    expect(screen.getByRole('button', { name: 'Inscribirme' }).style.backgroundColor).toBe('rgb(126, 34, 206)');
  });

  it('al presionar "Inscribirme" entrega la clase al padre', () => {
    const onInscribir = jasmine.createSpy('onInscribir');
    render(<ClaseCard clase={CLASE} onInscribir={onInscribir} />);
    fireEvent.click(screen.getByRole('button', { name: 'Inscribirme' }));
    expect(onInscribir).toHaveBeenCalledWith(CLASE);
  });
});