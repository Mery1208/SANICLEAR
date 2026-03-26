import React from 'react';

interface ContadorTareasProps {
    completadas: number;
    total: number;
}

const ContadorTareas: React.FC<ContadorTareasProps> = ({ completadas, total }) => {
    const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);
    
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center max-w-sm mx-auto w-full">
            <h3 className="text-slate-500 font-semibold mb-3 text-sm uppercase tracking-wide">Progreso del Turno</h3>
            <div className="flex items-end gap-1 mb-3">
                <span className="text-5xl font-extrabold text-[#16a34a]">{completadas}</span>
                <span className="text-3xl text-slate-300 font-light mx-2 pb-1">/</span>
                <span className="text-4xl font-bold text-slate-700 pb-0.5">{total}</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                <div 
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${porcentaje}%` }}
                ></div>
            </div>
            
            <p className="text-sm font-medium text-slate-500 m-0">
                Has completado el {porcentaje}% de las tareas asignadas
            </p>
        </div>
    );
};

export default ContadorTareas;
