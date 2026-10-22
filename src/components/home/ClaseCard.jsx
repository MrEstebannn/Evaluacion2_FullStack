import { formatoCLP } from '../../utils/formato';

/** Tarjeta de una clase de baile. Es "tonta": recibe todo por props. */
export default function ClaseCard({ clase, onInscribir }) {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0">
        <img src={clase.imagen} className="card-img-top img-cover-160" alt={clase.estilo} />
        <div className="card-body d-flex flex-column">
          <div>
            <span className="badge rounded-pill mb-2 text-white" style={{ backgroundColor: clase.color }}>
              {clase.estilo}
            </span>
            <h3 className="h6 mb-1">{clase.nombre}</h3>
            <p className="small text-muted mb-1">{clase.duracion} min · {clase.cupos} cupos</p>
            <p className="fw-bold mb-2">{formatoCLP(clase.precio)}</p>
          </div>
          <button type="button" className="btn text-white mt-auto" style={{ backgroundColor: clase.color }} onClick={() => onInscribir(clase)}>
            Inscribirme
          </button>
        </div>
      </div>
    </div>
  );
}
