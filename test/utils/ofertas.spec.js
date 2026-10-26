import { enOferta, precioFinal, porcentajeDescuento, productosEnOferta } from '../../src/utils/ofertas';
describe('utils/ofertas', () => {
 const p={precio:10000,precioOferta:7500};
 it('valida ofertas y calcula descuento y precio final',()=>{expect(enOferta(p)).toBeTrue();expect(precioFinal(p)).toBe(7500);expect(porcentajeDescuento(p)).toBe(25);});
 it('ignora ofertas nulas o superiores al precio',()=>{expect(enOferta({...p,precioOferta:0})).toBeFalse();expect(enOferta({...p,precioOferta:12000})).toBeFalse();expect(productosEnOferta([p,{precio:5,precioOferta:8}])).toEqual([p]);});
});