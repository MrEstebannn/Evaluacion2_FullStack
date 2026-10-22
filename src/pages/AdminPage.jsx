import { useState } from 'react';
import { useTienda } from '../context/TiendaContext';
import TablaUsuarios from '../components/admin/TablaUsuarios';
import TablaProductos from '../components/admin/TablaProductos';
import NuevoProductoModal from '../components/admin/NuevoProductoModal';

export default function AdminPage() {
  const { usuarios, productos, agregarProducto, eliminarProducto, eliminarUsuario, notificar } = useTienda();
  const [pestana, setPestana] = useState('usuarios');
  const [modalNuevo, setModalNuevo] = useState(false);

  const guardarProducto = (datos) => {
    agregarProducto(datos);
    notificar('Producto guardado correctamente.');
    setModalNuevo(false);
  };

  const borrarProducto = (p) => {
    if (window.confirm(`¿Eliminar el producto "${p.nombre}"?`)) {
      eliminarProducto(p.id);
      notificar('Producto eliminado.');
    }
  };

  const borrarUsuario = (u) => {
    if (window.confirm(`¿Eliminar al usuario ${u.nombre} ${u.apellidos}?`)) {
      eliminarUsuario(u.run);
      notificar('Usuario eliminado.');
    }
  };

  return (
    <div className="container my-5 pt-4" id="admin-seccion">
      <div className="card shadow-sm border-0 p-4">
        <h2 className="fw-bold mb-4">Panel de Administración</h2>

        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <button type="button" role="tab" className={`nav-link fw-semibold ${pestana === 'usuarios' ? 'active' : ''}`} onClick={() => setPestana('usuarios')}>
              Gestión de Usuarios
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" role="tab" className={`nav-link fw-semibold ${pestana === 'productos' ? 'active' : ''}`} onClick={() => setPestana('productos')}>
              Gestión de Productos
            </button>
          </li>
        </ul>

        {pestana === 'usuarios' ? (
          <TablaUsuarios usuarios={usuarios} onEliminar={borrarUsuario} />
        ) : (
          <TablaProductos productos={productos} onNuevo={() => setModalNuevo(true)} onEliminar={borrarProducto} />
        )}
      </div>

      <NuevoProductoModal abierto={modalNuevo} onCerrar={() => setModalNuevo(false)} onGuardar={guardarProducto} />
    </div>
  );
}
