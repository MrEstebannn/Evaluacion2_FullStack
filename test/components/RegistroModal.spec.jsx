import { render, screen, fireEvent } from '@testing-library/react';
import RegistroModal from '../../src/components/auth/RegistroModal';
import { REGIONES_Y_COMUNAS } from '../../src/data/catalogo';

describe('components/auth/RegistroModal', () => {
  const REGION = REGIONES_Y_COMUNAS[0].region;
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  const llenarFormularioValido = () => {
    escribir('RUN (9 dígitos sin puntos ni guión)', '19011022K');
    escribir('Nombre', 'Juan');
    escribir('Apellidos', 'Pérez Soto');
    escribir('Correo Electrónico', 'juan@duocuc.cl');
    escribir('Contraseña', 'abcd');
    escribir('Confirmar Contraseña', 'abcd');
    escribir('Región', REGION);
    escribir('Comuna', 'Santiago');
    escribir('Dirección', 'Av. Siempre Viva 742');
  };

  it('la comuna está deshabilitada hasta elegir una región', () => {
    render(<RegistroModal abierto onCerrar={() => {}} onRegistrar={() => ({ ok: true })} />);
    expect(screen.getByLabelText('Comuna').disabled).toBeTrue();
  });

  it('al elegir una región carga sus comunas (estado derivado)', () => {
    render(<RegistroModal abierto onCerrar={() => {}} onRegistrar={() => ({ ok: true })} />);
    escribir('Región', REGION);
    const comuna = screen.getByLabelText('Comuna');
    expect(comuna.disabled).toBeFalse();
    expect(comuna.options.length).toBe(REGIONES_Y_COMUNAS[0].comunas.length + 1);
  });

  it('con el formulario vacío muestra errores y no registra', () => {
    const onRegistrar = jasmine.createSpy('onRegistrar');
    render(<RegistroModal abierto onCerrar={() => {}} onRegistrar={onRegistrar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));
    expect(onRegistrar).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Correo Electrónico')).toHaveClass('is-invalid');
  });

  it('con datos válidos llama a onRegistrar con el RUN normalizado y tipo Cliente', () => {
    const onRegistrar = jasmine.createSpy('onRegistrar').and.returnValue({ ok: true });
    render(<RegistroModal abierto onCerrar={() => {}} onRegistrar={onRegistrar} />);
    llenarFormularioValido();
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));
    expect(onRegistrar).toHaveBeenCalledWith(jasmine.objectContaining({ run: '19011022K', nombre: 'Juan', tipo: 'Cliente', comuna: 'Santiago' }));
  });

  it('muestra el error devuelto por la "base de datos" (RUN duplicado)', () => {
    const onRegistrar = jasmine.createSpy('onRegistrar').and.returnValue({ ok: false, error: 'Ya existe un usuario registrado con ese RUN.' });
    render(<RegistroModal abierto onCerrar={() => {}} onRegistrar={onRegistrar} />);
    llenarFormularioValido();
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));
    expect(screen.queryByText('Ya existe un usuario registrado con ese RUN.')).not.toBeNull();
  });
});