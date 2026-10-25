import { clienteDeOrden, datosIniciales, validarCheckout } from '../../src/utils/checkout';
import { REGIONES_Y_COMUNAS } from '../../src/data/catalogo';

describe('utils/checkout', () => {
  const USUARIO = {
    run: '111111111', nombre: 'Ana', apellidos: 'Soto', correo: 'ana@gmail.com',
    region: 'Región Metropolitana de Santiago', comuna: 'Maipú', direccion: 'Los Olmos 123',
  };
  const DATOS = {
    nombre: ' Pedro ', apellidos: 'Hacker', correo: 'pedro@gmail.com', calle: 'Los Crisantemos 45', depto: '603',
    region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos', indicaciones: 'Dejar con el conserje',
  };

  describe('datosIniciales (datos automáticos con sesión)', () => {
    it('con un usuario con sesión, rellena nombre, correo, dirección, región y comuna', () => {
      expect(datosIniciales(USUARIO)).toEqual({
        nombre: 'Ana', apellidos: 'Soto', correo: 'ana@gmail.com', calle: 'Los Olmos 123', depto: '',
        region: 'Región Metropolitana de Santiago', comuna: 'Maipú', indicaciones: '',
      });
    });

    it('sin sesión, deja los campos vacíos y preselecciona la primera región', () => {
      const datos = datosIniciales(null);
      expect(datos.nombre).toBe('');
      expect(datos.calle).toBe('');
      expect(datos.region).toBe(REGIONES_Y_COMUNAS[0].region);
      expect(datos.comuna).toBe('');
    });
  });

  describe('validarCheckout', () => {
    it('acepta datos completos', () => {
      expect(validarCheckout(DATOS)).toEqual({});
    });

    it('marca los obligatorios vacíos', () => {
      const vacios = { ...datosIniciales(null), region: '' };
      expect(validarCheckout(vacios)).toEqual({ nombre: true, apellidos: true, correo: true, calle: true, region: true, comuna: true });
    });

    it('rechaza indicaciones de más de 300 caracteres y depto de más de 20', () => {
      const errores = validarCheckout({ ...DATOS, indicaciones: 'x'.repeat(301), depto: 'd'.repeat(21) });
      expect(errores).toEqual({ indicaciones: true, depto: true });
    });
  });

  describe('clienteDeOrden (orden con el cliente real)', () => {
    it('con sesión usa el RUN, nombre completo y correo de la cuenta', () => {
      const cliente = clienteDeOrden(USUARIO, DATOS);
      expect(cliente.run).toBe('111111111');
      expect(cliente.nombre).toBe('Ana Soto');
      expect(cliente.correo).toBe('ana@gmail.com');
    });

    it('guarda los datos de entrega escritos en el formulario (sin espacios sobrantes)', () => {
      const { entrega } = clienteDeOrden(USUARIO, DATOS);
      expect(entrega.nombre).toBe('Pedro');
      expect(entrega.calle).toBe('Los Crisantemos 45');
      expect(entrega.comuna).toBe('Cerrillos');
    });

    it('sin sesión usa los datos del formulario y RUN "—"', () => {
      const cliente = clienteDeOrden(null, DATOS);
      expect(cliente.run).toBe('—');
      expect(cliente.nombre).toBe('Pedro Hacker');
      expect(cliente.correo).toBe('pedro@gmail.com');
    });

    it('sin sesión y sin datos usa "Cliente web"', () => {
      expect(clienteDeOrden(null).nombre).toBe('Cliente web');
    });
  });
});