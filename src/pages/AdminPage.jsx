import AdminLayout from '../admin/AdminLayout';

/** Punto de entrada del panel de administración (el detalle vive en src/admin/). */
export default function AdminPage({ onSalirATienda = () => {} }) {
  return <AdminLayout onSalirATienda={onSalirATienda} />;
}
