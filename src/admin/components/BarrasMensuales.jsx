import { formatoCLP } from '../../utils/formato';

/** Gráfico de barras sencillo hecho solo con HTML/CSS (sin librerías). */
export default function BarrasMensuales({ datos }) {
  const maximo = Math.max(...datos.map((d) => d.total), 1);

  return (
    <div className="barras" role="img" aria-label="Ventas por mes">
      {datos.map((d) => (
        <div className="col-barra" key={d.clave} title={`${d.etiqueta}: ${formatoCLP(d.total)} (${d.ordenes} órdenes)`}>
          <small className="text-muted mb-1">{d.total ? `$${Math.round(d.total / 1000)}k` : '–'}</small>
          <div className="barra" style={{ height: `${(d.total / maximo) * 100}%` }} />
          <small className="fw-semibold mt-1">{d.etiqueta}</small>
        </div>
      ))}
    </div>
  );
}
