import React from 'react';

const Terminos: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-[#1e3a5f] dark:text-blue-400 mb-6 transition-colors">Términos y Condiciones</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm space-y-4 transition-colors">
        <p className="text-gray-600 dark:text-slate-300">
          <strong>Última actualización:</strong> 21 de Abril de 2026
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">1. Aceptación de Términos</h2>
        <p className="text-gray-600 dark:text-slate-300">
          Al acceder y utilizar Saniclear, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo, no utilices la aplicación.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">2. Uso del Servicio</h2>
        <ul className="list-disc pl-5 text-gray-600 dark:text-slate-300 space-y-2">
          <li>El servicio está destinado exclusivamente a la gestión de limpieza hospitalaria</li>
          <li>Debes proporcionar información veraz y actualizada</li>
          <li>Eres responsable de mantener la confidencialidad de tu cuenta</li>
          <li>El uso indebido puede resultar en suspensión o cancelación</li>
        </ul>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">3. Responsabilidades del Usuario</h2>
        <p className="text-gray-600 dark:text-slate-300">
          Los usuarios se comprometen a utilizar la plataforma de manera profesional, reportar incidencias de forma veraz y cumplir con los protocolos de higiene establecidos por su entidad.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">4. Limitación de Responsabilidad</h2>
        <p className="text-gray-600 dark:text-slate-300">
          Saniclear no se hace responsable de decisiones tomadas basadas en la información proporcionada por la aplicación. Los administradores son responsables de supervisar y validar las tareas.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">5. Propiedad Intelectual</h2>
        <p className="text-gray-600 dark:text-slate-300">
          Todos los derechos de propiedad intelectual de Saniclear y su contenido son propiedad de la empresa desarrolladora.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">6. Modificaciones</h2>
        <p className="text-gray-600 dark:text-slate-300">
          Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado constituye aceptación de los cambios.
        </p>
      </div>
    </div>
  );
};

export default Terminos;