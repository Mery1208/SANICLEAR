import React from 'react';

interface ContadorTareasProps {
    completadas: number;
    total: number;
}

const ContadorTareas: React.FC<ContadorTareasProps> = ({ completadas, total }) => {
    return (
        <div className="bg-white py-4 px-10 rounded-3xl border border-slate-300 shadow-sm flex flex-col items-center max-w-[300px] mx-auto w-full mt-6">
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-[32px] font-bold text-[#16a34a] leading-none mb-1">{completadas}</span>
                    <span className="text-[13px] font-medium text-slate-700">Completadas</span>
                </div>
                
                <span className="text-[40px] font-light text-slate-400 -mt-4">/</span>
                
                <div className="flex flex-col items-center">
                    <span className="text-[32px] font-bold text-slate-700 leading-none mb-1">{total}</span>
                    <span className="text-[13px] font-medium text-slate-700">Total</span>
                </div>
            </div>
        </div>
    );
};

export default ContadorTareas;
