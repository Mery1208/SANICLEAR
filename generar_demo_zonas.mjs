import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TIPOS_ZONA = ["Habitación", "Quirófano", "Baño", "Pasillo", "Urgencias", "Laboratorio", "Común"];
const NIVELES = ['alto', 'medio', 'bajo'];
const ESTADOS = ['Activo', 'Inactivo', 'Mantenimiento'];

async function generarZonasDemo() {
  console.log("Iniciando generación de zonas de demo...");

  const { data: entidades, error: entError } = await supabase.from('entidades').select('id, nombre');
  if (entError || !entidades.length) return console.error("No se encontraron entidades.");

  let totalCreadas = 0;

  for (const entidad of entidades) {
    const numZonas = Math.floor(Math.random() * 8) + 5; // 5 a 12 zonas
    const nuevasZonas = [];

    for (let i = 0; i < numZonas; i++) {
      const tipo = TIPOS_ZONA[Math.floor(Math.random() * TIPOS_ZONA.length)];
      const planta = Math.floor(Math.random() * 5); // 0 a 4
      const num = Math.floor(Math.random() * 90) + 10; // 10 a 99
      
      let nombreZona = `${tipo} ${planta}${num}`;
      if (tipo === "Pasillo" || tipo === "Común") {
        nombreZona = `${tipo} Planta ${planta}`;
      } else if (tipo === "Urgencias") {
        nombreZona = `Urgencias Box ${Math.floor(Math.random() * 10) + 1}`;
      }

      nuevasZonas.push({
        entidad_id: entidad.id,
        nombre: nombreZona,
        tipo: tipo,
        planta: planta,
        metros: Math.floor(Math.random() * 40) + 10, // 10 a 50 m2
        nivel: NIVELES[Math.floor(Math.random() * NIVELES.length)],
        estado: Math.random() > 0.8 ? 'Mantenimiento' : 'Activo'
      });
    }

    const { error: insertError } = await supabase.from('zonas').insert(nuevasZonas);
    if (insertError) {
      console.error(`Error insertando zonas en ${entidad.nombre}:`, insertError.message);
    } else {
      console.log(`✅ Creadas ${numZonas} zonas en ${entidad.nombre}`);
      totalCreadas += numZonas;
    }
  }

  console.log(`\n🎉 ¡Demo lista! Se han generado ${totalCreadas} zonas en total.`);
}

generarZonasDemo();
