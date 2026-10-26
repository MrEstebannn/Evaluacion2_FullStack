import { correoValido } from './validaciones';
import { OPCIONES_ENTREGA, REGIONES_Y_COMUNAS } from '../data/catalogo';

export function opcionDeEntrega(id) {
  return OPCIONES_ENTREGA.find((opcion) => opcion.id === id) ?? OPCIONES_ENTREGA[0];
}

export function resumenDeCompra({ items = [], descuento = 0, opcionEntrega } = {}) {
  const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const descuentoAplicado = Math.min(descuento, subtotal);
  const envio = opcionDeEntrega(opcionEntrega).precio;

  return {
    subtotal,
    descuento: descuentoAplicado,
    envio,
    total: Math.max(subtotal - descuento, 0) + envio,
  };
}

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
    opcionEntrega: OPCIONES_ENTREGA[0].id,
  };
}

export function validarCheckout({
  nombre = '',
  apellidos = '',
  correo = '',
  calle = '',
  depto = '',
  region = '',
  comuna = '',
  indicaciones = '',
  opcionEntrega = OPCIONES_ENTREGA[0].id,
}) {
  const errores = {};

  if (!nombre.trim() || nombre.length > 50) errores.nombre = true;
  if (!apellidos.trim() || apellidos.length > 100) errores.apellidos = true;
  if (!correoValido(correo)) errores.correo = true;
  if (!OPCIONES_ENTREGA.some((opcion) => opcion.id === opcionEntrega)) {
    errores.opcionEntrega = true;
  }

  if (opcionEntrega !== 'retiro') {
    if (!calle.trim() || calle.length > 300) errores.calle = true;
    if (!region) errores.region = true;
    if (!comuna) errores.comuna = true;
  }

  if (depto.length > 20) errores.depto = true;
  if (indicaciones.length > 300) errores.indicaciones = true;
  return errores;
}

export function clienteDeOrden(usuario, datos = datosIniciales(usuario)) {
  const retiro = datos.opcionEntrega === 'retiro';
  const entrega = {
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    correo: datos.correo.trim(),
    calle: retiro ? '' : datos.calle.trim(),
    depto: retiro ? '' : datos.depto.trim(),
    region: retiro ? '' : datos.region,
    comuna: retiro ? '' : datos.comuna,
    indicaciones: retiro ? '' : datos.indicaciones.trim(),
    opcionEntrega: datos.opcionEntrega,
  };

  if (usuario) {
    return {
      run: usuario.run,
      nombre: (usuario.nombre + ' ' + (usuario.apellidos ?? '')).trim(),
      correo: usuario.correo,
      entrega,
    };
  }

  return {
    run: '—',
    nombre: (entrega.nombre + ' ' + entrega.apellidos).trim() || 'Cliente web',
    correo: entrega.correo || 'sin-sesion@hype.cl',
    entrega,
  };
}