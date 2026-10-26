import { renderHook, act } from '@testing-library/react';
import { useCarrito } from '../../src/hooks/useCarrito';
import { limpiarAlmacenamiento } from '../helpers';

describe('hooks/useCarrito', () => {
  const PRODUCTOS = [
    { id: 1, nombre: 'Zapatillas', precio: 10000, stock: 2 },
    { id: 2, nombre: 'Toalla', precio: 5000, stock: 10 },
    { id: 3, nombre: 'Malla', precio: 10000, precioOferta: 8000, stock: 3 },
  ];
  let notificar;

  const crearCarrito = () => renderHook(() => useCarrito(PRODUCTOS, notificar));

  beforeEach(() => {
    limpiarAlmacenamiento();
    notificar = jasmine.createSpy('notificar');
  });
  afterAll(limpiarAlmacenamiento);

  it('comienza vacío', () => {
    const { result } = crearCarrito();
    expect(result.current.items).toEqual([]);
    expect(result.current.cantidadTotal).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('agregarProducto agrega el ítem y notifica el éxito', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(1); });
    expect(result.current.items.length).toBe(1);
    expect(result.current.subtotal).toBe(10000);
    expect(notificar).toHaveBeenCalledWith('Producto agregado al carrito.', 'success');
  });

  it('agrega los productos en oferta al precio final', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(3); });
    expect(result.current.items[0].precio).toBe(8000);
    expect(result.current.subtotal).toBe(8000);
  });
  it('agregar el mismo producto dos veces suma la cantidad', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(2); });
    act(() => { result.current.agregarProducto(2); });
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].cantidad).toBe(2);
    expect(result.current.cantidadTotal).toBe(2);
  });

  it('incluye la talla en el nombre del ítem', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(1, '38'); });
    expect(result.current.items[0].nombre).toBe('Zapatillas (Talla 38)');
  });

  it('no permite superar el stock disponible y avisa con un error', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(1); });
    act(() => { result.current.agregarProducto(1); });
    let agregado;
    act(() => { agregado = result.current.agregarProducto(1); });
    expect(agregado).toBeFalse();
    expect(result.current.cantidadTotal).toBe(2);
    expect(notificar).toHaveBeenCalledWith(jasmine.stringMatching(/límite de stock/), 'danger');
  });

  it('agregarProducto devuelve false si el producto no existe', () => {
    const { result } = crearCarrito();
    let agregado;
    act(() => { agregado = result.current.agregarProducto(999); });
    expect(agregado).toBeFalse();
  });

  it('agregarClase respeta el cupo máximo', () => {
    const { result } = crearCarrito();
    let primero;
    let segundo;
    act(() => { primero = result.current.agregarClase('Zumba Fitness', 18000, 1); });
    act(() => { segundo = result.current.agregarClase('Zumba Fitness', 18000, 1); });
    expect(primero).toBeTrue();
    expect(segundo).toBeFalse();
    expect(notificar).toHaveBeenCalledWith(jasmine.stringMatching(/límite de cupos/), 'danger');
  });

  it('cambiarCantidad con -1 elimina el ítem cuando llega a 0', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(2); });
    const id = result.current.items[0].id;
    act(() => result.current.cambiarCantidad(id, -1));
    expect(result.current.items).toEqual([]);
  });

  it('eliminarItem quita el ítem indicado', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(2); });
    act(() => result.current.eliminarItem(result.current.items[0].id));
    expect(result.current.items.length).toBe(0);
  });

  it('aplicarCupon con un cupón válido descuenta $5.000 del total', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(1); });
    let valido;
    act(() => { valido = result.current.aplicarCupon('hype10'); });
    expect(valido).toBeTrue();
    expect(result.current.descuento).toBe(5000);
    expect(result.current.total).toBe(5000);
  });

  it('aplicarCupon con un cupón inválido no aplica descuento', () => {
    const { result } = crearCarrito();
    let valido;
    act(() => { valido = result.current.aplicarCupon('FALSO'); });
    expect(valido).toBeFalse();
    expect(result.current.descuento).toBe(0);
  });

  it('vaciarCarrito limpia ítems y descuento', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(1); });
    act(() => { result.current.aplicarCupon('HYPE10'); });
    act(() => result.current.vaciarCarrito());
    expect(result.current.items).toEqual([]);
    expect(result.current.descuento).toBe(0);
  });

  it('persiste el carrito en localStorage', () => {
    const { result } = crearCarrito();
    act(() => { result.current.agregarProducto(2); });
    expect(JSON.parse(localStorage.getItem('hype_cart')).length).toBe(1);
  });
});