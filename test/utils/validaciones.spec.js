import {
  contarEspacios, correoValido, validarContacto, validarLogin,
  validarRegistro, validarTarjeta, validarProducto,
} from '../../src/utils/validaciones';

describe('utils/validaciones', () => {
  describe('contarEspacios', () => {
    it('cuenta los espacios de un texto', () => {
      expect(contarEspacios('Ana María López')).toBe(2);
    });
    it('devuelve 0 cuando no hay espacios', () => {
      expect(contarEspacios('Juan')).toBe(0);
    });
  });

  describe('correoValido', () => {
    it('acepta dominios permitidos sin importar mayúsculas', () => {
      expect(correoValido('juan@duocuc.cl')).toBeTrue();
      expect(correoValido('MARIA@GMAIL.COM')).toBeTrue();
    });
    it('rechaza dominios no permitidos o vacíos', () => {
      expect(correoValido('juan@otro.com')).toBeFalse();
      expect(correoValido('')).toBeFalse();
    });
    it('rechaza correos de más de 100 caracteres', () => {
      expect(correoValido('a'.repeat(95) + '@gmail.com')).toBeFalse();
    });
  });

  describe('validarLogin', () => {
    it('no devuelve errores con datos válidos', () => {
      expect(validarLogin({ correo: 'maria@hotmail.com', password: '1234' })).toEqual({});
    });
    it('marca solo los campos inválidos', () => {
      expect(validarLogin({ correo: 'x@otro.com', password: 'abc' })).toEqual({ correo: true, password: true });
    });
    it('rechaza contraseñas de más de 10 caracteres', () => {
      expect(validarLogin({ correo: 'maria@hotmail.com', password: 'a'.repeat(11) })).toEqual({ password: true });
    });
  });

  describe('validarRegistro', () => {
    const VALIDO = {
      run: '19.011.022-K', nombre: 'Juan', apellidos: 'Pérez Soto', correo: 'juan@duocuc.cl',
      password: 'abcd', passwordConfirm: 'abcd', region: 'Región Metropolitana de Santiago',
      comuna: 'Santiago', direccion: 'Av. Siempre Viva 742',
    };

    it('acepta un registro completo (el RUN con puntos y guión se normaliza)', () => {
      expect(validarRegistro(VALIDO)).toEqual({});
    });
    it('rechaza un RUN que no tiene 9 caracteres', () => {
      expect(validarRegistro({ ...VALIDO, run: '123' }).run).toBeTrue();
    });
    it('rechaza cuando las contraseñas no coinciden', () => {
      expect(validarRegistro({ ...VALIDO, passwordConfirm: 'otra' }).passwordConfirm).toBeTrue();
    });
    it('rechaza un nombre con más de 3 espacios', () => {
      expect(validarRegistro({ ...VALIDO, nombre: 'a b c d e' }).nombre).toBeTrue();
    });
    it('exige región, comuna y dirección', () => {
      const errores = validarRegistro({ ...VALIDO, region: '', comuna: '', direccion: '  ' });
      expect(errores).toEqual({ region: true, comuna: true, direccion: true });
    });
  });

  describe('validarTarjeta', () => {
    const VALIDA = { titular: 'Juan Pérez', numero: '4111 1111 1111 1111', expiracion: '12/28', cvv: '123' };

    it('acepta una tarjeta válida (ignora los espacios del número)', () => {
      expect(validarTarjeta(VALIDA)).toEqual({});
    });
    it('rechaza número corto, mes inválido y CVV corto', () => {
      const errores = validarTarjeta({ ...VALIDA, numero: '1234', expiracion: '13/28', cvv: '12' });
      expect(errores).toEqual({ numero: true, expiracion: true, cvv: true });
    });
  });

  describe('validarProducto', () => {
    const VALIDO = { codigo: 'PROD-07', nombre: 'Cinta', categoria: 'Accesorios', precio: '1000', stock: '5' };

    it('acepta un producto válido', () => {
      expect(validarProducto(VALIDO)).toEqual({});
    });
    it('rechaza código corto, precio negativo y stock no numérico', () => {
      const errores = validarProducto({ ...VALIDO, codigo: 'ab', precio: '-1', stock: 'abc' });
      expect(errores).toEqual({ codigo: true, precio: true, stock: true });
    });
    it('rechaza precio vacío', () => {
      expect(validarProducto({ ...VALIDO, precio: '' }).precio).toBeTrue();
    });
  });

  describe('validarContacto', () => {
    it('acepta un mensaje válido', () => {
      expect(validarContacto({ nombre: 'Ana', correo: 'ana@yahoo.com', comentario: 'Hola' })).toEqual({});
    });
    it('rechaza comentarios de más de 500 caracteres y nombre vacío', () => {
      const errores = validarContacto({ nombre: ' ', correo: 'ana@yahoo.com', comentario: 'x'.repeat(501) });
      expect(errores).toEqual({ nombre: true, comentario: true });
    });
  });
});