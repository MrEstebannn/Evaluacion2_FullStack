const COLORES = { Pagada: 'success', Pendiente: 'warning', Cancelada: 'danger' };

export default function EstadoBadge({ estado }) {
  return <span className={`badge rounded-pill text-bg-${COLORES[estado] ?? 'secondary'}`}>{estado}</span>;
}
