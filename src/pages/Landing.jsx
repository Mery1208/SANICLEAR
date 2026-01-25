import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Users, BarChart3, Smartphone, Globe, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import '../css/Landing.css';
import hospitalImg from '../assets/img/hospital.avif';
import medicoImg from '../assets/img/medico.avif';
import pasilloImg from '../assets/img/pasillo.avif';

export default function Landing() {
  return (
    <div className="landing-container">
      <Navbar />

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>GESTIÓN INTELIGENTE DE HIGIENE HOSPITALARIA</h1>
            <p>
              Digitaliza, supervisa y optimiza las tareas de limpieza en entornos
              críticos. La solución completa para hospitales modernos.
            </p>
            <div className="hero-buttons">
              <Link to="/login">
                <Button text="ENTRAR AL PORTAL" variant="primary" />
              </Link>
              <a href="#sobre-nosotros">
                <Button text="Conocer Más" variant="secondary" />
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src={hospitalImg} alt="Hospital moderno" />
          </div>
        </div>
      </header>

      {/* Sobre Nosotros Section */}
      <section id="sobre-nosotros" className="about-section">
        <div className="about-content">
          <div className="about-image">
            <img src={medicoImg} alt="Equipo médico" />
          </div>
          <div className="about-text">
            <h2>Una Solución Nacida de la Necesidad</h2>
            <p>
              SANICLEAR nació en 2024 cuando un grupo de profesionales sanitarios
              identificó un desafío crítico: <strong>la gestión manual de las tareas de limpieza
                hospitalaria era ineficiente y propensa a errores.</strong>
            </p>
            <p>
              Los registros en papel, la falta de trazabilidad y la comunicación
              fragmentada entre equipos ponían en riesgo la seguridad de los pacientes
              y la eficiencia operativa.
            </p>
            <p>
              Así surgió SANICLEAR: <u>una plataforma digital diseñada específicamente
                para transformar la gestión de higiene en entornos hospitalarios</u>,
              garantizando trazabilidad completa, supervisión en tiempo real y
              comunicación fluida entre todo el personal.
            </p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Hospitales</span>
              </div>
              <div className="stat">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Tareas Diarias</span>
              </div>
              <div className="stat">
                <span className="stat-number">99%</span>
                <span className="stat-label">Satisfacción</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>Todo lo que Necesitas en una Plataforma</h2>
          <p>Herramientas profesionales diseñadas para maximizar la eficiencia y seguridad</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Activity size={32} color="#2563eb" />
            </div>
            <h3>Control en Tiempo Real</h3>
            <p>Monitoriza en tiempo real el estado de todas las tareas de limpieza en tu institución desde un único panel de control.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={32} color="#2563eb" />
            </div>
            <h3>Trazabilidad Completa</h3>
            <p>Registra y audita cada acción realizada con un historial completo, verificable y conforme a normativas sanitarias.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Users size={32} color="#2563eb" />
            </div>
            <h3>Gestión de Equipos</h3>
            <p>Administra equipos con diferentes niveles de acceso: administradores, supervisores y personal operativo.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={32} color="#2563eb" />
            </div>
            <h3>Análisis y Reportes</h3>
            <p>Genera informes detallados sobre productividad, cumplimiento y áreas de mejora para tomar decisiones basadas en datos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Smartphone size={32} color="#2563eb" />
            </div>
            <h3>App Móvil Operarios</h3>
            <p>Aplicación móvil intuitiva para que el personal de limpieza registre tareas completadas con un simple toque.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Globe size={32} color="#2563eb" />
            </div>
            <h3>Acceso desde Cualquier Lugar</h3>
            <p>Plataforma cloud que permite acceder a la información desde cualquier dispositivo, en cualquier momento.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="steps-section">
        <div className="steps-header">
          <h2>Cómo Funciona SANICLEAR</h2>
          <p>Implementación simple en 3 pasos</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Configura tus Zonas</h3>
            <p>Define las áreas del hospital, asigna responsables y establece los protocolos de limpieza para cada zona.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Asigna Tareas</h3>
            <p>Programa y distribuye las tareas de limpieza al personal operativo desde el panel de administración.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Supervisa y Optimiza</h3>
            <p>Monitoriza el progreso en tiempo real y genera reportes para mejorar continuamente la eficiencia operativa.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="testimonial-content">
          <div className="testimonial-image">
            <img src={pasilloImg} alt="Pasillo de hospital" />
          </div>
          <div className="testimonial-text">
            <h2>Resultados Reales, Impacto Medible</h2>
            <blockquote>
              "Desde que implementamos SANICLEAR, hemos reducido el tiempo de gestión administrativa en un 60% y mejorado significativamente la trazabilidad de nuestros procesos de limpieza."
            </blockquote>
            <div className="testimonial-author">
              <CheckCircle size={20} color="#60a5fa" />
              <div>
                <strong>Dr. María González</strong>
                <span>Directora de Calidad, Hospital Central</span>
              </div>
            </div>
            <div className="testimonial-stats">
              <div className="t-stat">
                <span className="t-stat-number">60%</span>
                <span className="t-stat-label">Reducción en tiempo administrativo</span>
              </div>
              <div className="t-stat">
                <span className="t-stat-number">100%</span>
                <span className="t-stat-label">Trazabilidad de tareas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}