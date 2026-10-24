import { categoriasDB, ordenesDB } from '../../src/data/db';
import { limpiarAlmacenamiento } from '../helpers';

describe('data/db (órdenes y categorías)', () => {
  beforeEach(limpiarAlmacenamiento);
  afterAll(limpiarAlmacenamiento);

  describe('ordenesDB', () => {
    it('READ: parte con 10 órdenes de ejemplo', () => {
      expect(ordenesDB.listar().length).toBe(10);
    });

    it('CREATE: asigna número correlativo y calcula subtotal y total con descuento', () => {
      const nueva = ordenesDB.crear({
        cliente: { run: '1', nombre: 'Ana', correo: 'ana@gmail.com' },
        items: [{ nombre: 'Zumba Fitness', precio: 18000, cantidad: 2 }],
        descuento: 5000,
      });
      expect(nueva.numero).toBe('20260011');
      expect(nueva.subtotal).toBe(36000);
      expect(nueva.total).toBe(31000);
      expect(nueva.estado).toBe('Pagada');
      expect(ordenesDB.listar().length).toBe(11);
    });

    it('UPDATE: cambia el estado de una orden', () => {
      ordenesDB.actualizar(10, { estado: 'Pagada' });
      expect(ordenesDB.obtener(10).estado).toBe('Pagada');
    });

    it('DELETE: elimina una orden', () => {
      ordenesDB.eliminar(1);
      expect(ordenesDB.obtener(1)).toBeNull();
    });
  });

  describe('categoriasDB', () => {
    it('READ: parte con 3 categorías', () => {
      expect(categoriasDB.listar().map((c) => c.nombre)).toEqual(['Vestuario', 'Calzado', 'Accesorios']);
    });

    it('CREATE / UPDATE / DELETE', () => {
      const nueva = categoriasDB.crear({ nombre: 'Equipamiento', descripcion: '' });
      expect(categoriasDB.listar().length).toBe(4);
      categoriasDB.actualizar(nueva.id, { nombre: 'Equipos' });
      expect(categoriasDB.obtener(nueva.id).nombre).toBe('Equipos');
      categoriasDB.eliminar(nueva.id);
      expect(categoriasDB.listar().length).toBe(3);
    });
  });
});
