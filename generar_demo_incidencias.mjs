import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TITULOS_INCIDENCIA = ["Derrame de líquidos", "Material roto", "Falta de suministros", "Desperfecto en pared", "Avería en puerta", "Fuga de agua"];
const PRIORIDADES = ['critica', 'alta', 'media', 'baja'];

async function generarIncidenciasDemo() {
  console.log("Iniciando generación de incidencias de demo...");

  const { data: entidades, error: entError } = await supabase.from('entidades').select('id, nombre');
  if (entError || !entidades.length) return console.error("No se encontraron entidades.");

  let totalCreadas = 0;

  for (const entidad of entidades) {
    const { data: operarios } = await supabase.from('usuarios').select('nombre, apellidos').eq('entidad_id', entidad.id).eq('rol', 'operario');
    const { data: zonas } = await supabase.from('zonas').select('nombre').eq('entidad_id', entidad.id);

    if (!operarios?.length || !zonas?.length) {
      console.log(`Saltando ${entidad.nombre}: No hay operarios o zonas suficientes.`);
      continue;
    }

    const numIncidencias = Math.floor(Math.random() * 5) + 3; // 3 a 7
    const nuevasIncidencias = [];

    for (let i = 0; i < numIncidencias; i++) {
      const operario = operarios[Math.floor(Math.random() * operarios.length)];
      const zona = zonas[Math.floor(Math.random() * zonas.length)];
      
      nuevasIncidencias.push({
        entidad_id: entidad.id,
        titulo: TITULOS_INCIDENCIA[Math.floor(Math.random() * TITULOS_INCIDENCIA.length)],
        zona: zona.nombre,
        descripcion: "Reportado durante el turno de hoy para la demo.",
        prioridad: PRIORIDADES[Math.floor(Math.random() * PRIORIDADES.length)],
        estado: Math.random() > 0.7 ? 'en_proceso' : 'abierta',
        operario: `${operario.nombre} ${operario.apellidos}`,
        created_at: new Date().toISOString()
      });
    }

    const { error: insertError } = await supabase.from('incidencias').insert(nuevasIncidencias);
    if (insertError) {
      console.error(`Error insertando incidencias en ${entidad.nombre}:`, insertError.message);
    } else {
      console.log(`✅ Creadas ${numIncidencias} incidencias en ${entidad.nombre}`);
      totalCreadas += numIncidencias;
    }
  }

  console.log(`\n🎉 ¡Demo lista! Se han generado ${totalCreadas} incidencias en total.`);
}

generarIncidenciasDemo();
