import { CLASES } from '../../data/catalogo';
import { useTienda } from '../../context/TiendaContext';
import ClaseCard from './ClaseCard';

export default function ClasesSection({ onAbrirCarrito }) {
  const { carrito } = useTienda();

  const inscribir = (clase) => {
    if (carrito.agregarClase(clase.nombre, clase.precio, clase.cupos)) onAbrirCarrito();
  };

  return (
    <div className="container my-5" id="clases">
      <h1 className="text-center fw-bold mb-2">Nuestras clases</h1>
      <h5 className="text-center text-muted mb-4 fs-6">Elige el estilo que más te acomode. Cupos limitados por clase.</h5>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
        {CLASES.map((clase) => (
          <ClaseCard key={clase.id} clase={clase} onInscribir={inscribir} />
        ))}
      </div>
    </div>
  );
}
