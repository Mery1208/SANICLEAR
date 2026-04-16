# DIAGRAMA DE CLASES - SANICLEAR

## Estructura de Clases

```mermaid
classDiagram
    class Usuario {
        -string id
        -string nombre
        -string apellidos
        -string email
        -string rol
        -string turno
        +getUsuario() Usuario
        +mostrarDatos() void
    }

    class Admin {
        -string idAdmin
        -string gestionarZona
        -string gestionarUsuario
        +gestionarZonas() void
        +gestionarUsuarios() void
        +gestionarIncidencias() void
        +gestionarNotificaciones() void
        +mostrarDatos() void
    }

    class Operario {
        -string idOperario
        -string zonaAsignada
        +verTareas() void
        +completarTarea() void
        +reportarIncidencia() void
        +verNotificaciones() void
        +mostrarDatos() void
        +mostrarPerfil() void
    }

    class Zona {
        -string id
        -string nombre
        +crearZona() void
        +modificarZona() void
        +eliminarZona() void
    }

    class Tarea {
        -number id
        -string zona
        -string descripcion
        -string prioridad
        -string estado
        +asignarTarea() void
        +completarTarea() void
        +mostrarDatos() void
    }

    class Incidencia {
        -number id
        -string titulo
        -string descripcion
        -string prioridad
        -string estado
        -string foto_url
        +reportarIncidencia() void
        +mostrarDatos() void
        +cambiarEstado() void
    }

    class Notificacion {
        -number id
        -string titulo
        -string mensaje
        -string tipo
        -string destinatario
        -boolean leida
        +marcarLeida() void
        +enviarNotificacion() void
    }

    Usuario <|-- Admin : hereda
    Usuario <|-- Operario : hereda

    Admin "1" --> "*" Zona : gestiona
    Admin "1" --> "*" Notificacion : envia
    Admin "1" --> "*" Tarea : gestiona
    Zona "1" --> "*" Tarea : contiene
    Operario "1" --> "*" Tarea : realiza
    Operario "1" --> "*" Incidencia : reporta
    Incidencia "1" --> "*" Notificacion : genera
```

## Relaciones

```
HERENCIA:
  Usuario  <|--  Admin
  Usuario  <|--  Operario

ASOCIACIONES (1:*):
  Admin        --*  Zona         : gestiona
  Admin        --*  Notificacion : envia
  Admin        --*  Tarea        : gestiona
  Zona         --*  Tarea        : contiene
  Operario     --*  Tarea        : realiza
  Operario     --*  Incidencia   : reporta
  Incidencia   --*  Notificacion : genera
```
