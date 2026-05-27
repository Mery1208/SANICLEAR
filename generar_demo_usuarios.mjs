import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NOMBRES = ["Laura", "Carlos", "Ana", "Miguel", "Sofía", "David", "Elena", "Javier", "Carmen", "Daniel"];
const APELLIDOS = ["García", "Martínez", "López", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández"];
const TURNOS = ["Mañana", "Tarde", "Noche"];

async function generarUsuariosDemo() {
  console.log("Iniciando generación de usuarios de demo...");

  const { data: entidades, error: entError } = await supabase.from('entidades').select('id, nombre, codigo');
  if (entError || !entidades.length) return console.error("No se encontraron entidades.");

  let totalCreados = 0;

  for (const entidad of entidades) {
    const numUsuarios = Math.floor(Math.random() * 4) + 3; // 3 a 6 usuarios
    
    for (let i = 0; i < numUsuarios; i++) {
      const nombre = NOMBRES[Math.floor(Math.random() * NOMBRES.length)];
      const apellido = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
      const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}${Math.floor(Math.random() * 1000)}@${entidad.codigo.toLowerCase()}.com`;
      
      // Intentamos usar la edge function para crear el usuario en Auth y DB
      const { data, error } = await supabase.functions.invoke('crear-usuario', {
        body: {
          email: email,
          password: "Password123!",
          nombre: nombre,
          apellidos: apellido,
          rol: Math.random() > 0.8 ? 'admin' : 'operario',
          entidad_id: entidad.id,
          turno: TURNOS[Math.floor(Math.random() * TURNOS.length)]
        }
      });

      if (error || data?.error) {
        console.error(`Error creando usuario ${email}:`, error?.message || data?.error);
      } else {
        totalCreados++;
      }
    }
    console.log(`✅ Creados usuarios en ${entidad.nombre}`);
  }

  console.log(`\n🎉 ¡Demo lista! Se han generado ${totalCreados} usuarios en total.`);
}

generarUsuariosDemo();
