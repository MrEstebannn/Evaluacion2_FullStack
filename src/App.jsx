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

export default function App() {
  const { carrito, registrarUsuario, crearOrden, productos, actualizarProducto, notificar } = useTienda();
  const [seccion, setSeccion] = useState('inicio');
  const [modal, setModal] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busquedaNavbar, setBusquedaNavbar] = useState({ texto: '', n: 0 });

  const cerrarModal = () => setModal(null);

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

  const irAAncla = (idAncla) => {
    if (seccion !== 'inicio') {
      empujarHistorial({ seccion: 'inicio' });
      setSeccion('inicio');
    }
    setMenuAbierto(false);
    setTimeout(() => document.getElementById(idAncla)?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  const buscarDesdeNavbar = (texto) => {
    setBusquedaNavbar((anterior) => ({ texto, n: anterior.n + 1 }));
    irA('productos');
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
    crearOrden({
      cliente: { run: '—', nombre: 'Cliente web', correo: 'sin-sesion@hype.cl' },
      items: carrito.items.map(({ nombre, precio, cantidad, idProducto }) => ({ nombre, precio, cantidad, ...(idProducto && { idProducto }) })),
      descuento: carrito.descuento,
    });

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
      />
      <MenuLateral abierto={menuAbierto} items={ITEMS_MENU} onCerrar={() => setMenuAbierto(false)} onSeleccionar={seleccionarItemMenu} />

      <main>
        {seccion === 'inicio' && <InicioPage onIrATienda={() => irA('productos')} onAbrirCarrito={() => setModal('carrito')} />}
        {seccion === 'productos' && <ProductosPage key={busquedaNavbar.n} busqueda={busquedaNavbar.texto} />}
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
