import { useFormulario } from '../hooks/useFormulario';
import Campo from '../components/common/Campo';
import { useTienda } from '../context/TiendaContext';
import { REGIONES_Y_COMUNAS, OPCIONES_ENTREGA } from '../data/catalogo';
import { datosIniciales, validarCheckout, resumenDeCompra } from '../utils/checkout';
import { formatoCLP } from '../utils/formato';
import ResumenCompra from '../components/pago/ResumenCompra';

export default function CheckoutPage({ usuario, onContinuar, onIrTienda }) {
  const { carrito } = useTienda();
  const { valores, errores, enviado, onChange, cambiar, enviar } = useFormulario(
    datosIniciales(usuario),
    validarCheckout
  );
  const comunas = REGIONES_Y_COMUNAS.find((r) => r.region === valores.region)?.comunas ?? [];
  const resumen = resumenDeCompra({
    items: carrito.items,
    descuento: carrito.descuento,
    opcionEntrega: valores.opcionEntrega,
  });
  const estado = (campo) => ({
    error: Boolean(errores[campo]),
    validado: enviado && !errores[campo],
  });

  if (!carrito.items.length) {
    return (
      <div className="container my-5 pt-5">
        <div className="alert alert-info">Tu carrito está vacío.</div>
        <button className="btn btn-hype text-white" onClick={onIrTienda}>
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5 pt-5">
      <h1 className="fw-bold mb-4">Finalizar compra</h1>
      <div className="row g-4">
        <div className="col-lg-7">
          <form id="checkout-form" onSubmit={enviar(onContinuar)} noValidate>
            {usuario && (
              <div className="alert alert-success py-2">
                Sesión iniciada como <strong>{usuario.nombre} {usuario.apellidos}</strong>.
                Completamos tus datos.
              </div>
            )}

            <h2 className="h5 fw-bold">Información del cliente</h2>
            <div className="row g-2">
              <Campo
                claseContenedor="col-md-6"
                id="chkNombre"
                name="nombre"
                label="Nombre"
                value={valores.nombre}
                onChange={onChange}
                feedback="Nombre requerido."
                {...estado('nombre')}
              />
              <Campo
                claseContenedor="col-md-6"
                id="chkApellidos"
                name="apellidos"
                label="Apellidos"
                value={valores.apellidos}
                onChange={onChange}
                feedback="Apellidos requeridos."
                {...estado('apellidos')}
              />
              <Campo
                claseContenedor="col-12"
                id="chkCorreo"
                name="correo"
                type="email"
                label="Correo Electrónico"
                value={valores.correo}
                onChange={onChange}
                feedback="Ingresa un correo válido."
                {...estado('correo')}
              />
            </div>

            <h2 className="h5 fw-bold mt-3">Opciones de entrega</h2>
            {OPCIONES_ENTREGA.map((opcion) => (
              <div className="form-check mb-2" key={opcion.id}>
                <input
                  className="form-check-input"
                  type="radio"
                  id={'envio-' + opcion.id}
                  name="opcionEntrega"
                  value={opcion.id}
                  checked={valores.opcionEntrega === opcion.id}
                  onChange={onChange}
                />
                <label className="form-check-label" htmlFor={'envio-' + opcion.id}>
                  {opcion.nombre} — {opcion.precio ? formatoCLP(opcion.precio) : 'Gratis'}
                </label>
              </div>
            ))}

            {valores.opcionEntrega !== 'retiro' && (
              <>
                <h2 className="h5 fw-bold mt-3">Dirección de entrega</h2>
                <div className="row g-2">
                  <Campo
                    claseContenedor="col-md-8"
                    id="chkCalle"
                    name="calle"
                    label="Calle"
                    value={valores.calle}
                    onChange={onChange}
                    feedback="Calle requerida."
                    {...estado('calle')}
                  />
                  <Campo
                    claseContenedor="col-md-4"
                    id="chkDepto"
                    name="depto"
                    label="Departamento (opcional)"
                    value={valores.depto}
                    onChange={onChange}
                    feedback="Máximo 20 caracteres."
                    {...estado('depto')}
                  />
                  <Campo
                    claseContenedor="col-md-6"
                    id="chkRegion"
                    name="region"
                    as="select"
                    label="Región"
                    value={valores.region}
                    onChange={(e) => cambiar({ region: e.target.value, comuna: '' })}
                    feedback="Selecciona una región."
                    {...estado('region')}
                  >
                    <option value="">Seleccione una región</option>
                    {REGIONES_Y_COMUNAS.map((region) => (
                      <option key={region.region} value={region.region}>{region.region}</option>
                    ))}
                  </Campo>
                  <Campo
                    claseContenedor="col-md-6"
                    id="chkComuna"
                    name="comuna"
                    as="select"
                    label="Comuna"
                    value={valores.comuna}
                    onChange={onChange}
                    disabled={!valores.region}
                    feedback="Selecciona una comuna."
                    {...estado('comuna')}
                  >
                    <option value="">Seleccione una comuna</option>
                    {comunas.map((comuna) => (
                      <option key={comuna} value={comuna}>{comuna}</option>
                    ))}
                  </Campo>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="col-lg-5">
          <ResumenCompra resumen={resumen} items={carrito.items} />
          <button
            className="btn btn-success w-100 fw-bold"
            type="submit"
            form="checkout-form"
          >
            Pagar ahora {formatoCLP(resumen.total)}
          </button>
        </div>
      </div>
    </div>
  );
}