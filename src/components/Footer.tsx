import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/img/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src={logoImg} alt="Saniclear" />
          <p>Sistema de gestión de higiene hospitalaria de última generación.</p>
        </div>

        <div className="footer-column">
          <h4>Producto</h4>
          <ul>
            <li><a href="#">Características</a></li>
            <li><a href="#">Precios</a></li>
            <li><a href="#">Casos de Éxito</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Empresa</h4>
          <ul>
            <li><a href="#sobre-nosotros">Sobre Nosotros</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacidad</a></li>
            <li><a href="#">Términos</a></li>
            <li><a href="#">Seguridad</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 SANICLEAR - Sistema de Gestión de Limpieza Hospitalaria. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;