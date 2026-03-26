import React from 'react';
import { HardHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnConstruccion: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-100 p-8 text-center font-inherit">
            <div className="bg-white p-10 rounded-3xl shadow-md border-2 border-slate-300 max-w-lg w-full flex flex-col items-center">
                <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <HardHat size={48} />
                </div>
                
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Sección en Construcción</h1>
                
                <p className="text-lg text-slate-600 mb-8 max-w-md">
                    Estamos trabajando duro para tener esta funcionalidad disponible pronto. 
                    Por favor, vuelve más tarde o regresa al inicio.
                </p>

                <button 
                    onClick={() => navigate(-1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all duration-200 border-none cursor-pointer text-lg font-inherit"
                >
                    Volver atrás
                </button>
            </div>
        </div>
    );
};

export default EnConstruccion;
