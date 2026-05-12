import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import logoImg from '../assets/img/logo.png';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  return (
    <nav className="flex flex-wrap justify-between items-center py-2 px-3 sm:py-3 sm:px-4 md:py-4 md:px-8 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 font-inherit transition-colors gap-2">
      <div className="flex items-center shrink-0">
        <Link to="/">
          <img src={logoImg} alt="Saniclear Logo" className="w-auto max-w-[85px] sm:max-w-[130px] md:max-w-[160px] max-h-[45px] sm:max-h-[80px] md:max-h-[100px] object-contain dark:brightness-0 dark:invert transition-all" />
        </Link>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4">
        <Link to="/" className="hidden sm:block text-slate-800 dark:text-slate-200 font-medium no-underline transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm md:text-base">
          Inicio
        </Link>

        <ThemeToggle />

        <Link to="/login" className="no-underline">
          <Button 
            text="Acceso Personal" 
            variant="secondary" 
            className="px-2.5 py-1.5 text-[10px] sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-2.5 md:text-base whitespace-nowrap shadow-none border-blue-600/20" 
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;