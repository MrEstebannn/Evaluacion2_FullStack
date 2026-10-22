import BannerPromocional from '../components/home/BannerPromocional';
import BannerCupon from '../components/home/BannerCupon';
import ClasesSection from '../components/home/ClasesSection';
import MembresiasSection from '../components/home/MembresiasSection';
import ContactoInfo from '../components/home/ContactoInfo';

export default function InicioPage({ onIrATienda, onAbrirCarrito }) {
  return (
    <>
      <BannerPromocional onIrATienda={onIrATienda} />
      <BannerCupon />
      <ClasesSection onAbrirCarrito={onAbrirCarrito} />
      <MembresiasSection onAbrirCarrito={onAbrirCarrito} />
      <ContactoInfo />
    </>
  );
}
