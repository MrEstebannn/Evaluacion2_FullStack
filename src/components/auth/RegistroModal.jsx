import { useState } from 'react';
import Modal from '../common/Modal';
import Campo from '../common/Campo';
import { useFormulario } from '../../hooks/useFormulario';
import { validarRegistro } from '../../utils/validaciones';
import { REGIONES_Y_COMUNAS, TIPOS_USUARIO } from '../../data/catalogo';

const INICIAL = {
  run: '', nombre: '', apellidos: '', correo: '', password: '', passwordConfirm: '',
  fechaNacimiento: '', tipo: 'Cliente', region: '', comuna: '', direccion: '',
};

function FormularioRegistro({ onRegistrar }) {
  const { valores, errores, enviado, onChange, cambiar, enviar } = useFormulario(INICIAL, validarRegistro);
  const [errorServidor, setErrorServidor] = useState('');
  const estado = (campo) => ({ error: Boolean(errores[campo]), validado: enviado && !errores[campo] });

  // Las comunas dependen de la región elegida (valor derivado, no necesita estado propio)
  const comunas = REGIONES_Y_COMUNAS.find((r) => r.region === valores.region)?.comunas ?? [];

  const cambiarRegion = (e) => cambiar({ region: e.target.value, comuna: '' });

  const alExito = (v) => {
    const resultado = onRegistrar({
      run: v.run.replace(/[.\-]/g, ''),
      nombre: v.nombre.trim(),
      apellidos: v.apellidos.trim(),
      correo: v.correo.trim(),
      tipo: v.tipo,
      region: v.region,
      comuna: v.comuna,
      direccion: v.direccion.trim(),
      fechaNacimiento: v.fechaNacimiento,
    });
    if (!resultado.ok) setErrorServidor(resultado.error);
  };

  return (
    <form onSubmit={enviar(alExito)} noValidate>
      {errorServidor && <div className="alert alert-danger">{errorServidor}</div>}
      <div className="row g-3">
        <Campo claseContenedor="col-md-6" id="regRun" name="run" label="RUN (9 dígitos sin puntos ni guión)" placeholder="19011022K" maxLength={9}
          value={valores.run} onChange={onChange} feedback="RUN debe tener exactamente 9 dígitos." {...estado('run')} />
        <Campo claseContenedor="col-md-6" id="regNombre" name="nombre" label="Nombre" maxLength={50}
          value={valores.nombre} onChange={onChange} feedback="Nombre requerido (máx 50 caracteres y máx 3 espacios)." {...estado('nombre')} />
        <Campo claseContenedor="col-md-6" id="regApellidos" name="apellidos" label="Apellidos" maxLength={100}
          value={valores.apellidos} onChange={onChange} feedback="Apellidos requeridos (máx 100 caracteres y máx 2 espacios)." {...estado('apellidos')} />
        <Campo claseContenedor="col-md-6" id="regCorreo" name="correo" type="email" label="Correo Electrónico" maxLength={100} placeholder="nombre@gmail.com"
          value={valores.correo} onChange={onChange} feedback="Correo válido requerido (@gmail, @hotmail, @yahoo, @duocuc)." {...estado('correo')} />
        <Campo claseContenedor="col-md-6" id="regPass" name="password" type="password" label="Contraseña" maxLength={10}
          value={valores.password} onChange={onChange} feedback="Contraseña requerida (4 a 10 caracteres)." {...estado('password')} />
        <Campo claseContenedor="col-md-6" id="regPassConfirm" name="passwordConfirm" type="password" label="Confirmar Contraseña"
          value={valores.passwordConfirm} onChange={onChange} feedback="Las contraseñas no coinciden." {...estado('passwordConfirm')} />
        <Campo claseContenedor="col-md-6" id="regFecha" name="fechaNacimiento" type="date" label="Fecha de Nacimiento (Opcional)"
          value={valores.fechaNacimiento} onChange={onChange} />
        <Campo claseContenedor="col-md-6" id="regTipo" name="tipo" as="select" label="Tipo de Usuario" value={valores.tipo} onChange={onChange}>
          {TIPOS_USUARIO.map((t) => <option key={t} value={t}>{t}</option>)}
        </Campo>
        <Campo claseContenedor="col-md-6" id="regRegion" name="region" as="select" label="Región" value={valores.region} onChange={cambiarRegion}
          feedback="Selecciona una región." {...estado('region')}>
          <option value="">Seleccione una región</option>
          {REGIONES_Y_COMUNAS.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
        </Campo>
        <Campo claseContenedor="col-md-6" id="regComuna" name="comuna" as="select" label="Comuna" value={valores.comuna} onChange={onChange}
          disabled={!valores.region} feedback="Selecciona una comuna." {...estado('comuna')}>
          <option value="">Seleccione una comuna</option>
          {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
        </Campo>
        <Campo claseContenedor="col-12" id="regDireccion" name="direccion" label="Dirección" maxLength={300}
          value={valores.direccion} onChange={onChange} feedback="Dirección requerida (máx 300 caracteres)." {...estado('direccion')} />
      </div>
      <button type="submit" className="btn btn-hype text-white w-100 fw-bold mt-4">Registrar Usuario</button>
    </form>
  );
}

export default function RegistroModal({ abierto, onCerrar, onRegistrar }) {
  return (
    <Modal abierto={abierto} titulo="Registro de Usuario" onCerrar={onCerrar} tamano="modal-lg">
      <FormularioRegistro onRegistrar={onRegistrar} />
    </Modal>
  );
}
