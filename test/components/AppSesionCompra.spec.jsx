import { screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import { ordenesDB, usuariosDB } from '../../src/data/db';
import { comprasDeUsuario } from '../../src/admin/adminStats';
import { limpiarAlmacenamiento, renderConTienda } from '../helpers';
describe('App (sesión y checkout como página)',()=>{
 const ANA={run:'111111111',nombre:'Ana',apellidos:'Soto',correo:'ana@gmail.com',password:'abcd',tipo:'Cliente',region:'Región Metropolitana de Santiago',comuna:'Maipú',direccion:'Los Olmos 123'};
 const escribir=(label,value)=>fireEvent.change(screen.getByLabelText(label),{target:{value}});
 const login=()=>{fireEvent.click(screen.getByText('Iniciar Sesión'));escribir('Correo Electrónico','ana@gmail.com');escribir('Contraseña','abcd');fireEvent.click(screen.getByRole('button',{name:'Ingresar'}));};
 const tarjeta=(num='4111111111111111')=>{escribir('Titular de la Tarjeta','Ana Soto');escribir('Número de Tarjeta',num);escribir('Expiración (MM/AA)','12/28');escribir('CVV','123');fireEvent.click(screen.getByRole('button',{name:'Confirmar Pago'}));};
 const checkout=()=>{fireEvent.click(screen.getAllByRole('button',{name:'Inscribirme'})[0]);fireEvent.click(screen.getByRole('button',{name:'PAGAR'}));};
 beforeEach(()=>{limpiarAlmacenamiento();sessionStorage.clear();usuariosDB.crear(ANA);});
 afterEach(()=>sessionStorage.clear());afterAll(limpiarAlmacenamiento);
 it('un inicio de sesión incorrecto muestra un error',()=>{renderConTienda(<App/>);fireEvent.click(screen.getByText('Iniciar Sesión'));escribir('Correo Electrónico','ana@gmail.com');escribir('Contraseña','zzzz');fireEvent.click(screen.getByRole('button',{name:'Ingresar'}));expect(screen.queryByText('Contraseña incorrecta.')).not.toBeNull();});
 it('el login correcto muestra saludo y permite cerrar sesión',()=>{renderConTienda(<App/>);login();expect(screen.getByTestId('usuario-activo').textContent).toBe('Hola, Ana');fireEvent.click(screen.getByText('Cerrar sesión'));expect(screen.queryByTestId('usuario-activo')).toBeNull();});
 it('el checkout rellena datos de sesión y crea una orden con envío',()=>{renderConTienda(<App/>);login();checkout();expect(screen.getByLabelText('Calle').value).toBe('Los Olmos 123');fireEvent.click(screen.getByRole('button',{name:/Pagar ahora/}));tarjeta();expect(screen.getByText('¡Pago correcto!')).not.toBeNull();const orden=ordenesDB.listar().at(-1);expect(orden.cliente.run).toBe(ANA.run);expect(orden.envio).toBe(3990);expect(comprasDeUsuario(ordenesDB.listar(),ANA).length).toBe(1);});
 it('una tarjeta rechazada conserva el carrito y permite reintentar',()=>{renderConTienda(<App/>);checkout();escribir('Nombre','Pedro');escribir('Apellidos','Hacker');escribir('Correo Electrónico','pedro@gmail.com');fireEvent.click(screen.getByLabelText(/Retiro en tienda/));fireEvent.click(screen.getByRole('button',{name:/Pagar ahora/}));tarjeta('4111111111110000');expect(screen.getByText('No pudimos procesar el pago')).not.toBeNull();expect(JSON.parse(localStorage.getItem('hype_cart')).length).toBe(1);expect(screen.getByText('Volver a realizar el pago')).not.toBeNull();});
});