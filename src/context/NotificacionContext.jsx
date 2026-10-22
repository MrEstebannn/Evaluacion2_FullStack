import { createContext, useCallback, useContext, useState } from 'react';

const NotificacionContext = createContext(null);

/** Reemplaza los alert() del HTML original por avisos (toasts) de Bootstrap. */
export function NotificacionProvider({ children }) {
  const [mensajes, setMensajes] = useState([]);

  const cerrar = useCallback((id) => {
    setMensajes((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const notificar = useCallback(
    (texto, tipo = 'success') => {
      const id = `${Date.now()}-${Math.random()}`;
      setMensajes((prev) => [...prev, { id, texto, tipo }]);
      setTimeout(() => cerrar(id), 3500);
    },
    [cerrar]
  );

  return (
    <NotificacionContext.Provider value={{ notificar }}>
      {children}
      <div className="toast-container position-fixed top-0 end-0 p-3 contenedor-toasts">
        {mensajes.map((m) => (
          <div key={m.id} className={`toast show align-items-center text-bg-${m.tipo} border-0 mb-2`} role="alert">
            <div className="d-flex">
              <div className="toast-body">{m.texto}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Cerrar" onClick={() => cerrar(m.id)} />
            </div>
          </div>
        ))}
      </div>
    </NotificacionContext.Provider>
  );
}

export function useNotificacion() {
  const ctx = useContext(NotificacionContext);
  if (!ctx) throw new Error('useNotificacion debe usarse dentro de <NotificacionProvider>');
  return ctx;
}
