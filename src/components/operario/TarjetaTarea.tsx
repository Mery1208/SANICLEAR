import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface TarjetaTareaProps {
    zona: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    completada: boolean;
    onCompletar: () => void;
}

const TarjetaTarea: React.FC<TarjetaTareaProps> = ({ zona, descripcion, prioridad, completada, onCompletar }) => {
    const prioridadStyles = {
        Alta: 'bg-red-100 text-red-700 border-red-200',
        Media: 'bg-orange-100 text-orange-700 border-orange-200',
        Baja: 'bg-blue-100 text-blue-700 border-blue-200'
    };

    return (
        <div 
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 shadow-sm
                ${completada 
                    ? 'bg-green-50/50 border-green-400 opacity-80' 
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <h3 className={`text-lg font-bold m-0 transition-colors ${completada ? 'line-through text-green-600' : 'text-[#1e3a5f]'}`}>
                        {zona}
                    </h3>
                    {!completada && (
                        <span className={`text-xs font-bold py-1 px-2.5 rounded-full border ${prioridadStyles[prioridad]}`}>
                            {prioridad}
                        </span>
                    )}
                </div>
                
                <p className={`text-sm m-0 transition-colors ${completada ? 'line-through text-green-500' : 'text-slate-500 font-medium'}`}>
                    {descripcion}
                </p>
            </div>
            
            <button
                className={`flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer border
                    ${completada 
                        ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' 
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                    }`}
                onClick={onCompletar}
            >
                {completada ? (
                    <>
                        <CheckCircle2 size={18} className="text-green-600" />
                        <span className="hidden sm:inline">Completada</span>
                    </>
                ) : (
                    <>
                        <Circle size={18} />
                        <span className="hidden sm:inline">Marcar Válida</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default TarjetaTarea;
