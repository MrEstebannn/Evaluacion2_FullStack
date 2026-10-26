import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import MenuLateral from './components/layout/MenuLateral';
import LoginModal from './components/auth/LoginModal';
import RegistroModal from './components/auth/RegistroModal';
import CarritoModal from './components/carrito/CarritoModal';
import PagoTarjetaModal from './components/pago/PagoTarjetaModal';
import InicioPage from './pages/InicioPage';
import ProductosPage from './pages/ProductosPage';
import NosotrosPage from './pages/NosotrosPage';
import BlogsPage from './pages/BlogsPage';
import ContactoPage from './pages/ContactoPage';
import AdminPage from './pages/AdminPage';
import CategoriasPage from './pages/CategoriasPage';
import OfertasPage from './pages/OfertasPage';
import ProductoDetallePage from './pages/ProductoDetallePage';
import BlogDetallePage from './pages/BlogDetallePage';
import CheckoutPage from './pages/CheckoutPage';
import PagoCorrectoPage from './pages/PagoCorrectoPage';
import PagoErrorPage from './pages/PagoErrorPage';
import { ITEMS_MENU } from './data/catalogo';
import { useTienda } from './context/TiendaContext';
import { useSesionCliente } from './hooks/useSesionCliente';
import { clienteDeOrden, resumenDeCompra } from './utils/checkout';
import { procesarPago } from './utils/pago';
import {
  empujarHistorial,
  estadoActual,
  reemplazarHistorial,
} from './utils/historial';

export default function App() {
  const {
    carrito,
    registrarUsuario,
    crearOrden,
    productos,
    actualizarProducto,
    notificar,
  } = useTienda();
  const inicial = estadoActual() ?? { seccion: 'inicio', params: {} };
  const [seccion, setSeccion] = useState(inicial.seccion ?? 'inicio');
  const [params, setParams] = useState(inicial.params ?? {});
  const [modal, setModal] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busquedaNavbar, setBusquedaNavbar] = useState({ texto: '', n: 0 });
  const sesion = useSesionCliente();
  const [datosEntrega, setDatosEntrega] = useState(null);

  const cerrarModal = () => setModal(null);

  useEffect(() => {
    if (!estadoActual()?.seccion) {
      reemplazarHistorial({ seccion: 'inicio', params: {} });
    }

    const alVolver = (evento) => {
      setSeccion(evento.state?.seccion ?? 'inicio');
      setParams(evento.state?.params ?? {});
      setModal(null);
      setMenuAbierto(false);
    };

    window.addEventListener('popstate', alVolver);
    return () => window.removeEventListener('popstate', alVolver);
  }, []);

  const irA = (destino, nuevosParams = {}) => {
    empujarHistorial({ seccion: destino, params: nuevosParams });
    setSeccion(destino);
    setParams(nuevosParams);
    setMenuAbierto(false);
    setModal(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const irAAncla = (idAncla) => {
    irA('inicio');
    setTimeout(() => {
      document.getElementById(idAncla)?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const buscarDesdeNavbar = (texto) => {
    setBusquedaNavbar((anterior) => ({ texto, n: anterior.n + 1 }));
    irA('productos');
  };

  const seleccionarItemMenu = (item) => (
    item.tipo === 'ancla' ? irAAncla(item.destino) : irA(item.destino)
  );

  const alLoginExitoso = (credenciales) => {
    const resultado = sesion.iniciarSesion(credenciales);
    if (resultado.ok) {
      notificar('¡Bienvenido/a, ' + resultado.usuario.nombre + '!');
      cerrarModal();
    }
    return resultado;
  };

  const cerrarSesionCliente = () => {
    sesion.cerrarSesion();
    notificar('Sesión cerrada.', 'secondary');
  };

  const alRegistrar = (datosUsuario) => {
    const resultado = registrarUsuario(datosUsuario);
    if (resultado.ok) {
      sesion.abrirSesion(datosUsuario.run);
      notificar('Usuario registrado exitosamente.');
      cerrarModal();
    }
    return resultado;
  };

  const iniciarCheckout = () => irA('checkout');
  const continuarAlPago = (datos) => {
    setDatosEntrega(datos);
    setModal('pago');
  };

  const alPagoProcesado = (tarjeta) => {
    const resultado = procesarPago(tarjeta);
    const resumen = resumenDeCompra({
      items: carrito.items,
      descuento: carrito.descuento,
      opcionEntrega: datosEntrega?.opcionEntrega,
    });
    const items = carrito.items.map((item) => ({ ...item }));

    if (!resultado.ok) {
      irA('pago-error', { motivo: resultado.motivo, resumen, items });
      return;
    }

    const orden = crearOrden({
      cliente: clienteDeOrden(sesion.usuario, datosEntrega ?? undefined),
      items: items.map(({ nombre, precio, cantidad, idProducto }) => ({
        nombre,
        precio,
        cantidad,
        ...(idProducto && { idProducto }),
      })),
      descuento: resumen.descuento,
      envio: resumen.envio,
    });

    items
      .filter((item) => item.idProducto)
      .forEach((item) => {
        const producto = productos.find((actual) => actual.id === item.idProducto);
        if (producto) {
          actualizarProducto(producto.id, {
            stock: Math.max(producto.stock - item.cantidad, 0),
          });
        }
      });

    carrito.vaciarCarrito();
    setDatosEntrega(null);
    notificar('¡Pago procesado con éxito! Gracias por tu compra.');
    irA('pago-correcto', { orden, resumen, items });
  };

  const reintentarPago = () => {
    irA('checkout');
    setModal('pago');
  };

  if (seccion === 'admin') {
    return <AdminPage onSalirATienda={() => irA('inicio')} />;
  }

  return (
    <>
      <Navbar
        cantidadCarrito={carrito.cantidadTotal}
        onIrInicio={() => irA('inicio')}
        onAbrirLogin={() => setModal('login')}
        onAbrirRegistro={() => setModal('registro')}
        onAbrirCarrito={() => setModal('carrito')}
        onAbrirMenu={() => setMenuAbierto(true)}
        onBuscar={buscarDesdeNavbar}
        usuario={sesion.usuario}
        onCerrarSesion={cerrarSesionCliente}
      />
      <MenuLateral
        abierto={menuAbierto}
        items={ITEMS_MENU}
        onCerrar={() => setMenuAbierto(false)}
        onSeleccionar={seleccionarItemMenu}
      />

      <main>
        {seccion === 'inicio' && (
          <InicioPage
            onIrATienda={() => irA('productos')}
            onAbrirCarrito={() => setModal('carrito')}
          />
        )}
        {seccion === 'productos' && (
          <ProductosPage
            key={busquedaNavbar.n}
            busqueda={busquedaNavbar.texto}
            onVerDetalle={(id) => irA('producto-detalle', { id })}
          />
        )}
        {seccion === 'producto-detalle' && (
          <ProductoDetallePage
            id={params.id}
            onVolver={() => irA('productos')}
          />
        )}
        {seccion === 'categorias' && (
          <CategoriasPage
            id={params.id}
            onVerCategoria={(id) => irA('categorias', id == null ? {} : { id })}
            onVerDetalle={(id) => irA('producto-detalle', { id })}
          />
        )}
        {seccion === 'ofertas' && (
          <OfertasPage onVerDetalle={(id) => irA('producto-detalle', { id })} />
        )}
        {seccion === 'nosotros' && <NosotrosPage />}
        {seccion === 'blogs' && (
          <BlogsPage onVerBlog={(id) => irA('blog-detalle', { id })} />
        )}
        {seccion === 'blog-detalle' && (
          <BlogDetallePage
            id={params.id}
            onVolver={() => irA('blogs')}
          />
        )}
        {seccion === 'contacto' && <ContactoPage />}
        {seccion === 'checkout' && (
          <CheckoutPage
            usuario={sesion.usuario}
            onContinuar={continuarAlPago}
            onIrTienda={() => irA('productos')}
          />
        )}
        {seccion === 'pago-correcto' && (
          <PagoCorrectoPage
            {...params}
            onIrTienda={() => irA('productos')}
            onNotificar={() => notificar('Boleta enviada por correo electrónico.')}
          />
        )}
        {seccion === 'pago-error' && (
          <PagoErrorPage
            {...params}
            onReintentar={reintentarPago}
            onCarrito={() => setModal('carrito')}
            onIrTienda={() => irA('productos')}
          />
        )}
      </main>

      <LoginModal
        abierto={modal === 'login'}
        onCerrar={cerrarModal}
        onLoginExitoso={alLoginExitoso}
      />
      <RegistroModal
        abierto={modal === 'registro'}
        onCerrar={cerrarModal}
        onRegistrar={alRegistrar}
      />
      <CarritoModal
        abierto={modal === 'carrito'}
        onCerrar={cerrarModal}
        onPagar={iniciarCheckout}
      />
      <PagoTarjetaModal
        abierto={modal === 'pago'}
        onCerrar={cerrarModal}
        onPagoExitoso={alPagoProcesado}
      />
    </>
  );
}