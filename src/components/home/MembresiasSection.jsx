import { MEMBRESIAS } from '../../data/catalogo';
import { useTienda } from '../../context/TiendaContext';
import MembresiaCard from './MembresiaCard';

export default function MembresiasSection({ onAbrirCarrito }) {
  const { carrito } = useTienda();

  const elegir = (m) => {
    if (carrito.agregarClase(m.tituloItem, m.precio, m.cupoMax)) onAbrirCarrito();
  };

  return (
    <div className="container my-5 pt-4" id="membresias">
      <h1 className="text-center mb-2 fw-bold">Tipos de membresía</h1>
      <h5 className="text-center text-muted mb-4 fs-6">Elige el plan que más se ajuste a tu ritmo de práctica.</h5>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {MEMBRESIAS.map((m) => (
          <MembresiaCard key={m.id} membresia={m} onElegir={elegir} />
        ))}
      </div>
    </div>
  );
}
