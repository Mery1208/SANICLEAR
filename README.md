<div align="center">
  <img src="https://via.placeholder.com/1000x300/0ea5e9/ffffff?text=SANICLEARS+Hospital+Hygiene+Management" alt="Saniclears Banner" width="100%">
  
  <h1 align="center">🏥 SANICLEARS</h1>
  
  <p align="center">
    <strong>Gestión Inteligente de Higiene Hospitalaria</strong><br>
    Proyecto Final de Ciclo (TFG) - Desarrollo de Aplicaciones Web (DAW)
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/REACT-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/VITE-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/TAILWIND-v4_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/SUPABASE-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
    <img src="https://img.shields.io/badge/TYPESCRIPT-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/GEMINI_AI-v1.5-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini AI">
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Estado-En_Desarrollo-orange?style=flat-square" alt="Estado">
    <img src="https://img.shields.io/badge/Versión-0.0.0-blue?style=flat-square" alt="Versión">
    <img src="https://img.shields.io/badge/Licencia-MIT-green?style=flat-square" alt="Licencia">
  </p>
</div>

<br>

---

## 📖 Descripción del Proyecto

**Saniclears** es una aplicación web tipo SPA (Single Page Application) desarrollada con React 19 y TypeScript, diseñada para digitalizar y optimizar los procesos de limpieza en entornos hospitalarios bajo una arquitectura multicéntrica.

El sistema sustituye los partes de trabajo en papel por una gestión en tiempo real, permitiendo trazar quién limpió qué zona y cuándo. Distingue claramente entre **tres roles** diferenciados:

- **Superadmin** – Control maestro de la plataforma, gestión de múltiples hospitales y panel de métricas globales
- **Administrador** – Gestión local de un hospital/entidad (zonas, usuarios, tareas, incidencias)
- **Operario** – Vista móvil para visualizar y completar tareas, reportar incidencias

---

## 🛠️ Tecnologías y Herramientas

### 🎨 Frontend & Diseño
- **React 19.2** – Biblioteca UI con Hooks y Concurrent Mode
- **Vite 7** – Empaquetador ultrarrápido con HMR
- **TypeScript 5.9** – Tipado estático
- **Tailwind CSS 4** – Framework utility-first, diseño Mobile-First
- **GSAP** – Animaciones fluidas (transiciones, scroll-trigger)
- **React Markdown** – Renderizado de respuestas de la IA con formato premium
- **Recharts** – Librería de gráficos (BarChart, LineChart)
- **Lucide React** – Iconografía SVG consistente

### ⚡ Gestión de Estado
- **Zustand 5** – State management global (auth, contadores en tiempo real)
- **React Context API** – Proveedor de autenticación (AuthContext)

### ⚙️ Librerías de Utilidad
- **React Router DOM 7** – Enrutamiento SPA con protección de rutas
- **date-fns** – Utilidades de fechas (formato, comparación)
- **uuid** – Generación de identificadores únicos

### ☁️ Backend as a Service
- **Supabase** – Plataforma BaaS (PostgreSQL + Auth + Storage + Realtime)
- **PostgreSQL** – Base de datos relacional
  - **Row Level Security (RLS)** – Seguridad a nivel de fila activada en todas las tablas
  - **Triggers** – Sincronización automática `auth.users` → `public.usuarios`
  - **Policies** – Políticas granulares por rol
- **Supabase Auth** – Autenticación con JWT + bcrypt
- **Supabase Storage** – Almacenamiento de archivos (fotos de incidencias)
- **Supabase Realtime** – WebSockets para actualizaciones instantáneas

### 🛠️ Herramientas de Desarrollo
- **ESLint 9** – Linter con reglas TypeScript
- **Git + GitHub** – Control de versiones
- **Vercel** – Plataforma de despliegue (opcional)

---

## ✨ Características Clave

### 🔐 Sistema RBAC Multi-Rol
- **3 niveles de acceso:** Superadmin (global), Administrador (local), Operario (ejecución)
- **Autenticación segura** con Supabase Auth (bcrypt, JWT)
- **Row Level Security (RLS)** en todas las tablas – cada usuario solo ve sus datos asignados
- **Integridad referencial** con `ON DELETE SET NULL` y `ON DELETE CASCADE`

### 🏥 Módulos Implementados

#### 1. Módulo de Tareas (Core)
- Trazabilidad completa de limpiezas (asignación → en curso → completada)
- Prioridades: alta (roja), media (amarilla), baja (verde)
- Asignación a operarios específicos
- Búsqueda y filtrado en tiempo real
- Optimistic UI: actualización instantánea al completar

#### 2. Módulo de Incidencias
- Reporte de problemas: Equipo, Material, Acceso, Zona, Otros
- Prioridad ajustable + **marcar como urgente** (fija a `critica`)
- Adjuntar foto desde cámara (hasta 5 MB, subida automática a Supabase Storage)
- Estados: `abierta` → `en_revision`/`en_proceso` → `resuelta`
- Panel de revisión para admin con modal de detalle y cambio de estado
- Comentarios de resolución

#### 3. Módulo de Notificaciones
- Sistema de mensajería interna asíncrona
- Tipos: urgente, importante, informativa
- Segmentación por destinatario: `todos`, `turno_mañana`, `turno_tarde`, `personal`
- Superadmin puede filtrar por entidad (multicéntrico)
- Acción: marcar como leída (individual o masivo)
- Vistas diferenciadas: tabla (admin/superadmin) vs tarjetas (operario)

#### 4. Módulo de Gestión de Zonas y Usuarios
- **Página unificada** (`/admin/zonas`) con toggle Zonas/Usuarios
- CRUD completo de zonas (nombre, tipo, planta, m², prioridad, estado)
- CRUD completo de usuarios (nombre, apellidos, email, rol, turno)
- Badges por rol (colores diferenciados)
- Fallback a datos mock para desarrollo sin conexión

#### 5. Panel Superadmin (Multicéntrico)
- **Panel Global** (`/superadmin`) – Vista agregada de todas las entidades
  - Métricas consolidadas (usuarios, zonas, tareas, incidencias críticas)
  - Carga operativa por zona (top 6) con algoritmo de peso (tareas + incidencias*2)
  - Nivel de riesgo: `Crítico`, `Vigilancia`, `Estable`
- **Estadísticas** (`/superadmin/estadisticas`) – Gráficas históricas 6 meses
  - LineChart: incidencias vs tareas completadas
  - LineChart: productividad vs carga operativa
  - Zonas más exigidas (top 4)
  - **Motor predictivo** con:
    - Media móvil de 3 periodos
    - Extrapolación lineal
    - Sugerencia de personal (carga_prevista / 6)
- **Métricas por Entidad** (`/superadmin/entidades/:id/metricas`)
  - Zoom por hospital individual
  - Igual gráficas que globales, filtradas

#### 6. Módulo de Perfil
- Edición de datos personales (nombre, apellidos)
- Cambio de contraseña con validación
- Visualización de email y turno
- Cierre de sesión
- Integración con Supabase Auth

#### 7. SaniclearBot (Asistente de IA)
- **Integración de LLM:** Uso de la API de Google Gemini (1.5 Flash/Pro)
- **Grounding Dinámico:** Respuestas basadas 100% en la documentación técnica del proyecto
- **UI de Chat:** Ventana flotante con animaciones y renderizado de Markdown
- **Ayuda Contextual:** Capaz de explicar el manual de usuario y la arquitectura técnica al evaluador

---

## 📂 Estructura del Proyecto

```
limpieza-hospitalaria/
├── 📂 public/                  # Assets estáticos
│   ├── 📂 img/                 # Logos e imágenes
│   └── 📂 documentos/          # Documentación del proyecto
│       ├── 📄 MER.md          # Modelo Entidad-Relación (DB)
│       ├── 📄 diagrama_clases.md # Diagrama de clases UML
│       ├── 📄 MANUAL_TECNICO.md   # Guía técnica
│       ├── 📄 MANUAL_USUARIO.md   # Guía de usuario
│       └── 📄 MANUAL_DESPLIEGUE.md # Instrucciones de instalación
│
├── 📂 src/                     # Código fuente TypeScript/React
│   ├── 📂 assets/              # Imágenes importadas + CSS global
│   │   └── 📂 img/             # hospital.avif, medico.avif, pasillo.avif
│   ├── 📂 components/          # Componentes reutilizables
│   │   ├── 📂 common/          # Botón, Modal, AIAssistant (IA), etc.
│   │   └── 📂 operario/        # Tareas, Incidencias, etc.
│   ├── 📂 context/             # AuthContext (proveedor autenticación)
│   ├── 📂 css/                 # Estilos específicos por rol
│   ├── 📂 layouts/             # AdminLayout, OperarioLayout, SuperadminLayout
│   ├── 📂 mock/                # Datos estáticos de prueba (incidencias.json, etc.)
│   ├── 📂 pages/               # Vistas de la aplicación (Admin, Operario, etc.)
│   ├── 📂 services/            # Servicios API e Inteligencia Artificial
│   │   └── 📜 gemini.ts       # Integración con Google Gemini (lee de /public/documentos)
│   ├── 📂 routes/              # AppRouter y protección de rutas
│   ├── 📂 store/               # Zustand stores (estado global)
│   ├── 📂 supabase/            # Cliente Supabase (client.ts)
│   ├── 📜 App.tsx              # Componente raíz
│   ├── 📜 main.tsx             # Punto de entrada
│   └── 📜 index.css            # Estilos globales
│
├── 📜 .env.local               # Variables de entorno (NO COMMIT)
├── 📜 .env.example             # Ejemplo de variables
├── 📜 eslint.config.js         # Linter ESLint
├── 📜 index.html               # HTML base
├── 📜 package.json             # Dependencias y scripts NPM
├── 📜 tsconfig.json            # Configuración TypeScript
├── 📜 vite.config.js           # Configuración Vite
├── 📜 README.md                # Documentación principal del proyecto
└── 📜 AGENTS.md               # Configuración Kilo CLI

```

---

## 🚀 Instalación y Despliegue

### Requisitos Previos
- Node.js (v18+)
- Cuenta en Supabase con proyecto creado

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Mery1208/SANICLEARS.git
cd limpieza-hospitalaria

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env.local con:
VITE_SUPABASE_URL=https://zwmfzqdamdibjermgnyo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GEMINI_API_KEY=AIzaSy... (Clave de Google AI Studio)

# 4. Ejecutar en modo desarrollo
npm run dev
```

Accede a: http://localhost:5173

### Scripts Disponibles

| Comando            | Descripción                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Iniciar servidor de desarrollo       |
| `npm run build`    | Compilar para producción             |
| `npm run preview`  | Previsualizar build de producción    |
| `npm run lint`     | Ejecutar linter ESLint               |

### Despliegue en Producción

1. Ejecutar `npm run build`
2. Subir carpeta `dist/` a Vercel/Netlify
3. Configurar variables de entorno en la plataforma

---

## 📘 Diario de Desarrollo del TFG

### 📋 Ficha del Proyecto

| Rol | Detalle |
|-----|---------|
| 👩‍💻 Alumna | María Ceballos |
| 👨‍🏫 Tutor | María Mercedes Martínez Fragoso |
| 📅 Horario Seguimiento | 17:05 - 18:00 |
| 🏥 Proyecto | Gestión Inteligente de Higiene Hospitalaria |



---

### 🎓 Sesiones de Seguimiento y Tutorías

A lo largo del mes de abril se han llevado a cabo reuniones estratégicas con la tutora del proyecto, **María Mercedes Martínez Fragoso**, para validar los avances:

- 📅 **14/04/2026 — 1ª Tutoría (Toma de contacto y UI)**
  - **Asistentes:** María Ceballos y María Mercedes Martínez.
  - **Temas tratados:** Inicio de contacto. Revisión de mejoras de diseño: refactorización visual de interfaces, afinado de estilos y coherencia general para lograr un aspecto profesional.

- 📅 **16/04/2026 — 2ª Tutoría (Evolución de Arquitectura)**
  - **Asistentes:** María Ceballos y María Mercedes Martínez.
  - **Temas tratados:** Presentación de la idea clave de añadir un nuevo usuario **Superadmin**. Esto permite convertir la aplicación en un sistema **multiusuario y multicéntrico** con gestión centralizada de múltiples hospitales o entidades.

- 📅 **28/04/2026 — 3ª Tutoría (Cierre y Presentación)**
  - **Asistentes:** María Ceballos y María Mercedes Martínez.
  - **Temas tratados:** Revisión de arreglos finales de código, corrección de últimos bugs y preparación general de la presentación y defensa del proyecto.

---

## 📘 Diario de Desarrollo del TFG

### 🗓️ MAYO 2026 — Integración de IA y Pulido Final
 
 #### 📍 Semana 36 | 11 y 12 de Mayo - Corrección UI e Inyección Avanzada en IA
 
 ✨ **Mejoras de UI y Base de Conocimiento de IA:**
 - **Corrección Visual de Usuarios:** Eliminación de burbujas informativas redundantes ("Entidad") en la vista general de la lista de usuarios, manteniendo la interfaz más limpia y focalizada en los roles.
 - **Inyección Multi-Manual (Grounding Dinámico):** Refactorización del asistente de IA para que ahora lea simultáneamente los 3 documentos oficiales (`MANUAL_TECNICO.md`, `MANUAL_DESPLIEGUE.md` y `MANUAL_USUARIO.md`), extrayendo el contenido dinámicamente desde la carpeta `public/documentos`. Esto permite cruzar la información técnica, de instalación y de usuario para dar respuestas precisas.
 - **Extracción Automatizada:** Creación de scripts para extraer automáticamente el texto de los manuales originales (`.docx`) y convertirlos a un formato Markdown plano para su perfecta asimilación por la IA.

 #### 📍 Semana 35 | Inteligencia Artificial y Experiencia de Usuario
  
 ✨ **Hito: SaniclearBot - El Asistente Inteligente:**
 - **Integración de Gemini API:** Implementación de un asistente de IA capaz de responder dudas sobre el proyecto usando el manual oficial como fuente de verdad.
 - **Renderizado de Markdown:** Soporte para tablas, listas y formato enriquecido en el chat para una comunicación profesional.
 - **Grounding Técnico:** Configuración del sistema de "inyección de contexto" para evitar alucinaciones de la IA.
 - **Refactorización UI/UX:** Mejora visual de los mensajes y optimización de la ventana de chat flotante.

#### 📍 Semana 34 | Estandarización de Entidades y Accesibilidad
 
✨ **Integración y Refinamiento:**
- **Sincronización de Entidades (Hospitales):** Migración completa del sistema de gestión de entidades de IDs numéricos a UUIDs, alineando el código con el esquema real de Supabase.
- **Normalización de Campos:** Actualización de todas las consultas y visualizaciones para utilizar el campo `nombre_hospital` de forma consistente en el Perfil, Barra Superior y Gestión de Incidencias.
- **Mejoras en Modo Oscuro:** Implementación de "recuadros blancos" obligatorios para inputs y selectores en la vista de reporte de incidencias (Operario y Admin) para garantizar contraste y legibilidad máxima en temas oscuros.
- **Fiabilidad en Perfil:** Integración de un sistema de carga secundaria en el Perfil de Usuario para resolver el nombre del hospital directamente desde la tabla `entidades`, eliminando el fallback genérico "Gestión Global" para administradores.
- **Gestión de Avatar:** Corrección de accesibilidad en el Perfil permitiendo la eliminación del avatar a todos los roles (incluido Superadmin) mediante la visualización forzada del botón de papelera.

#### 📍 Semana 33 | Selectores Globales, Filtros Temporales y Preparación IA

✨ **Nuevas Funcionalidades y Optimizaciones:**
- **Panel Global Dinámico:** Añadido un selector de entidades en el Panel del Superadmin para filtrar métricas globales o específicas por hospital en tiempo real.
- **Exploración Histórica:** Incorporación de un selector de mes/año en las gráficas de carga operativa para visualizar la evolución histórica de tareas e incidencias.
- **Responsive Design:** Refactorización de todos los modales del sistema (Admin, Superadmin) aplicando el patrón `flex-col-reverse` en dispositivos móviles para un apilamiento más ergonómico de los botones de acción.
- **Validación UI:** Añadidos contadores de caracteres interactivos visuales en los campos de texto (ej. creación de Notificaciones).
- **Proyección de Futuro:** Integración de un apartado "Próximamente" (con estado bloqueado) en el menú lateral informando sobre la futura Fase 2 del proyecto: **Mapas interactivos 2D y Predicciones Avanzadas con IA**.

#### 📍 Semana 32 | 6, 7 y 8 de Mayo Corrección de Bugs y Consistencia Visual

✨ **Mejoras de Interfaz y Estabilidad:**
- **Estandarización de Paneles:** Alineación corregida en las cabeceras de Admin y Superadmin (`Dashboard`, `GestionZonaUsuarios`, `PanelGlobal`) utilizando un sistema Flexbox homogéneo y responsivo.
- **Modales de Prevención:** Sustitución global de las alertas nativas (`window.confirm`) por ventanas `Modal` personalizadas (con diseño de advertencia) para la eliminación irreversible de datos (usuarios, zonas, entidades).
- **Optimización de Gráficos:** El gráfico de Recharts del Dashboard ahora inyecta dinámicamente los 6 meses previos para garantizar una representación temporal coherente, incluso si la base de datos es de reciente creación.
- **Refactorización Móvil:** Las tarjetas de tareas del Operario (`MisTareas.tsx`) y los bloques de métricas han sido compactados y adaptados para un renderizado impecable en smartphones.

---

### 🗓️ ABRIL 2026 — Recta Final, Superadmin y Supabase

#### 📍 Semana 31 | 25-27-28 Abril 2026 · Estado Final

✨ **Refinamiento y Seguridad:**
- **25 y 26 de Abril:** Conexión completa de la aplicación con la base de datos real en Supabase. Resolución profunda de errores de código y configuración de las políticas de seguridad (RLS) en todas las tablas. Testing completo de flujos.
- **27 de Abril:** Últimos retoques de diseño general, corrección de errores finales de consultas SQL y cruce de datos (Foreign Keys) en Supabase. Documentación actualizada (diagrama de clases, MER, manuales técnico y de usuario).

---

#### 📍 Semana 30 | 23-24 Abril 2026 · Módulo de Incidencias y Notificaciones

👑 **Nuevos Módulos:**
- **23 de Abril:** Desarrollo e integración completa del módulo de Incidencias. Reportes de operarios con foto adjunta, niveles de prioridad (Baja, Media, Alta, Crítica), estados de resolución y panel de gestión para administradores.
- **24 de Abril:** Implementación del sistema de Notificaciones interno. Admin puede enviar mensajes segmentados por tipo (Urgente/Importante/Informativa) y destinatario (Turnos o Todos). Operario recibe bandeja con contador no-leídas.

---

#### 📍 Semana 29 | 21-22 Abril 2026 · Consolidación y Superadmin

🛠️ **Implementaciones:**
- **21 de Abril:** Desarrollo del nuevo rol de `superadmin` con privilegios globales y creación de sus vistas exclusivas:
  - Panel Global (vista agregada de todas las entidades)
  - Estadísticas Superadmin (gráficas históricas y motor predictivo)
  - Métricas por Entidad (zoom por hospital)
- **22 de Abril:** Integración del motor predictivo básico: cálculo de media móvil de 3 periodos y proyección lineal para sugerencia de personal y detección de zonas con mayor presión.

---

#### 📍 Semana 28 | 14-16 Abril 2026 · Gestión Combinada y Refinamiento

🛠️ **Mejoras de UX:**
- **14 de Abril:** Implementación de gestión combinada Zonas y Usuarios en una sola página (`/admin/zonas`) con toggle buttons estilo pill y transición azul (#3b82f6).
- **15 de Abril:** Actualización del Dashboard Admin con contadores en una línea (Pendientes, Críticas, Hoy, En Curso).
- **16 de Abril:** Añadido Perfil de Usuario completo para Admin y Operario (edición de nombre, cambio de contraseña con validación Supabase Auth).

---

#### 📍 Semana 27 | Martes 27/03/2026

#### 📍 Semana 28 | Panel de Control y Perfil · Jueves 09/04/2026

️ **Últimas implementaciones:**
- **Panel de Control (Admin):** Modificación para mostrar datos dinámicos en tiempo real. Gráfico de incidencias por mes. Tabla de tareas con badges.
- **Página de Perfil:** Nueva vista completa (`Perfil.tsx`) para editar nombre, apellidos y contraseña con validación en Supabase Auth.

---

### 🗓️ MARZO 2026 — Documentación Técnica

#### 📍 Semana 27 | Martes 27/03/2026

🎯 **Hito:** Finalización y entrega de todos los manuales del proyecto.

📂 Documentos entregados:
- ✅ **Manual Técnico:** Arquitectura, base de datos, Triggers y RLS.
- ✅ **Manual de Usuario:** Guía paso a paso para Supervisor y Operario con capturas de pantalla.
- ✅ **Manual de Despliegue:** Guía de instalación local y despliegue en Vercel.
- ✅ **Manual de Evaluación:** Autoevaluación del progreso del proyecto.
- ✅ **Manual de Seguimiento:** Trazabilidad del desarrollo semanal entregado al tutor.

---

### 🗓️ FEBRERO 2026 — Cierre de Manuales y Vistas Principales

---

#### 📍 Semana 26 | Lógica de Negocio y Paneles · Martes 24/02/2026

🛠️ **En desarrollo (Frontend):**
- **Panel de Control (Admin):** Refactorización del Dashboard conectando datos reales de Supabase. Estadísticas en tiempo real: tareas pendientes, en curso y completadas; incidencias abiertas.
- **Vista Operario ("Mis Tareas"):** Maquetación de tarjetas de tarea con zona, descripción, prioridad y estado. Lógica de "marcar como completada" actualizando el estado en Supabase.
- Revisión con el tutor del avance general y feedback sobre las vistas desarrolladas.

---

### 🗓️ ENERO 2026 — Documentación y UX

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

> **Nota:** El proyecto posteriormente fue migrado de vuelta a TypeScript (TSX) en marzo de 2026 para mejorar la robustez del código.

---

#### 📍 Semana 6 | Autenticación y Roles · Martes 04/11/2025 (aprox.)

- Implementación del flujo de login con Supabase Auth.
- Diseño del Trigger PostgreSQL para asignación automática de roles al registrarse.
- Primeras pruebas de la tabla `usuarios` y su relación con `auth.users`.

---

### 🗓️ OCTUBRE 2025 — Inicio del Proyecto

#### 📍 Semana 4 | "Hola Mundo" · Martes 28/10/2025

🎯 **Hito:** Inicialización del proyecto Vite + Supabase. Primer commit funcional.
- `npm create vite@latest saniclears` — proyecto arrancado.
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

🎯 **Hito:** Firma del Acta de Propuesta. Nace **Saniclears**.
- Primera reunión con la tutora María Mercedes Martínez Fragoso.
- Validación de la idea y aprobación para comenzar el análisis funcional.

---

*Documento vivo. Última actualización: 12/05/2026*
