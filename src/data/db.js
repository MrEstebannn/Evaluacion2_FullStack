// Fuente de datos simulada ("base de datos") con CRUD + persistencia en localStorage.
// Los componentes NO tocan localStorage directamente: usan estas funciones (vía hooks).

const KEYS = {
  productos: 'hype_productos',
  usuarios: 'hype_usuarios',
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
