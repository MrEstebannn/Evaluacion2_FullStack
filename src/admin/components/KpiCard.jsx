/** Tarjeta de indicador. `color` es un color de Bootstrap: primary, success, warning, danger, info. */
export default function KpiCard({ icono, titulo, valor, detalle, color = 'primary', onClick }) {
  return (
    <div className="card admin-card h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`kpi-icono bg-${color}-subtle text-${color}-emphasis`}>
          <i className={`bi bi-${icono}`} />
        </div>
        <div className="flex-grow-1">
          <div className="text-muted small">{titulo}</div>
          <div className="h4 fw-bold mb-0">{valor}</div>
          {detalle && <small className="text-muted">{detalle}</small>}
        </div>
        {onClick && (
          <button type="button" className="btn btn-sm btn-light rounded-circle" aria-label={`Ver ${titulo}`} onClick={onClick}>
            <i className="bi bi-arrow-right" />
          </button>
        )}
      </div>
    </div>
  );
}
