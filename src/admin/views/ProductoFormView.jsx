import { useTienda } from '../../context/TiendaContext';
import { useAdminNav } from '../AdminNavContext';
import { useFormulario } from '../../hooks/useFormulario';
import { validarProducto } from '../../utils/validaciones';
import { descuentoValido } from '../adminValidaciones';
import Campo from '../../components/common/Campo';
import PageHeader from '../components/PageHeader';

const validar = (v) => ({ ...validarProducto(v), ...(descuentoValido(v.descuento) ? {} : { descuento: true }) });

function FormularioProducto({ producto }) {
  const { categorias, agregarProducto, actualizarProducto, notificar } = useTienda();
  const { ir } = useAdminNav();
  const editando = Boolean(producto);

  const { valores, errores, enviado, onChange, enviar } = useFormulario(
    {
      codigo: producto?.codigo ?? '',
      nombre: producto?.nombre ?? '',
      categoria: producto?.categoria ?? '',
      precio: producto ? String(producto.precio) : '',
      stock: producto ? String(producto.stock) : '',
      stockCritico: producto ? String(producto.stockCritico ?? '') : '',
      descuento: producto?.descuento ? String(producto.descuento) : '',
      imagen: producto?.imagen ?? '',
      desc: producto?.desc ?? '',
    },
    validar
  );
  const estado = (campo) => ({ error: Boolean(errores[campo]), validado: enviado && !errores[campo] });

  const guardar = (v) => {
    const datos = {
      codigo: v.codigo.trim(),
      nombre: v.nombre.trim(),
      categoria: v.categoria,
      precio: parseFloat(v.precio),
      stock: parseInt(v.stock, 10),
      stockCritico: v.stockCritico !== '' ? parseInt(v.stockCritico, 10) : 0,
      descuento: v.descuento !== '' ? parseInt(v.descuento, 10) : 0,
      ...(v.imagen.trim() && { imagen: v.imagen.trim() }),
      ...(v.desc.trim() && { desc: v.desc.trim() }),
    };
    if (editando) {
      actualizarProducto(producto.id, datos);
      notificar('Producto actualizado correctamente.');
    } else {
      agregarProducto(datos);
      notificar('Producto guardado correctamente.');
    }
    ir('productos');
  };

  return (
    <form onSubmit={enviar(guardar)} noValidate>
      <div className="row g-3">
        <div className="col-md-4">
          <Campo id="prodCodigo" name="codigo" label="Código" value={valores.codigo} onChange={onChange} feedback="Código requerido (mínimo 3 caracteres)." {...estado('codigo')} />
        </div>
        <div className="col-md-8">
          <Campo id="prodNombre" name="nombre" label="Nombre" maxLength={100} value={valores.nombre} onChange={onChange} feedback="Nombre requerido (máx 100 caracteres)." {...estado('nombre')} />
        </div>
        <div className="col-md-4">
          <Campo id="prodCategoria" name="categoria" as="select" label="Categoría" value={valores.categoria} onChange={onChange} feedback="Selecciona una categoría." {...estado('categoria')}>
            <option value="">Seleccione una categoría</option>
            {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </Campo>
        </div>
        <div className="col-md-4">
          <Campo id="prodPrecio" name="precio" type="number" min="0" step="1" label="Precio ($)" value={valores.precio} onChange={onChange} feedback="Precio requerido (mayor o igual a 0)." {...estado('precio')} />
        </div>
        <div className="col-md-4">
          <Campo id="prodDescuento" name="descuento" type="number" min="0" max="90" step="1" label="Oferta: descuento (%)" value={valores.descuento} onChange={onChange} feedback="Ingresa un entero entre 0 y 90." {...estado('descuento')} />
        </div>
        <div className="col-md-6">
          <Campo id="prodStock" name="stock" type="number" min="0" step="1" label="Stock" value={valores.stock} onChange={onChange} feedback="Stock requerido." {...estado('stock')} />
        </div>
        <div className="col-md-6">
          <Campo id="prodCritico" name="stockCritico" type="number" min="0" step="1" label="Stock crítico" value={valores.stockCritico} onChange={onChange} />
        </div>
        <div className="col-12">
          <Campo id="prodImagen" name="imagen" label="Imagen (ruta o URL, opcional)" placeholder="/img/mi-producto.webp" value={valores.imagen} onChange={onChange} />
        </div>
        <div className="col-12">
          <Campo id="prodDesc" name="desc" as="textarea" rows={3} maxLength={500} label="Descripción (opcional)" value={valores.desc} onChange={onChange} />
        </div>
      </div>
      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-secondary" onClick={() => ir('productos')}>Cancelar</button>
        <button type="submit" className="btn btn-primary fw-bold">{editando ? 'Guardar cambios' : 'Guardar producto'}</button>
      </div>
    </form>
  );
}

export default function ProductoFormView() {
  const { productos } = useTienda();
  const { ruta, ir } = useAdminNav();
  const producto = ruta.id ? productos.find((p) => p.id === ruta.id) : null;

  if (ruta.id && !producto) {
    return <div className="alert alert-warning">No se encontró el producto. <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => ir('productos')}>Volver al listado</button></div>;
  }

  return (
    <>
      <PageHeader titulo={producto ? 'Editar producto' : 'Nuevo producto'} subtitulo={producto ? producto.codigo : 'Completa los datos para agregarlo al catálogo.'} />
      <div className="card admin-card" style={{ maxWidth: 860 }}>
        <div className="card-body p-4">
          <FormularioProducto key={producto?.id ?? 'nuevo'} producto={producto} />
        </div>
      </div>
    </>
  );
}
