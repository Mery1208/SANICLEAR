import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TIPOS_TAREA = [
  "Limpieza general", "Desinfección profunda", "Recogida de residuos biológicos", 
  "Limpieza de fluidos", "Esterilización de material", "Reposición de suministros"
];

const PRIORIDADES = ['alta', 'media', 'baja'];

async function generarTareasDemo() {
  console.log("Iniciando generación de tareas de demo para HOY...");

  // 1. Obtener los hospitales
  const { data: entidades, error: entError } = await supabase.from('entidades').select('id, nombre');
  if (entError || !entidades.length) return console.error("No se encontraron entidades.");

  // Para cada entidad, crear entre 5 y 10 tareas frescas
  let totalCreadas = 0;

  for (const entidad of entidades) {
    // Buscar operarios de este hospital
    const { data: operarios } = await supabase.from('usuarios').select('id, nombre, apellidos').eq('entidad_id', entidad.id).eq('rol', 'operario');
    // Buscar zonas de este hospital
    const { data: zonas } = await supabase.from('zonas').select('nombre').eq('entidad_id', entidad.id);

    if (!operarios?.length || !zonas?.length) {
      console.log(`Saltando ${entidad.nombre}: No hay operarios o zonas suficientes.`);
      continue;
    }

    const numTareas = Math.floor(Math.random() * 6) + 5; // 5 a 10 tareas
    const nuevasTareas = [];

    for (let i = 0; i < numTareas; i++) {
      const operario = operarios[Math.floor(Math.random() * operarios.length)];
      const zona = zonas[Math.floor(Math.random() * zonas.length)];
      
      nuevasTareas.push({
        entidad_id: entidad.id,
        zona: zona.nombre,
        tarea: TIPOS_TAREA[Math.floor(Math.random() * TIPOS_TAREA.length)],
        descripcion: "Generado automáticamente para la demo de hoy.",
        prioridad: PRIORIDADES[Math.floor(Math.random() * PRIORIDADES.length)],
        estado: Math.random() > 0.8 ? 'en_curso' : 'pendiente', // La mayoría pendientes, alguna en curso
        asignado: `${operario.nombre} ${operario.apellidos}`,
        asignado_id: operario.id,
        created_at: new Date().toISOString() // Fecha de HOY
      });
    }

    const { error: insertError } = await supabase.from('tareas').insert(nuevasTareas);
    if (insertError) {
      console.error(`Error insertando tareas en ${entidad.nombre}:`, insertError.message);
    } else {
      console.log(`✅ Creadas ${numTareas} tareas activas en ${entidad.nombre}`);
      totalCreadas += numTareas;
    }
  }

  console.log(`\n🎉 ¡Demo lista! Se han generado ${totalCreadas} tareas en total con fecha de HOY.`);
}

generarTareasDemo();
