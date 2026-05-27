import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MENSAJES = [
  "Recordatorio: Revisar inventario al finalizar el turno.",
  "Nuevo protocolo de desinfección en quirófanos.",
  "Reunión breve de personal a las 14:00.",
  "Precaución: Suelo resbaladizo en pasillo principal.",
  "Mantenimiento programado para esta noche en planta 2."
];

async function generarNotificacionesDemo() {
  console.log("Iniciando generación de notificaciones de demo...");

  const { data: entidades, error: entError } = await supabase.from('entidades').select('id, nombre');
  if (entError || !entidades.length) return console.error("No se encontraron entidades.");

  let totalCreadas = 0;

  for (const entidad of entidades) {
    const numNotif = Math.floor(Math.random() * 3) + 2; // 2 a 4
    const nuevasNotificaciones = [];

    for (let i = 0; i < numNotif; i++) {
      nuevasNotificaciones.push({
        entidad_id: entidad.id,
        titulo: "Aviso General",
        mensaje: MENSAJES[Math.floor(Math.random() * MENSAJES.length)],
        tipo: Math.random() > 0.7 ? 'urgente' : 'informativa',
        fecha: new Date().toISOString()
      });
    }

    const { error: insertError } = await supabase.from('notificaciones').insert(nuevasNotificaciones);
    if (insertError) {
      console.error(`Error insertando notificaciones en ${entidad.nombre}:`, insertError.message);
    } else {
      console.log(`✅ Creadas ${numNotif} notificaciones en ${entidad.nombre}`);
      totalCreadas += numNotif;
    }
  }

  // Notificación global (sin entidad_id)
  await supabase.from('notificaciones').insert([{
    titulo: "Actualización del Sistema",
    mensaje: "El sistema ha sido actualizado con nuevas funciones para la demo.",
    tipo: "informativa",
    fecha: new Date().toISOString()
  }]);
  totalCreadas++;

  console.log(`\n🎉 ¡Demo lista! Se han generado ${totalCreadas} notificaciones en total.`);
}

generarNotificacionesDemo();
