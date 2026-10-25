import { useState } from 'react';
import { useTienda } from '../context/TiendaContext';
import { autenticar, borrarSesionCliente, guardarSesionCliente, leerSesionCliente } from '../utils/sesion';

export function useSesionCliente() {
  const { usuarios } = useTienda();
  const [run, setRun] = useState(leerSesionCliente);
  const usuario = run ? usuarios.find((u) => u.run === run) ?? null : null;

  const iniciarSesion = ({ correo, password }) => {
    const resultado = autenticar(usuarios, correo, password);
    if (resultado.ok) {
      guardarSesionCliente(resultado.usuario.run);
      setRun(resultado.usuario.run);
    }
    return resultado;
  };

  const abrirSesion = (runUsuario) => {
    guardarSesionCliente(runUsuario);
    setRun(runUsuario);
  };

  const cerrarSesion = () => {
    borrarSesionCliente();
    setRun(null);
  };

  return { usuario, iniciarSesion, abrirSesion, cerrarSesion };
}