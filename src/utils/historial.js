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
  } catch {}
}

export function reemplazarHistorial(estado) {
  try {
    window.history.replaceState(estado, '');
  } catch {}
}
