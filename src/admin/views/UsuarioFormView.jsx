import { useState } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { useFormulario } from '../../hooks/useFormulario';
import { REGIONES_Y_COMUNAS, TIPOS_USUARIO } from '../../data/catalogo';
import { validarUsuarioAdmin } from '../adminValidaciones';
import Campo from '../../components/common/Campo';
import PageHeader from '../components/PageHeader';

function FormularioUsuario({ usuario }) {
  const { registrarUsuario, actualizarUsuario, notificar } = useTienda();
  const { ir } = useAdminNav();
  const editando = Boolean(usuario);
  const [errorServidor, setErrorServidor] = useState('');

  const { valores, errores, enviado, onChange, cambiar, enviar } = useFormulario(
    {
      run: usuario?.run ?? '', nombre: usuario?.nombre ?? '', apellidos: usuario?.apellidos ?? '', correo: usuario?.correo ?? '',
      tipo: usuario?.tipo ?? 'Cliente', region: usuario?.region ?? '', comuna: usuario?.comuna ?? '',
      direccion: usuario?.direccion ?? '', fechaNacimiento: usuario?.fechaNacimiento ?? '',
    },
    validarUsuarioAdmin
  );
  const estado = (campo) => ({ error: Boolean(errores[campo]), validado: enviado && !errores[campo] });
  const comunas = REGIONES_Y_COMUNAS.find((r) => r.region === valores.region)?.comunas ?? [];

  const guardar = (v) => {
    const datos = {
      run: v.run.replace(/[.\-]/g, ''), nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), correo: v.correo.trim(),
      tipo: v.tipo, region: v.region, comuna: v.comuna, direccion: v.direccion.trim(), fechaNacimiento: v.fechaNacimiento,
    };
    if (editando) {
      actualizarUsuario(usuario.run, datos);
      notificar('Usuario actualizado correctamente.');
    } else {
      const resultado = registrarUsuario(datos);
      if (!resultado.ok) {
        setErrorServidor(resultado.error);
        return;
      }
      notificar('Usuario creado correctamente.');
    }
    ir('usuarios');
  };

  return (
    <form onSubmit={enviar(guardar)} noValidate>
      {errorServidor && <div className="alert alert-danger">{errorServidor}</div>}
      <div className="row g-3">
        <div className="col-md-4">
          <Campo id="usrRun" name="run" label="RUN (9 dígitos)" maxLength={9} placeholder="19011022K" value={valores.run} onChange={onChange} disabled={editando}
            feedback="RUN debe tener exactamente 9 dígitos." {...estado('run')} />
        </div>
        <div className="col-md-4">
          <Campo id="usrNombre" name="nombre" label="Nombre" maxLength={50} value={valores.nombre} onChange={onChange} feedback="Nombre requerido (máx 50 caracteres y máx 3 espacios)." {...estado('nombre')} />
        </div>
        <div className="col-md-4">
          <Campo id="usrApellidos" name="apellidos" label="Apellidos" maxLength={100} value={valores.apellidos} onChange={onChange} feedback="Apellidos requeridos (máx 100 caracteres y máx 2 espacios)." {...estado('apellidos')} />
        </div>
        <div className="col-md-6">
          <Campo id="usrCorreo" name="correo" type="email" label="Correo electrónico" maxLength={100} value={valores.correo} onChange={onChange} feedback="Correo válido requerido (@gmail, @hotmail, @yahoo, @duocuc)." {...estado('correo')} />
        </div>
        <div className="col-md-3">
          <Campo id="usrTipo" name="tipo" as="select" label="Tipo de usuario" value={valores.tipo} onChange={onChange}>
            {TIPOS_USUARIO.map((t) => <option key={t}>{t}</option>)}
          </Campo>
        </div>
        <div className="col-md-3">
          <Campo id="usrFecha" name="fechaNacimiento" type="date" label="Nacimiento (opcional)" value={valores.fechaNacimiento} onChange={onChange} />
        </div>
        <div className="col-md-6">
          <Campo id="usrRegion" name="region" as="select" label="Región" value={valores.region} onChange={(e) => cambiar({ region: e.target.value, comuna: '' })} feedback="Selecciona una región." {...estado('region')}>
            <option value="">Seleccione una región</option>
            {REGIONES_Y_COMUNAS.map((r) => <option key={r.region}>{r.region}</option>)}
          </Campo>
        </div>
        <div className="col-md-6">
          <Campo id="usrComuna" name="comuna" as="select" label="Comuna" value={valores.comuna} onChange={onChange} disabled={!valores.region} feedback="Selecciona una comuna." {...estado('comuna')}>
            <option value="">Seleccione una comuna</option>
            {comunas.map((c) => <option key={c}>{c}</option>)}
          </Campo>
        </div>
        <div className="col-12">
          <Campo id="usrDireccion" name="direccion" label="Dirección" maxLength={300} value={valores.direccion} onChange={onChange} feedback="Dirección requerida (máx 300 caracteres)." {...estado('direccion')} />
        </div>
      </div>
      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-secondary" onClick={() => ir('usuarios')}>Cancelar</button>
        <button type="submit" className="btn btn-primary fw-bold">{editando ? 'Guardar cambios' : 'Crear usuario'}</button>
      </div>
    </form>
  );
}

export default function UsuarioFormView() {
  const { usuarios } = useTienda();
  const { ruta, ir } = useAdminNav();
  const usuario = ruta.run ? usuarios.find((u) => u.run === ruta.run) : null;

  if (ruta.run && !usuario) {
    return <div className="alert alert-warning">No se encontró el usuario. <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => ir('usuarios')}>Volver al listado</button></div>;
  }

  return (
    <>
      <PageHeader titulo={usuario ? 'Editar usuario' : 'Nuevo usuario'} subtitulo={usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Registra una cuenta desde el panel.'} />
      <div className="card admin-card" style={{ maxWidth: 900 }}>
        <div className="card-body p-4">
          <FormularioUsuario key={usuario?.run ?? 'nuevo'} usuario={usuario} />
        </div>
      </div>
    </>
  );
}
