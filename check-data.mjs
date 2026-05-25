import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnvVar = (key) => {
  const match = env.match(new RegExp(`${key}\\s*=\\s*["']?([^"'\n\r]+)["']?`));
  return match ? match[1] : null;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("=== USUARIOS ===");
  const { data: usuarios, error: errUser } = await supabase.from('usuarios').select('id, nombre, apellidos, email, rol, entidad_id');
  if (errUser) console.error("Error fetching usuarios:", errUser);
  else console.log(usuarios);
}

check();
