import { useEffect, useState } from 'react';
import { CUENTAS_ADMIN } from '../data/catalogo';
import { useFormulario } from '../hooks/useFormulario';
import Campo from '../components/common/Campo';
import { iniciales } from './components/Topbar';

const validar = (v) => ({
  ...(v.usuario.trim() ? {} : { usuario: true }),
  ...(v.password ? {} : { password: true }),
});

export default function AdminLogin({ onIngresar, onVolver }) {
  const { valores, errores, enviado, onChange, cambiar, enviar } = useFormulario({ usuario: '', password: '' }, validar);
  const [credencialesInvalidas, setCredencialesInvalidas] = useState(false);

  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => document.body.classList.remove('admin-mode');
  }, []);

  const intentar = (v) => {
    const cuenta = CUENTAS_ADMIN.find((c) => c.usuario.toLowerCase() === v.usuario.trim().toLowerCase() && c.password === v.password);
    if (cuenta) onIngresar(cuenta);
    else setCredencialesInvalidas(true);
  };

  const usarCuenta = (cuenta) => {
    cambiar({ usuario: cuenta.usuario, password: cuenta.password });
    setCredencialesInvalidas(false);
  };

  return (
    <div className="admin-login">
      <div className="card admin-card admin-login-card">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <img src="/img/logo-pagina.png" alt="Hype Academic" width="64" height="64" className="rounded-3 mb-3" />
            <h1 className="h4 fw-bold mb-1">Panel de administración</h1>
            <p className="text-muted mb-0">Inicia sesión para continuar</p>
          </div>

          {credencialesInvalidas && <div className="alert alert-danger py-2">Usuario o contraseña incorrectos.</div>}

          <form onSubmit={enviar(intentar)} noValidate>
            <Campo id="adminUsuario" name="usuario" label="Usuario" autoComplete="username" value={valores.usuario}
              onChange={(e) => { onChange(e); setCredencialesInvalidas(false); }} feedback="Ingresa tu usuario."
              error={Boolean(errores.usuario)} validado={enviado && !errores.usuario && !credencialesInvalidas} />
            <Campo id="adminPassword" name="password" type="password" label="Contraseña" autoComplete="current-password" value={valores.password}
              onChange={(e) => { onChange(e); setCredencialesInvalidas(false); }} feedback="Ingresa tu contraseña."
              error={Boolean(errores.password)} validado={enviado && !errores.password && !credencialesInvalidas} />
            <button type="submit" className="btn btn-hype text-white w-100 fw-bold py-2">Iniciar sesión</button>
          </form>

          <div className="d-flex align-items-center gap-2 my-4 text-muted small">
            <hr className="flex-grow-1 m-0" />Usuarios de prueba<hr className="flex-grow-1 m-0" />
          </div>

          <div className="list-group">
            {CUENTAS_ADMIN.map((c) => (
              <button key={c.usuario} type="button" className="list-group-item list-group-item-action d-flex align-items-center gap-3 rounded-3" onClick={() => usarCuenta(c)}>
                <span className="avatar-iniciales">{iniciales(c.perfil)}</span>
                <span className="text-start">
                  <span className="d-block fw-semibold">{c.usuario}</span>
                  <small className="text-muted">{c.perfil.tipo} · toca para rellenar los datos</small>
                </span>
              </button>
            ))}
          </div>

          <div className="text-center mt-4">
            <button type="button" className="btn btn-link text-decoration-none" onClick={onVolver}>
              <i className="bi bi-arrow-left me-1" />Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
