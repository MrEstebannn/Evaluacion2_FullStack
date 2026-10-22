import { useState } from 'react';
import { BLOGS } from '../data/catalogo';
import BlogCard from '../components/blogs/BlogCard';
import Modal from '../components/common/Modal';

export default function BlogsPage() {
  const [blogAbierto, setBlogAbierto] = useState(null);

  return (
    <div className="container my-5 pt-4" id="blogs-seccion">
      <h1 className="text-center fw-bold mb-2">Noticias y Casos Curiosos</h1>
      <h5 className="text-center text-muted mb-4 fs-6">Descubre artículos interesantes y datos sobre la cultura de la danza.</h5>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {BLOGS.map((b) => (
          <BlogCard key={b.id} blog={b} onVer={setBlogAbierto} />
        ))}
      </div>

      <Modal abierto={Boolean(blogAbierto)} titulo={blogAbierto?.titulo ?? ''} onCerrar={() => setBlogAbierto(null)} tamano="modal-lg">
        <p className="fs-6">{blogAbierto?.texto}</p>
      </Modal>
    </div>
  );
}
