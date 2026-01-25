import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 
import Button from '../components/Button'; 
import '../css/Landing.css';

export default function Landing() {
  return (
    <div className="landing-container">
      <Navbar />

      <header className="hero">
        <h1>GESTIÓN INTELIGENTE DE HIGIENE HOSPITALARIA</h1>
        <p>
          Digitaliza, supervisa y optimiza las tareas de limpieza en entornos críticos.
          Seguridad para el paciente, control para el hospital.
        </p>
        
        
        <Link to="/login">
          <Button text="ENTRAR AL PORTAL" variant="primary" />
        </Link>
      </header>

      <section className="features">
        <div className="grid-features">
          <div className="card">
            <Activity color="#2563eb" size={40} style={{ marginBottom: '10px' }}/>
            <h3>Control Real</h3>
          </div>
          <div className="card">
            <ShieldCheck color="#2563eb" size={40} style={{ marginBottom: '10px' }}/>
            <h3>Trazabilidad</h3>
          </div>
          <div className="card">
            <Users color="#2563eb" size={40} style={{ marginBottom: '10px' }}/>
            <h3>Roles</h3>
          </div>
        </div>
      </section>
      
      
      <Footer />
    </div>
  );
}