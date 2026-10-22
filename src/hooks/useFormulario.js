import { useState } from 'react';

/**
 * Maneja el estado de un formulario controlado + validación al enviar.
 * - valores: objeto con el valor de cada campo
 * - errores: objeto con SOLO los campos inválidos (lo entrega la función validar)
 * - enviado: true después del primer intento de envío (para pintar is-valid / is-invalid)
 */
export function useFormulario(valoresIniciales, validar) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
  };

  const cambiar = (cambios) => setValores((prev) => ({ ...prev, ...cambios }));

  const enviar = (alExito) => (e) => {
    e.preventDefault();
    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);
    setEnviado(true);
    if (Object.keys(nuevosErrores).length === 0) alExito(valores);
  };

  const reiniciar = () => {
    setValores(valoresIniciales);
    setErrores({});
    setEnviado(false);
  };

  return { valores, errores, enviado, onChange, cambiar, enviar, reiniciar };
}
