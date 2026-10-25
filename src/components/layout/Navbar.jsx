export default function Navbar({ cantidadCarrito, onIrInicio, onAbrirLogin, onAbrirRegistro, onAbrirCarrito, onAbrirMenu }) {
  return (
    <nav className="navbar bg-body-tertiary fixed-top px-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={onIrInicio} role="button">
          <img src="/img/logo-pagina.png" alt="Logo" width="70" height="70" />
          <h5 className="m-0 fw-bold">HYPE ACADEMIC</h5>
        </div>

        <div className="d-flex align-items-center ms-auto gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onAbrirLogin}>Iniciar Sesión</button>
          <button type="button" className="btn btn-outline-dark" onClick={onAbrirRegistro}>Inscribirse</button>
          <button type="button" className="btn btn-primary position-relative btn-hype" onClick={onAbrirCarrito}>
            🛒 Carrito
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" data-testid="cart-count">
              {cantidadCarrito}
            </span>
          </button>
          <span className="navbar-brand m-0 fs-6 fw-semibold ms-2">MENU</span>
        </div>

        <button className="navbar-toggler ms-2" type="button" aria-label="Abrir menú" onClick={onAbrirMenu}>
          <span className="navbar-toggler-icon" />
        </button>
      </div>
    </nav>
  );
}
