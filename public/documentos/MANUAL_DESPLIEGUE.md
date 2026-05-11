# 🚀 SANICLEARS — Manual de Despliegue
> **Instalación y Configuración**  
> **Curso:** 2025/26 | **Centro:** IES Albarregas

---

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- Cuenta de Supabase
- Cuenta de Google AI Studio (para Gemini API)
- Git

---

## 1️⃣ Instalación Local

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Mery1208/SANICLEARS.git
cd limpieza-hospitalaria
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://[TU_PROYECTO].supabase.co
VITE_SUPABASE_ANON_KEY=[TU_ANON_KEY]
VITE_GEMINI_API_KEY=[TU_API_KEY_DE_GEMINI]
```

### Paso 4: Configurar Base de Datos

1. Crear proyecto en Supabase
2. Ejecutar el schema SQL (disponible en documentación)
3. Configurar políticas RLS
4. Crear trigger para sincronización de usuarios

### Paso 5: Ejecutar en Desarrollo

```bash
npm run dev
```

Acceder a: http://localhost:5173

---

## 2️⃣ Despliegue en Producción

### Opción A: Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel Dashboard
3. Deploy automático desde rama main

### Opción B: Netlify

1. Ejecutar `npm run build`
2. Subir carpeta `dist/` a Netlify
3. Configurar redirects para SPA

### Opción C: Manual

```bash
npm run build
# Copiar dist/ a servidor web
```

---

## 3️⃣ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor desarrollo |
| `npm run build` | Compilación producción |
| `npm run preview` | Preview build local |
| `npm run lint` | Linter ESLint |

---

## 4️⃣ Solución de Problemas

### Error de conexión Supabase

Verificar:
- URL del proyecto correcto
- Anon key válido
- Tabla existente y Row Level Security habilitado

### Error de Gemini API

Verificar:
- API Key válida en Google AI Studio
- Modelo configurado correctamente en `gemini.ts`

---

*© 2026 SANICLEARS — Documentación Técnica*