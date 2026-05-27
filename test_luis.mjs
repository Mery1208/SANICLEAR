import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://zwmfzqdamdibjermgnyo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bWZ6cWRhbWRpYmplcm1nbnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDUxNzcsImV4cCI6MjA4MjY4MTE3N30.bJtR3HBgOzzLwlB7x476MBlC44BpKiWsvkuuwekvjSY"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testLoginUser() {
  const email = "luisramirez@gmail.com"
  const password = "Operario123!"

  console.log(`Trying to login with ${email} and password: ${password}`)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error("Login failed:", error.message)
  } else {
    console.log("Login successful!", data.user.email)
  }
}

testLoginUser()
