import { screen, fireEvent } from '@testing-library/react';
import ProductosPage from '../../src/pages/ProductosPage';
import { productosDB } from '../../src/data/db';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';
describe('pages/ProductosPage',()=>{
 beforeEach(limpiarAlmacenamiento);afterAll(limpiarAlmacenamiento);
 it('renderiza una tarjeta por producto',()=>{renderConTienda(<ProductosPage/>);expect(screen.getByText('Tienda de Productos')).not.toBeNull();expect(screen.getAllByRole('button',{name:'Añadir al Carrito'}).length).toBe(6);});
 it('muestra productos nuevos de la base de datos',()=>{productosDB.crear({codigo:'PROD-99',nombre:'Cinta para el pelo',categoria:'Accesorios',precio:3000,stock:4});renderConTienda(<ProductosPage/>);expect(screen.queryByText('Cinta para el pelo')).not.toBeNull();});
 it('añade al carrito y persiste',()=>{renderConTienda(<ProductosPage/>);fireEvent.click(screen.getAllByRole('button',{name:'Añadir al Carrito'})[0]);expect(screen.queryByText('Producto agregado al carrito.')).not.toBeNull();expect(JSON.parse(localStorage.getItem('hype_cart')).length).toBe(1);});
 it('envía el id del producto a la navegación de detalle',()=>{const ver=jasmine.createSpy('detalle');renderConTienda(<ProductosPage onVerDetalle={ver}/>);fireEvent.click(screen.getAllByRole('button',{name:'Ver Detalle'})[0]);expect(ver).toHaveBeenCalledWith(101);});
});