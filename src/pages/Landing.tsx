import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Users, BarChart3, Smartphone, Globe, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import '../css/Landing.css';
import hospitalImg from '../assets/img/hospital.avif';
import medicoImg from '../assets/img/medico.avif';
import pasilloImg from '../assets/img/pasillo.avif';

export default function Landing(): React.JSX.Element {

  useEffect(() => {
    // animacion de entrada del hero con gsap
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 })
        .from('.hero-text h1', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
        .from('.hero-text p', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
        .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
        .from('.hero-image', { opacity: 0, x: 60, scale: 0.95, duration: 1 }, '-=0.6');

      gsap.to('.hero-image', {
        y: -15, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1,
      });
    });

    // animaciones de scroll con intersection observer
    const animated = document.querySelectorAll('.anim');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animated.forEach((el) => observer.observe(el));

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-container">
      <Navbar />

      {/* Hero */}
      <header className="hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Gestión <span className="text-gradient">Inteligente</span> de
              Higiene Hospitalaria
            </h1>
            <p>
              Digitaliza, supervisa y optimiza las tareas de limpieza en entornos
              críticos. La solución completa para hospitales modernos.
            </p>
            <div className="hero-buttons">
              <Link to="/login">
                <Button text="Entrar al Portal" variant="primary" icon={ArrowRight} />
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

      {/* Sobre nosotros */}
      <section id="sobre-nosotros" className="about-section">
        <div className="about-content">
          <div className="about-image anim slide-left">
            <img src={medicoImg} alt="Equipo médico" />
          </div>
          <div className="about-text anim slide-right">
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
              <div className="stat anim fade-up delay-1">
                <span className="stat-number">50+</span>
                <span className="stat-label">Hospitales</span>
              </div>
              <div className="stat anim fade-up delay-2">
                <span className="stat-number">10.000+</span>
                <span className="stat-label">Tareas Diarias</span>
              </div>
              <div className="stat anim fade-up delay-3">
                <span className="stat-number">99%</span>
                <span className="stat-label">Satisfacción</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="features-section">
        <div className="features-header anim fade-up">
          <h2>Todo lo que Necesitas en una Plataforma</h2>
          <p>Herramientas profesionales diseñadas para maximizar la eficiencia y seguridad</p>
        </div>
        <div className="features-grid">
          <div className="feature-card anim fade-up delay-1">
            <div className="feature-icon">
              <Activity size={28} />
            </div>
            <h3>Control en Tiempo Real</h3>
            <p>Monitoriza en tiempo real el estado de todas las tareas de limpieza en tu institución desde un único panel de control.</p>
          </div>
          <div className="feature-card anim fade-up delay-2">
            <div className="feature-icon">
              <ShieldCheck size={28} />
            </div>
            <h3>Trazabilidad Completa</h3>
            <p>Registra y audita cada acción realizada con un historial completo, verificable y conforme a normativas sanitarias.</p>
          </div>
          <div className="feature-card anim fade-up delay-3">
            <div className="feature-icon">
              <Users size={28} />
            </div>
            <h3>Gestión de Equipos</h3>
            <p>Administra equipos con diferentes niveles de acceso: administradores, supervisores y personal operativo.</p>
          </div>
          <div className="feature-card anim fade-up delay-4">
            <div className="feature-icon">
              <BarChart3 size={28} />
            </div>
            <h3>Análisis y Reportes</h3>
            <p>Genera informes detallados sobre productividad, cumplimiento y áreas de mejora para tomar decisiones basadas en datos.</p>
          </div>
          <div className="feature-card anim fade-up delay-5">
            <div className="feature-icon">
              <Smartphone size={28} />
            </div>
            <h3>App Móvil Operarios</h3>
            <p>Aplicación móvil intuitiva para que el personal de limpieza registre tareas completadas con un simple toque.</p>
          </div>
          <div className="feature-card anim fade-up delay-6">
            <div className="feature-icon">
              <Globe size={28} />
            </div>
            <h3>Acceso desde Cualquier Lugar</h3>
            <p>Plataforma cloud que permite acceder a la información desde cualquier dispositivo, en cualquier momento.</p>
          </div>
        </div>
      </section>

      {/* Pasos */}
      <section className="steps-section">
        <div className="steps-header anim fade-up">
          <h2>Cómo Funciona SANICLEAR</h2>
          <p>Implementación simple en 3 pasos</p>
        </div>
        <div className="steps-wrapper">
          <div className="steps-line anim scale-x"></div>
          <div className="steps-grid">
            <div className="step-card anim fade-up delay-1">
              <div className="step-number">1</div>
              <h3>Configura tus Zonas</h3>
              <p>Define las áreas del hospital, asigna responsables y establece los protocolos de limpieza para cada zona.</p>
            </div>
            <div className="step-card anim fade-up delay-2">
              <div className="step-number">2</div>
              <h3>Asigna Tareas</h3>
              <p>Programa y distribuye las tareas de limpieza al personal operativo desde el panel de administración.</p>
            </div>
            <div className="step-card anim fade-up delay-3">
              <div className="step-number">3</div>
              <h3>Supervisa y Optimiza</h3>
              <p>Monitoriza el progreso en tiempo real y genera reportes para mejorar continuamente la eficiencia operativa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="testimonial-section">
        <div className="testimonial-content">
          <div className="testimonial-image anim slide-left">
            <img src={pasilloImg} alt="Pasillo de hospital" />
          </div>
          <div className="testimonial-text anim slide-right">
            <h2>Resultados Reales, Impacto Medible</h2>
            <blockquote>
              "Desde que implementamos SANICLEAR, hemos reducido el tiempo de gestión administrativa en un 60% y mejorado significativamente la trazabilidad de nuestros procesos de limpieza."
            </blockquote>
            <div className="testimonial-author">
              <CheckCircle size={20} color="#2563EB" />
              <div>
                <strong>Dr. María González</strong>
                <span>Directora de Calidad, Hospital Central</span>
              </div>
            </div>
            <div className="testimonial-stats">
              <div className="t-stat anim fade-up delay-1">
                <span className="t-stat-number">60%</span>
                <span className="t-stat-label">Reducción en tiempo administrativo</span>
              </div>
              <div className="t-stat anim fade-up delay-2">
                <span className="t-stat-number">100%</span>
                <span className="t-stat-label">Trazabilidad de tareas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content anim fade-up">
          <h2>¿Listo para Transformar la Gestión de tu Hospital?</h2>
          <p>
            Únete a los hospitales que ya confían en SANICLEAR para optimizar sus procesos
            de higiene y garantizar la máxima seguridad.
          </p>
          <Link to="/login">
            <Button text="Comenzar Ahora" variant="primary" icon={ArrowRight} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}