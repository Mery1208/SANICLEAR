import React from 'react';
import { Check } from 'lucide-react';

interface TarjetaTareaProps {
    zona: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    completada: boolean;
    onCompletar: () => void;
}

const TarjetaTarea: React.FC<TarjetaTareaProps> = ({ zona, descripcion, prioridad, completada, onCompletar }) => {
    const prioridadStyles = {
        Alta: 'bg-red-100 text-red-500 border-red-200',
        Media: 'bg-orange-100 text-orange-500 border-orange-200',
        Baja: 'bg-blue-100 text-blue-500 border-blue-200'
    };

    return (
        <div 
            className={`flex items-center justify-between p-5 rounded-3xl border transition-all duration-300
                ${completada 
                    ? 'bg-transparent border-green-400' 
                    : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
        >
            <div className="flex flex-col items-start gap-1.5">
                <h3 className={`text-[17px] font-medium m-0 transition-colors ${completada ? 'line-through text-green-500' : 'text-slate-700'}`}>
                    {zona}
                </h3>
                
                <p className={`text-[13px] m-0 transition-colors ${completada ? 'line-through text-green-400' : 'text-slate-500'}`}>
                    {descripcion}
                </p>

                {!completada && (
                    <span className={`mt-1 text-[13px] font-medium py-1 px-3.5 rounded-full border ${prioridadStyles[prioridad]}`}>
                        Prioridad {prioridad}
                    </span>
                )}
            </div>
            
            <button
                className={`flex items-center justify-center gap-1.5 py-2.5 px-5 rounded-3xl font-medium text-[14px] transition-all duration-200 cursor-pointer
                    ${completada 
                        ? 'bg-green-100/50 text-green-500 border border-green-200' 
                        : 'bg-[#22c55e] text-white border-transparent hover:bg-green-600 shadow-sm'
                    }`}
                onClick={onCompletar}
            >
                <Check size={18} />
                <span>{completada ? 'Completada' : 'Completar'}</span>
            </button>
        </div>
    );
};

export default TarjetaTarea;
