import React from 'react';

const Cookies: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-[#1e3a5f] dark:text-blue-400 mb-6 transition-colors">Política de Cookies</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm space-y-4 transition-colors">
        <p className="text-gray-600 dark:text-slate-300">
          <strong>Última actualización:</strong> 21 de Abril de 2026
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">1. ¿Qué son las cookies?</h2>
        <p className="text-gray-600 dark:text-slate-300">
          Una cookie es un pequeño fichero de texto que se almacena en su navegador cuando visita casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">2. Cookies utilizadas en este sitio web</h2>
        <p className="text-gray-600 dark:text-slate-300">
          Siguiendo las directrices de la Agencia Española de Protección de Datos procedemos a detallar el uso de cookies que hace esta web con el fin de informarle con la máxima exactitud posible.
        </p>
        <ul className="list-disc pl-5 text-gray-600 dark:text-slate-300 space-y-2">
          <li>
            <strong>Cookies técnicas:</strong> Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan como, por ejemplo, controlar el tráfico y la comunicación de datos, identificar la sesión, acceder a partes de acceso restringido. Para Saniclears, utilizamos cookies para mantener la sesión del usuario autenticado.
          </li>
          <li>
            <strong>Cookies de análisis:</strong> Son aquellas que bien tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado. Para ello se analiza su navegación en nuestra página web con el fin de mejorar la oferta de productos o servicios que le ofrecemos.
          </li>
        </ul>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">3. Desactivación o eliminación de cookies</h2>
        <p className="text-gray-600 dark:text-slate-300">
          En cualquier momento podrá ejercer su derecho de desactivación o eliminación de cookies de este sitio web. Estas acciones se realizan de forma diferente en función del navegador que esté usando. La mayoría de los navegadores web ofrecen la posibilidad de permitir, bloquear o eliminar las cookies instaladas en su equipo.
        </p>
        
        <h2 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-400 mt-4 transition-colors">4. Contacto</h2>
        <p className="text-gray-600 dark:text-slate-300">
          Si tiene alguna duda sobre esta política de cookies, puede contactar con Saniclears a través de: soporte@saniclear.com
        </p>
      </div>
    </div>
  );
};

export default Cookies;