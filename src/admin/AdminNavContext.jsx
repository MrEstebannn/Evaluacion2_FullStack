import { createContext, useContext } from 'react';

/** Navegación interna del panel: { ruta: { vista, ...params }, ir(vista, params) } */
export const AdminNavContext = createContext(null);

export function useAdminNav() {
  const ctx = useContext(AdminNavContext);
  if (!ctx) throw new Error('useAdminNav debe usarse dentro de <AdminLayout>');
  return ctx;
}
