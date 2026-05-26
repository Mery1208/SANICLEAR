import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Note: To check auth.users we would need the service role key, but let's check public.usuarios first.
// Wait, I can just use the anon key for public.usuarios.
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data, error } = await supabase.from('usuarios').select('*').eq('email', 'carmenruiz@gmail.com')
  console.log("Usuarios in DB:", data)
  console.log("Error:", error)
}
check()
