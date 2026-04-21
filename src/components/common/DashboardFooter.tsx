import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="mt-auto pt-10 pb-4 text-center">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        <a href="#" className="hover:text-blue-500 transition-colors">Privacidad</a>
        <span className="hidden sm:inline">&middot;</span>
        <a href="#" className="hover:text-blue-500 transition-colors">Términos Legales</a>
        <span className="hidden sm:inline">&middot;</span>
        <a href="#" className="hover:text-blue-500 transition-colors">Soporte Técnico</a>
      </div>
      <p className="text-[10px] font-semibold text-gray-400">
        &copy; {new Date().getFullYear()} SANICLEARS SaaS. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default DashboardFooter;
