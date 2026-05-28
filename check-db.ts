import { supabase } from './src/supabase/client';

async function checkDatabase() {
  console.log('Verificando base de datos...');
  
  // Verificar las entidades
  const { data: entidades, error: entidadesError } = await supabase
    .from('entidades')
    .select('*');
    
  if (entidadesError) {
    console.error('Error al obtener entidades:', entidadesError);
    return;
  }
  
  console.log('Entidades encontradas:', entidades);
  
  // Verificar usuarios
  const { data: usuarios, error: usuariosError } = await supabase
    .from('usuarios')
    .select('*');
    
  if (usuariosError) {
    console.error('Error al obtener usuarios:', usuariosError);
    return;
  }
  
  console.log('Usuarios encontrados:', usuarios);
  
  // Verificar zonas
  const { data: zonas, error: zonasError } = await supabase
    .from('zonas')
    .select('*');
    
  if (zonasError) {
    console.error('Error al obtener zonas:', zonasError);
    return;
  }
  
  console.log('Zonas encontradas:', zonas);
  
  // Verificar tareas
  const { data: tareas, error: tareasError } = await supabase
    .from('tareas')
    .select('*');
    
  if (tareasError) {
    console.error('Error al obtener tareas:', tareasError);
    return;
  }
  
  console.log('Tareas encontradas:', tareas);
  
  // Verificar incidencias
  const { data: incidencias, error: incidenciasError } = await supabase
    .from('incidencias')
    .select('*');
    
  if (incidenciasError) {
    console.error('Error al obtener incidencias:', incidenciasError);
    return;
  }
  
  console.log('Incidencias encontradas:', incidencias);
  
  // Verificar notificaciones
  const { data: notificaciones, error: notificacionesError } = await supabase
    .from('notificaciones')
    .select('*');
    
  if (notificacionesError) {
    console.error('Error al obtener notificaciones:', notificacionesError);
    return;
  }
  
  console.log('Notificaciones encontradas:', notificaciones);
}

checkDatabase().catch(console.error);