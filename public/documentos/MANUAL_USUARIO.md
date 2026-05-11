# Manual de Usuario

TÉCNICO SUPERIOR EN DESARROLLO DE APLICACIONES WEB

Departamento de Informática

MANUAL USUARIO

Autor/es: María Ceballos Mesias

Curso Académico: 2025/26

Índice

1.Introducción4

1.1.¿Qué es SANICLEARS?4

1.2. Roles de usuario4

1.3. Requisitos de acceso4

2.Acceso a la Plataforma5

2.1. Landing Page5

2.2. Inicio de Sesión (Login)7

3. Vista del Administrador8

3.1. Panel de Control8

3.2. Menú Lateral10

3.3. Gestión de Tareas11

Crear nueva tarea11

Estados de las tareas11

3.4. Gestión de Zonas y Usuarios11

Pestaña Zonas12

Pestaña Usuarios13

3.5. Notificaciones15

Crear Notificación16

3.6. Gestión de Incidencias16

Ver/Gestionar una Incidencia17

Crear nueva Incidencia17

3.7. Mi Perfil18

4. Vista del Operario20

4.1. Mis Tareas20

4.2. Menú Lateral21

4.3. Notificaciones21

4.4. Reportar Incidencia22

4.5. Mi Perfil23

5. Vista del SuperAdmin24

5.1. Menú Lateral24

5.2. Próximamente24

5.3. Panel Global25

5.4. Control de Entidades27

5.5. Métricas28

5.6. Controlar Entidad29

5.7. Notificaciones Globales32

5.8. Mi Perfil34

Introducción

¿Qué es SANICLEARS?

SANICLEARS es una plataforma digital diseñada específicamente para transformar la gestión de higiene en entornos hospitalarios. Nació en 2024 como respuesta a un problema crítico detectado por profesionales sanitarios: la gestión manual de tareas de limpieza era ineficiente, difícil de rastrear y propensa a errores que podían comprometer la seguridad de los pacientes.

La plataforma permite digitalizar, supervisar y optimizar todas las tareas de limpieza en tiempo real desde un único panel de control, garantizando la trazabilidad completa de cada acción, comunicación fluida entre el personal y cumplimiento de normativas sanitarias vigentes.

1.2. Roles de usuario

SANICLEARS gestiona el acceso mediante tres roles diferenciados con permisos específicos:

Rol

Descripción y accesos

Superadmin

Acceso total al sistema. Gestiona todas las entidades (hospitales), usuarios globales, métricas predictivas y notificaciones a nivel global. Es el nivel más alto de la jerarquía.

Administrador

Gestiona su propio hospital. Puede crear y asignar tareas, gestionar zonas y usuarios de su entidad, enviar notificaciones internas y revisar incidencias.

Operario

Accede a sus tareas asignadas, puede marcarlas como completadas, consultar notificaciones recibidas y reportar incidencias desde el terreno.

1.3. Requisitos de acceso

Para utilizar SANICLEARS solo se necesita un navegador web actualizado (Chrome, Firefox, Edge o Safari) y las credenciales de acceso proporcionadas por el administrador del sistema. No es necesario instalar ningún software adicional.

Acceso a la Plataforma

2.1. Landing Page

Al acceder a la URL de SANICLEARS, el usuario llega a la página de inicio o landing page. Esta página presenta la plataforma de forma pública, describe sus funcionalidades principales y permite iniciar sesión a través del botón «Acceso Personal» situado en la esquina superior derecha de la barra de navegación.

La landing page está estructurada en varias secciones:

Hero: título principal «Gestión Inteligente de Higiene Hospitalaria» con botones de acceso y más información.

Una solución nacida de la necesidad: descripción del problema que resuelve la plataforma, con métricas clave (50+ hospitales, 10.000+ tareas diarias, 99% satisfacción).

Todo lo que necesitas: tarjetas con las 6 funcionalidades principales (Control en Tiempo Real, Trazabilidad Completa, Gestión de Equipos, Análisis y Reportes, App Móvil Operarios y Acceso desde Cualquier Lugar).

Cómo funciona SANICLEARS: proceso en 3 pasos (Configura tus Zonas → Asigna Tareas → Supervisa y Optimiza).

Resultados reales: testimonial de la Dra. María González con métricas de impacto.

Llamada a la acción final con botón «Comenzar Ahora».

Un footer con el logo de la empresa, definición de la empresa , la parte legal con privacidad, políticas y cookies, resumen de la landing explicando a la empresa y las redes sociales de la empresa: Instagram, Github y Facebook.

2.2. Inicio de Sesión (Login)

Para acceder al portal, pulsa el botón «Acceso Personal» desde la landing page o navega directamente a la página de login. El formulario de acceso contiene dos campos obligatorios:

Email: dirección de correo electrónico del usuario registrado en el sistema.

Contraseña: clave de acceso personal (mínimo 8 caracteres, mayúsculas, minúsculas, número y carácter especial).

Una vez introducidas las credenciales correctas, el sistema redirige automáticamente al panel correspondiente según el rol del usuario (Administrador, Operario o Superadmin). Si las credenciales son incorrectas, aparece un mensaje de error.

🔒  Contraseña olvidada

Si no recuerdas tu contraseña, pulsa el enlace «¿Olvidaste tu contraseña?» y sigue las instrucciones enviadas al correo registrado.

3. Vista del Administrador

El rol de Administrador es el responsable de la gestión operativa del hospital. Dispone de un panel completo con acceso a tareas, zonas, usuarios, notificaciones e incidencias de su entidad.

3.1. Panel de Control

El Panel de Control es la pantalla principal que ve el Administrador tras iniciar sesión. Muestra un resumen en tiempo real del estado del sistema con cuatro métricas clave en tarjetas:

Pendientes: número de tareas aún sin comenzar.

Alertas: notificaciones de alta prioridad que requieren atención inmediata.

Hechas: tareas completadas en el día.

En Curso: tareas que los operarios están ejecutando en este momento.

Debajo de las tarjetas se muestra el gráfico «Incidencias por Mes», que permite visualizar la evolución histórica de incidencias a lo largo del año. En la parte inferior del panel aparecen las secciones «Actividad Reciente» (últimas acciones registradas) y la tabla «Tareas Activas» con el detalle completo de zona, tarea, operario asignado, estado y prioridad.

En la esquina superior derecha se muestra el nombre y rol del administrador logueado, junto con el botón de logout (icono de salida).

3.2. Menú Lateral

El menú lateral es el sistema de navegación principal del administrador. Se abre pulsando el icono de tres líneas (☰) en la esquina superior izquierda y se cierra con la «X». Contiene las siguientes opciones:

Panel Principal: acceso directo al Panel de Control.

Gestión Zonas y Usuarios: gestión de zonas hospitalarias y usuarios del sistema.

Notificaciones: centro de comunicaciones internas.

Incidencias: gestión de reportes técnicos del hospital.

Mi Perfil: configuración de la cuenta personal.

3.3. Gestión de Tareas

Crear nueva tarea

Para crear una nueva tarea, pulsa el botón «+ Nueva Tarea» (azul, esquina superior derecha del panel). Se abrirá un modal con el formulario «Nueva Tarea» que contiene los siguientes campos:

Título de la tarea: nombre descriptivo (ej. Limpieza profunda UCI).

Zona: desplegable con las zonas registradas en el hospital.

Operario: desplegable con los operarios disponibles.

Prioridad: selector entre Alta, Media y Baja.

Descripción: instrucciones especiales opcionales.

Pulsa «Asignar Tarea» para confirmar. La tarea aparecerá inmediatamente en la tabla de Tareas Activas del panel y en la vista del operario asignado.

⚠️  Campos obligatorios

El título, zona y operario son obligatorios. La prioridad por defecto es Media si no se modifica.

Estados de las tareas

Cada tarea puede encontrarse en uno de los siguientes estados, identificados por colores:

Pendiente

La tarea ha sido asignada pero el operario aún no la ha comenzado.

En Curso

El operario está realizando la tarea en ese momento.

Hecha

La tarea ha sido completada y marcada como tal.

3.4. Gestión de Zonas y Usuarios

Accede desde el menú lateral pulsando «Gestión Zonas y Usuarios». La pantalla tiene dos pestañas: Zonas y Usuarios.

Pestaña Zonas

Muestra el listado completo de zonas hospitalarias registradas. Por cada zona se indica el nombre, planta, tipo, metros cuadrados, prioridad y estado (Activo/Inactivo). Cada zona dispone de dos acciones:

Editar (botón azul): abre el modal «Editar Zona» con los campos Nombre, Tipo de zona, Planta, Metros cuadrados y Prioridad/Nivel precargados. Modifica los datos y pulsa «Guardar».

Eliminar (botón rojo): muestra un modal de confirmación «¿Estás completamente seguro?» antes de borrar definitivamente la zona. Esta acción no se puede deshacer.

Para crear una zona nueva, pulsa «+ Crear Zona» (esquina superior derecha). El formulario «Crear Zona» solicita: Nombre de la zona, Tipo de zona, Planta, Metros cuadrados y Prioridad/Nivel.

Pestaña Usuarios

Muestra todos los usuarios registrados en el sistema con nombre, email, rol y turno. Las acciones disponibles son:

Editar: abre el modal «Editar Usuario» con campos Nombre, Apellidos, Email, Rol y Turno. Modifica y pulsa «Guardar».

Eliminar: confirmación antes de borrar el usuario permanentemente.

Para crear un usuario nuevo, pulsa «+ Crear Usuario». El formulario solicita: Nombre, Apellidos, Email, Rol (Operario/Administrador) y Turno (Mañana/Tarde/Noche).

3.5. Notificaciones

La sección Notificaciones centraliza todas las comunicaciones internas del hospital. Las notificaciones se clasifican en tres tipos, identificados por colores:

Urgentes (rojo): comunicaciones críticas que requieren actuación inmediata.

Importantes (naranja): avisos relevantes que no son de emergencia.

Informativas (azul): comunicaciones generales de interés.

Cada fila de la tabla muestra el título de la notificación, emisor, destinatario (todos, turno_mañana, turno_tarde o turno_noche), fecha de envío y tipo.

Crear Notificación

Pulsa «+ Crear Notificación» para abrir el modal correspondiente. Los campos son:

Tipo: Urgente, Importante o Informativa.

Destinatarios: Todos los Operarios, Turno Mañana o Turno Tarde.

Título: asunto de la notificación.

Mensaje: cuerpo del texto.

3.6. Gestión de Incidencias

Desde esta sección el administrador puede revisar, asignar y resolver todos los reportes técnicos del hospital. La pantalla muestra un resumen con cuatro métricas: Abiertas, Resueltas, En Revisión y Total, y una tabla con el listado completo filtrable por tipo (Equipo, Material, Acceso, Zona, Otro) y estado.

Para cada incidencia se muestra: ID, Título, Tipo, Zona, Operario, Prioridad, Estado y Fecha. El estado puede ser Abierta (naranja), En Revisión (azul) o Resuelta (verde).

Ver/Gestionar una Incidencia

Pulsa el botón «Ver» en cualquier fila para abrir el detalle de la incidencia. Desde el modal puedes:

Consultar todos los datos: título, zona, operario, fecha, prioridad y descripción completa.

Cambiar el estado: botones Resuelta, Abierta o En Rev.

Añadir comentario de resolución: escribe cómo se resolvió el problema y pulsa «Guardar Comentario».

Crear nueva Incidencia

Pulsa «+ Nueva Incidencia» para registrar un nuevo reporte desde el panel de administración. Rellena: Tipo de incidencia, Zona, Descripción, Prioridad (Baja/Media/Alta/Crítica) y activa el checkbox «Marcar como urgente» si es necesario.

3.7. Mi Perfil

Accede desde el menú lateral pulsando «Mi Perfil». Aquí puedes consultar y modificar tu información personal y cambiar la contraseña:

Información Personal: Nombre, Apellidos, Email y Turno (visualización).

Seguridad de la Cuenta: introduce la contraseña actual y la nueva (mínimo 8 caracteres, mayúsculas, minúsculas, número y carácter especial) y confírmala en el tercer campo.

Botones: «Restablecer» limpia los campos de contraseña; «Guardar Cambios» actualiza los datos.

4. Vista del Operario

El operario es el personal de limpieza que trabaja sobre el terreno. Su interfaz está simplificada para facilitar el uso desde cualquier dispositivo, centrándose en sus tareas asignadas y la comunicación directa con el hospital.

4.1. Mis Tareas

Esta es la pantalla principal del operario tras iniciar sesión. Muestra un resumen de su jornada con tres contadores: Prioridad Alta, Completadas y Pendientes. Debajo aparece la lista de tareas asignadas para su turno, con el nombre de la zona, la tarea a realizar, la prioridad y el botón «✓ Hecho».

Para marcar una tarea como completada, pulsa el botón verde «Hecho» a la derecha de la tarea. El contador «Completadas» se actualizará automáticamente y la tarea cambiará de estado en el panel del administrador en tiempo real.

💡  Orden de prioridad

Las tareas se muestran ordenadas por prioridad (Alta primero) para facilitar la planificación del turno.

4.2. Menú Lateral

El menú del operario está simplificado respecto al del administrador. Contiene solo las secciones relevantes para su rol:

Mis Tareas: pantalla principal con las tareas asignadas.

Notificaciones: comunicaciones recibidas del hospital.

Reportar Incidencia: formulario para notificar problemas detectados.

Mi Perfil: configuración de la cuenta personal.

4.3. Notificaciones

La pantalla de notificaciones muestra todos los avisos recibidos del administrador o del sistema. Cada notificación incluye el tipo (identificado con un icono), el título, el mensaje completo y la fecha y hora de recepción. Las notificaciones están clasificadas con contadores de Urgentes, Importantes e Informativas.

4.4. Reportar Incidencia

Cuando un operario detecta un problema durante su turno (material roto, acceso bloqueado, fuga, etc.), puede reportarlo inmediatamente desde esta sección. El formulario solicita:

Tipo de incidencia: desplegable (Equipo, Material, Acceso, Zona, Otro).

Zona: nombre de la zona donde se ha detectado el problema.

Descripción: explicación detallada del problema observado.

Prioridad: Baja, Media, Alta o Crítica.

Marcar como urgente: checkbox para destacar incidencias que requieren actuación inmediata.

Adjuntar foto: opción de subir una imagen del problema (PNG, JPG o WEBP, máximo 5 MB).

Al pulsar «Enviar Incidencia», el reporte queda registrado en el sistema y es visible de inmediato para el administrador del hospital.

4.5. Mi Perfil

Idéntico al del administrador: permite editar el nombre, los apellidos y cambiar la contraseña. El email y el turno son campos informativos no editables por el propio operario.

5. Vista del SuperAdmin

El Superadmin es el nivel más alto del sistema SANICLEARS. Tiene visibilidad y control sobre todas las entidades (hospitales) registradas en la plataforma, pudiendo supervisar su actividad, gestionar sus datos y enviar notificaciones a nivel global.

5.1. Menú Lateral 

El menú lateral del Superadmin se abre pulsando el icono ☰ en la esquina superior izquierda. Contiene las siguientes secciones, todas ellas de ámbito global (todas las entidades del sistema):

Resumen Global: acceso al Panel Global del Superadmin con métricas consolidadas de todo el sistema.

Control Entidades: listado maestro de todos los hospitales y clínicas registrados en SANICLEARS.

Notificaciones: gestión de comunicaciones globales a cualquier entidad.

Mi Perfil: configuración de la cuenta personal del Superadmin.

Proximalmente: futuros proyectos creándose.

 

5.2. Próximamente

Dentro del menú lateral del Superadmin existe una sección etiquetada como «Próximamente». Al pulsarla, se abre un modal informativo que presenta las funcionalidades planificadas para futuras versiones de la plataforma.

Este modal recoge la hoja de ruta del producto: nuevas características, integraciones previstas y mejoras operativas que se irán incorporando en próximas versiones. Su presencia en el panel del Superadmin responde al enfoque de desarrollo continuo de SANICLEARS, manteniendo siempre informados a los responsables del sistema sobre la evolución de la plataforma.

🚀  Roadmap del producto

Las funcionalidades listadas en este modal son ideas y proyectos en planificación, no compromisos de entrega. Su estado puede cambiar en cualquier momento según las prioridades del equipo de desarrollo.

5.3. Panel Global

Tras iniciar sesión como Superadmin, el panel global muestra una visión consolidada de todo el sistema:

Usuarios Activos: total de usuarios registrados en todas las entidades.

Zonas Monitorizadas: número total de zonas bajo control.

Carga Operativa: suma de tareas activas en este momento.

Alertas Críticas: incidencias de prioridad crítica abiertas.

Los gráficos incluyen «Carga Operativa por Zona» y «Tareas vs Incidencias», que permiten identificar puntos de saturación y tomar decisiones de redistribución de recursos entre entidades.

5.4. Control de Entidades

Esta sección muestra el listado maestro de todos los hospitales y clínicas registrados en SANICLEARS. Para cada entidad se indica: nombre, código, ubicación, estado (Activa) y plan contratado (Free, Básico o Premium). Las acciones disponibles son:

Editar (lápiz): modifica los datos de la entidad.

Eliminar (papelera): elimina la entidad y todos sus datos.

Controlar (botón azul): accede al panel de control detallado de esa entidad.

Métricas (botón blanco): accede al panel de métricas predictivas de esa entidad.

Para registrar un nuevo hospital, pulsa «+ Nueva Entidad». El formulario solicita: Nombre del hospital, Código (ej. HC-01), Ciudad, Plan (Basic/Premium) y Estado.

5.5. Métricas

La vista de Métricas de una entidad proporciona análisis predictivo e inteligencia operativa impulsada por IA. Muestra cuatro indicadores clave:

Predicción Incidencias: estimación de incidencias para el próximo periodo.

Carga Prevista: tareas estimadas según histórico.

Personal Ideal: número óptimo de operarios recomendado.

Nivel de Riesgo: Bajo, Medio o Alto según los datos de la entidad.

El gráfico de «Evolución Mensual de Carga Operativa» muestra las tendencias de Nuevas Incidencias y Tareas Completadas a lo largo del año. La sección «Salud de la Entidad» resume el estado general y la última auditoría realizada. El «Motor Predictivo (IA)» describe los algoritmos utilizados: media móvil, extrapolación lineal y detección de saturación.

5.6. Controlar Entidad

Pulsa «Controlar» en una entidad para acceder a su panel de control maestro con permisos extendidos. Esta vista muestra en una sola pantalla toda la información operativa del hospital:

Resumen: usuarios, zonas, tareas activas e incidencias abiertas de esa entidad.

Tareas Activas del Centro: tabla editable con zona, operario asignado, estado y acciones (completar, editar, eliminar).

Incidencias Abiertas: listado con zona, prioridad y acciones de gestión.

Personal del Centro: listado de usuarios con rol y acciones de edición.

Últimas Notificaciones: historial de comunicaciones enviadas.

Desde esta vista el Superadmin puede crear, editar y eliminar tareas, incidencias y usuarios de la entidad sin necesidad de acceder con las credenciales del administrador de ese hospital.

5.7. Notificaciones Globales

La sección de Notificaciones del Superadmin incluye un filtro adicional de «Entidad Destino» con un selector desplegable que permite ver y gestionar notificaciones globales (todas las entidades) o las de un hospital específico. Las acciones son las mismas que en la vista del administrador (editar y eliminar).

Al crear una nueva notificación, el Superadmin dispone de un campo adicional «Entidad Destino» que permite enviarla a todas las entidades (Global) o a un hospital concreto.

5.8. Mi Perfil

Idéntico al de los demás roles. El Superadmin puede editar su nombre y cambiar su contraseña. El sistema muestra el avatar con las iniciales «SA» y el rol «Superadmin» de forma destacada en el encabezado del perfil.