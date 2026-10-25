import { useState } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { useFormulario } from '../../hooks/useFormulario';
import Modal from '../../components/common/Modal';
import Campo from '../../components/common/Campo';
import PageHeader from '../components/PageHeader';

function FormularioCategoria({ categoria, categorias, onGuardar }) {
  const validar = (v) => {
    const errores = {};
    const nombre = v.nombre.trim();
    const repetida = categorias.some((c) => c.id !== categoria?.id && c.nombre.toLowerCase() === nombre.toLowerCase());
    if (nombre.length < 2 || nombre.length > 40 || repetida) errores.nombre = true;
    return errores;
  };
  const { valores, errores, enviado, onChange, enviar } = useFormulario({ nombre: categoria?.nombre ?? '', descripcion: categoria?.descripcion ?? '' }, validar);

  return (
    <form onSubmit={enviar((v) => onGuardar({ nombre: v.nombre.trim(), descripcion: v.descripcion.trim() }))} noValidate>
      <Campo id="catNombre" name="nombre" label="Nombre" maxLength={40} value={valores.nombre} onChange={onChange}
        error={Boolean(errores.nombre)} validado={enviado && !errores.nombre} feedback="Nombre requerido (2 a 40 caracteres) y distinto al de otra categoría." />
      <Campo id="catDescripcion" name="descripcion" as="textarea" rows={3} maxLength={200} label="Descripción (opcional)" value={valores.descripcion} onChange={onChange} />
      <button type="submit" className="btn btn-primary w-100 fw-bold">{categoria ? 'Guardar cambios' : 'Crear categoría'}</button>
    </form>
  );
}

export default function CategoriasView() {
  const { categorias, productos, agregarCategoria, actualizarCategoria, eliminarCategoria, actualizarProducto, notificar } = useTienda();
  const [modal, setModal] = useState(null);

  const cantidadProductos = (nombre) => productos.filter((p) => p.categoria === nombre).length;

  const guardar = (datos) => {
    if (modal.categoria) {
      const anterior = modal.categoria.nombre;
      actualizarCategoria(modal.categoria.id, datos);
      if (anterior !== datos.nombre) productos.filter((p) => p.categoria === anterior).forEach((p) => actualizarProducto(p.id, { categoria: datos.nombre }));
      notificar('Categoría actualizada.');
    } else {
      agregarCategoria(datos);
      notificar('Categoría creada.');
    }
    setModal(null);
  };

  const borrar = (c) => {
    if (cantidadProductos(c.nombre) > 0) {
      notificar('No puedes eliminar una categoría que tiene productos asociados.', 'danger');
      return;
    }
    if (window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) {
      eliminarCategoria(c.id);
      notificar('Categoría eliminada.');
    }
  };

  return (
    <>
      <PageHeader titulo="Categorías" subtitulo="Organiza los productos de la tienda.">
        <button type="button" className="btn btn-primary" onClick={() => setModal({})}><i className="bi bi-plus-lg me-2" />Nueva categoría</button>
      </PageHeader>

      <div className="row g-3">
        {categorias.map((c) => (
          <div className="col-md-6 col-xl-4" key={c.id}>
            <div className="card admin-card h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold mb-0">{c.nombre}</h5>
                  <span className="badge text-bg-primary rounded-pill">{cantidadProductos(c.nombre)} productos</span>
                </div>
                <p className="text-muted flex-grow-1">{c.descripcion || 'Sin descripción.'}</p>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setModal({ categoria: c })}><i className="bi bi-pencil" /> Editar</button>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => borrar(c)}><i className="bi bi-trash" /> Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {categorias.length === 0 && <div className="col-12"><div className="alert alert-info">Todavía no hay categorías. Crea la primera.</div></div>}
      </div>

      <Modal abierto={Boolean(modal)} titulo={modal?.categoria ? 'Editar categoría' : 'Nueva categoría'} onCerrar={() => setModal(null)}>
        {modal && <FormularioCategoria categoria={modal.categoria} categorias={categorias} onGuardar={guardar} />}
      </Modal>
    </>
  );
}
