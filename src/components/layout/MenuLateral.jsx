/** Menú lateral (offcanvas de Bootstrap controlado por estado de React). */
export default function MenuLateral({ abierto, items, onCerrar, onSeleccionar }) {
  if (!abierto) return null;

  return (
    <>
      <div className="offcanvas offcanvas-end show" tabIndex="-1" aria-labelledby="menuLateralTitulo">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-bold" id="menuLateralTitulo">MENU</h5>
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            {items.map((item) => (
              <li className="nav-item" key={item.etiqueta}>
                <button type="button" className="nav-link btn btn-link text-start" onClick={() => onSeleccionar(item)}>
                  <h4>➡️{item.etiqueta}</h4>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="offcanvas-backdrop fade show" onClick={onCerrar} />
    </>
  );
}
