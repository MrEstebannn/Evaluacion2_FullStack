import { render, screen, fireEvent } from '@testing-library/react';
import Campo from '../../src/components/common/Campo';

// Pruebas de RENDERIZADO CONDICIONAL y PROPS del campo reutilizable.
describe('components/common/Campo', () => {
  it('renderiza la etiqueta asociada al input', () => {
    render(<Campo id="nombre" name="nombre" label="Nombre" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Nombre').tagName).toBe('INPUT');
  });

  it('marca el campo como inválido y muestra el mensaje cuando error=true', () => {
    render(<Campo id="c" label="Correo" value="" onChange={() => {}} error feedback="Correo requerido" />);
    expect(screen.getByLabelText('Correo')).toHaveClass('is-invalid');
    expect(screen.queryByText('Correo requerido')).not.toBeNull();
  });

  it('marca el campo como válido cuando validado=true', () => {
    render(<Campo id="c" label="Correo" value="a" onChange={() => {}} validado />);
    expect(screen.getByLabelText('Correo')).toHaveClass('is-valid');
  });

  it('no muestra mensaje de error si no se entrega feedback', () => {
    const { container } = render(<Campo id="c" label="Correo" value="" onChange={() => {}} />);
    expect(container.querySelector('.invalid-feedback')).toBeNull();
  });

  it('renderiza un select con sus opciones hijas', () => {
    render(
      <Campo id="r" as="select" label="Región" value="" onChange={() => {}}>
        <option value="">Seleccione</option>
        <option value="RM">Metropolitana</option>
      </Campo>
    );
    const select = screen.getByLabelText('Región');
    expect(select).toHaveClass('form-select');
    expect(select.options.length).toBe(2);
  });

  it('dispara onChange cuando el usuario escribe (evento)', () => {
    const onChange = jasmine.createSpy('onChange');
    render(<Campo id="n" label="Nombre" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});