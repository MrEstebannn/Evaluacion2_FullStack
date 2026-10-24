// Fuente de datos simulada ("base de datos") con CRUD + persistencia en localStorage.
// Los componentes NO tocan localStorage directamente: usan estas funciones (vía hooks).

const KEYS = {
  productos: 'hype_productos',
  usuarios: 'hype_usuarios',
  ordenes: 'hype_ordenes',
  categorias: 'hype_categorias',
};

const PRODUCTOS_INICIALES = [
  { id: 101, codigo: 'PROD-01', nombre: 'Zapatillas de Ballet Profesional', categoria: 'Calzado', precio: 35000, stock: 12, stockCritico: 3, imagen: '/img/zapatillas-ballet.webp', desc: 'Zapatillas flexibles de lona de alta durabilidad para prácticas y presentaciones.', tallas: ['35', '36', '37', '38', '39', '40'] },
  { id: 102, codigo: 'PROD-02', nombre: 'Malla de Danza Elástica', categoria: 'Vestuario', precio: 22000, stock: 5, stockCritico: 5, imagen: '/img/malla-danza-elastica.jpeg', desc: 'Malla ergonómica transpirable ideal para entrenamiento intensivo.' },
  { id: 103, codigo: 'PROD-03', nombre: 'Pants Urban Hip-Hop', categoria: 'Vestuario', precio: 28000, stock: 20, stockCritico: 4, imagen: '/img/pants-urban-hiphop.avif', desc: 'Pantalón holgado de algodón reforzado diseñado para la danza urbana.', tallas: ['S', 'M', 'L', 'XL'] },
  { id: 104, codigo: 'PROD-04', nombre: 'Zapatos de Salsa Cuero', categoria: 'Calzado', precio: 45000, stock: 2, stockCritico: 3, imagen: '/img/zapatos-salsa-cuero.webp', desc: 'Calzado de cuero legítimo con suela antideslizante para giros rápidos.', tallas: ['36', '37', '38', '39', '40', '41', '42'] },
  { id: 105, codigo: 'PROD-05', nombre: 'Toalla Microfibra Hype', categoria: 'Accesorios', precio: 12000, stock: 30, stockCritico: 10, imagen: '/img/toalla-microfibra.webp', desc: 'Toalla ligera de secado ultrarrápido con diseño de la academia.' },
  { id: 106, codigo: 'PROD-06', nombre: 'Botella Térmica 750ml', categoria: 'Accesorios', precio: 15000, stock: 15, stockCritico: 5, imagen: '/img/botella-termica.webp', desc: 'Mantiene tus bebidas frías durante toda tu jornada de entrenamiento.' },
];

const USUARIOS_INICIALES = [
  { run: '19011022K', nombre: 'Juan', apellidos: 'Pérez', correo: 'juan@duocuc.cl', tipo: 'Administrador', region: 'Región Metropolitana de Santiago', comuna: 'Santiago' },
  { run: '182345678', nombre: 'Maria', apellidos: 'Gómez', correo: 'maria@hotmail.com', tipo: 'Vendedor', region: 'Región Metropolitana de Santiago', comuna: 'Providencia' },
  { run: '201234567', nombre: 'Carlos', apellidos: 'López', correo: 'carlos@gmail.com', tipo: 'Cliente', region: 'Región Metropolitana de Santiago', comuna: 'Maipú' },
];

// ---------- utilidades de persistencia ----------
function leer(clave, datosIniciales) {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado) return JSON.parse(guardado);
  } catch {
    /* si localStorage falla se usan los datos iniciales */
  }
  return JSON.parse(JSON.stringify(datosIniciales));
}

function guardar(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
  } catch {
    /* sin persistencia, la app sigue funcionando en memoria */
  }
}

// ---------- CRUD de productos ----------
export const productosDB = {
  /** READ: lista todos los productos */
  listar() {
    return leer(KEYS.productos, PRODUCTOS_INICIALES);
  },

  /** READ: obtiene un producto por id */
  obtener(id) {
    return this.listar().find((p) => p.id === id) ?? null;
  },

  /** CREATE: agrega un producto y lo devuelve */
  crear(datos) {
    const nuevo = {
      id: Date.now(),
      imagen: '/img/logo-promocional.png',
      desc: 'Producto oficial de Hype Academic.',
      ...datos,
    };
    guardar(KEYS.productos, [...this.listar(), nuevo]);
    return nuevo;
  },

  /** UPDATE: modifica campos de un producto existente */
  actualizar(id, cambios) {
    const lista = this.listar().map((p) => (p.id === id ? { ...p, ...cambios } : p));
    guardar(KEYS.productos, lista);
    return lista.find((p) => p.id === id) ?? null;
  },

  /** DELETE: elimina un producto por id */
  eliminar(id) {
    guardar(KEYS.productos, this.listar().filter((p) => p.id !== id));
  },
};

// ---------- CRUD de usuarios (clave: RUN) ----------
export const usuariosDB = {
  listar() {
    return leer(KEYS.usuarios, USUARIOS_INICIALES);
  },

  obtener(run) {
    return this.listar().find((u) => u.run === run) ?? null;
  },

  /** CREATE: devuelve { ok, usuario } o { ok:false, error } si el RUN ya existe */
  crear(datos) {
    if (this.obtener(datos.run)) {
      return { ok: false, error: 'Ya existe un usuario registrado con ese RUN.' };
    }
    guardar(KEYS.usuarios, [...this.listar(), datos]);
    return { ok: true, usuario: datos };
  },

  actualizar(run, cambios) {
    const lista = this.listar().map((u) => (u.run === run ? { ...u, ...cambios } : u));
    guardar(KEYS.usuarios, lista);
    return lista.find((u) => u.run === run) ?? null;
  },

  eliminar(run) {
    guardar(KEYS.usuarios, this.listar().filter((u) => u.run !== run));
  },
};

// ---------- Categorías ----------
const CATEGORIAS_INICIALES = [
  { id: 1, nombre: 'Vestuario', descripcion: 'Mallas, pants y ropa para entrenar.' },
  { id: 2, nombre: 'Calzado', descripcion: 'Zapatillas y zapatos para cada estilo de baile.' },
  { id: 3, nombre: 'Accesorios', descripcion: 'Toallas, botellas y complementos.' },
];

export const categoriasDB = {
  listar() {
    return leer(KEYS.categorias, CATEGORIAS_INICIALES);
  },
  obtener(id) {
    return this.listar().find((c) => c.id === id) ?? null;
  },
  crear(datos) {
    const nueva = { id: Date.now(), ...datos };
    guardar(KEYS.categorias, [...this.listar(), nueva]);
    return nueva;
  },
  actualizar(id, cambios) {
    const lista = this.listar().map((c) => (c.id === id ? { ...c, ...cambios } : c));
    guardar(KEYS.categorias, lista);
    return lista.find((c) => c.id === id) ?? null;
  },
  eliminar(id) {
    guardar(KEYS.categorias, this.listar().filter((c) => c.id !== id));
  },
};

// ---------- Órdenes / boletas ----------
// Una orden = una compra. cliente: { run, nombre, correo }. items: [{ nombre, precio, cantidad, idProducto? }]
const orden = (id, numero, fecha, cliente, items, estado, descuento = 0) => {
  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  return { id, numero, fecha, cliente, items, subtotal, descuento, total: Math.max(subtotal - descuento, 0), estado };
};
const JUAN = { run: '19011022K', nombre: 'Juan Pérez', correo: 'juan@duocuc.cl' };
const MARIA = { run: '182345678', nombre: 'Maria Gómez', correo: 'maria@hotmail.com' };
const CARLOS = { run: '201234567', nombre: 'Carlos López', correo: 'carlos@gmail.com' };

const ORDENES_INICIALES = [
  orden(1, '20260001', '2026-05-12T15:20:00', CARLOS, [{ nombre: 'Membresía Básica', precio: 60000, cantidad: 1 }], 'Pagada'),
  orden(2, '20260002', '2026-06-03T11:05:00', MARIA, [{ nombre: 'Zapatillas de Ballet Profesional (Talla 37)', precio: 35000, cantidad: 1, idProducto: 101 }, { nombre: 'Toalla Microfibra Hype', precio: 12000, cantidad: 1, idProducto: 105 }], 'Pagada'),
  orden(3, '20260003', '2026-06-21T18:40:00', CARLOS, [{ nombre: 'Hip-Hop Intermedio', precio: 22000, cantidad: 2 }], 'Pagada'),
  orden(4, '20260004', '2026-07-09T10:15:00', JUAN, [{ nombre: 'Membresía Premium', precio: 120000, cantidad: 1 }], 'Pagada', 5000),
  orden(5, '20260005', '2026-07-28T13:30:00', MARIA, [{ nombre: 'Pants Urban Hip-Hop (Talla M)', precio: 28000, cantidad: 1, idProducto: 103 }, { nombre: 'Botella Térmica 750ml', precio: 15000, cantidad: 2, idProducto: 106 }], 'Pagada'),
  orden(6, '20260006', '2026-08-14T17:00:00', CARLOS, [{ nombre: 'Malla de Danza Elástica', precio: 22000, cantidad: 2, idProducto: 102 }], 'Cancelada'),
  orden(7, '20260007', '2026-08-30T12:10:00', JUAN, [{ nombre: 'Zapatos de Salsa Cuero (Talla 40)', precio: 45000, cantidad: 1, idProducto: 104 }, { nombre: 'Salsa Avanzado', precio: 20000, cantidad: 1 }], 'Pagada'),
  orden(8, '20260008', '2026-09-18T19:25:00', MARIA, [{ nombre: 'Membresía Estándar', precio: 90000, cantidad: 1 }], 'Pagada', 5000),
  orden(9, '20260009', '2026-10-05T09:45:00', CARLOS, [{ nombre: 'Toalla Microfibra Hype', precio: 12000, cantidad: 3, idProducto: 105 }, { nombre: 'Zumba Fitness', precio: 18000, cantidad: 1 }], 'Pagada'),
  orden(10, '20260010', '2026-10-21T16:35:00', JUAN, [{ nombre: 'Pants Urban Hip-Hop (Talla L)', precio: 28000, cantidad: 2, idProducto: 103 }], 'Pendiente'),
];

export const ordenesDB = {
  listar() {
    return leer(KEYS.ordenes, ORDENES_INICIALES);
  },
  obtener(id) {
    return this.listar().find((o) => o.id === id) ?? null;
  },
  /** CREATE: calcula número correlativo, fecha y totales. */
  crear({ cliente, items, descuento = 0, estado = 'Pagada' }) {
    const lista = this.listar();
    const ultimo = lista.reduce((max, o) => Math.max(max, Number(o.numero)), 20260000);
    const nueva = orden(Date.now(), String(ultimo + 1), new Date().toISOString(), cliente, items, estado, descuento);
    guardar(KEYS.ordenes, [...lista, nueva]);
    return nueva;
  },
  actualizar(id, cambios) {
    const lista = this.listar().map((o) => (o.id === id ? { ...o, ...cambios } : o));
    guardar(KEYS.ordenes, lista);
    return lista.find((o) => o.id === id) ?? null;
  },
  eliminar(id) {
    guardar(KEYS.ordenes, this.listar().filter((o) => o.id !== id));
  },
};
