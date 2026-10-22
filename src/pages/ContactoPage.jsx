import { useState } from 'react';
import Campo from '../components/common/Campo';
import { useFormulario } from '../hooks/useFormulario';
import { validarContacto } from '../utils/validaciones';

const INICIAL = { nombre: '', correo: '', comentario: '' };

export default function ContactoPage() {
  const { valores, errores, enviado, onChange, enviar, reiniciar } = useFormulario(INICIAL, validarContacto);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const estado = (campo) => ({ error: Boolean(errores[campo]), validado: enviado && !errores[campo] });

  const alExito = () => {
    setMensajeEnviado(true);
    reiniciar();
  };

  return (
    <div className="container my-5 pt-4" id="contacto-form-seccion">
      <div className="card shadow-sm border-0 p-4 p-md-5">
        <h2 className="fw-bold text-center mb-2">Formulario de Contacto</h2>
        <p className="text-center text-muted mb-4">Déjanos tus mensajes o dudas y te responderemos a la brevedad.</p>

        <form onSubmit={enviar(alExito)} noValidate>
          <Campo id="contactoNombre" name="nombre" label="Nombre Completo" maxLength={100} value={valores.nombre} onChange={onChange}
            feedback="El nombre es requerido (máximo 100 caracteres)." {...estado('nombre')} />
          <Campo id="contactoCorreo" name="correo" type="email" label="Correo Electrónico" maxLength={100} placeholder="ejemplo@gmail.com"
            value={valores.correo} onChange={onChange} feedback="Ingresa un correo válido (@gmail, @hotmail, @yahoo, @duocuc)." {...estado('correo')} />
          <Campo id="contactoComentario" name="comentario" as="textarea" rows={4} maxLength={500} label="Comentario"
            value={valores.comentario} onChange={onChange} feedback="El comentario es requerido (máximo 500 caracteres)." {...estado('comentario')} />
          <button type="submit" className="btn btn-hype text-white fw-bold px-4">Enviar Mensaje</button>
        </form>

        {mensajeEnviado && (
          <div className="mt-3">
            <div className="alert alert-success">¡Mensaje enviado con éxito! Nos contactaremos contigo a la brevedad.</div>
          </div>
        )}
      </div>
    </div>
  );
}
