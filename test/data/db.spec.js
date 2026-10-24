import { productosDB, usuariosDB } from '../../src/data/db';
import { limpiarAlmacenamiento } from '../helpers';

describe('data/db (CRUD simulado)', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  describe('productosDB', () => {
    it('READ: sin datos guardados devuelve los 6 productos iniciales', () => {
      expect(productosDB.listar().length).toBe(6);
    });

    it('READ: no deja que modificar la lista devuelta altere los datos iniciales', () => {
      const lista = productosDB.listar();
      lista[0].nombre = 'MODIFICADO';
      expect(productosDB.listar()[0].nombre).toBe('Zapatillas de Ballet Profesional');
    });

    it('READ: obtiene un producto por id o null si no existe', () => {
      expect(productosDB.obtener(101).codigo).toBe('PROD-01');
      expect(productosDB.obtener(999)).toBeNull();
    });

    it('CREATE: agrega el producto, completa valores por defecto y persiste', () => {
      const nuevo = productosDB.crear({ codigo: 'PROD-99', nombre: 'Cinta', categoria: 'Accesorios', precio: 3000, stock: 4 });
      expect(productosDB.listar().length).toBe(7);
      expect(nuevo.imagen).toBe('/img/logo-promocional.png');
      expect(JSON.parse(localStorage.getItem('hype_productos')).length).toBe(7);
    });

    it('UPDATE: modifica solo los campos indicados', () => {
      const actualizado = productosDB.actualizar(101, { stock: 50 });
      expect(actualizado.stock).toBe(50);
      expect(actualizado.nombre).toBe('Zapatillas de Ballet Profesional');
    });

    it('UPDATE: devuelve null si el id no existe', () => {
      expect(productosDB.actualizar(999, { stock: 1 })).toBeNull();
    });

    it('DELETE: elimina el producto por id', () => {
      productosDB.eliminar(101);
      expect(productosDB.obtener(101)).toBeNull();
      expect(productosDB.listar().length).toBe(5);
    });
  });

  describe('usuariosDB', () => {
    it('READ: devuelve los 3 usuarios iniciales', () => {
      expect(usuariosDB.listar().length).toBe(3);
    });

    it('CREATE: rechaza un RUN duplicado', () => {
      const resultado = usuariosDB.crear({ run: '19011022K', nombre: 'Otro' });
      expect(resultado.ok).toBeFalse();
      expect(resultado.error).toBe('Ya existe un usuario registrado con ese RUN.');
      expect(usuariosDB.listar().length).toBe(3);
    });

    it('CREATE: agrega un usuario nuevo', () => {
      const resultado = usuariosDB.crear({ run: '111111111', nombre: 'Nuevo', apellidos: 'Usuario' });
      expect(resultado.ok).toBeTrue();
      expect(usuariosDB.obtener('111111111').nombre).toBe('Nuevo');
    });

    it('UPDATE: cambia el tipo de un usuario', () => {
      expect(usuariosDB.actualizar('201234567', { tipo: 'Vendedor' }).tipo).toBe('Vendedor');
    });

    it('DELETE: elimina un usuario por RUN', () => {
      usuariosDB.eliminar('201234567');
      expect(usuariosDB.obtener('201234567')).toBeNull();
      expect(usuariosDB.listar().length).toBe(2);
    });
  });
});