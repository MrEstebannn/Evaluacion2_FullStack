export const CLAVE_SESION_CLIENTE = 'hype_cliente_sesion';

export function leerSesionCliente() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION_CLIENTE))?.run ?? null;
  } catch {
    return null;
  }
}

export function guardarSesionCliente(run) {
  try {
    sessionStorage.setItem(CLAVE_SESION_CLIENTE, JSON.stringify({ run }));
  } catch {}
}

export function borrarSesionCliente() {
  try {
    sessionStorage.removeItem(CLAVE_SESION_CLIENTE);
  } catch {}
}

export function autenticar(usuarios, correo, password) {
  const buscado = correo.trim().toLowerCase();
  const conEseCorreo = usuarios.filter((u) => (u.correo ?? '').trim().toLowerCase() === buscado);

  if (conEseCorreo.length === 0) return { ok: false, error: 'No existe una cuenta con ese correo.' };

  const usuario = conEseCorreo.find((u) => u.password === password);
  if (usuario) return { ok: true, usuario };

  if (conEseCorreo.every((u) => !u.password)) {
    return { ok: false, error: 'Esta cuenta no tiene contraseña registrada. Crea una cuenta nueva con el botón Inscribirse.' };
  }
  return { ok: false, error: 'Contraseña incorrecta.' };
}