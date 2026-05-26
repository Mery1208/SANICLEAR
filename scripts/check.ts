import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Just using standard fetch in Deno to check the user in DB
const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')
const supabaseKey = Deno.env.get('VITE_SUPABASE_PUBLISHABLE_KEY')
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

console.log("Supabase URL:", supabaseUrl)
