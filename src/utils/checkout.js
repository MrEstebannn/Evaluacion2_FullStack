import { correoValido } from './validaciones';
import { REGIONES_Y_COMUNAS } from '../data/catalogo';

export function datosIniciales(usuario) {
  return {
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    calle: usuario?.direccion ?? '',
    depto: '',
    region: usuario?.region ?? REGIONES_Y_COMUNAS[0].region,
    comuna: usuario?.comuna ?? '',
    indicaciones: '',
  };
}

export function validarCheckout({ nombre, apellidos, correo, calle, depto = '', region, comuna, indicaciones = '' }) {
  const errores = {};
  if (!nombre.trim() || nombre.length > 50) errores.nombre = true;
  if (!apellidos.trim() || apellidos.length > 100) errores.apellidos = true;
  if (!correoValido(correo)) errores.correo = true;
  if (!calle.trim() || calle.length > 300) errores.calle = true;
  if (depto.length > 20) errores.depto = true;
  if (!region) errores.region = true;
  if (!comuna) errores.comuna = true;
  if (indicaciones.length > 300) errores.indicaciones = true;
  return errores;
}

export function clienteDeOrden(usuario, datos = datosIniciales(usuario)) {
  const entrega = {
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    correo: datos.correo.trim(),
    calle: datos.calle.trim(),
    depto: datos.depto.trim(),
    region: datos.region,
    comuna: datos.comuna,
    indicaciones: datos.indicaciones.trim(),
  };

  if (usuario) {
    return { run: usuario.run, nombre: `${usuario.nombre} ${usuario.apellidos ?? ''}`.trim(), correo: usuario.correo, entrega };
  }
  return {
    run: '—',
    nombre: `${entrega.nombre} ${entrega.apellidos}`.trim() || 'Cliente web',
    correo: entrega.correo || 'sin-sesion@hype.cl',
    entrega,
  };
}