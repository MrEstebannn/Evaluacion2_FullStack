// Funciones de validación puras (sin React): fáciles de probar con pruebas unitarias.
// Cada validador devuelve un objeto con SOLO los campos inválidos, p. ej. { correo: true }.

const DOMINIOS_VALIDOS = ['@gmail.com', '@hotmail.com', '@yahoo.com', '@duocuc.cl', '@duoc.cl', '@profesor.duoc.cl'];

export const contarEspacios = (texto) => (texto.match(/ /g) || []).length;

export function correoValido(correo) {
  const valor = correo.trim().toLowerCase();
  return valor.length > 0 && valor.length <= 100 && DOMINIOS_VALIDOS.some((d) => valor.endsWith(d));
}

export function validarContacto({ nombre, correo, comentario }) {
  const errores = {};
  if (!nombre.trim() || nombre.length > 100) errores.nombre = true;
  if (!correoValido(correo)) errores.correo = true;
  if (!comentario.trim() || comentario.length > 500) errores.comentario = true;
  return errores;
}

export function validarLogin({ correo, password }) {
  const errores = {};
  if (!correoValido(correo)) errores.correo = true;
  if (!password.trim() || password.length < 4 || password.length > 10) errores.password = true;
  return errores;
}

export function validarRegistro(v) {
  const errores = {};
  const run = v.run.replace(/[.\-]/g, '');
  if (run.length !== 9) errores.run = true;
  if (!v.nombre.trim() || v.nombre.length > 50 || contarEspacios(v.nombre) > 3) errores.nombre = true;
  if (!v.apellidos.trim() || v.apellidos.length > 100 || contarEspacios(v.apellidos) > 2) errores.apellidos = true;
  if (!correoValido(v.correo)) errores.correo = true;
  if (!v.password.trim() || v.password.length < 4 || v.password.length > 10) errores.password = true;
  if (!v.passwordConfirm || v.passwordConfirm !== v.password) errores.passwordConfirm = true;
  if (!v.region) errores.region = true;
  if (!v.comuna) errores.comuna = true;
  if (!v.direccion.trim() || v.direccion.length > 300) errores.direccion = true;
  return errores;
}

export function validarTarjeta({ titular, numero, expiracion, cvv }) {
  const errores = {};
  if (!titular.trim()) errores.titular = true;
  if (!/^\d{15,16}$/.test(numero.replace(/\s/g, ''))) errores.numero = true;
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiracion.trim())) errores.expiracion = true;
  if (!/^\d{3,4}$/.test(cvv)) errores.cvv = true;
  return errores;
}

export function validarProducto({ codigo, nombre, categoria, precio, stock }) {
  const errores = {};
  if (codigo.trim().length < 3) errores.codigo = true;
  if (!nombre.trim() || nombre.length > 100) errores.nombre = true;
  if (!categoria) errores.categoria = true;
  if (precio === '' || Number.isNaN(parseFloat(precio)) || parseFloat(precio) < 0) errores.precio = true;
  if (stock === '' || Number.isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0) errores.stock = true;
  return errores;
}
