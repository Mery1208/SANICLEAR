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
        <aside className="fixed left-0 top-[70px] bottom-0 w-[250px] bg-white border-r border-slate-200 overflow-y-auto z-40 hidden md:block">
            <nav className="flex flex-col gap-1.5 p-4">
                {items.map(item => {
                    const isActivo = rutaActiva.startsWith(item.ruta);
                    return (
                        <button
                            key={item.id}
                            className={`flex items-center justify-between w-full py-2.5 px-4 rounded-lg cursor-pointer transition-colors duration-200 text-left font-inherit text-sm font-medium
                                ${isActivo 
                                    ? 'bg-blue-50 text-blue-700' 
                                    : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            onClick={() => onItemClick(item.ruta)}
                        >
                            <span>{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                                <span className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-xs font-bold
                                    ${isActivo ? 'bg-blue-200 text-blue-800' : 'bg-red-500 text-white'}`}
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
