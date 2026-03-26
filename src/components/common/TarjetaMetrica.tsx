import React from 'react';

interface TarjetaMetricaProps {
    label: string;
    valor: number;
    color: 'rojo' | 'verde' | 'azul' | 'amarillo';
}

const TarjetaMetrica: React.FC<TarjetaMetricaProps> = ({ label, valor, color }) => {
    const colorStyles = {
        rojo: 'border-l-[5px] border-l-red-500 text-red-600 bg-red-50/30',
        verde: 'border-l-[5px] border-l-green-500 text-green-600 bg-green-50/30',
        azul: 'border-l-[5px] border-l-blue-500 text-blue-600 bg-blue-50/30',
        amarillo: 'border-l-[5px] border-l-orange-400 text-orange-600 bg-orange-50/30'
    };

    return (
        <div className={`py-4 px-5 rounded-xl border border-slate-200 border-l-[5px] shadow-sm flex flex-col gap-1 transition-transform hover:-translate-y-1 ${colorStyles[color].replace(/border-l-\[5px\] /, '')}`}>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
            <span className="text-3xl font-extrabold">{valor}</span>
        </div>
    );
};

export default TarjetaMetrica;
