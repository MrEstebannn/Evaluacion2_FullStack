/** Se muestra únicamente durante septiembre (mes 8 en JavaScript). */
export default function BannerCupon({ fecha = new Date() }) {
  if (fecha.getMonth() !== 8) return null;

  return (
    <div className="container my-5">
      <div className="card shadow border-0 bg-warning bg-gradient text-dark text-center p-4 rounded-4">
        <h2 className="fw-bold mb-2">🎉 ¡CUPÓN DE DESCUENTO ESPECIAL DE SEPTIEMBRE! 🎉</h2>
        <p className="fs-5 mb-3">Utiliza el código de descuento en tu carrito de compras durante este mes:</p>
        <div className="d-inline-block bg-dark text-white fw-bold fs-3 px-4 py-2 rounded-pill shadow-sm align-self-center mb-2">
          SEPTIEMBRE10
        </div>
        <small className="text-dark fw-semibold">¡Aprovecha $5.000 de rebaja directa en tu total!</small>
      </div>
    </div>
  );
}
