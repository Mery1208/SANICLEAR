import React from 'react';
import { Construction } from 'lucide-react';

const EnConstruccion: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center">
            <div className="max-w-md w-full flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-400 rounded-full flex items-center justify-center mb-4 transition-colors">
                    <Construction size={32} />
                </div>
                
                <h1 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-wide mb-2 transition-colors">Aún No Implementado</h1>
                
                <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors">
                    Esta sección está vacía. Se implementará en futuras iteraciones.
                </p>
            </div>
        </div>
    );
};

export default EnConstruccion;
