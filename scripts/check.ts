import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("Supabase URL:", supabaseUrl)
