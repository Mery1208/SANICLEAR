import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Users, AlertCircle, Bell, User, ClipboardList, HardHat } from 'lucide-react';

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
}

const MenuLateral: React.FC<MenuLateralProps> = ({ items }) => {
    return (
        <aside className="w-[260px] bg-[#92cbf8] border-r border-[#7ab9ee] overflow-y-auto shrink-0 flex flex-col py-6 px-4">
            <nav className="flex flex-col gap-3">
                {items.map(item => {
                    if (item.disabled) {
                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between w-full py-3 px-5 rounded-3xl cursor-not-allowed transition-all duration-200 text-left font-inherit text-[15px] font-semibold border shadow-sm bg-slate-100 text-slate-400 border-slate-200 opacity-60"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-400">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                                <span className="inline-flex items-center gap-1 min-w-fit px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-600 border border-amber-200">
                                    <HardHat size={10} />
                                    En proceso
                                </span>
                            </div>
                        );
                    }

                    return (
                        <NavLink
                            key={item.id}
                            to={item.ruta}
                            end={item.ruta === '/admin' || item.ruta === '/operario'}
                            className={({ isActive }) => `
                                flex items-center justify-between w-full py-3 px-5 rounded-3xl cursor-pointer transition-all duration-200 text-left font-inherit text-[15px] font-semibold border shadow-sm
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
                                        <span className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[10px] font-extrabold shadow-sm
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
    );
};

export default MenuLateral;
