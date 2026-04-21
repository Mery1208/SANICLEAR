import React from 'react';

const Seguridad: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-[#1e3a5f] mb-6">Seguridad</h1>
      
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">1. Medidas de Seguridad</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li><strong>Cifrado SSL/TLS:</strong> Todas las comunicaciones están cifradas</li>
          <li><strong>Autenticación:</strong> Sistema de Supabase Auth con sesiones seguras</li>
          <li><strong>Row Level Security (RLS):</strong> Control de acceso a nivel de fila en la base de datos</li>
          <li><strong>Roles y Permisos:</strong> Sistema RBAC (Admin, Operario, Superadmin)</li>
        </ul>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">2. Protección de Datos</h2>
        <p className="text-gray-600">
          Los datos se almacenan en Supabase con políticas de seguridad que garantizan que cada usuario solo acceda a la información de su entidad.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">3. Multi-Tenant</h2>
        <p className="text-gray-600">
          Saniclear implementa arquitectura multi-tenant donde cada entidad (hospital) tiene acceso aislado a sus propios datos, garantizando la confidencialidad.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">4. Recomendaciones</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>Usa una contraseña robusta</li>
          <li>Cierra sesión cuando uses dispositivos compartidos</li>
          <li>No compartas tus credenciales</li>
          <li>Contacta si detectas actividad sospechosa</li>
        </ul>
      </div>
    </div>
  );
};

export default Seguridad;