import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/img/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-600 text-white pt-12 pb-6 px-8 rounded-t-2xl font-inherit">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1.5 flex flex-col">
          <img src={logoImg} alt="Saniclear" className="h-[50px] w-max brightness-0 invert" />
          <p className="text-sm text-white/60 mt-3 leading-relaxed">
            Sistema de gestión de higiene hospitalaria de última generación.
          </p>
        </div>

        <div className="flex flex-col">
          <h4 className="text-base font-semibold mb-4 text-white">Producto</h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li><a href="#" className="text-white/60 no-underline text-sm transition-all duration-200 hover:text-white hover:pl-1">Características</a></li>
            <li><a href="#" className="text-white/60 no-underline text-sm transition-all duration-200 hover:text-white hover:pl-1">Precios</a></li>
            <li><a href="#" className="text-white/60 no-underline text-sm transition-all duration-200 hover:text-white hover:pl-1">Casos de Éxito</a></li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h4 className="text-base font-semibold mb-4 text-white">Empresa</h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li><a href="#sobre-nosotros" className="text-white/60 no-underline text-sm transition-all duration-200 hover:text-white hover:pl-1">Sobre Nosotros</a></li>
            <li><a href="#" className="text-white/60 no-underline text-sm transition-all duration-200 hover:text-white hover:pl-1">Blog</a></li>
            <li><a href="#" className="text-white/60 no-underline text-sm transition-all duration-200 hover:text-white hover:pl-1">Contacto</a></li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h4 className="text-base font-semibold mb-4 text-white">Legal</h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li><a href="#" className="text-white/60 no-underline text-sm transition-all duration-200 hover:text-white hover:pl-1">Privacidad</a></li>
            <li><a href="#" className="text-white/60 no-underline text-sm transition-all duration-200 hover:text-white hover:pl-1">Términos</a></li>
            <li><a href="#" className="text-white/60 no-underline text-sm transition-all duration-200 hover:text-white hover:pl-1">Seguridad</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 pt-6 text-center text-xs text-white/50">
        <p className="m-0">© 2026 SANICLEAR - Sistema de Gestión de Limpieza Hospitalaria. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;