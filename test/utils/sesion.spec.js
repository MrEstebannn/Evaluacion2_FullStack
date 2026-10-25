import { autenticar, borrarSesionCliente, CLAVE_SESION_CLIENTE, guardarSesionCliente, leerSesionCliente } from '../../src/utils/sesion';

describe('utils/sesion', () => {
  const USUARIOS = [
    { run: '111111111', nombre: 'Ana', correo: 'Ana@Gmail.com', password: 'abcd' },
    { run: '222222222', nombre: 'Luis', correo: 'luis@gmail.com' }, // cuenta antigua, sin contraseña guardada
  ];

  beforeEach(() => sessionStorage.clear());
  afterAll(() => sessionStorage.clear());

  describe('autenticar', () => {
    it('acepta correo (sin importar mayúsculas ni espacios) y contraseña correctos', () => {
      const resultado = autenticar(USUARIOS, '  ana@gmail.COM ', 'abcd');
      expect(resultado.ok).toBeTrue();
      expect(resultado.usuario.run).toBe('111111111');
    });

    it('rechaza una contraseña incorrecta', () => {
      const resultado = autenticar(USUARIOS, 'ana@gmail.com', 'zzzz');
      expect(resultado.ok).toBeFalse();
      expect(resultado.error).toBe('Contraseña incorrecta.');
    });

    it('rechaza un correo que no está registrado', () => {
      const resultado = autenticar(USUARIOS, 'nadie@gmail.com', 'abcd');
      expect(resultado.ok).toBeFalse();
      expect(resultado.error).toBe('No existe una cuenta con ese correo.');
    });

    it('avisa cuando la cuenta existe pero no tiene contraseña registrada', () => {
      const resultado = autenticar(USUARIOS, 'luis@gmail.com', 'abcd');
      expect(resultado.ok).toBeFalse();
      expect(resultado.error).toContain('no tiene contraseña');
    });
  });

  describe('sesión en sessionStorage', () => {
    it('sin sesión guardada devuelve null', () => {
      expect(leerSesionCliente()).toBeNull();
    });

    it('guarda y lee el RUN del usuario', () => {
      guardarSesionCliente('111111111');
      expect(leerSesionCliente()).toBe('111111111');
    });

    it('borrarSesionCliente elimina la sesión', () => {
      guardarSesionCliente('111111111');
      borrarSesionCliente();
      expect(leerSesionCliente()).toBeNull();
    });

    it('ignora datos corruptos en vez de fallar', () => {
      sessionStorage.setItem(CLAVE_SESION_CLIENTE, '{{no-es-json');
      expect(leerSesionCliente()).toBeNull();
    });
  });
});