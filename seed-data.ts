import { createClient } from '@supabase/supabase-js';

// Intentar obtener variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables de entorno no encontradas. Necesitas configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  console.error('Puedes obtenerlas del panel de Supabase > Project > Settings > API');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndSeedData() {
  console.log('=== Verificando y sembrando datos de ejemplo ===\n');
  
  try {
    // 1. Verificar entidades (hospitales)
    console.log('1. Verificando entidades...');
    const { data: entidades, error: entidadesError } = await supabase
      .from('entidades')
      .select('id, nombre_hospital');
      
    if (entidadesError) throw entidadesError;
    
    console.log(`   Entidades encontradas: ${entidades.length}`);
    entidades.forEach(e => console.log(`   - ${e.nombre_hospital} (ID: ${e.id})`));
    
    // Buscar el Hospital de Prueba Saniclears
    const hospitalSaniclears = entidades.find(e => 
      e.nombre_hospital.toLowerCase().includes('saniclears') && 
      e.nombre_hospital.toLowerCase().includes('prueba')
    ) || entidades.find(e => e.nombre_hospital.toLowerCase().includes('saniclears'));
    
    let entidadId = null;
    let entidadNombre = '';
    
    if (hospitalSaniclears) {
      entidadId = hospitalSaniclears.id;
      entidadNombre = hospitalSaniclears.nombre_hospital;
      console.log(`   ✓ Hospital de prueba encontrado: ${entidadNombre} (ID: ${entidadId})`);
    } else {
      console.log('   ! No se encontró Hospital de Prueba Saniclears. Se usará la primera entidad disponible.');
      if (entidades.length > 0) {
        entidadId = entidades[0].id;
        entidadNombre = entidades[0].nombre_hospital;
        console.log(`   Usando entidad: ${entidadNombre} (ID: ${entidadId})`);
      } else {
        console.log('   ! No hay entidades en la base de datos. Creando una de ejemplo...');
        const { data: newEntidad, error: entidadError } = await supabase
          .from('entidades')
          .insert({ nombre_hospital: 'Hospital de Prueba Saniclears' })
          .select()
          .single();
          
        if (entidadError) throw entidadError;
        entidadId = newEntidad.id;
        entidadNombre = newEntidad.nombre_hospital;
        console.log(`   ✓ Entidad creada: ${entidadNombre} (ID: ${entidadId})`);
      }
    }
    
    console.log('');
    
    // 2. Verificar zonas para esta entidad
    console.log('2. Verificando zonas...');
    const { data: zonas, error: zonasError } = await supabase
      .from('zonas')
      .select('id, nombre')
      .eq('entidad_id', entidadId);
      
    if (zonasError) throw zonasError;
    
    console.log(`   Zonas encontradas para ${entidadNombre}: ${zonas.length}`);
    zonas.forEach(z => console.log(`   - ${z.nombre}`));
    
    // Si no hay zonas, crear algunas de ejemplo
    if (zonas.length === 0) {
      console.log('   ! No hay zonas. Creando zonas de ejemplo...');
      const zonasEjemplo = [
        { nombre: 'Urgencias', entidad_id: entidadId },
        { nombre: 'Quirófanos', entidad_id: entidadId },
        { nombre: 'Hospitalización', entidad_id: entidadId },
        { nombre: 'Laboratorio', entidad_id: entidadId },
        { nombre: 'Imagenología', entidad_id: entidadId }
      ];
      
      const { data: zonasCreadas, error: zonasInsertError } = await supabase
        .from('zonas')
        .insert(zonasEjemplo)
        .select();
        
      if (zonasInsertError) throw zonasInsertError;
      
      console.log(`   ✓ Creadas ${zonasCreadas.length} zonas:`);
      zonasCreadas.forEach(z => console.log(`     - ${z.nombre}`));
    }
    
    console.log('');
    
    // 3. Verificar usuarios operarios para esta entidad
    console.log('3. Verificando usuarios operarios...');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nombre, apellidos, email, rol, turno')
      .eq('entidad_id', entidadId)
      .eq('rol', 'operario');
      
    if (usuariosError) throw usuariosError;
    
    console.log(`   Usuarios operarios encontrados: ${usuarios.length}`);
    usuarios.forEach(u => console.log(`   - ${u.nombre} ${u.apellidos || ''} (${u.email}) - Turno: ${u.turno}`));
    
    // Si no hay usuarios operarios, crear algunos de ejemplo
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
        }
      ];
      
      const usuariosCreados = [];
      
      for (const usuarioData of usuariosEjemplo) {
        try {
          // Crear usuario en auth
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: usuarioData.email,
            password: usuarioData.password,
            email_confirm: true
          });
          
          if (authError) {
            console.warn(`   ! Error creando auth para ${usuarioData.email}: ${authError.message}`);
            // Continuar talvez el usuario ya existe
          }
          
          // Crear entrada en tabla usuarios
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
    }
    
    console.log('');
    
    // 4. Verificar tareas
    console.log('4. Verificando tareas...');
    const { data: tareas, error: tareasError } = await supabase
      .from('tareas')
      .select('id, tarea, zona, asignado, estado, prioridad')
      .eq('entidad_id', entidadId);
      
    if (tareasError) throw tareasError;
    
    console.log(`   Tareas encontradas: ${tareas.length}`);
    tareas.forEach(t => console.log(`   - [${t.estado}] ${t.tarea} (${t.zona}) - Prioridad: ${t.prioridad}`));
    
    // Si no hay tareas, crear algunas de ejemplo
    if (tareas.length === 0) {
      console.log('   ! No hay tareas. Creando tareas de ejemplo...');
      
      // Primero obtenemos las zonas y usuarios para asignar
      const { data: zonasDisponibles } = await supabase
        .from('zonas')
        .select('id, nombre')
        .eq('entidad_id', entidadId);
        
      const { data: usuariosDisponibles } = await supabase
        .from('usuarios')
        .select('id, nombre, apellidos')
        .eq('entidad_id', entidadId)
        .eq('rol', 'operario');
      
      if (zonasDisponibles.length === 0 || usuariosDisponibles.length === 0) {
        console.log('   ! No se pueden crear tareas sin zonas o usuarios operarios');
      } else {
        const tareasEjemplo = [
          { 
            tarea: 'Limpieza y desinfección de camas', 
            zona: zonasDisponibles[0].nombre, // Urgencias
            asignado: `${usuariosDisponibles[0].nombre} ${usuariosDisponibles[0].apellidos || ''}`,
            estado: 'pendiente',
            prioridad: 'alta',
            entidad_id: entidadId
          },
          { 
            tarea: 'Desinfección de superficies comunes', 
            zona: zonasDisponibles[1].nombre || 'Quirófanos', 
            asignado: `${usuariosDisponibles[1]?.nombre || ''} ${usuariosDisponibles[1]?.apellidos || ''}`,
            estado: 'en_curso',
            prioridad: 'media',
            entidad_id: entidadId
          },
          { 
            tarea: 'Reposición de materiales de limpieza', 
            zona: zonasDisponibles[2]?.nombre || 'Hospitalización', 
            asignado: `${usuariosDisponibles[2]?.nombre || ''} ${usuariosDisponibles[2]?.apellidos || ''}`,
            estado: 'pendiente',
            prioridad: 'baja',
            entidad_id: entidadId
          },
          { 
            tarea: 'Limpieza profunda de baños', 
            zona: zonasDisponibles[0].nombre, 
            asignado: `${usuariosDisponibles[0].nombre} ${usuariosDisponibles[0].apellidos || ''}`,
            estado: 'pendiente',
            prioridad: 'alta',
            entidad_id: entidadId
          }
        ];
        
        const { data: tareasCreadas, error: tareasInsertError } = await supabase
          .from('tareas')
          .insert(tareasEjemplo)
          .select();
          
        if (tareasInsertError) throw tareasInsertError;
        
        console.log(`   ✓ Creadas ${tareasCreadas.length} tareas:`);
        tareasCreadas.forEach(t => console.log(`     - [${t.estado}] ${t.tarea} (${t.zona})`));
      }
    }
    
    console.log('');
    
    // 5. Verificar incidencias
    console.log('5. Verificando incidencias...');
    const { data: incidencias, error: incidenciasError } = await supabase
      .from('incidencias')
      .select('id, titulo, zona, prioridad, estado')
      .eq('entidad_id', entidadId);
      
    if (incidenciasError) throw incidenciasError;
    
    console.log(`   Incidencias encontradas: {incidencias.length}`);
    incidencias.forEach(i => console.log(`   - [${i.estado}] ${i.titulo} (${i.zona}) - Prioridad: ${i.prioridad}`));
    
    // Si no hay incidencias, crear algunas de ejemplo
    if (incidencias.length === 0) {
      console.log('   ! No hay incidencias. Creando incidencias de ejemplo...');
      
      const { data: zonasDisponibles } = await supabase
        .from('zonas')
        .select('id, nombre')
        .eq('entidad_id', entidadId);
      
      if (zonasDisponibles.length === 0) {
        console.log('   ! No se pueden crear incidencias sin zonas');
      } else {
        const incidenciasEjemplo = [
          { 
            titulo: 'Fuga de agua en piso 3', 
            zona: zonasDisponibles[0].nombre,
            prioridad: 'alta',
            estado: 'abierta',
            entidad_id: entidadId
          },
          { 
            titulo: 'Fallos en sistema de iluminación de emergencia', 
            zona: zonasDisponibles[1]?.nombre || zonasDisponibles[0].nombre,
            prioridad: 'media',
            estado: 'abierta',
            entidad_id: entidadId
          },
          { 
            titulo: 'Obstrucción en conducto de ventilación', 
            zona: zonasDisponibles[2]?.nombre || zonasDisponibles[0].nombre,
            prioridad: 'baja',
            estado: 'abierta',
            entidad_id: entidadId
          }
        ];
        
        const { data: incidenciasCreadas, error: incidenciasInsertError } = await supabase
          .from('incidencias')
          .insert(incidenciasEjemplo)
          .select();
          
        if (incidenciasInsertError) throw incidenciasInsertError;
        
        console.log(`   ✓ Creadas ${incidenciasCreadas.length} incidencias:`);
        incidenciasCreadas.forEach(i => console.log(`     - [${i.estado}] ${i.titulo} (${i.zona})`));
      }
    }
    
    console.log('\n=== Proceso completado ===');
    console.log('Ahora debería haber datos en el Hospital de Prueba Saniclears');
    
  } catch (error) {
    console.error('Error durante el proceso:', error);
    process.exit(1);
  }
}

checkAndSeedData();