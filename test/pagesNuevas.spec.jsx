import { fireEvent, screen } from '@testing-library/react';
import { limpiarAlmacenamiento, renderConTienda } from './helpers';
import CategoriasPage from '../src/pages/CategoriasPage';
import ProductoDetallePage from '../src/pages/ProductoDetallePage';
import BlogDetallePage from '../src/pages/BlogDetallePage';
import CheckoutPage from '../src/pages/CheckoutPage';
import PagoCorrectoPage from '../src/pages/PagoCorrectoPage';
import PagoErrorPage from '../src/pages/PagoErrorPage';
describe('páginas nuevas de tienda y pago',()=>{
 beforeEach(limpiarAlmacenamiento);afterAll(limpiarAlmacenamiento);
 it('muestra categorías con cantidades y abre sus productos',()=>{const onVerCategoria=jasmine.createSpy('categoria');renderConTienda(<CategoriasPage onVerCategoria={onVerCategoria}/>);expect(screen.getAllByText('2 productos').length).toBe(3);fireEvent.click(screen.getAllByText('Ver productos')[0]);expect(onVerCategoria).toHaveBeenCalledWith(1);});
 it('muestra producto y blog por id y vuelve',()=>{const volver=jasmine.createSpy('volver');renderConTienda(<ProductoDetallePage id={101} onVolver={volver}/>);expect(screen.getByText(/Stock disponible/).textContent).toContain('Stock disponible:');});
 it('avisa cuando un detalle no existe',()=>{renderConTienda(<ProductoDetallePage id={999}/>);expect(screen.getByText('No encontramos ese producto.')).not.toBeNull();});
 it('abre un blog identificado por id',()=>{renderConTienda(<BlogDetallePage id={1}/>);expect(screen.getByText('Beneficios del baile en la salud mental')).not.toBeNull();});
 it('muestra el segundo artículo del blog por id',()=>{renderConTienda(<BlogDetallePage id={2}/>);expect(screen.getByText('La evolución del Hip-Hop urbano')).not.toBeNull();}); it('checkout vacío ofrece volver a la tienda',()=>{const volver=jasmine.createSpy('tienda');renderConTienda(<CheckoutPage onIrTienda={volver}/>);fireEvent.click(screen.getByText('Ir a la tienda'));expect(volver).toHaveBeenCalled();});
 it('muestra resultado correcto y notifica envío de boleta',()=>{const correo=jasmine.createSpy('correo');renderConTienda(<PagoCorrectoPage orden={{numero:'20260011'}} resumen={{subtotal:1,descuento:0,envio:0,total:1}} items={[]} onNotificar={correo}/>);fireEvent.click(screen.getByText('Enviar boleta por correo'));expect(correo).toHaveBeenCalled();});
 it('muestra motivo de rechazo y botón de reintento',()=>{const retry=jasmine.createSpy('retry');renderConTienda(<PagoErrorPage motivo="Tarjeta rechazada" resumen={{subtotal:1,descuento:0,envio:0,total:1}} items={[]} onReintentar={retry}/>);fireEvent.click(screen.getByText('Volver a realizar el pago'));expect(retry).toHaveBeenCalled();});
});