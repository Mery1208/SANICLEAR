import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import logoImg from '../assets/img/logo.png';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center py-2 px-3 sm:py-3 sm:px-4 md:py-4 md:px-8 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 font-inherit transition-colors">
      <div className="flex items-center">
        <Link to="/">
          <img src={logoImg} alt="Saniclear Logo" className="w-auto max-w-[100px] sm:max-w-[130px] md:max-w-[160px] max-h-[60px] sm:max-h-[80px] md:max-h-[100px] object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        <Link to="/" className="text-slate-800 dark:text-slate-200 font-medium no-underline transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm md:text-base">
          Inicio
        </Link>

        <ThemeToggle />

        <Link to="/login" className="no-underline">
          <Button text="Acceso Personal" variant="secondary" className="px-2 py-1 text-[10px] sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-2.5 md:text-base" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;