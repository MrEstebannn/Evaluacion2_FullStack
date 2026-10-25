import { useEffect } from 'react';

export default function Modal({ abierto, titulo, onCerrar, tamano = '', footer = null, children }) {
  useEffect(() => {
    if (!abierto) return undefined;
    document.body.classList.add('modal-open');
    const alPresionarTecla = (e) => e.key === 'Escape' && onCerrar();
    document.addEventListener('keydown', alPresionarTecla);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', alPresionarTecla);
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <>
      <div
        className="modal d-block show"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}
      >
        <div className={`modal-dialog modal-dialog-centered ${tamano}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">{titulo}</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}
