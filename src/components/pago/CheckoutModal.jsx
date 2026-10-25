import Modal from '../common/Modal';
import Campo from '../common/Campo';
import { useFormulario } from '../../hooks/useFormulario';
import { useTienda } from '../../context/TiendaContext';
import { REGIONES_Y_COMUNAS } from '../../data/catalogo';
import { datosIniciales, validarCheckout } from '../../utils/checkout';
import { formatoCLP } from '../../utils/formato';

function FormularioCheckout({ usuario, onContinuar }) {
  const { carrito } = useTienda();
  // Si hay sesión iniciada, el formulario parte con los datos del usuario ya escritos.
  const { valores, errores, enviado, onChange, cambiar, enviar } = useFormulario(datosIniciales(usuario), validarCheckout);
  const estado = (campo) => ({ error: Boolean(errores[campo]), validado: enviado && !errores[campo] });
  const comunas = REGIONES_Y_COMUNAS.find((r) => r.region === valores.region)?.comunas ?? [];

  return (
    <form onSubmit={enviar(onContinuar)} noValidate>
      {usuario && (
        <div className="alert alert-success py-2 small">
          Sesión iniciada como <strong>{usuario.nombre} {usuario.apellidos}</strong>. Completamos tus datos automáticamente; puedes cambiarlos para esta entrega.
        </div>
      )}

      <div className="table-responsive mb-3">
        <table className="table table-sm align-middle mb-0">
          <thead>
            <tr><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {carrito.items.map((i) => (
              <tr key={i.id}>
                <td>{i.nombre}</td>
                <td>{formatoCLP(i.precio)}</td>
                <td>{i.cantidad}</td>
                <td>{formatoCLP(i.precio * i.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {carrito.descuento > 0 && <div className="text-end small text-success fw-bold">Descuento aplicado: -{formatoCLP(carrito.descuento)}</div>}
      </div>

      <h6 className="fw-bold">Información del cliente</h6>
      <div className="row g-2">
        <Campo claseContenedor="col-md-6" id="chkNombre" name="nombre" label="Nombre" maxLength={50} value={valores.nombre} onChange={onChange}
          feedback="Nombre requerido (máx 50 caracteres)." {...estado('nombre')} />
        <Campo claseContenedor="col-md-6" id="chkApellidos" name="apellidos" label="Apellidos" maxLength={100} value={valores.apellidos} onChange={onChange}
          feedback="Apellidos requeridos (máx 100 caracteres)." {...estado('apellidos')} />
        <Campo claseContenedor="col-12" id="chkCorreo" name="correo" type="email" label="Correo Electrónico" maxLength={100} placeholder="nombre@gmail.com"
          value={valores.correo} onChange={onChange} feedback="Correo válido requerido (@gmail, @hotmail, @yahoo, @duocuc)." {...estado('correo')} />
      </div>

      <h6 className="fw-bold mt-2">Dirección de entrega</h6>
      <div className="row g-2">
        <Campo claseContenedor="col-md-8" id="chkCalle" name="calle" label="Calle" maxLength={300} value={valores.calle} onChange={onChange}
          feedback="Calle requerida (máx 300 caracteres)." {...estado('calle')} />
        <Campo claseContenedor="col-md-4" id="chkDepto" name="depto" label="Departamento (opcional)" placeholder="Ej.: 603" maxLength={20}
          value={valores.depto} onChange={onChange} feedback="Máximo 20 caracteres." {...estado('depto')} />
        <Campo claseContenedor="col-md-6" id="chkRegion" name="region" as="select" label="Región" value={valores.region}
          onChange={(e) => cambiar({ region: e.target.value, comuna: '' })} feedback="Selecciona una región." {...estado('region')}>
          <option value="">Seleccione una región</option>
          {REGIONES_Y_COMUNAS.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
        </Campo>
        <Campo claseContenedor="col-md-6" id="chkComuna" name="comuna" as="select" label="Comuna" value={valores.comuna} onChange={onChange}
          disabled={!valores.region} feedback="Selecciona una comuna." {...estado('comuna')}>
          <option value="">Seleccione una comuna</option>
          {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
        </Campo>
        <Campo claseContenedor="col-12" id="chkIndicaciones" name="indicaciones" as="textarea" rows={2} maxLength={300}
          label="Indicaciones para la entrega (opcional)" placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."
          value={valores.indicaciones} onChange={onChange} feedback="Máximo 300 caracteres." {...estado('indicaciones')} />
      </div>

      <button type="submit" className="btn btn-success w-100 fw-bold mt-2">Pagar ahora {formatoCLP(carrito.total)}</button>
    </form>
  );
}

export default function CheckoutModal({ abierto, onCerrar, usuario = null, onContinuar }) {
  return (
    <Modal abierto={abierto} titulo="Datos de entrega" onCerrar={onCerrar} tamano="modal-lg modal-dialog-scrollable">
      <FormularioCheckout usuario={usuario} onContinuar={onContinuar} />
    </Modal>
  );
}