import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
// import logo from "../assets/logo.png"; // Logo no disponible, comentado

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                {/* <img src={logo} alt="Logo" className="logo-image" /> */}
                <span className="logo-text">Limpieza Hospitalaria</span>
            </div>
            <div className="navbar-links">
                <Link to="/login" className="btn-login">Acceso Personal</Link>
            </div>
        </nav>
    );
};
export default Navbar;