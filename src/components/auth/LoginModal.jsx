import Modal from '../common/Modal';
import Campo from '../common/Campo';
import { useFormulario } from '../../hooks/useFormulario';
import { validarLogin } from '../../utils/validaciones';

const INICIAL = { correo: '', password: '' };

function FormularioLogin({ onExito }) {
  const { valores, errores, enviado, onChange, enviar } = useFormulario(INICIAL, validarLogin);
  const estado = (campo) => ({ error: Boolean(errores[campo]), validado: enviado && !errores[campo] });

  return (
    <form onSubmit={enviar(onExito)} noValidate>
      <Campo id="loginCorreo" name="correo" type="email" label="Correo Electrónico" maxLength={100} placeholder="usuario@gmail.com"
        value={valores.correo} onChange={onChange} feedback="Correo requerido (@gmail, @hotmail, @yahoo, @duocuc)." {...estado('correo')} />
      <Campo id="loginPass" name="password" type="password" label="Contraseña" maxLength={10}
        value={valores.password} onChange={onChange} feedback="La contraseña debe tener entre 4 y 10 caracteres." {...estado('password')} />
      <button type="submit" className="btn btn-hype text-white w-100 fw-bold">Ingresar</button>
    </form>
  );
}

export default function LoginModal({ abierto, onCerrar, onLoginExitoso }) {
  return (
    <Modal abierto={abierto} titulo="Iniciar Sesión" onCerrar={onCerrar}>
      <FormularioLogin onExito={onLoginExitoso} />
    </Modal>
  );
}
