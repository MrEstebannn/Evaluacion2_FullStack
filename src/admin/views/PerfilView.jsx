import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { useFormulario } from '../../hooks/useFormulario';
import { validarPerfil } from '../adminValidaciones';
import Campo from '../../components/common/Campo';
import PageHeader from '../components/PageHeader';
import { iniciales } from '../components/Topbar';

function FormularioPerfil({ admin }) {
  const { actualizarUsuario, notificar } = useTienda();
  const { valores, errores, enviado, onChange, enviar } = useFormulario(
    { nombre: admin.nombre, apellidos: admin.apellidos, correo: admin.correo },
    validarPerfil
  );
  const estado = (campo) => ({ error: Boolean(errores[campo]), validado: enviado && !errores[campo] });

  const guardar = (v) => {
    actualizarUsuario(admin.run, { nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), correo: v.correo.trim() });
    notificar('Perfil actualizado.');
  };

  return (
    <form onSubmit={enviar(guardar)} noValidate>
      <div className="row g-3">
        <div className="col-md-6"><Campo id="perfNombre" name="nombre" label="Nombre" maxLength={50} value={valores.nombre} onChange={onChange} feedback="Nombre requerido." {...estado('nombre')} /></div>
        <div className="col-md-6"><Campo id="perfApellidos" name="apellidos" label="Apellidos" maxLength={100} value={valores.apellidos} onChange={onChange} feedback="Apellidos requeridos." {...estado('apellidos')} /></div>
        <div className="col-12"><Campo id="perfCorreo" name="correo" type="email" label="Correo electrónico" maxLength={100} value={valores.correo} onChange={onChange} feedback="Correo válido requerido (@gmail, @hotmail, @yahoo, @duocuc)." {...estado('correo')} /></div>
      </div>
      <button type="submit" className="btn btn-primary fw-bold">Guardar cambios</button>
    </form>
  );
}

export default function PerfilView() {
  const { admin } = useAdminNav();

  return (
    <>
      <PageHeader titulo="Mi perfil" subtitulo="Datos de la cuenta de administración." />
      {!admin ? (
        <div className="alert alert-warning">No hay ningún usuario de tipo Administrador registrado.</div>
      ) : (
        <div className="row g-3">
          <div className="col-lg-4">
            <div className="card admin-card h-100"><div className="card-body text-center">
              <span className="avatar-iniciales avatar-grande mx-auto mb-3">{iniciales(admin)}</span>
              <h5 className="fw-bold mb-0">{admin.nombre} {admin.apellidos}</h5>
              <span className="badge text-bg-danger mb-3">{admin.tipo}</span>
              <p className="small text-muted mb-0">RUN {admin.run}<br />{admin.comuna}, {admin.region}</p>
            </div></div>
          </div>
          <div className="col-lg-8">
            <div className="card admin-card"><div className="card-body p-4">
              <FormularioPerfil key={admin.run} admin={admin} />
            </div></div>
          </div>
        </div>
      )}
    </>
  );
}
