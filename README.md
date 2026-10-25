# HYPE ACADEMIC – versión React

Migración de `Prueba.html` (HTML + Bootstrap + JS suelto) a una aplicación **React (Vite)** con componentes reutilizables.

## Cómo ejecutarlo en Visual Studio Code

Requiere [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev      # abre http://localhost:5173
npm run build    # genera la carpeta dist/ para producción
```

## Estructura

```
src/
├── main.jsx                 punto de entrada (providers + Bootstrap CSS)
├── App.jsx                  raíz: qué página y qué modal se muestran
├── data/
│   ├── db.js                "base de datos" simulada: CRUD de productos y usuarios + localStorage
│   └── catalogo.js          datos estáticos: clases, membresías, blogs, regiones, cupones, menú
├── hooks/                   lógica reutilizable (useCarrito, useProductos, useUsuarios, useFormulario)
├── context/                 estado global (TiendaContext) y avisos (NotificacionContext)
├── utils/                   validaciones.js y formato.js (funciones puras, fáciles de testear)
├── components/              layout/, common/, home/, productos/, carrito/, auth/, pago/, blogs/, admin/
└── pages/                   InicioPage, ProductosPage, NosotrosPage, BlogsPage, ContactoPage, AdminPage
public/img/                  imágenes (nombres normalizados, sin espacios ni tildes)
```

## Equivalencias HTML → React

| HTML original | React |
|---|---|
| `mostrarSeccion()` + `.seccion-pagina` | estado `seccion` en `App.jsx` |
| `<nav>` + offcanvas | `Navbar.jsx`, `MenuLateral.jsx` |
| Tarjetas de clases / membresías | `ClaseCard`, `MembresiaCard` (datos en `catalogo.js`) |
| `renderProductos()` con `innerHTML` | `ProductosPage` → `ProductoCard` |
| `verDetalleProducto()` / `abrirBlog()` | `ProductoDetalleModal`, `BlogsPage` + `Modal` |
| array `productos` / `usuarios` | `data/db.js` (CRUD + localStorage) |
| `carrito`, `agregarAlCarrito()`, cupones | hook `useCarrito` |
| 5 formularios con `classList.add('is-invalid')` | `useFormulario` + `Campo` + `validaciones.js` |
| Modales de Bootstrap (JS) | `Modal.jsx` (clases de Bootstrap controladas por estado) |
| `alert()` | avisos (toasts) con `NotificacionContext` |

## Cambios respecto al HTML (a propósito)

- El campo correo del registro tenía `maxlength=100` en el HTML pero el JS rechazaba más de 30; ahora el límite es **100** en ambos.
- Se rechaza registrar un **RUN repetido** (el RUN es la clave del CRUD de usuarios).
- La tarjeta valida número (15–16 dígitos), expiración `MM/AA` y CVV numérico. **Los datos de tarjeta no se guardan.**
- La contraseña del registro se guarda en localStorage solo para simular el login; en un backend real se guardaría cifrada.
- El panel de administración tiene botón **Eliminar** (usuarios y productos); `db.js` ya incluye `actualizar` para cuando agreguen edición.
- Los productos y usuarios ahora **persisten** en localStorage (`hype_productos`, `hype_usuarios`); el carrito sigue en `hype_cart`.
- El id `contacto` del bloque de información pasó a `contacto-info` para no chocar con la página del formulario.

## Pendiente de la Evaluación 2 (no incluido aquí)

Pruebas unitarias con Jasmine + Karma, y vistas nuevas del diagrama (categorías, ofertas, checkout con página de pago correcto/error, dashboard de administrador).
