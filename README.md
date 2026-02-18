<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
<div align="center">
  <img src="https://via.placeholder.com/1000x300/0ea5e9/ffffff?text=SANICLEAR+Hospital+Hygiene+Management" alt="Saniclear Banner" width="100%">
  
  <h1 align="center">🏥 SANICLEAR</h1>
  
  <p align="center">
    <strong>Gestión Inteligente de Higiene Hospitalaria</strong><br>
    Proyecto Final de Ciclo (TFG) - Desarrollo de Aplicaciones Web (DAW)
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/REACT-v18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/VITE-Lighting_Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/TAILWIND-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/SUPABASE-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Estado-En_Desarrollo-orange?style=flat-square" alt="Estado">
    <img src="https://img.shields.io/badge/Versión-1.0.0-blue?style=flat-square" alt="Versión">
    <img src="https://img.shields.io/badge/Licencia-MIT-green?style=flat-square" alt="Licencia">
  </p>
</div>

<br>

---

## 📖 Descripción del Proyecto

**Saniclear** es una aplicación web tipo SPA (Single Page Application) diseñada para digitalizar y optimizar los procesos de limpieza en entornos hospitalarios. 

El sistema sustituye los partes de trabajo en papel por una gestión en tiempo real, permitiendo trazar quién limpió qué zona y cuándo. Diferencia claramente entre **Supervisores** (gestión y control) y **Operarios** (validación de tareas en movilidad).

---

## 🛠️ Tecnologías y Herramientas

### 🎨 Frontend & Diseño
<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Excalidraw-121212?style=for-the-badge&logo=excalidraw&logoColor=white" alt="Excalidraw" />
</p>

### ☁️ Backend & Datos
<p>
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

### ⚙️ Herramientas de Desarrollo
<p>
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VS Code" />
  <img src="https://img.shields.io/badge/GIT-E34F26?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  <img src="https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="NPM" />
</p>
---

## ✨ Características Clave

- 🔐 **Control de Acceso (RBAC):** Sistema de autenticación seguro con roles diferenciados para Administradores y Operarios.
- 🏥 **Gestión de Zonas y Tareas:** Asignación dinámica de limpiezas a quirófanos, habitaciones y pasillos.
- 📱 **Diseño Mobile-First:** Interfaz optimizada para que los operarios la usen cómodamente desde tablets o móviles.
- ⚡ **Tiempo Real:** Actualización instantánea de estados gracias a la tecnología de Supabase.
- 🛡️ **Seguridad Avanzada:** Implementación de Row Level Security (RLS) para proteger los datos sensibles.
- 📊 **Dashboard Analítico:** Panel visual para el control de incidencias y métricas de limpieza.

---

## 📂 Estructura del Proyecto

```bash
saniclear/
├── 📂 public/              # Assets estáticos (imágenes, favicon)
├── 📂 src/
│   ├── 📂 components/      # Componentes reutilizables (Botones, Modales, Navbar)
│   ├── 📂 pages/           # Vistas principales (Login, Dashboard, Tareas)
│   ├── 📂 supabase/        # Configuración del cliente y conexión DB
│   ├── 📂 assets/          # Estilos globales e imágenes importadas
│   ├── 📜 App.jsx          # Enrutador principal
│   └── 📜 main.jsx         # Punto de entrada de React
├── 📜 .env                 # Variables de entorno (NO SUBIR A GITHUB)
├── 📜 index.html           # HTML base
├── 📜 tailwind.config.js   # Configuración de estilos
└── 📜 vite.config.js       # Configuración del empaquetador
````
🚀 Instalación y Despliegue
🚧 SECCIÓN EN PROCESO DE REDACCIÓN

La documentación detallada para la instalación local y el despliegue en producción (Vercel) se está finalizando. Las instrucciones completas estarán disponibles en la próxima actualización de la documentación.

📘 Diario de Desarrollo del TFG
📋 Ficha del Proyecto
Rol,Detalle
👩‍💻 Alumna,María Ceballos
👨‍🏫 Tutor,Paco Mera
📅 Horario Seguimiento,"Martes, 16:55"
🏥 Proyecto,Gestión Inteligente de Higiene Hospitalaria

🚀 PROGRESO SEMANAL
🗓️ FEBRERO - MARZO 2026: Prototipado Final, Lógica y Documentación
Objetivo del bimestre: Cerrar la 2ª Evaluación con la documentación lista y las vistas principales funcionales.

📍 Semana 20 | Entrega de Documentación (Previsión)
Fecha Tutoría: Martes 03/03/2026

🎯 Hito: Finalización y entrega de la "Biblia" del proyecto.

📂 Documentos a entregar:

Manual Técnico: Arquitectura y Código.

Manual de Usuario: Guía para Supervisor/Operario.

Manual de Despliegue: Guía de instalación.

Manual de Evaluación: Autoevaluación del progreso.

Estado: 📅 Planificado para cierre de evaluación.

📍 Semana 19 | Lógica de Negocio y Paneles
Fecha Tutoría: Martes 24/02/2026

🛠️ En desarrollo (Frontend):

Panel de Control (Admin): Refactorización del Dashboard conectando datos reales de Supabase.

Vista Operario ("Mis Tareas"): Maquetación de tarjetas y lógica de "marcar completada".

📍 Semana 18 | Maratón de Documentación
Fecha Tutoría: Martes 17/02/2026

📚 Documentación: Inicio de redacción de entregables obligatorios (Técnico, Usuario, Despliegue).

📄 Evaluación: Creación del "Manual de Evaluación" para el tutor.

📍 Semana 17 | UX/UI y "Efecto WOW"
Fecha Tutoría: Martes 10/02/2026

✨ Frontend: Implementación de animaciones en la Landing Page.

🎨 Diseño: Creación de Prototipos Definitivos en Excalidraw.

📍 Semana 16 | Innovación: Asistente IA
Fecha Tutoría: Martes 03/02/2026

💡 Mejora del Alcance: Integración conceptual de un Asistente IA para predecir zonas de riesgo.

🗓️ ENERO 2026: Ejecución Visual y Frontend
📍 Semana 15 | Desarrollo del MVP Visual
Fecha Tutoría: Martes 27/01/2026

Trabajo autónomo: Lógica del formulario de registro y validación en React.

📍 Semana 14 | Landing Page y Login
Fecha Tutoría: Martes 20/01/2026

✅ Landing Page: Diseño definitivo (Hero, Features, Footer).

✅ Auth: Maquetación del Login y selectores de rol.

📍 Semana 13 | Vuelta de Vacaciones
Fecha Tutoría: Martes 13/01/2026

Actividad: Reactivación del entorno y actualización de librerías.

🗓️ DICIEMBRE 2025: Documentación y Análisis
📍 Semana 11 | Cierre de Análisis
Fecha Tutoría: Martes 16/12/2025

Hito: Entrega del análisis funcional y requisitos. Aprobación para codificar.

📍 Semana 10 | Dudas Teóricas
Fecha Tutoría: Martes 09/12/2025

Actividad: Resolución de dudas sobre relación auth.users vs public.usuarios.

🗓️ NOVIEMBRE 2025: Definición Tecnológica
📍 Semana 7 | Pivote a JavaScript
Fecha Tutoría: Martes 11/11/2025

Decisión Clave: Cambio de TypeScript a JavaScript (JSX) y confirmación de Supabase.

🗓️ OCTUBRE 2025: Inicio del Proyecto
📍 Semana 4 | "Hola Mundo"
Fecha Tutoría: Martes 28/10/2025

Hito: Inicialización del proyecto Vite + Supabase.

📍 Semana 3 | Modelo de Datos (MER)
Fecha Tutoría: Martes 21/10/2025

Hito: Diseño de tablas principales.

📍 Semana 2 | Git y Repositorio
Fecha Tutoría: Martes 14/10/2025

Hito: Configuración de GitHub y ramas.

📍 Semana 1 | Aprobación de la Propuesta
Fecha Tutoría: Martes 07/10/2025

Hito: Firma del Acta de Propuesta. Nace "Saniclear".

Documento vivo. Última actualización: 17/02/2026
