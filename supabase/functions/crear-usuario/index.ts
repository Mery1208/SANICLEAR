// @ts-nocheck
// Este archivo se ejecuta en Deno (Supabase Edge Functions), no en Node.js.
// Los errores del editor TypeScript son esperados y no afectan al despliegue.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  // Manejo de CORS (muy importante para que funcione desde el frontend)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, nombre, apellidos, rol, turno, entidad_id } = await req.json()

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true  // ← sin email de confirmación, listo para usar
    })

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: userRow, error: dbError } = await supabase
      .from('usuarios')
      .upsert({
        id: authData.user.id,
        email,
        nombre,
        apellidos: apellidos || '',
        rol: rol || 'operario',
        turno: turno || 'Mañana',
        entidad_id: entidad_id || null
      }, { onConflict: 'id' })
      .select()
      .single()

    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ user: userRow }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})