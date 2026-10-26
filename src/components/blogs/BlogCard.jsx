export default function BlogCard({ blog, onVer }) {
  return (
    <div className="col">
      <div className="card h-100 border-0 shadow-sm">
        <img
          src={blog.imagen}
          className="card-img-top img-cover-220"
          alt={blog.titulo}
        />
        <div className="card-body d-flex flex-column">
          <h4 className="card-title fw-bold">{blog.titulo}</h4>
          <p className="card-text text-muted">{blog.resumen}</p>
          <button
            className="btn btn-hype text-white mt-auto align-self-start"
            onClick={() => onVer(blog)}
          >
            Ver Caso
          </button>
        </div>
      </div>
    </div>
  );
}