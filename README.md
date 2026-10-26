<div align="center">

<img src="public/img/logo-pagina.png" alt="Logo Hype Academic" width="96" />

# Hype Academic

**Tienda online y panel de administración de una academia de danza, construida con React.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![Jasmine](https://img.shields.io/badge/Tests-Jasmine%20%2B%20Karma-8A4182?logo=jasmine&logoColor=white)
![Evaluación](https://img.shields.io/badge/DSY1104-Evaluación%202-512DA8)

</div>

---

## Contenido

- [Sobre el proyecto](#sobre-el-proyecto)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Primeros pasos](#primeros-pasos)
- [Scripts disponibles](#scripts-disponibles)
- [Cuentas y datos de prueba](#cuentas-y-datos-de-prueba)
- [Arquitectura](#arquitectura)
- [Persistencia de datos](#persistencia-de-datos)
- [Pruebas](#pruebas)
- [Historial de versiones](#historial-de-versiones)
- [Equipo](#equipo)

## Sobre el proyecto

**Hype Academic** es la aplicación web de una academia de danza. Reúne en un solo lugar:

- la **vitrina pública**: clases, membresías, tienda de productos, blogs y contacto;
- el **flujo de compra** completo, desde el carrito hasta la confirmación del pago;
- un **panel de administración** para gestionar productos, usuarios, categorías y órdenes.

Nació como una página HTML con Bootstrap y JavaScript suelto (Evaluación 1). En la **Evaluación 2** de Desarrollo Full Stack se migró a **React + Vite** con componentes reutilizables, se agregaron nuevas vistas y se incorporaron pruebas unitarias con **Jasmine y Karma**.

> Esta versión es solo frontend: los datos se simulan en el navegador (`localStorage`). No hay backend conectado todavía.

## Funcionalidades

### Tienda

- **Inicio** con clases, membresías, banner promocional y cupón de descuento.
- **Catálogo de productos** con búsqueda por texto, filtro por categoría, rango de precio y orden (precio o nombre).
- **Categorías** y **Ofertas**: vistas que agrupan los productos por categoría y por precio rebajado.
- **Detalle de producto** con descripción, tallas y precio de oferta.
- **Carrito** con cantidades editables y cupones de descuento.
- **Registro e inicio de sesión** de clientes, con validación de cada campo.
- **Checkout** con datos de envío y tres opciones de entrega. Si hay sesión iniciada, los datos se completan solos.
- **Pago con tarjeta** y dos resultados: **compra exitosa** (con resumen y boleta) o **pago rechazado** (con opción de reintentar).
- **Nosotros**, **Blogs** (listado y detalle) y **Formulario de contacto**.
- **Botón Atrás del navegador** funcional entre todas las páginas.

### Panel de administración

- Acceso con **login propio** (ver [cuentas de prueba](#cuentas-y-datos-de-prueba)).
- **Dashboard** con indicadores y gráfico mensual.
- **Productos**: listado, creación, edición, eliminación, **stock crítico** y reportes.
- **Categorías**: creación, edición y eliminación.
- **Usuarios**: listado, alta, edición, detalle y eliminación.
- **Órdenes y boletas** de las compras realizadas.
- **Reportes** y **perfil** del administrador.

## Tecnologías

| Herramienta | Uso |
|---|---|
| [React 18](https://react.dev) | Interfaz basada en componentes, hooks y contexto |
| [Vite 5](https://vitejs.dev) | Servidor de desarrollo y empaquetado |
| [Bootstrap 5.3](https://getbootstrap.com) y [Bootstrap Icons](https://icons.getbootstrap.com) | Diseño responsivo e iconos |
| [Jasmine 4](https://jasmine.github.io) y [Karma 6](https://karma-runner.github.io) | Pruebas unitarias en Chrome headless |
| [Testing Library](https://testing-library.com) | Render de componentes y simulación de eventos |
| Babel, Webpack e Istanbul | Compilación de pruebas y reporte de cobertura |
| `localStorage` y `sessionStorage` | Persistencia simulada de datos y sesiones |

## Primeros pasos

### Requisitos

- [Node.js](https://nodejs.org) 18 o superior
- npm (incluido con Node.js)
- Google Chrome o Chromium, solo para ejecutar las pruebas

### Instalación

```bash
git clone https://github.com/MrEstebannn/Evaluacion2_FullStack.git
cd Evaluacion2_FullStack
npm install
npm run dev
```

La aplicación queda disponible en **http://localhost:5173**.

### Versión de producción

```bash
npm run build      # genera la carpeta dist/
npm run preview    # sirve dist/ para revisarla localmente
```

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión optimizada en `dist/` |
| `npm run preview` | Previsualiza la versión de producción |
| `npm test` | Ejecuta todas las pruebas una vez (Chrome headless) |
| `npm run test:watch` | Ejecuta las pruebas y queda atento a cambios |
| `npm run test:coverage` | Ejecuta las pruebas y genera el reporte en `coverage/` |

## Cuentas y datos de prueba

### Administrador

1. Abre el **menú lateral** (botón de la barra superior).
2. Entra a **Panel Administrador**.
3. Ingresa con:

| Usuario | Contraseña |
|---|---|
| `Don Carter` | `123456` |

La pantalla de login también permite autocompletar esta cuenta con un clic.

### Cliente

Los usuarios que vienen de ejemplo **no tienen contraseña**. Para probar el flujo de cliente, crea una cuenta con el botón **Inscribirse** y luego inicia sesión con ese correo.

Reglas del formulario de registro:

- RUN de 9 caracteres, sin puntos ni guion, y no repetido.
- Correo de un dominio permitido: `@gmail.com`, `@hotmail.com`, `@yahoo.com`, `@duocuc.cl`, `@duoc.cl` o `@profesor.duoc.cl`.
- Contraseña de 4 a 10 caracteres.

### Cupones de descuento

`HYPE10`, `DESCUENTO10` y `SEPTIEMBRE10` descuentan **$5.000** del carrito.

### Opciones de entrega

| Opción | Costo |
|---|---|
| Retiro en tienda | $0 |
| Despacho a domicilio | $3.990 |
| Despacho express | $6.990 |

### Pagos simulados

No se realiza ningún cobro real y **los datos de tarjeta no se guardan**.

- Cualquier tarjeta de **15 o 16 dígitos** con vencimiento `MM/AA` y CVV de 3 o 4 dígitos → **pago aprobado**.
- Una tarjeta cuyo número **termine en `0000`** → **pago rechazado**, para probar la vista de error.

## Arquitectura

```text
.
├── public/img/             imágenes (nombres sin espacios ni tildes)
├── src/
│   ├── main.jsx            punto de entrada: providers y estilos de Bootstrap
│   ├── App.jsx             raíz: decide qué página y qué modal se muestran
│   ├── pages/              13 páginas de la tienda (Inicio, Productos, Checkout, Pago…)
│   ├── components/         componentes reutilizables, agrupados por dominio
│   │   ├── layout/         Navbar y menú lateral
│   │   ├── common/         Modal y Campo de formulario
│   │   ├── home/           clases, membresías, banners y contacto
│   │   ├── productos/      tarjeta, detalle, filtros y precio
│   │   ├── carrito/        carrito y sus ítems
│   │   ├── auth/           login y registro
│   │   ├── pago/           checkout, resumen y pago con tarjeta
│   │   └── blogs/          tarjeta de blog
│   ├── admin/              panel de administración
│   │   ├── views/          13 vistas (dashboard, productos, usuarios, órdenes…)
│   │   └── components/     sidebar, topbar, KPIs, barras y badges
│   ├── hooks/              lógica reutilizable (useCarrito, useFormulario, useSesionCliente…)
│   ├── context/            estado global de la tienda y avisos (toasts)
│   ├── data/
│   │   ├── db.js           base de datos simulada con CRUD y localStorage
│   │   └── catalogo.js     datos estáticos: clases, membresías, blogs, cupones, menú
│   └── utils/              funciones puras: validaciones, filtros, ofertas, checkout, pago
├── test/                   pruebas unitarias (Jasmine), organizadas igual que src/
├── karma.conf.cjs          configuración de Karma, Webpack y cobertura
└── vite.config.js          configuración de Vite
```

### Decisiones de diseño

- **Un componente, una responsabilidad.** Los componentes reciben datos y funciones por `props` y solo manejan estado propio cuando es necesario.
- **Lógica fuera de la vista.** Los hooks y las funciones de `utils/` concentran las reglas de negocio, lo que las hace fáciles de probar.
- **Navegación sin librería de rutas.** `App.jsx` mantiene la página activa en un estado y la sincroniza con el historial del navegador (`utils/historial.js`), por lo que el botón Atrás funciona.
- **Bootstrap sin su JavaScript.** Los modales y menús se controlan con estado de React y clases de Bootstrap.

## Persistencia de datos

`src/data/db.js` actúa como una base de datos en el navegador y ofrece operaciones de **crear, listar, obtener, actualizar y eliminar** sobre cada entidad.

| Clave | Almacenamiento | Contenido |
|---|---|---|
| `hype_productos` | `localStorage` | Catálogo de productos |
| `hype_usuarios` | `localStorage` | Usuarios registrados |
| `hype_categorias` | `localStorage` | Categorías de productos |
| `hype_ordenes` | `localStorage` | Órdenes y boletas |
| `hype_cart` | `localStorage` | Carrito de compras |
| `hype_cliente_sesion` | `sessionStorage` | Sesión del cliente |
| `hype_admin_sesion` | `sessionStorage` | Sesión del administrador |

Al comprar, la orden se guarda y el **stock** de cada producto se descuenta automáticamente.

Para volver al estado inicial, borra los datos del sitio desde las herramientas del navegador (**Application → Storage → Clear site data**).

> **Importante:** la contraseña del registro se guarda sin cifrar en `localStorage` solo para simular el login. Un backend real debe guardarla cifrada.

## Pruebas

El proyecto incluye cerca de **300 casos de prueba** repartidos en **57 archivos**, que cubren:

- **Renderizado** de componentes con sus datos.
- **Props** recibidas y usadas correctamente.
- **Estado** de formularios, carrito y sesión.
- **Eventos** de usuario: clics, escritura y envío de formularios.
- **Flujos completos** de navegación, búsqueda y compra.

```bash
npm test                # una sola ejecución
npm run test:coverage   # ejecución + reporte de cobertura
```

El reporte HTML queda en `coverage/html/index.html`.

| Métrica | Cobertura |
|---|---|
| Líneas | 79,9 % |
| Funciones | 74,9 % |
| Ramas | 70,0 % |

*Valores del último reporte generado; pueden cambiar al agregar o modificar pruebas.*

Si Chrome no está en la ruta por defecto, define la variable `CHROME_BIN` con la ruta del ejecutable antes de correr las pruebas.

## Historial de versiones

| Versión | Contenido |
|---|---|
| **Evaluación 1** | Sitio en HTML, Bootstrap y JavaScript: inicio, tienda, carrito, formularios y panel básico |
| **Evaluación 2** | Migración a React + Vite, base de datos simulada, filtros, categorías, ofertas, checkout, pago, sesión de clientes, panel de administración ampliado y pruebas con Jasmine y Karma |

### Próximos pasos

- Conectar el frontend con un backend y una base de datos reales.
- Cifrar contraseñas y autenticar con tokens.
- Aumentar la cobertura de ramas.

## Equipo

Proyecto desarrollado por el equipo de la asignatura **Desarrollo Full Stack (DSY1104)**.

| GitHub |
|---|
| [@micastroh](https://github.com/micastroh) |
| [@MrEstebannn](https://github.com/MrEstebannn) |
| [@Mqs7er](https://github.com/Mqs7er) |
