export function procesarPago({ numero = '' }) {
  const limpio = String(numero).replace(/\s/g, '');

  if (limpio.endsWith('0000')) {
    return { ok: false, motivo: 'La tarjeta fue rechazada por la pasarela de pago.' };
  }

  return { ok: true };
}