import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-24 font-sans">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-black text-[#1e3a5f]">SANICLEARS</h2>
            <p className="text-gray-500 text-sm mt-2">
              Gestión Inteligente de Higiene Hospitalaria.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Producto</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/#sobre-nosotros" className="text-base text-gray-500 hover:text-gray-900">Sobre Nosotros</a></li>
              <li><a href="/#features-section" className="text-base text-gray-500 hover:text-gray-900">Características</a></li>
              <li><Link to="/login" className="text-base text-gray-500 hover:text-gray-900">Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/politica-privacidad" className="text-base text-gray-500 hover:text-gray-900">Privacidad</Link></li>
              <li><Link to="/cookies" className="text-base text-gray-500 hover:text-gray-900">Cookies</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Social</h3>
            <div className="flex space-x-6 mt-4">
                <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">Twitter</span><Twitter size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">GitHub</span><Github size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">LinkedIn</span><Linkedin size={24} /></a>
            </div>
          </div>

        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">&copy; {new Date().getFullYear()} SANICLEARS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
