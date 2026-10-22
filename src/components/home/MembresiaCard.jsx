import { formatoCLP } from '../../utils/formato';

export default function MembresiaCard({ membresia, onElegir }) {
  const { nombre, descripcion, precio, unidad, color } = membresia;
  const estiloBoton = color ? { backgroundColor: color } : undefined;
  const claseBoton = color ? 'btn text-white' : 'btn btn-outline-secondary';

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold">{nombre}</h5>
          <p className="small text-muted">{descripcion}</p>
          <p className="fs-5 fw-bold mb-3">
            {formatoCLP(precio)}
            <span className="fs-6 text-muted fw-normal">/{unidad}</span>
          </p>
          <button type="button" className={`${claseBoton} mt-auto fw-semibold`} style={estiloBoton} onClick={() => onElegir(membresia)}>
            Elegir plan
          </button>
        </div>
      </div>
    </div>
  );
}
