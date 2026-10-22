/**
 * Campo de formulario Bootstrap (label + input/select/textarea + mensaje de error).
 * - as: 'input' | 'select' | 'textarea'
 * - error: true si el campo es inválido  -> clase is-invalid
 * - validado: true cuando ya se intentó enviar y no hay error -> clase is-valid
 */
export default function Campo({ id, label, as: Etiqueta = 'input', error = false, validado = false, feedback = '', claseContenedor = 'mb-3', children, ...resto }) {
  const claseBase = Etiqueta === 'select' ? 'form-select' : 'form-control';
  const estado = error ? 'is-invalid' : validado ? 'is-valid' : '';

  return (
    <div className={claseContenedor}>
      <label htmlFor={id} className="form-label fw-semibold">{label}</label>
      <Etiqueta id={id} className={`${claseBase} ${estado}`} {...resto}>
        {children}
      </Etiqueta>
      {feedback && <div className="invalid-feedback">{feedback}</div>}
    </div>
  );
}
