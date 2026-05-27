import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testPasswordChangeLuis() {
  const email = "luisramirez@gmail.com"
  
  console.log(`Buscando usuario en public.usuarios...`)
  const { data: usuario, error: errUsuario } = await supabase.from('usuarios').select('*').eq('email', email).maybeSingle()
  
  if(!usuario) {
      console.log("¡El usuario luisramirez@gmail.com NO EXISTE en public.usuarios!")
      return;
  }
  const id = usuario.id
  console.log("ID del usuario encontrado:", id)

  const nuevaPassword = "Operario123!"

  console.log(`Llamando a actualizar-usuario Edge Function...`)
  const res = await fetch('https://zwmfzqdamdibjermgnyo.supabase.co/functions/v1/actualizar-usuario', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ id, password: nuevaPassword })
  });

  const respData = await res.json()
  console.log("Respuesta de actualizar-usuario:", respData)
  
  if(respData.error) {
      console.log("ERROR CRÍTICO AL ACTUALIZAR:", respData.error)
  } else {
      console.log(`Intentando hacer login con Operario123!...`)
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: nuevaPassword
      })

      if (loginError) {
        console.error("Login falló:", loginError.message)
      } else {
        console.log("Login exitoso con la NUEVA contraseña!", loginData.user.email)
      }
  }
}

testPasswordChangeLuis()
