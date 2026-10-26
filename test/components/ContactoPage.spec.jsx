import { render, screen, fireEvent } from '@testing-library/react';
import ContactoPage from '../../src/pages/ContactoPage';

describe('pages/ContactoPage', () => {
  const campo = (etiqueta) => screen.getByLabelText(etiqueta);
  const escribir = (etiqueta, valor) => fireEvent.change(campo(etiqueta), { target: { value: valor } });
  const enviar = () => fireEvent.click(screen.getByRole('button', { name: 'Enviar Mensaje' }));
  const llenarValido = () => {
    escribir('Nombre Completo', 'Ana Soto');
    escribir('Correo Electrónico', 'ana@gmail.com');
    escribir('Comentario', 'Quiero información de las clases.');
  };

  // Renderizado
  it('muestra el formulario con sus tres campos y el botón de envío', () => {
    render(<ContactoPage />);
    expect(screen.getByRole('heading', { name: 'Formulario de Contacto' })).not.toBeNull();
    expect(campo('Nombre Completo')).not.toBeNull();
    expect(campo('Correo Electrónico').type).toBe('email');
    expect(campo('Comentario').tagName).toBe('TEXTAREA');
    expect(screen.queryByRole('button', { name: 'Enviar Mensaje' })).not.toBeNull();
  });

  it('no muestra el mensaje de éxito antes de enviar', () => {
    render(<ContactoPage />);
    expect(screen.queryByText(/Mensaje enviado con éxito/)).toBeNull();
  });

  // Estado
  it('los campos reflejan lo que escribe el usuario', () => {
    render(<ContactoPage />);
    escribir('Nombre Completo', 'Luis');
    escribir('Comentario', 'Hola');
    expect(campo('Nombre Completo').value).toBe('Luis');
    expect(campo('Comentario').value).toBe('Hola');
  });

  it('enviar vacío marca los tres campos como inválidos y no muestra éxito', () => {
    render(<ContactoPage />);
    enviar();
    ['Nombre Completo', 'Correo Electrónico', 'Comentario'].forEach((e) => expect(campo(e).classList.contains('is-invalid')).toBeTrue());
    expect(screen.queryByText(/Mensaje enviado con éxito/)).toBeNull();
  });

  it('un correo de dominio no permitido invalida solo el correo', () => {
    render(<ContactoPage />);
    llenarValido();
    escribir('Correo Electrónico', 'ana@otrodominio.com');
    enviar();
    expect(campo('Correo Electrónico').classList.contains('is-invalid')).toBeTrue();
    expect(campo('Nombre Completo').classList.contains('is-invalid')).toBeFalse();
    expect(screen.queryByText(/Mensaje enviado con éxito/)).toBeNull();
  });

  // Evento de envío correcto
  it('con datos válidos muestra el mensaje de éxito y limpia el formulario', () => {
    render(<ContactoPage />);
    llenarValido();
    enviar();
    expect(screen.queryByText(/Mensaje enviado con éxito/)).not.toBeNull();
    expect(campo('Nombre Completo').value).toBe('');
    expect(campo('Correo Electrónico').value).toBe('');
    expect(campo('Comentario').value).toBe('');
  });
});