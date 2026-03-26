import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import logoImg from '../assets/img/logo.png';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-sm sticky top-0 z-50 font-inherit">
      <div className="flex items-center">
        <Link to="/">
          <img src={logoImg} alt="Saniclear Logo" className="h-[90px] w-auto" />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/" className="mr-4 text-slate-800 font-medium no-underline transition-colors duration-300 hover:text-blue-600">
          Inicio
        </Link>

        <Link to="/login" className="no-underline">
          <Button text="Acceso Personal" variant="secondary" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;