import React from "react";
import Navbar from "../components/Navbar.jsx";
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Users } from 'lucide-react';


const Landing = () => {
    return (
        <div className="landing-container">
            <Navbar />
            <header className="landing-header">
                <h1> GESTIÓN INTELIGENTE DE LIMPIEZA HOSPITALARIA </h1>
                <p> Digitaliza, supervisa y optimiza las tareas de limpieza hospitalaria en entornos críticos.
                    Seguridad al paciente y control para el hospital.
                </p>
                <Link to="/login" className="btn-primary">Acceder</Link>
            </header>

            <section className="features">
                <div className="grid-features">
                    <div className="card">
                        <Activity color="#2563eb" size={40} style={{ marginBottom: '10px' }} />
                        <h3> Control en Tiempo Real </h3>
                    </div>
                    <div className="card">
                        <Activity color="#2563eb" size={40} style={{ marginBottom: '10px' }} />
                        <h3> Trazabilidad </h3>
                    </div>
                    <div className="card">
                        <Activity color="#2563eb" size={40} style={{ marginBottom: '10px' }} />
                        <h3> Roles </h3>
                    </div>
                </div>
            </section>
            <footer className="footer">
                © 2024 Saniclear - Todos los derechos reservados.
            </footer>
        </div>
    )
}
    export default Landing