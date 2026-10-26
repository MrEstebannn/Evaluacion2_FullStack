import { useEffect, useMemo, useState } from 'react';
import { CUPONES_VALIDOS, DESCUENTO_CUPON } from '../data/catalogo';
import { precioFinal } from '../utils/ofertas';

const CLAVE_CARRITO = 'hype_cart';

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch {
    return [];
  }
}

const nuevoId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function useCarrito(productos, notificar) {
  const [items, setItems] = useState(leerCarrito);
  const [descuento, setDescuento] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
    } catch {}
  }, [items]);

  const cantidadTotal = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, i) => acc + i.precio * i.cantidad, 0), [items]);
  const total = Math.max(subtotal - descuento, 0);

  const cantidadDeProducto = (idProducto) =>
    items.filter((i) => i.idProducto === idProducto).reduce((s, i) => s + i.cantidad, 0);

  const sumarAlCarrito = (nombre, nuevoItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.nombre === nombre)) {
        return prev.map((i) => (i.nombre === nombre ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...prev, { id: nuevoId(), cantidad: 1, ...nuevoItem }];
    });
  };

  const agregarProducto = (idProducto, talla = '') => {
    const p = productos.find((x) => x.id === idProducto);
    if (!p) return false;

    if (cantidadDeProducto(p.id) + 1 > p.stock) {
      notificar('No es posible agregar más productos. Ha alcanzado el límite de stock disponible.', 'danger');
      return false;
    }
    const nombreFinal = talla ? `${p.nombre} (Talla ${talla})` : p.nombre;
    sumarAlCarrito(nombreFinal, { idProducto: p.id, nombre: nombreFinal, precio: precioFinal(p) });
    notificar('Producto agregado al carrito.', 'success');
    return true;
  };

  const agregarClase = (nombre, precio, cupoMax) => {
    const existente = items.find((i) => i.nombre === nombre);
    const cantidadActual = existente ? existente.cantidad : 0;
    if (cupoMax && cantidadActual + 1 > cupoMax) {
      notificar('No es posible inscribirse. Se ha alcanzado el límite de cupos para esta clase.', 'danger');
      return false;
    }
    sumarAlCarrito(nombre, { nombre, precio, cupoMax });
    return true;
  };

  const cambiarCantidad = (idItem, delta) => {
    const item = items.find((i) => i.id === idItem);
    if (!item) return;

    if (delta > 0) {
      if (item.idProducto) {
        const p = productos.find((x) => x.id === item.idProducto);
        if (p && cantidadDeProducto(item.idProducto) + 1 > p.stock) {
          notificar('No es posible agregar más. Límite de stock disponible alcanzado.', 'danger');
          return;
        }
      } else if (item.cupoMax && item.cantidad + 1 > item.cupoMax) {
        notificar('No es posible agregar más. Límite de cupos alcanzado.', 'danger');
        return;
      }
    }

    setItems((prev) =>
      prev
        .map((i) => (i.id === idItem ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0)
    );
  };

  const eliminarItem = (idItem) => setItems((prev) => prev.filter((i) => i.id !== idItem));

  const aplicarCupon = (codigo) => {
    const valido = CUPONES_VALIDOS.includes(codigo.trim().toUpperCase());
    setDescuento(valido ? DESCUENTO_CUPON : 0);
    return valido;
  };

  const vaciarCarrito = () => {
    setItems([]);
    setDescuento(0);
  };

  return {
    items, cantidadTotal, subtotal, descuento, total,
    agregarProducto, agregarClase, cambiarCantidad, eliminarItem, aplicarCupon, vaciarCarrito,
  };
}
