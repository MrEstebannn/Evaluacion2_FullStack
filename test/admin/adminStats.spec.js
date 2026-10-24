import {
  comprasDeUsuario, contarPorEstado, masVendidos, productosCriticos, ticketPromedio, totalVentas, valorInventario, ventasPorCategoria, ventasPorMes,
} from '../../src/admin/adminStats';

describe('admin/adminStats (cálculos del panel)', () => {
  const ordenes = [
    { estado: 'Pagada', total: 1000, fecha: '2026-10-05T10:00:00', cliente: { run: '1', correo: 'a@gmail.com' }, items: [{ nombre: 'A (Talla M)', precio: 500, cantidad: 2, idProducto: 1 }] },
    { estado: 'Cancelada', total: 5000, fecha: '2026-10-06T10:00:00', cliente: { run: '2', correo: 'b@gmail.com' }, items: [{ nombre: 'B', precio: 5000, cantidad: 1 }] },
    { estado: 'Pagada', total: 3000, fecha: '2026-09-10T10:00:00', cliente: { run: '1', correo: 'a@gmail.com' }, items: [{ nombre: 'A', precio: 500, cantidad: 1, idProducto: 1 }, { nombre: 'Clase X', precio: 2500, cantidad: 1 }] },
  ];
  const productos = [
    { id: 1, nombre: 'A', categoria: 'Calzado', precio: 500, stock: 2, stockCritico: 3 },
    { id: 2, nombre: 'B', categoria: 'Vestuario', precio: 1000, stock: 10, stockCritico: 3 },
    { id: 3, nombre: 'C', categoria: 'Vestuario', precio: 200, stock: 0, stockCritico: 0 },
  ];

  it('totalVentas suma solo las órdenes pagadas', () => {
    expect(totalVentas(ordenes)).toBe(4000);
  });

  it('ticketPromedio divide por las órdenes pagadas (0 si no hay)', () => {
    expect(ticketPromedio(ordenes)).toBe(2000);
    expect(ticketPromedio([])).toBe(0);
  });

  it('ventasPorMes entrega los últimos 6 meses, incluso los vacíos', () => {
    const meses = ventasPorMes(ordenes, 6, new Date(2026, 9, 24));
    expect(meses.map((m) => m.etiqueta)).toEqual(['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct']);
    expect(meses[5].total).toBe(1000);
    expect(meses[4].total).toBe(3000);
    expect(meses[0].total).toBe(0);
  });

  it('masVendidos agrupa las tallas bajo el mismo producto y ordena por unidades', () => {
    const ranking = masVendidos(ordenes);
    expect(ranking[0]).toEqual({ nombre: 'A', unidades: 3, ingresos: 1500 });
    expect(ranking.length).toBe(2);
  });

  it('productosCriticos ignora los productos sin stock crítico definido', () => {
    expect(productosCriticos(productos).map((p) => p.id)).toEqual([1]);
  });

  it('valorInventario multiplica precio por stock', () => {
    expect(valorInventario(productos)).toBe(500 * 2 + 1000 * 10);
  });

  it('ventasPorCategoria separa clases y membresías de los productos', () => {
    const resultado = ventasPorCategoria(ordenes, productos);
    expect(resultado.find((c) => c.categoria === 'Calzado').total).toBe(1500);
    expect(resultado.find((c) => c.categoria === 'Clases y membresías').total).toBe(2500);
  });

  it('comprasDeUsuario filtra por RUN o correo', () => {
    expect(comprasDeUsuario(ordenes, { run: '1', correo: 'x@x.cl' }).length).toBe(2);
    expect(comprasDeUsuario(ordenes, { run: '9', correo: 'b@gmail.com' }).length).toBe(1);
  });

  it('contarPorEstado siempre incluye los tres estados', () => {
    expect(contarPorEstado(ordenes)).toEqual({ Pagada: 2, Pendiente: 0, Cancelada: 1 });
  });
});
