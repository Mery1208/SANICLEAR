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

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📘 Diario de Desarrollo del TFG
📋 Ficha del Proyecto
Rol,Detalle
👩‍💻 Alumna,María Ceballos
👨‍🏫 Tutor,Paco Mera
📅 Horario Seguimiento,"Martes, 16:55"
🏥 Proyecto,Gestión Inteligente de Higiene Hospitalaria
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 🗓️ MARZO 2026 — Cierre de Manuales y Segunda Evaluación

#### 📍 Semana 20 | Entrega de Documentación · Martes 03/03/2026

🎯 **Hito:** Finalización y entrega de todos los manuales del proyecto.

📂 Documentos entregados:
- ✅ **Manual Técnico:** Arquitectura, base de datos, Triggers y RLS.
- ✅ **Manual de Usuario:** Guía paso a paso para Supervisor y Operario con capturas de pantalla.
- ✅ **Manual de Despliegue:** Guía de instalación local y despliegue en Vercel.
- ✅ **Manual de Evaluación:** Autoevaluación del progreso del proyecto.
- ✅ **Manual de Seguimiento:** Trazabilidad del desarrollo semanal entregado al tutor.

🗒️ Estado general al cierre de la 2ª evaluación: vistas principales operativas y conectadas a Supabase. Pendiente para las próximas semanas: módulo de incidencias, notificaciones y refinamiento mobile.

---

#### 📍 Semana 19 | Lógica de Negocio y Paneles · Martes 24/02/2026

🛠️ **En desarrollo (Frontend):**
- **Panel de Control (Admin):** Refactorización del Dashboard conectando datos reales de Supabase. Estadísticas en tiempo real: tareas pendientes, en curso y completadas; incidencias abiertas.
- **Vista Operario ("Mis Tareas"):** Maquetación de tarjetas de tarea con zona, descripción, prioridad y estado. Lógica de "marcar como completada" actualizando el estado en Supabase.
- Revisión con el tutor del avance general y feedback sobre las vistas desarrolladas.

---

### 🗓️ FEBRERO 2026 — Lógica de Negocio y Documentación

#### 📍 Semana 18 | Maratón de Documentación · Martes 17/02/2026

📚 **Hito:** Inicio formal de la redacción de los entregables obligatorios.
- Inicio del **Manual Técnico:** arquitectura del sistema, descripción de la BD y código principal.
- Inicio del **Manual de Usuario:** guía para Supervisor y Operario.
- Inicio del **Manual de Despliegue:** instalación local y despliegue con Vercel.
- Creación del **Manual de Evaluación** para el tutor.

---

#### 📍 Semana 17 | UX/UI y "Efecto WOW" · Martes 10/02/2026

✨ **Frontend:**
- Implementación de animaciones de entrada en la Landing Page (fade-in, slide-up).
- Creación de los **Prototipos Definitivos** en Excalidraw: Dashboard Admin, Vista Operario, Gestión de Zonas, Gestión de Tareas, Incidencias.
- Revisión de paleta de colores y tipografía para mayor coherencia con la imagen corporativa.

---

#### 📍 Semana 16 | Innovación: Asistente IA · Martes 03/02/2026

💡 **Mejora del Alcance:**
- Investigación de viabilidad de un módulo de IA para predecir zonas de riesgo de infección.
- Documentado como funcionalidad futura en el Acta de Propuesta.
- La arquitectura del proyecto se ha diseñado para permitir esta integración en el futuro.

---

### 🗓️ ENERO 2026 — Ejecución Visual y Frontend

#### 📍 Semana 15 | Desarrollo del MVP Visual · Martes 27/01/2026

- Trabajo autónomo: lógica del formulario de registro y validaciones en React (campos obligatorios, formato email, longitud mínima de contraseña).
- Implementación de la redirección según rol del usuario tras autenticación.

---

#### 📍 Semana 14 | Landing Page y Login · Martes 20/01/2026

✅ **Landing Page:** Diseño definitivo (Hero, Features, Footer) implementado en React + Tailwind.  
✅ **Auth:** Maquetación del Login, selectores de rol e integración con Supabase Auth.

---

#### 📍 Semana 13 | Vuelta de Vacaciones · Martes 13/01/2026

- Reactivación del entorno de desarrollo.
- Actualización de todas las dependencias del proyecto a sus últimas versiones estables.
- Resolución de conflictos de versiones.

---

### 🗓️ DICIEMBRE 2025 — Documentación y Análisis

#### 📍 Semana 11 | Cierre de Análisis · Martes 16/12/2025

🎯 **Hito:** Entrega del análisis funcional completo y requisitos del sistema. **Aprobación del tutor para comenzar a codificar.**

---

#### 📍 Semana 10 | Dudas Teóricas · Martes 09/12/2025

- Resolución de dudas sobre la relación `auth.users` (Supabase) vs `public.usuarios` (tabla propia).
- Explicación del flujo de Triggers para sincronizar ambas tablas.
- Revisión del flujo de registro de operarios por parte del Administrador.

---

#### 📍 Semana 9 | Refinamiento de Base de Datos · Martes 02/12/2025

- Revisión y ajuste de todas las tablas del modelo.
- Creación de índices y relaciones en Supabase Dashboard.
- Pruebas de integridad referencial.

---

### 🗓️ NOVIEMBRE 2025 — Definición Tecnológica

#### 📍 Semana 8 | Primeras Políticas RLS · Martes 25/11/2025

- Configuración de las primeras políticas de Row Level Security (RLS) en Supabase.
- Pruebas con distintas configuraciones y documentación de problemas encontrados.

---

#### 📍 Semana 7 | Pivote a JavaScript · Martes 11/11/2025

🔑 **Decisión Clave:** Cambio de TypeScript a JavaScript (JSX) para reducir la curva de aprendizaje y ajustarse al plazo del proyecto.
- Confirmación definitiva del stack: React + Vite + Tailwind + Supabase (JS).
- Revisión de la estructura de carpetas del proyecto.

---

#### 📍 Semana 6 | Autenticación y Roles · Martes 04/11/2025 (aprox.)

- Implementación del flujo de login con Supabase Auth.
- Diseño del Trigger PostgreSQL para asignación automática de roles al registrarse.
- Primeras pruebas de la tabla `usuarios` y su relación con `auth.users`.

---

### 🗓️ OCTUBRE 2025 — Inicio del Proyecto

#### 📍 Semana 4 | "Hola Mundo" · Martes 28/10/2025

🎯 **Hito:** Inicialización del proyecto Vite + Supabase. Primer commit funcional.
- `npm create vite@latest saniclear` — proyecto arrancado.
- Instalación y configuración de Tailwind CSS.
- Configuración del cliente Supabase y primeras pruebas de conexión.
- Creación de las primeras tablas en Supabase Dashboard.

---

#### 📍 Semana 3 | Modelo de Datos (MER) · Martes 21/10/2025

🎯 **Hito:** Diseño y validación del Modelo Entidad-Relación con el tutor.
- Diseño de tablas principales: `usuarios`, `zonas`, `tareas`, `incidencias`, `materiales`.
- Definición de relaciones, claves primarias y foráneas.
- Ajustes en la tabla `tareas` para incluir historial de estados.

---

#### 📍 Semana 2 | Git y Repositorio · Martes 14/10/2025

🎯 **Hito:** Configuración de GitHub y estructura de ramas.
- Creación del repositorio `saniclear` en GitHub.
- Configuración de ramas: `main` (producción) y `develop` (desarrollo activo).
- Definición de convención de commits.
- Primera entrada del README.

---

#### 📍 Semana 1 | Aprobación de la Propuesta · Martes 07/10/2025

🎯 **Hito:** Firma del Acta de Propuesta. Nace **Saniclear**.
- Primera reunión con el tutor Paco Mera.
- Validación de la idea y aprobación para comenzar el análisis funcional.

---

*Documento vivo. Última actualización: 03/03/2026*
