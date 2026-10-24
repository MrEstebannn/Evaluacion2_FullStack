/** Fila "nombre ........ valor" con barra de progreso de Bootstrap. */
export default function BarraProgreso({ etiqueta, valorTexto, porcentaje, color = 'primary' }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between small mb-1">
        <span className="fw-semibold">{etiqueta}</span>
        <span className="text-muted">{valorTexto}</span>
      </div>
      <div className="progress" style={{ height: 8 }}>
        <div className={`progress-bar bg-${color}`} style={{ width: `${Math.max(0, Math.min(100, porcentaje))}%` }} />
      </div>
    </div>
  );
}
