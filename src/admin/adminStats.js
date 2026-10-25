export const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const quitarTalla = (nombre) => nombre.replace(/ \(Talla .*\)$/, '');

export const ordenesPagadas = (ordenes) => ordenes.filter((o) => o.estado === 'Pagada');

export const totalVentas = (ordenes) => ordenesPagadas(ordenes).reduce((suma, o) => suma + o.total, 0);

export function ticketPromedio(ordenes) {
  const pagadas = ordenesPagadas(ordenes);
  return pagadas.length ? Math.round(totalVentas(ordenes) / pagadas.length) : 0;
}

export function ventasPorMes(ordenes, cantidad = 6, hoy = new Date()) {
  const meses = [];
  for (let i = cantidad - 1; i >= 0; i -= 1) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push({ clave: `${d.getFullYear()}-${d.getMonth()}`, etiqueta: MESES[d.getMonth()], total: 0, ordenes: 0 });
  }
  ordenesPagadas(ordenes).forEach((o) => {
    const f = new Date(o.fecha);
    const mes = meses.find((m) => m.clave === `${f.getFullYear()}-${f.getMonth()}`);
    if (mes) {
      mes.total += o.total;
      mes.ordenes += 1;
    }
  });
  return meses;
}

export function masVendidos(ordenes, limite = 5) {
  const mapa = {};
  ordenesPagadas(ordenes).forEach((o) =>
    o.items.forEach((i) => {
      const nombre = quitarTalla(i.nombre);
      mapa[nombre] = mapa[nombre] || { nombre, unidades: 0, ingresos: 0 };
      mapa[nombre].unidades += i.cantidad;
      mapa[nombre].ingresos += i.precio * i.cantidad;
    })
  );
  return Object.values(mapa).sort((a, b) => b.unidades - a.unidades).slice(0, limite);
}

export const productosCriticos = (productos) => productos.filter((p) => p.stockCritico > 0 && p.stock <= p.stockCritico);

export const valorInventario = (productos) => productos.reduce((s, p) => s + p.precio * p.stock, 0);

export function ventasPorCategoria(ordenes, productos) {
  const mapa = {};
  ordenesPagadas(ordenes).forEach((o) =>
    o.items.forEach((i) => {
      const prod = productos.find((p) => p.id === i.idProducto) || productos.find((p) => p.nombre === quitarTalla(i.nombre));
      const categoria = prod ? prod.categoria : 'Clases y membresías';
      mapa[categoria] = (mapa[categoria] || 0) + i.precio * i.cantidad;
    })
  );
  return Object.entries(mapa).map(([categoria, total]) => ({ categoria, total })).sort((a, b) => b.total - a.total);
}

export const comprasDeUsuario = (ordenes, usuario) =>
  ordenes.filter((o) => o.cliente && (o.cliente.run === usuario.run || o.cliente.correo === usuario.correo));

export const contarPorEstado = (ordenes) =>
  ordenes.reduce((acc, o) => ({ ...acc, [o.estado]: (acc[o.estado] || 0) + 1 }), { Pagada: 0, Pendiente: 0, Cancelada: 0 });

export function descargarCSV(nombreArchivo, filas) {
  const texto = filas.map((fila) => fila.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
  const blob = new Blob([`\uFEFF${texto}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}

export const formatoFecha = (iso) => new Date(iso).toLocaleDateString('es-CL');
