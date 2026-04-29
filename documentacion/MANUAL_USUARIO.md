# MANUAL DE USUARIO: SANICLEARS

Bienvenido al manual de usuario de **Saniclears**, la plataforma de gestión inteligente de higiene hospitalaria. 

Este documento está diseñado para guiar paso a paso a los distintos perfiles que interactúan con la aplicación: **Operarios** (personal de limpieza), **Administradores** (gestores de un hospital) y **Superadministradores** (gestores globales multicéntricos).

---

## 1. Acceso al Sistema (Login)

Todos los usuarios, independientemente de su rol, acceden a la plataforma a través de la misma pantalla de inicio de sesión.

1. Abre el navegador web y accede a la URL de Saniclears.
2. Introduce tu **Correo electrónico** y **Contraseña**.
3. Haz clic en "Iniciar Sesión".
4. El sistema detectará automáticamente tu rol y te redirigirá a tu panel correspondiente.

> 📸 **[CAPTURA DE PANTALLA 1: Insertar aquí imagen de la pantalla de Login con el formulario vacío]**

---

## 2. Perfil: OPERARIO

La interfaz del operario está diseñada específicamente para ser utilizada desde teléfonos móviles (*Mobile-First*), con botones grandes y un menú de navegación inferior muy accesible.

### 2.1. Panel Principal (Mis Tareas)
Al iniciar sesión, el operario visualizará inmediatamente las tareas que tiene asignadas para su turno.

* **Tareas Pendientes:** Aparecen en la lista con su zona, prioridad (por colores) y descripción.
* **Comenzar Tarea:** Al pulsar sobre una tarea, esta pasa al estado "En curso".
* **Finalizar Tarea:** Una vez completada la limpieza, el operario pulsa el botón de verificación para marcarla como "Completada" y desaparece de la lista activa.

> 📸 **[CAPTURA DE PANTALLA 2: Insertar aquí imagen de la vista móvil "Mis Tareas" con algunas tareas pendientes y en curso]**

### 2.2. Reportar una Incidencia
Si el operario detecta una rotura, falta de material o un riesgo de seguridad, puede notificarlo al instante.

1. Navega a la pestaña **"Incidencias"** (icono del triángulo de alerta).
2. Selecciona el **Tipo** (Material, Equipo, Zona, Acceso, Otro).
3. Escribe una breve **Descripción**.
4. (Opcional pero recomendado) Toma una **Fotografía** del problema usando la cámara del móvil.
5. Si es muy grave, marca la casilla **"Urgente"**.
6. Pulsa en "Enviar Reporte".

> 📸 **[CAPTURA DE PANTALLA 3: Insertar aquí imagen del formulario de "Reportar Incidencia" desde la vista móvil]**

### 2.3. Notificaciones
En la pestaña de la campana, el operario recibirá avisos emitidos por la administración (por ejemplo: "Cambio de protocolo en UCI"). Las notificaciones no leídas tendrán un punto azul.

---

## 3. Perfil: ADMINISTRADOR

El administrador tiene el control total de un hospital o entidad específica. Su vista está optimizada para escritorio o tablet.

### 3.1. Dashboard (Panel de Control)
El panel principal ofrece una visión en tiempo real del estado del hospital.
* Muestra tarjetas de resumen: Tareas de hoy, completadas, y alertas críticas.
* Un **Gráfico temporal** con la evolución de las incidencias en el mes.
* La lista de **Tareas Activas** de todo su equipo en vivo.

> 📸 **[CAPTURA DE PANTALLA 4: Insertar aquí imagen del "Dashboard" del administrador con gráficas y métricas]**

### 3.2. Gestión de Zonas y Usuarios
Desde el menú lateral, el administrador puede gestionar la estructura de su hospital.

1. **Pestaña Zonas:** Permite crear áreas (ej. Quirófano 1, UCI, Pasillo Norte), asignando su nivel de prioridad y metros cuadrados.
2. **Pestaña Usuarios:** Permite dar de alta a nuevos operarios, indicando su nombre, email y turno de trabajo (Mañana/Tarde/Noche).

> 📸 **[CAPTURA DE PANTALLA 5: Insertar aquí imagen de la vista "Gestión de Zonas y Usuarios" con la tabla de operarios visible]**

### 3.3. Gestión de Incidencias
Aquí el administrador recibe los reportes enviados por los operarios.

1. Visualiza la tabla con las incidencias (ordenadas por fecha y prioridad).
2. Al hacer clic en "Ver", se abre una ventana con los **detalles y la fotografía** adjunta.
3. El administrador puede cambiar el estado a "En Revisión" o "Resuelta", añadiendo un **Comentario de resolución** (ej. "Mantenimiento ya ha reparado la ventana").

> 📸 **[CAPTURA DE PANTALLA 6: Insertar aquí imagen del modal de detalle de una Incidencia, mostrando la foto y los botones de cambiar estado]**

---

## 4. Perfil: SUPERADMIN

El Superadmin es el director general. Tiene una visión "multicéntrica", pudiendo ver los datos de todos los hospitales agrupados o filtrarlos de manera individual.

### 4.1. Panel Global
Al entrar, el Superadmin visualiza las métricas absolutas (total de usuarios de la plataforma, carga operativa global, alertas críticas de todos los centros).

* **Filtro por Entidad:** En la esquina superior derecha, un selector permite cambiar entre la visión "Global (Todas)" o seleccionar un hospital específico (ej. "Hospital de Mérida").
* **Carga Operativa por Zona:** Un gráfico de barras muestra qué zonas específicas de los hospitales están sufriendo mayor saturación (comparando tareas programadas vs. incidencias reportadas).

> 📸 **[CAPTURA DE PANTALLA 7: Insertar aquí imagen del "Panel Global" del Superadmin, mostrando el selector de entidad desplegado y las gráficas]**

### 4.2. Estadísticas y Predicciones (IA)
Esta sección cruza datos históricos para extraer conclusiones ejecutivas.

1. **Evolución Histórica:** Permite viajar a meses anteriores para ver cómo fue el rendimiento.
2. **Zonas de Riesgo:** Calcula matemáticamente qué áreas requieren vigilancia.
3. **Motor Predictivo:** Analiza la tendencia de los últimos meses para **predecir** cuánta carga de trabajo habrá el próximo mes y **sugiere** cuántos operarios exactos se van a necesitar para cubrir el cupo sin saturar al personal.

> 📸 **[CAPTURA DE PANTALLA 8: Insertar aquí imagen de la vista "Estadísticas Superadmin" haciendo énfasis en el bloque del Motor Predictivo]**

---

## 5. Funciones Comunes

### 5.1. Notificaciones
Tanto el Administrador como el Superadmin pueden crear nuevas notificaciones. El Superadmin puede enviar avisos globales a todos los hospitales, mientras que el Administrador solo a su equipo. Permite segmentar por "Turno de mañana" o "Turno de tarde".

### 5.2. Mi Perfil
Haciendo clic en el icono del usuario arriba a la derecha, cualquier persona puede acceder a "Mi Perfil" para:
* Editar sus datos personales (Nombre y Apellidos).
* Cambiar su contraseña (requiere introducir la contraseña actual por seguridad).

> 📸 **[CAPTURA DE PANTALLA 9: Insertar aquí imagen de la pantalla de "Mi Perfil"]**

---
*Saniclears - Tecnología al servicio de la salud.*
