import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/img/logo.png';

const AppFooter: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-8">
          <img src={logoImg} alt="Saniclears" className="h-16 brightness-0 invert" />
          <span className="text-xs text-white/70">© 2026 Saniclears - Gestión Hospitalaria</span>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/privacidad" className="text-xs text-white/50 hover:text-white transition-colors">Política de Privacidad</Link>
          <span className="text-white/20">|</span>
          <Link to="/terminos" className="text-xs text-white/50 hover:text-white transition-colors">Términos</Link>
          <span className="text-white/20">|</span>
          <Link to="/seguridad" className="text-xs text-white/50 hover:text-white transition-colors">Seguridad</Link>
          <span className="text-white/20">|</span>
          <Link to="/cookies" className="text-xs text-white/50 hover:text-white transition-colors">Cookies</Link>
        </div>
        
        <span className="text-[10px] text-white/30">v1.0.0</span>
      </div>
    </footer>
  );
};

export default AppFooter;