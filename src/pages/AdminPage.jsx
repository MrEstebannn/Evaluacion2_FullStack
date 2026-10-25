import { useState } from 'react';
import AdminLayout from '../admin/AdminLayout';
import AdminLogin from '../admin/AdminLogin';
import { CLAVE_SESION_ADMIN } from '../data/catalogo';
import { useTienda } from '../context/TiendaContext';

const leerSesion = () => {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION_ADMIN));
  } catch {
    return null;
  }
};

export default function AdminPage({ onSalirATienda = () => {} }) {
  const { registrarUsuario, notificar } = useTienda();
  const [sesion, setSesion] = useState(leerSesion);

  const ingresar = (cuenta) => {
    registrarUsuario(cuenta.perfil);
    const nueva = { run: cuenta.perfil.run, usuario: cuenta.usuario };
    try {
      sessionStorage.setItem(CLAVE_SESION_ADMIN, JSON.stringify(nueva));
    } catch {}
    setSesion(nueva);
    notificar('Sesión Iniciada');
  };

  const cerrarSesion = () => {
    try {
      sessionStorage.removeItem(CLAVE_SESION_ADMIN);
    } catch {}
    setSesion(null);
    notificar('Sesión cerrada.', 'secondary');
    onSalirATienda();
  };

  if (!sesion) return <AdminLogin onIngresar={ingresar} onVolver={onSalirATienda} />;

  return <AdminLayout runSesion={sesion.run} onSalirATienda={onSalirATienda} onCerrarSesion={cerrarSesion} />;
}
