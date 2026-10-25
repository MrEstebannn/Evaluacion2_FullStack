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
import { ITEMS_MENU } from './data/catalogo';
import { useTienda } from './context/TiendaContext';
import { empujarHistorial, estadoActual, reemplazarHistorial } from './utils/historial';

/**
 * Componente raíz: decide qué "página" se muestra (estado `seccion`)
 * y cuál modal está abierto (estado `modal`). Reemplaza mostrarSeccion() del HTML.
 */
export default function App() {
  const { carrito, registrarUsuario, crearOrden, productos, actualizarProducto, notificar } = useTienda();
  const [seccion, setSeccion] = useState('inicio');
  const [modal, setModal] = useState(null); // 'login' | 'registro' | 'carrito' | 'pago' | null
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarModal = () => setModal(null);

  // Historial del navegador: el botón Atrás vuelve a la sección anterior en vez de salir del sitio
  useEffect(() => {
    if (!estadoActual()?.seccion) reemplazarHistorial({ seccion: 'inicio' });

    const alVolver = (e) => {
      setSeccion(e.state?.seccion ?? 'inicio');
      setModal(null);
      setMenuAbierto(false);
    };
    window.addEventListener('popstate', alVolver);
    return () => window.removeEventListener('popstate', alVolver);
  }, []);

  const irA = (destino) => {
    if (destino !== seccion) {
      empujarHistorial(destino === 'admin' ? { seccion: 'admin', ruta: { vista: 'dashboard' } } : { seccion: destino });
      setSeccion(destino);
    }
    setMenuAbierto(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vuelve al Inicio y baja con scroll suave hasta un bloque (Clases, Membresías o Contacto)
  const irAAncla = (idAncla) => {
    if (seccion !== 'inicio') {
      empujarHistorial({ seccion: 'inicio' });
      setSeccion('inicio');
    }
    setMenuAbierto(false);
    setTimeout(() => document.getElementById(idAncla)?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  const seleccionarItemMenu = (item) => (item.tipo === 'ancla' ? irAAncla(item.destino) : irA(item.destino));

  const alLoginExitoso = () => {
    notificar('¡Inicio de sesión exitoso!');
    cerrarModal();
  };

  const alRegistrar = (datosUsuario) => {
    const resultado = registrarUsuario(datosUsuario);
    if (resultado.ok) {
      notificar('Usuario registrado exitosamente.');
      cerrarModal();
    }
    return resultado;
  };

  const alPagoExitoso = () => {
    // Registra la compra como orden para que aparezca en el panel de administración
    crearOrden({
      cliente: { run: '—', nombre: 'Cliente web', correo: 'sin-sesion@hype.cl' },
      items: carrito.items.map(({ nombre, precio, cantidad, idProducto }) => ({ nombre, precio, cantidad, ...(idProducto && { idProducto }) })),
      descuento: carrito.descuento,
    });

    // Descuenta del inventario los productos vendidos (las clases y membresías no tienen stock)
    carrito.items
      .filter((item) => item.idProducto)
      .forEach((item) => {
        const producto = productos.find((p) => p.id === item.idProducto);
        if (producto) actualizarProducto(producto.id, { stock: Math.max(producto.stock - item.cantidad, 0) });
      });

    notificar('¡Pago procesado con éxito! Gracias por tu compra.');
    carrito.vaciarCarrito();
    cerrarModal();
  };

  // El panel de administración tiene su propio layout (sin la barra de la tienda)
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
      />
      <MenuLateral abierto={menuAbierto} items={ITEMS_MENU} onCerrar={() => setMenuAbierto(false)} onSeleccionar={seleccionarItemMenu} />

      <main>
        {seccion === 'inicio' && <InicioPage onIrATienda={() => irA('productos')} onAbrirCarrito={() => setModal('carrito')} />}
        {seccion === 'productos' && <ProductosPage />}
        {seccion === 'nosotros' && <NosotrosPage />}
        {seccion === 'blogs' && <BlogsPage />}
        {seccion === 'contacto' && <ContactoPage />}
      </main>

      <LoginModal abierto={modal === 'login'} onCerrar={cerrarModal} onLoginExitoso={alLoginExitoso} />
      <RegistroModal abierto={modal === 'registro'} onCerrar={cerrarModal} onRegistrar={alRegistrar} />
      <CarritoModal abierto={modal === 'carrito'} onCerrar={cerrarModal} onPagar={() => setModal('pago')} />
      <PagoTarjetaModal abierto={modal === 'pago'} onCerrar={cerrarModal} onPagoExitoso={alPagoExitoso} />
    </>
  );
}
