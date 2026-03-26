import React from 'react';

interface MenuItem {
    id: string;
    label: string;
    ruta: string;
    badge?: number;
}

interface MenuLateralProps {
    items: MenuItem[];
    rutaActiva: string;
    onItemClick: (ruta: string) => void;
}

const MenuLateral: React.FC<MenuLateralProps> = ({ items, rutaActiva, onItemClick }) => {
    return (
        <aside className="w-[240px] bg-[#92cbf8] border-r border-slate-300 overflow-y-auto shrink-0 hidden md:block py-6 px-4">
            <nav className="flex flex-col gap-3">
                {items.map(item => {
                    const isActivo = rutaActiva.startsWith(item.ruta);
                    return (
                        <button
                            key={item.id}
                            className={`flex items-center justify-between w-full py-3.5 px-5 rounded-3xl cursor-pointer transition-all duration-200 text-left font-inherit text-[15px] font-medium shadow-sm border
                                ${isActivo 
                                    ? 'bg-[#1b84e7] text-white border-transparent' 
                                    : 'bg-[#f8f9fa] text-slate-700 hover:bg-white border-slate-200'
                                }`}
                            onClick={() => onItemClick(item.ruta)}
                        >
                            <span>{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                                <span className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold shadow-sm
                                    ${isActivo ? 'bg-white text-[#1b84e7]' : 'bg-red-500 text-white'}`}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>
        </aside>
    );
};

export default MenuLateral;
