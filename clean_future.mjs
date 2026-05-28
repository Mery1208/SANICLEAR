import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function limpiarFuturo() {
  console.log("Limpiando incidencias del futuro (desde el 4 de Junio de 2026 en adelante)...");

  const targetEntityId = 'e0000000-0000-0000-0000-000000000001';
  
  const { data, error, count } = await supabase
    .from('incidencias')
    .delete({ count: 'exact' })
    .eq('entidad_id', targetEntityId)
    .gte('created_at', '2026-06-04T00:00:00Z');

  if (error) {
    console.error("Error borrando:", error);
  } else {
    console.log(` Borradas ${count} incidencias futuras.`);
  }
}

limpiarFuturo();
