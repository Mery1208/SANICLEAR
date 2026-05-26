// @ts-nocheck
// Este archivo se ejecuta en Deno (Supabase Edge Functions), no en Node.js.
// Los errores del editor TypeScript son esperados y no afectan al despliegue.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Admin client usa service_role key (inyectada automáticamente por Supabase)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Verificar que el llamante está autenticado
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: caller }, error: callerError } = await supabaseAdmin.auth.getUser(token)

    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verificar rol del llamante (debe ser admin o superadmin)
    const { data: callerProfile } = await supabaseAdmin
      .from('usuarios')
      .select('rol')
      .eq('id', caller.id)
      .single()

    if (!callerProfile || !['admin', 'superadmin'].includes(callerProfile.rol)) {
      return new Response(JSON.stringify({ error: 'Sin permisos suficientes' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Obtener datos del body
    const { email, password, nombre, apellidos, rol, turno, entidad_id } = await req.json()

    if (!email || !password || !nombre) {
      return new Response(
        JSON.stringify({ error: 'Email, contraseña y nombre son obligatorios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Crear usuario en Supabase Auth (email ya verificado, sin email de confirmación)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre, apellidos, rol },
    })

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Insertar fila en tabla usuarios con el mismo id de Auth
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .upsert(
        {
          id: authData.user.id,
          email,
          nombre,
          apellidos: apellidos || '',
          rol: rol || 'operario',
          turno: turno || 'Mañana',
          entidad_id: entidad_id || null,
        },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (userError) {
      // Si falla el insert en DB, limpiar el usuario de Auth para evitar inconsistencias
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ user: userData }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
