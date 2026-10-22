export default function BannerPromocional({ onIrATienda }) {
  return (
    <div className="container-fluid py-5 bg-hype text-white">
      <div className="container text-center">
        <div className="row row-cols-1 row-cols-md-2 align-items-center g-4">
          <div className="col">
            <h2 className="fw-bold mb-3">Mantente sano al ritmo de la musica</h2>
            <p className="h5 fw-normal">
              Academia de danza con clases variadas,<br />
              inscríbete en línea y revisa tu asistencia y progreso desde tu celular.
            </p>
            <button type="button" className="btn btn-light fw-bold mt-2" onClick={onIrATienda}>
              🛍️ Tienda de Productos
            </button>
          </div>
          <div className="col">
            <img
              src="/img/logo-promocional.png"
              className="img-fluid rounded shadow w-100"
              alt="Clase de baile"
              style={{ height: 350, objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
