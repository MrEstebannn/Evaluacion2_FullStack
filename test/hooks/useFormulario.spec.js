import { renderHook, act } from '@testing-library/react';
import { useFormulario } from '../../src/hooks/useFormulario';

describe('hooks/useFormulario', () => {
  const validar = (v) => (v.nombre.trim() ? {} : { nombre: true });
  const evento = () => ({ preventDefault: jasmine.createSpy('preventDefault') });

  it('parte con los valores iniciales y sin errores', () => {
    const { result } = renderHook(() => useFormulario({ nombre: '' }, validar));
    expect(result.current.valores).toEqual({ nombre: '' });
    expect(result.current.errores).toEqual({});
    expect(result.current.enviado).toBeFalse();
  });

  it('onChange actualiza el valor del campo indicado', () => {
    const { result } = renderHook(() => useFormulario({ nombre: '' }, validar));
    act(() => result.current.onChange({ target: { name: 'nombre', value: 'Ana' } }));
    expect(result.current.valores.nombre).toBe('Ana');
  });

  it('enviar con datos inválidos registra errores y NO ejecuta la acción de éxito', () => {
    const alExito = jasmine.createSpy('alExito');
    const e = evento();
    const { result } = renderHook(() => useFormulario({ nombre: '' }, validar));
    act(() => result.current.enviar(alExito)(e));
    expect(e.preventDefault).toHaveBeenCalled();
    expect(alExito).not.toHaveBeenCalled();
    expect(result.current.errores).toEqual({ nombre: true });
    expect(result.current.enviado).toBeTrue();
  });

  it('enviar con datos válidos ejecuta la acción de éxito con los valores', () => {
    const alExito = jasmine.createSpy('alExito');
    const { result } = renderHook(() => useFormulario({ nombre: '' }, validar));
    act(() => result.current.onChange({ target: { name: 'nombre', value: 'Ana' } }));
    act(() => result.current.enviar(alExito)(evento()));
    expect(alExito).toHaveBeenCalledWith({ nombre: 'Ana' });
  });

  it('reiniciar vuelve al estado inicial', () => {
    const { result } = renderHook(() => useFormulario({ nombre: '' }, validar));
    act(() => result.current.onChange({ target: { name: 'nombre', value: 'Ana' } }));
    act(() => result.current.reiniciar());
    expect(result.current.valores).toEqual({ nombre: '' });
    expect(result.current.enviado).toBeFalse();
  });
});