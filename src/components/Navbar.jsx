import React from "react";  
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
    return (
        <nav className = "navbar" >
            <div className = "navbar-logo" >
                <img src = { logo } alt = "Logo" className = "logo-image" />
            </div>
            <div className = "navbar-links" >
                <Link to ="/login" className = "btn-login"> Acceso Personal </Link>
                </div>
        </nav>
    );
};
export default Navbar;