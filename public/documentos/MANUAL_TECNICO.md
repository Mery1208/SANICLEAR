# 🏥 SANICLEARS — Manual Técnico
> **Proyecto Final de Ciclo (TFG)**  
> **Autor:** María Ceballos Mesías | **Curso:** 2025/26 | **Centro:** IES Albarregas

---

## 📑 ÍNDICE

1. [Introducción](#1-introducción)
2. [Arquitectura de la Aplicación](#2-arquitectura-de-la-aplicación)
3. [Documentación Técnica](#3-documentación-técnica)
4. [Proceso de Despliegue](#4-proceso-de-despliegue)
5. [Propuesta de Mejoras](#5-propuesta-de-mejoras)
6. [Bibliografía](#6-bibliografía)

---

## 1️⃣ INTRODUCCIÓN

### 1.1. DESCRIPCIÓN DEL PROYECTO

El proyecto denominado SANICLEARS consiste en el diseño, desarrollo e implementación de una aplicación web integral destinada a la digitalización de los procesos de limpieza y desinfección en entornos hospitalarios.

Se trata de una Single Page Application (SPA) desarrollada con tecnologías web modernas, que permite la gestión en tiempo real de las tareas de higiene, garantizando la trazabilidad de las acciones realizadas por el personal de limpieza y ofreciendo a los supervisores herramientas de control y auditoría.

El sistema sustituye los tradicionales partes de trabajo en papel por una plataforma digital centralizada, accesible desde dispositivos móviles (para los operarios) y equipos de escritorio (para la administración).

### 1.2. JUSTIFICACCIÓN Y PROBLEMÁTICA

En la actualidad, la gestión de la higiene en muchos centros sanitarios sigue dependiendo de procesos manuales y registros físicos. Esta metodología presenta varios inconvenientes críticos:

- **Falta de trazabilidad:** Es difícil saber con exactitud quién limpió una zona específica y a qué hora exacta.
- **Retraso en la información:** Las incidencias no se comunican en tiempo real.
- **Dificultad de auditoría:** Analizar el rendimiento requiere digitalizar manualmente los datos.

### 1.3. ÁMBITO DEL PROYECTO

El alcance del sistema abarca los siguientes módulos funcionales:

- Gestión de Usuarios y Roles
- Gestión de Espacios (Zonas)
- Planificación de Tareas
- Control de Incidencias

### 1.4. DIAGRAMA DE CONTEXTO

El flujo de información comienza cuando el usuario accede a la aplicación a través de un navegador web. La aplicación cliente (Frontend) se comunica de forma segura mediante HTTPS con los servicios en la nube de Supabase.

---

## 2️⃣ ARQUITECTURA DE LA APLICACIÓN

El proyecto Saniclears se ha diseñado siguiendo un modelo de arquitectura moderna, desacoplada y basada en la nube. Implementa una arquitectura Serverless y SPA.

### 2.1. FRONTEND

#### 2.1.1. TECNOLOGÍAS USADAS

- **React (v19) + TypeScript:** Librería principal para interfaz basada en componentes
- **Vite 7:** Herramienta de construcción con HMR instantáneo
- **Tailwind CSS 4:** Framework utility-first para diseño responsive
- **React Router DOM:** Enrutamiento dinámico en SPA
- **Lucide React:** Iconos vectoriales ligeros
- **Zustand:** Gestión de estado global (sesión del usuario) + React Context API
- **Gráficas y Animaciones:** Recharts para estadísticas, GSAP para animaciones
- **Supabase Client:** Conexión segura con backend

#### 2.1.2. ENTORNOS DE DESARROLLO

- Node.js & NPM
- Visual Studio Code con ESLint y Prettier
- Git & GitHub para control de versiones
- Chrome DevTools para pruebas responsive

### 2.2. BACKEND

#### 2.2.1. TECNOLOGÍAS USADAS

- **Supabase:** Plataforma BaaS con PostgreSQL
- **PostgreSQL:** Motor de base de datos relacional
- **Supabase Auth (GoTrue):** Autenticación JWT + bcrypt
- **Row Level Security (RLS):** Políticas de seguridad a nivel de fila
- **PL/pgSQL (Triggers):** Lógica de negocio en base de datos

#### 2.2.2. ENTORNO DE DESARROLLO

- Supabase Dashboard para gestión de tablas y políticas
- SQL Editor para scripts y triggers
- Table Editor para inspección de datos

---

## 3️⃣ DOCUMENTACIÓN TÉCNICA

### 3.1. ANÁLISIS

#### 3.1.1. REQUISITOS FUNCIONALES

| ID | Nombre | Descripción |
|----|--------|-------------|
| RF01 | Gestión de Roles | Distinción entre Superadmin, Admin y Operario |
| RF02 | Gestión de Usuarios y Zonas | CRUD completo de personal y áreas |
| RF03 | Asignación de Tareas | Creación, asignación y seguimiento con prioridades |
| RF04 | Reporte de Incidencias | Reporte con descripciones y fotografías |
| RF05 | Notificaciones Internas | Mensajería segmentada por turnos |
| RF06 | Panel Estadístico | Métricas de carga operativa y alertas predictivas |

#### 3.1.2. REQUISITOS NO FUNCIONALES

| ID | Nombre | Descripción |
|----|--------|-------------|
| RNF01 | Usabilidad Responsive | Interfaz 100% usable en móviles |
| RNF02 | Rendimiento | Carga inicial < 2 segundos, SPA sin recargas |
| RNF03 | Seguridad | Contraseñas encriptadas, validación JWT |
| RNF04 | Disponibilidad | Alojamiento cloud con 99.9% uptime |

### 3.2. DESARROLLOS

#### 3.2.1. DISEÑO DE LA BBDD

Arquitectura Multi-Tenant con tabla `entidades` como eje central para separar datos de distintos centros sanitarios.

#### 3.2.2. MODELO ENTIDAD/RELACIÓN

- Entidad (1) — (N) Usuario
- Entidad (1) — (N) Zona
- Zona (1) — (N) Tarea
- Usuario (1) — (N) Tarea
- Usuario (1) — (N) Incidencia

#### 3.2.3. MODELO RELACIONAL

Ver esquema completo en el archivo adjunto con estructura de tablas: entidades, usuarios, zonas, tareas, incidencias, notificaciones.

#### 3.2.4. DIAGRAMA DE CASOS DE USO

**Operario:** Iniciar Sesión, Ver tareas, Completar tareas, Reportar incidencias, Leer notificaciones.

**Administrador:** Dashboard, CRUD de zonas/usuarios, Asignar tareas, Resolver incidencias, Enviar notificaciones.

**Superadmin:** Panel Global multicéntrico, Filtrar por entidad, Visualizar predicciones.

### 3.3. PRUEBAS REALIZADAS

#### 3.3.1. PRUEBAS FUNCIONALES

12 pruebas cubiertas: Login, creación de tareas, completado, reporte de incidencias, resolución, notificaciones, filtros históricos, seguridad RLS.

#### 3.3.2. PRUEBAS DE SEGURIDAD (RLS)

Validadas políticas SELECT y DELETE con denegación de acceso entre entidades.

#### 3.3.3. PRUEBAS DE INTERFAZ Y RESPONSIVIDAD

Verificado en escritorio (1920x1080), tablet y móvil con adaptación de tablas a tarjetas.

---

## 4️⃣ PROCESO DE DESPLIEGUE

### 4.1. REQUISITOS DEL SISTEMA

| Herramienta | Versión Mínima | Uso |
|-------------|----------------|-----|
| Node.js | ≥ 18.0.0 | Entorno de ejecución |
| NPM | ≥ 9.0.0 | Gestor de paquetes |
| Git | ≥ 2.40 | Control de versiones |
| Supabase | Free Tier | PostgreSQL + Auth |
| Vercel | Hobby | Hosting frontend |

### 4.2. DESPLIEGUE DEL BACKEND

1. Crear proyecto en Supabase (región eu-central-1)
2. Ejecutar schema.sql en SQL Editor
3. Configurar variables de entorno (.env.local)
4. Excluir .env.local en .gitignore

### 4.3. DESPLIEGUE DEL FRONTEND

1. Conectar repositorio GitHub con Vercel
2. Configurar variables de entorno en Vercel
3. Deploy automático en cada push a main
4. Configurar dominio personalizado

---

## 5️⃣ PROPUESTA DE MEJORAS

### 5.1. MEJORAS APLICADAS

1. **Arquitectura Serverless (Supabase):** Reducción del 40% en tiempo de backend
2. **Tailwind CSS:** Interfaz responsive sin CSS personalizado
3. **JavaScript estándar:** Agilidad en desarrollo del MVP

### 5.2. MEJORAS FUTURAS

1. Mapa 3D Interactivo (Gemelo Digital)
2. Sistema de Fichaje Geolocalizado
3. Notificaciones Push (PWA)
4. Escaneo QR/NFC
5. Módulo de Inteligencia Artificial predictiva

---

## 6️⃣ BIBLIOGRAFÍA

### 6.1. WEBS DE REFERENCIA

- React Documentation: https://react.dev/
- Supabase Docs: https://supabase.com/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Tailwind CSS: https://tailwindcss.com/
- Vite Guide: https://vitejs.dev/guide/

### 6.2. ARTÍCULOS DE REFERENCIA

- RBAC en aplicaciones web modernas
- Diseño Mobile-First para entornos operativos
- Protocolos de Limpieza en Entornos Sanitarios

---

*© 2026 SANICLEARS — Manual Técnico v1.0*