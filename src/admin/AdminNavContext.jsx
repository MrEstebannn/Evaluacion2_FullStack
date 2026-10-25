import { createContext, useContext } from 'react';

export const AdminNavContext = createContext(null);

export function useAdminNav() {
  const ctx = useContext(AdminNavContext);
  if (!ctx) throw new Error('useAdminNav debe usarse dentro de <AdminLayout>');
  return ctx;
}
