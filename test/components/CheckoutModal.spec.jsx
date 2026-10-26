import { screen, fireEvent } from '@testing-library/react';
import CheckoutPage from '../../src/pages/CheckoutPage';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';
describe('pages/CheckoutPage',()=>{
 const ITEMS=[{id:'a1',idProducto:105,nombre:'Toalla Microfibra Hype',precio:12000,cantidad:2}];
 beforeEach(()=>{limpiarAlmacenamiento();localStorage.setItem('hype_cart',JSON.stringify(ITEMS));});afterAll(limpiarAlmacenamiento);
 it('muestra el resumen y las opciones de entrega',()=>{renderConTienda(<CheckoutPage/>);expect(screen.getByText('Toalla Microfibra Hype × 2')).not.toBeNull();expect(screen.getByLabelText(/Despacho express/)).not.toBeNull();});
 it('oculta y no valida la dirección para retiro en tienda',()=>{const continuar=jasmine.createSpy('continuar');renderConTienda(<CheckoutPage onContinuar={continuar}/>);fireEvent.click(screen.getByLabelText(/Retiro en tienda/));fireEvent.change(screen.getByLabelText('Nombre'),{target:{value:'Pedro'}});fireEvent.change(screen.getByLabelText('Apellidos'),{target:{value:'Soto'}});fireEvent.change(screen.getByLabelText('Correo Electrónico'),{target:{value:'pedro@gmail.com'}});fireEvent.click(screen.getByRole('button',{name:/Pagar ahora/}));expect(continuar).toHaveBeenCalled();expect(screen.queryByLabelText('Calle')).toBeNull();});
 it('sin carrito ofrece volver a la tienda',()=>{localStorage.removeItem('hype_cart');const {unmount}=renderConTienda(<CheckoutPage/>);expect(screen.getByText('Tu carrito está vacío.')).not.toBeNull();unmount();});
});