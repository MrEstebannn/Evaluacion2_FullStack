import { contarEspacios, correoValido } from '../utils/validaciones';

export function validarUsuarioAdmin(v) {
  const errores = {};
  if (v.run.replace(/[.\-]/g, '').length !== 9) errores.run = true;
  if (!v.nombre.trim() || v.nombre.length > 50 || contarEspacios(v.nombre) > 3) errores.nombre = true;
  if (!v.apellidos.trim() || v.apellidos.length > 100 || contarEspacios(v.apellidos) > 2) errores.apellidos = true;
  if (!correoValido(v.correo)) errores.correo = true;
  if (!v.region) errores.region = true;
  if (!v.comuna) errores.comuna = true;
  if (!v.direccion.trim() || v.direccion.length > 300) errores.direccion = true;
  return errores;
}

export function validarPerfil(v) {
  const errores = {};
  if (!v.nombre.trim() || v.nombre.length > 50) errores.nombre = true;
  if (!v.apellidos.trim() || v.apellidos.length > 100) errores.apellidos = true;
  if (!correoValido(v.correo)) errores.correo = true;
  return errores;
}

/** Descuento opcional de 0 a 90 %. */
export const descuentoValido = (valor) => valor === '' || (Number(valor) >= 0 && Number(valor) <= 90 && Number.isInteger(Number(valor)));
