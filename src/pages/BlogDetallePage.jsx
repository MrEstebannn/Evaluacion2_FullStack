import { BLOGS } from '../data/catalogo';

export default function BlogDetallePage({ id, onVolver }) {
  const blog = BLOGS.find((articulo) => String(articulo.id) === String(id));

  if (!blog) {
    return (
      <div className="container my-5 pt-5">
        <div className="alert alert-warning">No encontramos ese artículo.</div>
        <button className="btn btn-outline-dark" onClick={onVolver}>
          ← Volver a noticias
        </button>
      </div>
    );
  }

  return (
    <article className="container my-5 pt-5">
      <button className="btn btn-link px-0 mb-3" onClick={onVolver}>
        ← Volver a noticias
      </button>
      <h1 className="fw-bold">{blog.titulo}</h1>
      <img
        src={blog.imagen}
        alt={blog.titulo}
        className="img-fluid rounded my-3"
        style={{ maxHeight: 420 }}
      />
      <p className="fs-5 text-muted">{blog.resumen}</p>
      <p className="fs-5">{blog.texto}</p>
    </article>
  );
}