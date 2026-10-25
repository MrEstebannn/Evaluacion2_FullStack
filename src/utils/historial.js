// Integra la navegación por estado de React con el botón Atrás/Adelante del navegador.
// Cada cambio de sección o de vista del panel agrega una entrada al historial (pushState),
// y al volver se recibe el evento `popstate` con el estado guardado.

export const estadoActual = () => {
  try {
    return window.history.state ?? null;
  } catch {
    return null;
  }
};

export function empujarHistorial(estado) {
  try {
    window.history.pushState(estado, '');
  } catch {
    /* entorno sin History API: la app sigue funcionando sin botón Atrás */
  }
}

export function reemplazarHistorial(estado) {
  try {
    window.history.replaceState(estado, '');
  } catch {
    /* igual que arriba */
  }
}
