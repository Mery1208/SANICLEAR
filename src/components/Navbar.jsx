import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import '../css/Navbar.css';
import logoImg from '../assets/img/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logoImg} alt="Saniclear Logo" className="logo-img" style={{ height: '90px' }} />
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/" style={{ marginRight: '15px' }}>Inicio</Link>


        <Link to="/login">
          <Button text="Acceso Personal" variant="secondary" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;