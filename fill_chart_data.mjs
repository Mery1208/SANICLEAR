import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TITULOS_INCIDENCIA = ["Derrame de líquidos", "Material roto", "Falta de suministros", "Desperfecto en pared", "Avería en puerta", "Fuga de agua", "Limpieza urgente", "Reparación menor"];
const PRIORIDADES = ['critica', 'alta', 'media', 'baja'];

async function generarIncidenciasParaGrafica() {
  console.log("Comenzando inserción anónima de incidencias...");

  const targetEntityId = 'e0000000-0000-0000-0000-000000000001';

  console.log("Obteniendo la entidad objetivo (Hospital Saniclear)...");
  const { data: entidadData } = await supabase.from('entidades').select('id, nombre_hospital').eq('id', targetEntityId).single();
  if (!entidadData) return console.error("No se encontró la entidad objetivo.");
  const entidad = { id: entidadData.id, nombre: entidadData.nombre_hospital };

  let totalCreadas = 0;
  const year = 2026;

  const { data: operarios } = await supabase.from('usuarios').select('nombre, apellidos').eq('entidad_id', entidad.id).eq('rol', 'operario');
  const { data: zonas } = await supabase.from('zonas').select('nombre').eq('entidad_id', entidad.id);

  if (!operarios?.length || !zonas?.length) {
    console.error(`Faltan operarios o zonas en ${entidad.nombre}. No se pueden crear datos.`);
    return;
  }

  const nuevasIncidencias = [];
  
  // Rellenamos datos para cada zona
  for (const zona of zonas) {
    // Rellenamos datos para TODOS los meses de 2026 (0 a 11)
    for (let mes = 0; mes < 12; mes++) {
      // 3 a 8 incidencias por zona por MES
      const numIncidencias = Math.floor(Math.random() * 6) + 3; 
      
      for (let i = 0; i < numIncidencias; i++) {
        const operario = operarios[Math.floor(Math.random() * operarios.length)];
        
        // Fecha aleatoria de este mes y año
        const daysInMonth = new Date(year, mes + 1, 0).getDate();
        const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
        const createdAt = new Date(Date.UTC(year, mes, randomDay, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)));
        
        nuevasIncidencias.push({
          entidad_id: entidad.id,
          titulo: TITULOS_INCIDENCIA[Math.floor(Math.random() * TITULOS_INCIDENCIA.length)],
          tipo: ['limpieza', 'mantenimiento', 'equipamiento'][Math.floor(Math.random() * 3)],
          zona: zona.nombre,
          descripcion: "Incidencia de prueba generada para mostrar en los gráficos históricos.",
          prioridad: PRIORIDADES[Math.floor(Math.random() * PRIORIDADES.length)],
          // 40% abiertas, 60% resueltas para que la gráfica tenga ambos colores
          estado: Math.random() > 0.6 ? 'abierta' : 'resuelta',
          operario: `${operario.nombre} ${operario.apellidos}`,
          created_at: createdAt.toISOString()
        });
      }
    }
  }

  if (nuevasIncidencias.length > 0) {
    // Insert in chunks of 500 to avoid limits
    console.log(`Insertando ${nuevasIncidencias.length} incidencias para ${entidad.nombre}...`);
    const chunkSize = 500;
    for (let i = 0; i < nuevasIncidencias.length; i += chunkSize) {
      const chunk = nuevasIncidencias.slice(i, i + chunkSize);
      const { error } = await supabase.from('incidencias').insert(chunk);
      if (error) {
        console.error(`Error insertando chunk en ${entidad.nombre}:`, error);
      } else {
        totalCreadas += chunk.length;
      }
    }
    console.log(`✅ Creadas incidencias en ${entidad.nombre}`);
  }

  console.log(`\n🎉 ¡Gráficas rellenadas! Se han generado ${totalCreadas} incidencias en el año ${year}.`);
}

generarIncidenciasParaGrafica();
