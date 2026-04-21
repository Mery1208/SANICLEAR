import React from 'react';

const Cookies: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-[#1e3a5f] mb-6">Política de Cookies</h1>
      
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">1. ¿Qué son las Cookies?</h2>
        <p className="text-gray-600">
          Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando usas una aplicación web.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">2. Cookies que Utilizamos</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento de la app (sesión, autenticación)</li>
          <li><strong>Cookies de preferencias:</strong> Guardan tu configuración y ajustes</li>
        </ul>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">3. Gestión de Cookies</h2>
        <p className="text-gray-600">
          La mayoría de navegadores permiten gestionar las cookies. Puedes configurar tu navegador para rechazar cookies o eliminarlas.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">4. Cookies de Terceros</h2>
        <p className="text-gray-600">
          Saniclear utiliza servicios de Supabase para autenticación y base de datos. Estos servicios pueden usar cookies técnicas necesarias para su funcionamiento.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] mt-4">5. Actualizaciones</h2>
        <p className="text-gray-600">
          Esta política puede actualizarse. Te notificaremos de cualquier cambio significativo.
        </p>
      </div>
    </div>
  );
};

export default Cookies;