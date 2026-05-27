import { createClient } from '@supabase/supabase-js';

// Función para cargar variables de entorno desde .env.local
function loadEnvFile() {
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Archivo .env.local no encontrado');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    line = line.trim();
    if (line === '' || line.startsWith('#')) return;
    
    const [key, ...valueParts] = line.split('=');
    if (key) {
      const value = valueParts.join('=').trim();
      // Remover comillas si existen
      const cleanValue = value.replace(/^["']|["']$/g, '');
      process.env[key] = cleanValue;
    }
  });
}

// Cargar variables de entorno
loadEnvFile();

// Obtener variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables de entorno no encontradas en .env.local');
  console.error('Asegúrate de que el archivo .env.local exista y contenga VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedHospitalDePrueba() {
  console.log('=== Sembrando datos para Hospital de Prueba Saniclears ===\n');
  
  try {
    // 1. Buscar o crear el Hospital de Prueba Saniclears
    console.log('1. Buscando Hospital de Prueba Saniclears...');
    let { data: entidades, error: entidadesError } = await supabase
      .from('entidades')
      .select('id, nombre_hospital')
      .ilike('nombre_hospital', '%saniclears%prueba%');
      
    if (entidadesError) throw entidadesError;
    
    let entidadId;
    let entidadNombre;
    
    if (entidades.length > 0) {
      entidadId = entidades[0].id;
      entidadNombre = entidades[0].nombre_hospital;
      console.log(`   ✓ Hospital encontrado: ${entidadNombre} (ID: ${entidadId})`);
    } else {
      // Buscar cualquier entidad con saniclears
      const { data: entidadesSaniclears, error: saniclearsError } = await supabase
        .from('entidades')
        .select('id, nombre_hospital')
        .ilike('nombre_hospital', '%saniclears%');
        
      if (saniclearsError) throw saniclearsError;
      
      if (entidadesSaniclears.length > 0) {
        entidadId = entidadesSaniclears[0].id;
        entidadNombre = entidadesSaniclears[0].nombre_hospital;
        console.log(`   ! No se encontró hospital con "prueba", usando: ${entidadNombre} (ID: ${entidadId})`);
      } else {
        // Crear nueva entidad
        console.log('   ! No se encontró ninguna entidad Saniclears. Creando una nueva...');
        const { data: nuevaEntidad, error: crearEntidadError } = await supabase
          .from('entidades')
          .insert({ nombre_hospital: 'Hospital de Prueba Saniclears' })
          .select()
          .single();
          
        if (crearEntidadError) throw crearEntidadError;
        entidadId = nuevaEntidad.id;
        entidadNombre = nuevaEntidad.nombre_hospital;
        console.log(`   ✓ Entidad creada: ${entidadNombre} (ID: ${entidadId})`);
      }
    }
    
    console.log('');
    
    // 2. Asegurar que existan zonas
    console.log('2. Verificando zonas...');
    const { data: zonasExistentes, error: zonasError } = await supabase
      .from('zonas')
      .select('id, nombre')
      .eq('entidad_id', entidadId);
      
    if (zonasError) throw zonasError;
    
    let zonas = zonasExistentes;
    
    if (zonas.length === 0) {
      console.log('   ! No hay zonas. Creando zonas de ejemplo...');
      const zonasEjemplo = [
        { nombre: 'Urgencias', entidad_id: entidadId },
        { nombre: 'Quirófanos', entidad_id: entidadId },
        { nombre: 'Hospitalización', entidad_id: entidadId },
        { nombre: 'Laboratorio', entidad_id: entidadId },
        { nombre: 'Imagenología', entidad_id: entidadId },
        { nombre: 'Consultas Externas', entidad_id: entidadId },
        { nombre: 'Administración', entidad_id: entidadId }
      ];
      
      const { data: zonasCreadas, error: zonasInsertError } = await supabase
        .from('zonas')
        .insert(zonasEjemplo)
        .select();
        
      if (zonasInsertError) throw zonasInsertError;
      
      zonas = zonasCreadas;
      console.log(`   ✓ Creadas ${zonas.length} zonas:`);
      zonas.forEach(z => console.log(`     - ${z.nombre}`));
    } else {
      console.log(`   ✓ Ya existen ${zonas.length} zonas:`);
      zonas.forEach(z => console.log(`     - ${z.nombre}`));
    }
    
    console.log('');
    
    // 3. Asegurar que existan usuarios operarios
    console.log('3. Verificando usuarios operarios...');
    const { data: usuariosExistentes, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nombre, apellidos, email, rol, turno')
      .eq('entidad_id', entidadId)
      .eq('rol', 'operario');
      
    if (usuariosError) throw usuariosError;
    
    let usuarios = usuariosExistentes;
    
    if (usuarios.length === 0) {
      console.log('   ! No hay usuarios operarios. Creando usuarios de ejemplo...');
      
      // Primero necesitamos asegurarnos de que existan en auth
      const usuariosEjemplo = [
        { 
          email: 'operador1@hospital.test', 
          password: 'Operador123!', 
          nombre: 'Carlos', 
          apellidos: 'Rodríguez', 
          rol: 'operario',
          turno: 'Mañana'
        },
        { 
          email: 'operador2@hospital.test', 
          password: 'Operador123!', 
          nombre: 'Laura', 
          apellidos: 'Méndez', 
          rol: 'operario',
          turno: 'Tarde'
        },
        { 
          email: 'operador3@hospital.test', 
          password: 'Operador123!', 
          nombre: 'Miguel', 
          apellidos: 'Fernández', 
          rol: 'operario',
          turno: 'Noche'
        },
        { 
          email: 'operador4@hospital.test', 
          password: 'Operador123!', 
          nombre: 'Ana', 
          apellidos: 'García', 
          rol: 'operario',
          turno: 'Mañana'
        },
        { 
          email: 'operador5@hospital.test', 
          password: 'Operador123!', 
          nombre: 'Luis', 
          apellidos: 'Martínez', 
          rol: 'operario',
          turno: 'Tarde'
        }
      ];
      
      const usuariosCreados = [];
      
      for (const usuarioData of usuariosEjemplo) {
        try {
          // Verificar si ya existe en auth
          const { data: authExists } = await supabase.auth.admin.getUserByEmail(usuarioData.email);
          
          let authData;
          if (authExists.user) {
            console.log(`   ℹ️  Usuario auth ya existe: ${usuarioData.email}`);
            authData = { user: authExists.user };
          } else {
            // Crear usuario en auth
            const { data: newAuthData, error: authError } = await supabase.auth.admin.createUser({
              email: usuarioData.email,
              password: usuarioData.password,
              email_confirm: true
            });
            
            if (authError) {
              console.warn(`   ! Error creando auth para ${usuarioData.email}: ${authError.message}`);
              // Continuar talvez el usuario ya existe de otra forma
              continue;
            }
            authData = newAuthData;
          }
          
          // Crear o actualizar entrada en tabla usuarios
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .upsert({
              id: authData.user.id,
              email: usuarioData.email,
              nombre: usuarioData.nombre,
              apellidos: usuarioData.apellidos,
              rol: usuarioData.rol,
              turno: usuarioData.turno,
              entidad_id: entidadId
            }, { onConflict: 'id' })
            .select()
            .single();
            
          if (userError) throw userError;
          
          usuariosCreados.push(userData);
          console.log(`   ✓ Usuario creado: ${usuarioData.nombre} ${usuarioData.apellidos} (${usuarioData.email})`);
        } catch (userErr) {
          console.error(`   ! Error procesando usuario ${usuarioData.email}:`, userErr.message);
        }
      }
      
      usuarios = [...usuarios, ...usuariosCreados];
    } else {
      console.log(`   ✓ Ya existen ${usuarios.length} usuarios operarios:`);
      usuarios.forEach(u => console.log(`     - ${u.nombre} ${u.apellidos || ''} (${u.email}) - Turno: ${u.turno}`));
    }
    
    console.log('');
    
    // 4. Asegurar que existan tareas
    console.log('4. Verificando tareas...');
    const { data: tareasExistentes, error: tareasError } = await supabase
      .from('tareas')
      .select('id, tarea, zona, asignado, estado, prioridad')
      .eq('entidad_id', entidadId);
      
    if (tareasError) throw tareasError;
    
    let tareas = tareasExistentes;
    
    if (tareas.length === 0) {
      console.log('   ! No hay tareas. Creando tareas de ejemplo...');
      
      if (zonas.length === 0 || usuarios.length === 0) {
        console.log('   ! No se pueden crear tareas sin zonas o usuarios operarios');
      } else {
        const tareasEjemplo = [
          { 
            tarea: 'Limpieza y desinfección de camas', 
            zona: zonas[0].nombre, 
            asignado: `${usuarios[0].nombre} ${usuarios[0].apellidos || ''}`,
            estado: 'pendiente',
            prioridad: 'alta',
            entidad_id: entidadId
          },
          { 
            tarea: 'Desinfección de superficies comunes', 
            zona: zonas[1]?.nombre || zonas[0].nombre, 
            asignado: `${usuarios[1]?.nombre || ''} ${usuarios[1]?.apellidos || ''}`,
            estado: 'en_curso',
            prioridad: 'media',
            entidad_id: entidadId
          },
          { 
            tarea: 'Reposición de materiales de limpieza', 
            zona: zonas[2]?.nombre || zonas[0].nombre, 
            asignado: `${usuarios[2]?.nombre || ''} ${usuarios[2]?.apellidos || ''}`,
            estado: 'pendiente',
            prioridad: 'baja',
            entidad_id: entidadId
          },
          { 
            tarea: 'Limpieza profunda de baños', 
            zona: zonas[0].nombre, 
            asignado: `${usuarios[0].nombre} ${usuarios[0].apellidos || ''}`,
            estado: 'pendiente',
            prioridad: 'alta',
            entidad_id: entidadId
          },
          { 
            tarea: 'Limpieza de salas de espera', 
            zona: zonas[3]?.nombre || zonas[0].nombre, 
            asignado: `${usuarios[3]?.nombre || ''} ${usuarios[3]?.apellidos || ''}`,
            estado: 'pendiente',
            prioridad: 'media',
            entidad_id: entidadId
          }
        ];
        
        const { data: tareasCreadas, error: tareasInsertError } = await supabase
          .from('tareas')
          .insert(tareasEjemplo)
          .select();
          
        if (tareasInsertError) throw tareasInsertError;
        
        tareas = tareasCreadas;
        console.log(`   ✓ Creadas ${tareas.length} tareas:`);
        tareas.forEach(t => console.log(`     - [${t.estado}] ${t.tarea} (${t.zona})`));
      }
    } else {
      console.log(`   ✓ Ya existen ${tareas.length} tareas:`);
      tareas.forEach(t => console.log(`     - [${t.estado}] ${t.tarea} (${t.zona})`));
    }
    
    console.log('');
    
    // 5. Asegurar que existan incidencias
    console.log('5. Verificando incidencias...');
    const { data: incidenciasExistentes, error: incidenciasError } = await supabase
      .from('incidencias')
      .select('id, titulo, zona, prioridad, estado')
      .eq('entidad_id', entidadId);
      
    if (incidenciasError) throw incidenciasError;
    
    let incidencias = incidenciasExistentes;
    
    if (incidencias.length === 0) {
      console.log('   ! No hay incidencias. Creando incidencias de ejemplo...');
      
      if (zonas.length === 0) {
        console.log('   ! No se pueden crear incidencias sin zonas');
      } else {
        const incidenciasEjemplo = [
          { 
            titulo: 'Fuga de agua en piso 3', 
            zona: zonas[0].nombre,
            prioridad: 'alta',
            estado: 'abierta',
            entidad_id: entidadId
          },
          { 
            titulo: 'Fallos en sistema de iluminación de emergencia', 
            zona: zonas[1]?.nombre || zonas[0].nombre,
            prioridad: 'media',
            estado: 'abierta',
            entidad_id: entidadId
          },
          { 
            titulo: 'Obstrucción en conducto de ventilación', 
            zona: zonas[2]?.nombre || zonas[0].nombre,
            prioridad: 'baja',
            estado: 'abierta',
            entidad_id: entidadId
          },
          { 
            titulo: 'Equipo de esterilización fuera de servicio', 
            zona: zonas[3]?.nombre || zonas[0].nombre,
            prioridad: 'alta',
            estado: 'abierta',
            entidad_id: entidadId
          }
        ];
        
        const { data: incidenciasCreadas, error: incidenciasInsertError } = await supabase
          .from('incidencias')
          .insert(incidenciasEjemplo)
          .select();
          
        if (incidenciasInsertError) throw incidenciasInsertError;
        
        incidencias = incidenciasCreadas;
        console.log(`   ✓ Creadas ${incidencias.length} incidencias:`);
        incidencias.forEach(i => console.log(`     - [${i.estado}] ${i.titulo} (${i.zona})`));
      }
    } else {
      console.log(`   ✓ Ya existen ${incidencias.length} incidencias:`);
      incidencias.forEach(i => console.log(`     - [${i.estado}] ${i.titulo} (${i.zona})`));
    }
    
    console.log('\n=== Proceso completado ===');
    console.log(`El Hospital de Prueba Saniclears (${entidadNombre}) ahora tiene:`);
    console.log(`- ${zonas.length} zonas`);
    console.log(`- ${usuarios.length} usuarios operarios`);
    console.log(`- ${tareas.length} tareas`);
    console.log(`- ${incidencias.length} incidencias`);
    console.log('\nAhora debería ver datos en la interfaz.');
    
  } catch (error) {
    console.error('Error durante el proceso:', error);
    process.exit(1);
  }
}

seedHospitalDePrueba();