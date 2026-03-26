import React from 'react';

interface TarjetaMetricaProps {
    label: string;
    valor: number;
    color: 'rojo' | 'verde' | 'azul' | 'amarillo';
}

const TarjetaMetrica: React.FC<TarjetaMetricaProps> = ({ label, valor, color }) => {
    const colorStyles = {
        rojo: 'border-l-[6px] border-l-red-500 text-red-500',
        verde: 'border-l-[6px] border-l-green-500 text-green-500',
        azul: 'border-l-[6px] border-l-blue-500 text-blue-500',
        amarillo: 'border-l-[6px] border-l-orange-400 text-orange-500'
    };

    return (
        <div className={`py-3 px-5 rounded-[2rem] bg-white border border-slate-300 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 ${colorStyles[color].split(' ')[0]} ${colorStyles[color].split(' ')[1]}`}>
            <span className="text-[15px] font-medium text-slate-700 ml-2">{label}</span>
            <span className={`text-[22px] font-semibold mr-2 ${colorStyles[color].split(' ')[2]}`}>{valor}</span>
        </div>
    );
};

export default TarjetaMetrica;
