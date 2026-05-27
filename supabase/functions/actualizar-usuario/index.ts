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

    const { id, password, email } = JSON.parse(bodyText)

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID es obligatorio' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Preparamos los datos a actualizar dinámicamente
    const updateData: any = {}
    if (password && password.trim() !== '') updateData.password = password.trim()
    if (email && email.trim() !== '') updateData.email = email.trim()

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No hay nada que actualizar' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
      id,
      updateData
    )

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true, user: authData.user }), {
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
