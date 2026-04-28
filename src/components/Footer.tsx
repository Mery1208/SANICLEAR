import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/img/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-600 text-white pt-8 pb-6 px-4 sm:px-8 rounded-t-2xl font-inherit">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div className="md:col-span-1.5 flex flex-col items-center md:items-start">
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg">
            <img src={logoImg} alt="Saniclear" className="h-[80px] sm:h-[120px] w-[150px] sm:w-[200px] object-contain" />
          </div>
          <p className="text-xs sm:text-sm text-white/60 mt-3 leading-relaxed max-w-[250px] text-center md:text-left">
            Sistema de gestión de higiene hospitalaria de última generación.
          </p>
        </div>

        <div className="flex flex-col">
          <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-white">Producto</h4>
          <ul className="list-none p-0 m-0 space-y-1.5 sm:space-y-2">
            <li><a href="#" className="text-white/60 no-underline text-xs sm:text-sm transition-all duration-200 hover:text-white hover:pl-1">Características</a></li>
            <li><a href="#" className="text-white/60 no-underline text-xs sm:text-sm transition-all duration-200 hover:text-white hover:pl-1">Precios</a></li>
            <li><a href="#" className="text-white/60 no-underline text-xs sm:text-sm transition-all duration-200 hover:text-white hover:pl-1">Casos de Éxito</a></li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-white">Empresa</h4>
          <ul className="list-none p-0 m-0 space-y-1.5 sm:space-y-2">
            <li><a href="#sobre-nosotros" className="text-white/60 no-underline text-xs sm:text-sm transition-all duration-200 hover:text-white hover:pl-1">Sobre Nosotros</a></li>
            <li><a href="#" className="text-white/60 no-underline text-xs sm:text-sm transition-all duration-200 hover:text-white hover:pl-1">Blog</a></li>
            <li><a href="#" className="text-white/60 no-underline text-xs sm:text-sm transition-all duration-200 hover:text-white hover:pl-1">Contacto</a></li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-white">Legal</h4>
          <ul className="list-none p-0 m-0 space-y-1.5 sm:space-y-2">
            <li><a href="#" className="text-white/60 no-underline text-xs sm:text-sm transition-all duration-200 hover:text-white hover:pl-1">Privacidad</a></li>
            <li><a href="#" className="text-white/60 no-underline text-xs sm:text-sm transition-all duration-200 hover:text-white hover:pl-1">Términos</a></li>
            <li><a href="#" className="text-white/60 no-underline text-xs sm:text-sm transition-all duration-200 hover:text-white hover:pl-1">Seguridad</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 pt-4 sm:pt-6 text-center text-xs text-white/50">
        <p className="m-0">© 2026 SANICLEAR - Sistema de Gestión de Limpieza Hospitalaria. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
