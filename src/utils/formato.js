/** Formatea un número como pesos chilenos: 25000 -> "$25.000" */
export const formatoCLP = (numero) => `$${Number(numero).toLocaleString('es-CL')}`;
