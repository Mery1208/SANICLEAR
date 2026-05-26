// @ts-nocheck
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Leer el body como texto primero para debug
    const bodyText = await req.text()
    
    if (!bodyText || bodyText.trim() === '') {
      return new Response(JSON.stringify({ error: 'Body vacío' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { email, password, nombre, apellidos, rol, turno, entidad_id } = JSON.parse(bodyText)

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email y contraseña son obligatorios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
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