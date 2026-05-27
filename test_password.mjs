import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testPasswordChange() {
  const email = "jorgealvarez100@gmail.com"
  
  console.log(`Buscando usuario en public.usuarios para sacar su ID...`)
  const { data: usuario } = await supabase.from('usuarios').select('*').eq('email', email).single()
  
  if(!usuario) {
      console.log("No encontrado")
      return;
  }
  const id = usuario.id
  console.log("ID del usuario:", id)

  const nuevaPassword = "nuevaPassword321"

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

  console.log(`Intentando hacer login con nuevaPassword321...`)
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

testPasswordChange()
