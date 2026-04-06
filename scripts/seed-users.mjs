/**
 * Script para registrar los usuarios seed en Supabase Auth.
 *
 * Uso:
 *   node scripts/seed-users.mjs
 *
 * Requiere las variables de entorno:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *
 * También puedes usar la SERVICE_ROLE_KEY para evitar confirmación de email:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/seed-users.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Cargar .env.local si existe
const envPath = resolve(rootDir, '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Faltan variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const USERS = [
  { email: 'admin@saniclear.com', password: 'Admin1234!', nombre: 'Admin', apellidos: 'Saniclear', rol: 'admin', turno: null },
  { email: 'juan.perez@saniclear.com', password: 'Operario123!', nombre: 'Juan', apellidos: 'Pérez García', rol: 'operario', turno: 'Mañana' },
  { email: 'maria.ceballos@saniclear.com', password: 'Operario123!', nombre: 'María', apellidos: 'Ceballos Mesías', rol: 'operario', turno: 'Tarde' },
  { email: 'evelia.gil@saniclear.com', password: 'Operario123!', nombre: 'Evelia', apellidos: 'Gil Paredes', rol: 'operario', turno: 'Noche' },
  { email: 'carlos.f@saniclear.com', password: 'Operario123!', nombre: 'Carlos', apellidos: 'Fernández', rol: 'operario', turno: 'Mañana' },
  { email: 'ana.martinez@saniclear.com', password: 'Operario123!', nombre: 'Ana', apellidos: 'Martínez', rol: 'operario', turno: 'Tarde' },
];

async function seedUsers() {
  console.log('Iniciando registro de usuarios en Supabase Auth...\n');

  for (const user of USERS) {
    console.log(`Registrando: ${user.email} ...`);

    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          nombre: user.nombre,
          apellidos: user.apellidos,
          rol: user.rol,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('User already exists')) {
        console.log(`  -> Ya existe, saltando.`);
      } else {
        console.error(`  -> Error: ${error.message}`);
      }
      continue;
    }

    if (data.user) {
      console.log(`  -> OK (id: ${data.user.id})`);

      // Insertar/actualizar en tabla usuarios
      const { error: upsertError } = await supabase
        .from('usuarios')
        .upsert({
          id: data.user.id,
          email: user.email,
          nombre: user.nombre,
          apellidos: user.apellidos,
          rol: user.rol,
          turno: user.turno,
        }, { onConflict: 'id' });

      if (upsertError) {
        console.error(`  -> Error al insertar en tabla usuarios: ${upsertError.message}`);
      } else {
        console.log(`  -> Perfil creado en tabla usuarios.`);
      }
    }
  }

  console.log('\nProceso completado.');
}

seedUsers().catch(console.error);
