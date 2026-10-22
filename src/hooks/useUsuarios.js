import { useState } from 'react';
import { usuariosDB } from '../data/db';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState(() => usuariosDB.listar());

  const registrarUsuario = (datos) => {
    const resultado = usuariosDB.crear(datos);
    if (resultado.ok) setUsuarios(usuariosDB.listar());
    return resultado;
  };

  const actualizarUsuario = (run, cambios) => {
    usuariosDB.actualizar(run, cambios);
    setUsuarios(usuariosDB.listar());
  };

  const eliminarUsuario = (run) => {
    usuariosDB.eliminar(run);
    setUsuarios(usuariosDB.listar());
  };

  return { usuarios, registrarUsuario, actualizarUsuario, eliminarUsuario };
}
