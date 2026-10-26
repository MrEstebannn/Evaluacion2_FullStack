import { clienteDeOrden, datosIniciales, validarCheckout, opcionDeEntrega, resumenDeCompra } from '../../src/utils/checkout';
import { REGIONES_Y_COMUNAS } from '../../src/data/catalogo';
describe('utils/checkout',()=>{
 const USUARIO={run:'111111111',nombre:'Ana',apellidos:'Soto',correo:'ana@gmail.com',region:'Región Metropolitana de Santiago',comuna:'Maipú',direccion:'Los Olmos 123'};
 const DATOS={nombre:' Pedro ',apellidos:'Hacker',correo:'pedro@gmail.com',calle:'Los Crisantemos 45',depto:'603',region:'Región Metropolitana de Santiago',comuna:'Cerrillos',indicaciones:'Dejar con el conserje',opcionEntrega:'domicilio'};
 it('rellena los datos de sesión y la entrega por defecto',()=>{const d=datosIniciales(USUARIO); expect(d.nombre).toBe('Ana'); expect(d.apellidos).toBe('Soto'); expect(d.calle).toBe('Los Olmos 123'); expect(d.opcionEntrega).toBe('domicilio');});
 it('inicia invitado sin datos y con primera región',()=>{const d=datosIniciales(null);expect(d.nombre).toBe('');expect(d.calle).toBe('');expect(d.region).toBe(REGIONES_Y_COMUNAS[0].region);});
 it('valida domicilio y no exige dirección para retiro',()=>{expect(validarCheckout(DATOS)).toEqual({});expect(validarCheckout({...DATOS,calle:'',region:'',comuna:'',opcionEntrega:'retiro'})).toEqual({});});
 it('normaliza cliente y resume subtotal, descuento y despacho',()=>{expect(clienteDeOrden(null,DATOS).nombre).toBe('Pedro Hacker');expect(opcionDeEntrega('express').precio).toBe(6990);expect(resumenDeCompra({items:[{precio:10000,cantidad:2}],descuento:5000,opcionEntrega:'domicilio'})).toEqual({subtotal:20000,descuento:5000,envio:3990,total:18990});});
});