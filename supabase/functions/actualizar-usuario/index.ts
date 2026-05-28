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
    const bodyText = await req.text()
    
    if (!bodyText || bodyText.trim() === '') {
      return new Response(JSON.stringify({ error: 'Body vacío' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { id, password, email, nombre, apellidos, rol, turno, entidad_id } = JSON.parse(bodyText)

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID es obligatorio' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 1. Actualizar Auth si hay password o email
    const authUpdateData: any = {}
    if (password && password.trim() !== '') authUpdateData.password = password.trim()
    if (email && email.trim() !== '') authUpdateData.email = email.trim()

    let authUser = null;
    if (Object.keys(authUpdateData).length > 0) {
      const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
        id,
        authUpdateData
      )

      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      authUser = authData.user;
    }

    // 2. Actualizar tabla public.usuarios (bypasses RLS gracias al SERVICE_ROLE_KEY)
    const profileUpdateData: any = {}
    if (nombre !== undefined) profileUpdateData.nombre = nombre
    if (apellidos !== undefined) profileUpdateData.apellidos = apellidos
    if (rol !== undefined) profileUpdateData.rol = rol
    if (turno !== undefined) profileUpdateData.turno = turno
    if (entidad_id !== undefined) profileUpdateData.entidad_id = entidad_id
    if (email && email.trim() !== '') profileUpdateData.email = email.trim() // Sincronizar email también

    if (Object.keys(profileUpdateData).length > 0) {
      const { error: dbError } = await supabase.from('usuarios').update(profileUpdateData).eq('id', id)
      
      if (dbError) {
        return new Response(JSON.stringify({ error: 'Error actualizando perfil: ' + dbError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    return new Response(JSON.stringify({ success: true, user: authUser || { id } }), {
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
