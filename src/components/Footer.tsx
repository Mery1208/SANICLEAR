import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Facebook, Instagram } from 'lucide-react';
import logoImg from '../assets/img/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-600 border-t border-slate-800 mt-24 font-sans">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="col-span-2 md:col-span-1">
            <img src={logoImg} alt="Saniclears Logo" className="max-w-[160px] mb-4" />
            <p className="text-slate-300 text-sm">
              Gestión Inteligente de Higiene Hospitalaria.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Producto</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/#sobre-nosotros" className="text-base text-slate-100 hover:text-white">Sobre Nosotros</a></li>
              <li><a href="/#features-section" className="text-base text-slate-100 hover:text-white">Características</a></li>
              <li><Link to="/login" className="text-base text-slate-100 hover:text-white">Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/privacidad" className="text-base text-slate-100 hover:text-white">Privacidad</Link></li>
              <li><Link to="/terminos" className="text-base text-slate-100 hover:text-white">Términos y Condiciones</Link></li>
              <li><Link to="/cookies" className="text-base text-slate-100 hover:text-white">Cookies</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Social</h3>
            <div className="flex space-x-6 mt-4">
                <a href="https://www.instagram.com/saniclears.official?igsh=YmhzZmF4a3BtZGZ4&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><span className="sr-only">Instagram</span><Instagram size={24} /></a>
                <a href="https://github.com/Mery1208/SANICLEAR" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><span className="sr-only">GitHub</span><Github size={24} /></a>
                <a href="https://www.facebook.com/share/1CfmjY8FZf/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><span className="sr-only">Facebook</span><Facebook size={24} /></a>
            </div>
          </div>

        </div>
        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-base text-slate-300 text-center">&copy; {new Date().getFullYear()} SANICLEARS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
