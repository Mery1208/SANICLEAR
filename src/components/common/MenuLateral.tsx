import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Users, AlertCircle, Bell, User, HardHat, X } from 'lucide-react';

interface MenuItem {
    id: string;
    label: string;
    ruta: string;
    icon: React.ReactNode;
    badge?: number;
    disabled?: boolean;
}

interface MenuLateralProps {
    items: MenuItem[];
    isOpen?: boolean;
    onClose?: () => void;
}

const MenuLateral: React.FC<MenuLateralProps> = ({ items, isOpen = false, onClose }) => {
    return (
        <>
            <div 
                className={`
                    fixed inset-0 bg-black/50 z-40 lg:hidden
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={onClose}
            />

            <aside className={`
                w-[280px] 
                w-[280px]
                bg-[#92ccf8] border-r border-[#7ab9ee] 
                overflow-y-auto shrink-0 flex flex-col 
                font-sans z-50
                fixed lg:sticky top-0 left-0 
                h-screen 
                fixed inset-y-0 left-0 
                lg:static lg:h-full lg:min-h-[calc(100vh-90px)]
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <button 
                    className="lg:hidden absolute top-3 right-3 p-2 rounded-lg hover:bg-blue-200 transition-colors z-10"
                    onClick={onClose}
                    aria-label="Cerrar menu"
                >
                    <X size={28} />
                </button>

                <nav className="flex flex-col gap-2 mt-14 lg:mt-4 px-4 py-4">
                    {items.map(item => {
                        if (item.disabled) {
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between w-full py-3 px-4 rounded-2xl cursor-not-allowed transition-all duration-200 text-left text-sm font-semibold border shadow-sm bg-slate-100 text-slate-400 border-slate-200 opacity-60"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-400">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 min-w-fit px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-600 border border-amber-200">
                                        <HardHat size={9} />
                                        En proc.
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.id}
                                to={item.ruta}
                                end={item.ruta === '/admin' || item.ruta === '/operario' || item.ruta === '/superadmin'}
                                onClick={onClose}
                                className={({ isActive }) => `
                                    flex items-center justify-between w-full py-3 px-4 rounded-2xl cursor-pointer transition-all duration-200 text-left text-sm font-semibold border shadow-sm
                                    ${isActive 
                                        ? 'bg-[#1b84e7] text-white border-transparent' 
                                        : 'bg-[#f8f9fa] text-slate-700 hover:bg-white border-slate-200'
                                    }
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <span className={isActive ? 'text-white' : 'text-blue-500'}>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </div>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-full text-[10px] font-extrabold shadow-sm
                                                ${item.id === 'notificaciones' || item.id === 'incidencias' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-600'}`}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default MenuLateral;