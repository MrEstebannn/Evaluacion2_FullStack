import { fireEvent, screen, within } from '@testing-library/react';
import App from '../../src/App';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';
describe('App: recorrido integrado de tienda y pagos',()=>{
 beforeEach(()=>{limpiarAlmacenamiento();sessionStorage.clear();});
 afterAll(limpiarAlmacenamiento);
 const menu=nombre=>{fireEvent.click(screen.getByLabelText('Abrir menú'));fireEvent.click(screen.getByRole('button',{name:new RegExp(nombre)}));};
 const escribir=(label,value)=>fireEvent.change(screen.getByLabelText(label),{target:{value}});
 const llenarCheckout=()=>{escribir('Nombre','Eva');escribir('Apellidos','Rojas');escribir('Correo Electrónico','eva@gmail.com');fireEvent.click(screen.getByLabelText(/Retiro en tienda/));fireEvent.click(screen.getByRole('button',{name:/Pagar ahora/}));};
 const pagar=numero=>{escribir('Titular de la Tarjeta','Eva Rojas');escribir('Número de Tarjeta',numero);escribir('Expiración (MM/AA)','12/28');escribir('CVV','123');fireEvent.click(screen.getByRole('button',{name:'Confirmar Pago'}));};
 const agregarProducto=()=>{menu('Tienda & Productos');fireEvent.click(screen.getAllByRole('button',{name:'Añadir al Carrito'})[0]);fireEvent.click(screen.getByTestId('cart-count').parentElement);fireEvent.click(screen.getByRole('button',{name:'PAGAR'}));};
 it('calcula el despacho sobre el precio de oferta',()=>{
  renderConTienda(<App/>);
  menu('Tienda & Productos');
  fireEvent.click(screen.getAllByRole('button',{name:'Añadir al Carrito'})[0]);
  fireEvent.click(screen.getByTestId('cart-count').parentElement);
  fireEvent.click(screen.getByRole('button',{name:'PAGAR'}));
  escribir('Nombre','Eva');
  escribir('Apellidos','Rojas');
  escribir('Correo Electrónico','eva@gmail.com');
  escribir('Calle','Av. Central 123');
  fireEvent.change(screen.getByLabelText('Comuna'),{target:{value:'Santiago'}});
  expect(screen.getByRole('button',{name:/Pagar ahora.*33.980/})).not.toBeNull();
 });
 it('recorre ofertas, categoría, detalles, blog, pago aprobado, rechazo y reintento',()=>{
  renderConTienda(<App/>);
  menu('Ofertas');expect(document.querySelectorAll('del').length).toBe(3);
  menu('Categorías');fireEvent.click(screen.getAllByRole('button',{name:'Ver productos'})[0]);expect(screen.getByRole('heading',{name:'Vestuario'})).not.toBeNull();
  fireEvent.click(screen.getAllByRole('button',{name:'Ver Detalle'})[0]);expect(screen.getByRole('heading',{name:/Malla de Danza|Pants Urban/})).not.toBeNull();
  menu('Noticias & Blogs');fireEvent.click(screen.getAllByRole('button',{name:'Ver Caso'})[0]);expect(screen.getByText('Beneficios del baile en la salud mental')).not.toBeNull();
  agregarProducto();llenarCheckout();pagar('4111111111111111');expect(screen.getByText('¡Pago correcto!')).not.toBeNull();expect(JSON.parse(localStorage.getItem('hype_cart'))).toEqual([]);
  agregarProducto();llenarCheckout();pagar('4111111111110000');expect(screen.getByText('No pudimos procesar el pago')).not.toBeNull();expect(JSON.parse(localStorage.getItem('hype_cart')).length).toBe(1);
  fireEvent.click(screen.getByRole('button',{name:'Volver a realizar el pago'}));expect(screen.getByRole('dialog')).not.toBeNull();pagar('4111111111111111');expect(screen.getByText('¡Pago correcto!')).not.toBeNull();expect(JSON.parse(localStorage.getItem('hype_cart'))).toEqual([]);
 });
});