const TARJETAS = [
  { titulo: 'Misión', texto: 'Promover el bienestar físico y emocional a través de clases de baile de alto nivel accesible a todo público.' },
  { titulo: 'Visión', texto: 'Ser la academia digital de danza líder en el país, integrando tecnología y aprendizaje de vanguardia.' },
  { titulo: '¿Por qué elegirnos?', texto: 'Cupos reducidos por clase, instructores especializados por estilo y una plataforma pensada para que tú controles tu proceso: inscripciones, pagos y seguimiento, todo en un solo lugar.' },
];

export default function NosotrosPage() {
  return (
    <div className="container my-5 pt-4" id="nosotros-seccion">
      <div className="bg-light p-4 p-md-5 rounded-4 shadow-sm border">
        <h2 className="fw-bold mb-3 text-center texto-hype">Sobre HYPE ACADEMIC</h2>
        <p className="fs-6 text-secondary text-center mb-4">
          Somos una academia comprometida con la formación artística e integral de bailarines. Nuestro objetivo es brindar un espacio inclusivo, técnico y dinámico donde la comunidad pueda desarrollar su disciplina al ritmo de la música.
        </p>
        <div className="row text-center g-3">
          {TARJETAS.map((t) => (
            <div className="col-md-4" key={t.titulo}>
              <div className="p-3 bg-white rounded shadow-sm border h-100">
                <h5 className="fw-bold">{t.titulo}</h5>
                <p className="small text-muted">{t.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
