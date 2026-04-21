import React from 'react';

const PoliticaPrivacidad: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-[#1e3a5f] mb-6">Política de Privacidad</h1>
      
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <p className="text-gray-600">
          <strong>Última actualización:</strong> 21 de Abril de 2026
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">1. Introducción</h2>
        <p className="text-gray-600">
          Saniclear se compromete a proteger la privacidad de los usuarios. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">2. Datos que Recopilamos</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>Nombre y apellidos</li>
          <li>Correo electrónico</li>
          <li>Datos de la entidad (hospital/clínica)</li>
          <li>Tareas e incidencias reportadas</li>
        </ul>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">3. Uso de los Datos</h2>
        <p className="text-gray-600">
          Los datos se utilizan exclusivamente para la gestión de limpieza hospitalaria, incluyendo la asignación de tareas, seguimiento de incidencias y comunicación entre usuarios.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">4. Protección de Datos</h2>
        <p className="text-gray-600">
          Utilizamos medidas de seguridad avanzadas incluyendo cifrado SSL, autenticación mediante Supabase Auth, y políticas de Row Level Security (RLS) para garantizar el acceso solo a usuarios autorizados.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">5. Tus Derechos</h2>
        <p className="text-gray-600">
          Puedes ejercer tu derecho de acceso, rectificación, supresión y oposición contactando con el administrador de tu entidad.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">6. contacto</h2>
        <p className="text-gray-600">
          Para cualquier consulta sobre privacidad: soporte@saniclear.com
        </p>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;