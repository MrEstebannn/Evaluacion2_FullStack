export const CLASES = [
  { id: 1, estilo: 'Ballet', nombre: 'Ballet Principiante', imagen: '/img/foto-ballet.jpg', duracion: 60, cupos: 15, precio: 25000, color: '#ec4899' },
  { id: 2, estilo: 'Salsa', nombre: 'Salsa Avanzado', imagen: '/img/foto-salsa.jpg', duracion: 60, cupos: 20, precio: 20000, color: '#dc2626' },
  { id: 3, estilo: 'Hip-Hop', nombre: 'Hip-Hop Intermedio', imagen: '/img/foto-hiphop.jpg', duracion: 60, cupos: 20, precio: 22000, color: '#7e22ce' },
  { id: 4, estilo: 'Contemporánea', nombre: 'Danza Contemporánea', imagen: '/img/foto-contemporanea.jpg', duracion: 75, cupos: 15, precio: 28000, color: '#b45309' },
  { id: 5, estilo: 'Zumba', nombre: 'Zumba Fitness', imagen: '/img/foto-zumba.png', duracion: 50, cupos: 25, precio: 18000, color: '#16a34a' },
];

export const MEMBRESIAS = [
  { id: 1, nombre: 'Básica', descripcion: '2 clases por semana.', precio: 60000, unidad: 'mes', color: '#0284c7', cupoMax: 50, tituloItem: 'Membresía Básica' },
  { id: 2, nombre: 'Estándar', descripcion: '4 clases por semana.', precio: 90000, unidad: 'mes', color: '#6366f1', cupoMax: 50, tituloItem: 'Membresía Estándar' },
  { id: 3, nombre: 'Premium', descripcion: 'Acceso ilimitado a todas las clases.', precio: 120000, unidad: 'mes', color: '#0f172a', cupoMax: 50, tituloItem: 'Membresía Premium' },
  { id: 4, nombre: 'Clase suelta', descripcion: 'Pago por clase individual.', precio: 25000, unidad: 'clase', color: null, cupoMax: 20, tituloItem: 'Clase Suelta' },
];

export const BLOGS = [
  {
    id: 1,
    titulo: 'Beneficios del baile en la salud mental',
    resumen: 'Bailar libera endorfinas, reduce el estrés y mejora la memoria muscular en todas las edades.',
    imagen: '/img/beneficios-del-baile.jpg',
    texto:
      'Bailar es una de las actividades físicas más completas para el cerebro. Al aprender coreografías, se estimula la memoria y la neuroplasticidad. Además, la práctica continua disminuye significativamente los niveles de cortisol (estrés) y aumenta la serotonina, favoreciendo la autoestima y la conexión interpersonal.',
  },
  {
    id: 2,
    titulo: 'La evolución del Hip-Hop urbano',
    resumen: 'Un recorrido histórico sobre cómo la cultura callejera se transformó en una disciplina internacional.',
    imagen: '/img/evolucion-hiphop.jpg',
    texto:
      'Surgido en el Bronx durante los años 70, el Hip-Hop trasciende la música y el baile para convertirse en una forma de expresión social. En Chile, la escena urbana ha crecido exponencialmente, transformando las plazas y academias en semilleros de talento nacional con proyección internacional.',
  },
];

export const REGIONES_Y_COMUNAS = [
  {
    region: 'Región Metropolitana de Santiago',
    comunas: [
      'Alhué', 'Buin', 'Calera de Tango', 'Cerrillos', 'Cerro Navia', 'Colina',
      'Conchalí', 'Curacaví', 'El Bosque', 'El Monte', 'Estación Central',
      'Huechuraba', 'Independencia', 'Isla de Maipo', 'La Cisterna', 'La Florida',
      'La Granja', 'La Pintana', 'La Reina', 'Lampa', 'Las Condes', 'Lo Barnechea',
      'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'María Pinto', 'Melipilla',
      'Ñuñoa', 'Padre Hurtado', 'Paine', 'Pedro Aguirre Cerda', 'Peñaflor',
      'Peñalolén', 'Pirque', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura',
      'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín',
      'San José de Maipo', 'San Miguel', 'San Pedro', 'San Ramón', 'Santiago',
      'Talagante', 'Tiltil', 'Vitacura',
    ],
  },
];

export const CATEGORIAS_PRODUCTO = ['Vestuario', 'Calzado', 'Accesorios'];
export const OPCIONES_ENTREGA = [{ id: 'domicilio', nombre: 'Despacho a domicilio', precio: 3990 }, { id: 'express', nombre: 'Despacho express', precio: 6990 }, { id: 'retiro', nombre: 'Retiro en tienda', precio: 0 }];
export const TIPOS_USUARIO = ['Cliente', 'Vendedor', 'Administrador'];

export const CUPONES_VALIDOS = ['HYPE10', 'DESCUENTO10', 'SEPTIEMBRE10'];
export const DESCUENTO_CUPON = 5000;

export const ITEMS_MENU = [
  { etiqueta: 'Clases', tipo: 'ancla', destino: 'clases' },
  { etiqueta: 'Tipos de membresía', tipo: 'ancla', destino: 'membresias' },
  { etiqueta: 'Tienda & Productos', tipo: 'seccion', destino: 'productos' },
  { etiqueta: 'Categorías', tipo: 'seccion', destino: 'categorias' },
  { etiqueta: 'Ofertas', tipo: 'seccion', destino: 'ofertas' },
  { etiqueta: 'Nosotros', tipo: 'seccion', destino: 'nosotros' },
  { etiqueta: 'Noticias & Blogs', tipo: 'seccion', destino: 'blogs' },
  { etiqueta: 'Formulario de Contacto', tipo: 'seccion', destino: 'contacto' },
  { etiqueta: 'Panel Administrador', tipo: 'seccion', destino: 'admin' },
  { etiqueta: 'Contacto Info', tipo: 'ancla', destino: 'contacto-info' },
];

export const CUENTAS_ADMIN = [
  {
    usuario: 'Don Carter',
    password: '123456',
    perfil: {
      run: '176543210',
      nombre: 'Don',
      apellidos: 'Carter',
      correo: 'don.carter@duocuc.cl',
      tipo: 'Administrador',
      region: 'Región Metropolitana de Santiago',
      comuna: 'Santiago',
      direccion: 'Av. Principal #123',
    },
  },
];

export const CLAVE_SESION_ADMIN = 'hype_admin_sesion';
