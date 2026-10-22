import Modal from '../common/Modal';
import Campo from '../common/Campo';
import { useFormulario } from '../../hooks/useFormulario';
import { validarProducto } from '../../utils/validaciones';
import { CATEGORIAS_PRODUCTO } from '../../data/catalogo';

const INICIAL = { codigo: '', nombre: '', categoria: '', precio: '', stock: '', stockCritico: '', desc: '' };

function FormularioProducto({ onGuardar }) {
  const { valores, errores, enviado, onChange, enviar } = useFormulario(INICIAL, validarProducto);
  const estado = (campo) => ({ error: Boolean(errores[campo]), validado: enviado && !errores[campo] });

  const alExito = (v) =>
    onGuardar({
      codigo: v.codigo.trim(),
      nombre: v.nombre.trim(),
      categoria: v.categoria,
      precio: parseFloat(v.precio),
      stock: parseInt(v.stock, 10),
      stockCritico: v.stockCritico !== '' ? parseInt(v.stockCritico, 10) : 0,
      ...(v.desc.trim() && { desc: v.desc.trim() }),
    });

  return (
    <form onSubmit={enviar(alExito)} noValidate>
      <Campo id="prodCodigo" name="codigo" label="Código" value={valores.codigo} onChange={onChange}
        feedback="Código requerido (mínimo 3 caracteres)." {...estado('codigo')} />
      <Campo id="prodNombre" name="nombre" label="Nombre" maxLength={100} value={valores.nombre} onChange={onChange}
        feedback="Nombre requerido (máx 100 caracteres)." {...estado('nombre')} />
      <Campo id="prodCategoria" name="categoria" as="select" label="Categoría" value={valores.categoria} onChange={onChange}
        feedback="Selecciona una categoría." {...estado('categoria')}>
        <option value="">Seleccione una categoría</option>
        {CATEGORIAS_PRODUCTO.map((c) => <option key={c} value={c}>{c}</option>)}
      </Campo>
      <Campo id="prodPrecio" name="precio" type="number" min="0" step="1" label="Precio ($)" value={valores.precio} onChange={onChange}
        feedback="Precio requerido (mayor o igual a 0)." {...estado('precio')} />
      <div className="row g-2">
        <div className="col-6">
          <Campo id="prodStock" name="stock" type="number" min="0" step="1" label="Stock" value={valores.stock} onChange={onChange}
            feedback="Stock requerido." {...estado('stock')} />
        </div>
        <div className="col-6">
          <Campo id="prodCritico" name="stockCritico" type="number" min="0" step="1" label="Stock Crítico" value={valores.stockCritico} onChange={onChange} />
        </div>
      </div>
      <Campo id="prodDesc" name="desc" as="textarea" rows={2} maxLength={500} label="Descripción (Opcional)" value={valores.desc} onChange={onChange} />
      <button type="submit" className="btn btn-primary w-100 fw-bold">Guardar Producto</button>
    </form>
  );
}

export default function NuevoProductoModal({ abierto, onCerrar, onGuardar }) {
  return (
    <Modal abierto={abierto} titulo="Agregar Nuevo Producto" onCerrar={onCerrar}>
      <FormularioProducto onGuardar={onGuardar} />
    </Modal>
  );
}
