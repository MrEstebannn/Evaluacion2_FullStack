const DATOS = [
  { icono: '📍', titulo: 'Ubicación', lineas: ['Av. Principal #123', 'Santiago, Chile'] },
  { icono: '📞', titulo: 'Teléfono', lineas: ['+56 9 1234 5678', '+56 2 2345 6789'] },
  { icono: '✉️', titulo: 'Contacto', lineas: ['contacto@academia.cl'] },
];

export default function ContactoInfo() {
  return (
    <div className="container my-5 pt-4" id="contacto-info">
      <div className="bg-dark text-white p-4 p-md-5 rounded-4 shadow">
        <div className="row row-cols-1 row-cols-md-4 g-4 text-center align-items-center">
          <div className="col">
            <h2 className="fw-bold mb-1">Contáctanos</h2>
            <p className="small text-white-50 mb-0">Estamos disponibles 24/7 para tus dudas.</p>
          </div>
          {DATOS.map((d) => (
            <div className="col" key={d.titulo}>
              <h5 className="fw-bold mb-1">{d.icono} {d.titulo}</h5>
              <p className="small text-white-50 mb-0">
                {d.lineas.map((linea, i) => (
                  <span key={linea}>
                    {linea}
                    {i < d.lineas.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
