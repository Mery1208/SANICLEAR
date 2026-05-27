const nombres = ['Ana','Jose','Maria','Carlos','Laura','David','Lucia','Sergio','Patricia','Jorge','Cristina','Isabel','Alberto','Fernando','Teresa','Antonio','Rosario','Rocio','Juan','Marta','Pablo','Nuria','Ricardo','Elena','Luis'];
const apellidos = ['Martin','Perez','Gomez','Ruiz','Garcia','Lopez','Fernandez','Alvarez','Jimenez','Sanchez','Heredia','Ortiz','Munoz','Fuentes','Castro','Roman','Alonso','Navarro','Torres','Dominguez','Hernandez','Leon','Gonzalez','Santiago','Diaz'];

const hospitales = [
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'c3d4e5f6-a7b8-9012-cdef-345678901234',
    'e0000000-0000-0000-0000-000000000001',
    '31e1fd91-5a88-4003-8471-497d322e9e26'
];

async function run() {
    console.log("Empezando a crear 100 usuarios reales (20 por hospital)...");
    let contadorGeneral = 1;

    for (let h = 0; h < hospitales.length; h++) {
        for (let i = 1; i <= 20; i++) {
            const nombre = nombres[Math.floor(Math.random() * 25)];
            const apellido = apellidos[Math.floor(Math.random() * 25)];
            
            const email = `${nombre.toLowerCase()}${apellido.toLowerCase()}${contadorGeneral}@gmail.com`;
            const turno = ['Mañana', 'Tarde', 'Noche'][Math.floor(Math.random() * 3)];
            
            try {
                const res = await fetch('https://zwmfzqdamdibjermgnyo.supabase.co/functions/v1/crear-usuario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        password: 'password123',
                        nombre: nombre,
                        apellidos: apellido,
                        rol: 'operario',
                        turno: turno,
                        entidad_id: hospitales[h]
                    })
                });
                const data = await res.json();
                
                if (data.error) {
                    console.error(`Error en ${email}:`, data.error);
                } else {
                    console.log(`✅ Creado con éxito: ${email}`);
                }
            } catch (e) {
                console.error(`Fallo de red en ${email}:`, e);
            }
            contadorGeneral++;
        }
    }
    console.log("¡Terminado! 100 usuarios creados correctamente.");
}

run();
