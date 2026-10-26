import { BLOGS } from '../data/catalogo';
import BlogCard from '../components/blogs/BlogCard';

export default function BlogsPage({ onVerBlog = () => {} }) {
  return (
    <div className="container my-5 pt-4" id="blogs-seccion">
      <h1 className="text-center fw-bold mb-2">Noticias y Casos Curiosos</h1>
      <h5 className="text-center text-muted mb-4 fs-6">
        Descubre artículos interesantes y datos sobre la cultura de la danza.
      </h5>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {BLOGS.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onVer={() => onVerBlog(blog.id)}
          />
        ))}
      </div>
    </div>
  );
}