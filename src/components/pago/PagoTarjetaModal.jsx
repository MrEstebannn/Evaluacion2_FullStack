import Modal from '../common/Modal';
import Campo from '../common/Campo';
import { useFormulario } from '../../hooks/useFormulario';
import { validarTarjeta } from '../../utils/validaciones';

const INICIAL = { titular: '', numero: '', expiracion: '', cvv: '' };

function FormularioTarjeta({ onPagoExitoso }) {
  const { valores, errores, enviado, onChange, enviar } = useFormulario(INICIAL, validarTarjeta);
  const estado = (campo) => ({ error: Boolean(errores[campo]), validado: enviado && !errores[campo] });

  return (
    <form onSubmit={enviar(onPagoExitoso)} noValidate>
      <Campo id="tarjetaNombre" name="titular" label="Titular de la Tarjeta" value={valores.titular} onChange={onChange}
        feedback="Nombre del titular requerido." {...estado('titular')} />
      <Campo id="tarjetaNumero" name="numero" label="Número de Tarjeta" placeholder="1234 5678 9012 3456" maxLength={16}
        value={valores.numero} onChange={onChange} feedback="Ingrese un número de tarjeta válido (15 o 16 dígitos)." {...estado('numero')} />
      <div className="row g-2">
        <div className="col-6">
          <Campo id="tarjetaExp" name="expiracion" label="Expiración (MM/AA)" placeholder="12/28" maxLength={5}
            value={valores.expiracion} onChange={onChange} feedback="Use el formato MM/AA." {...estado('expiracion')} />
        </div>
        <div className="col-6">
          <Campo id="tarjetaCvv" name="cvv" type="password" label="CVV" maxLength={4}
            value={valores.cvv} onChange={onChange} feedback="CVV requerido (3 o 4 dígitos)." {...estado('cvv')} />
        </div>
      </div>
      <button type="submit" className="btn btn-success w-100 fw-bold">Confirmar Pago</button>
    </form>
  );
}

export default function PagoTarjetaModal({ abierto, onCerrar, onPagoExitoso }) {
  return (
    <Modal abierto={abierto} titulo="Ingreso de Datos de Tarjeta" onCerrar={onCerrar}>
      <FormularioTarjeta onPagoExitoso={onPagoExitoso} />
    </Modal>
  );
}
