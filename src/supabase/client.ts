import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (
  !supabaseUrl ||
  !supabaseKey ||
  supabaseUrl === 'https://your-project.supabase.co' ||
  supabaseKey === 'your-anon-key-here'
) {
  throw new Error(
    'Supabase no está configurado correctamente. Crea un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY válidos.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
