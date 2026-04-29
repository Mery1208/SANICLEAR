import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Users, AlertCircle, Bell, User, HardHat, X, Lock, BrainCircuit } from 'lucide-react';
import Modal from './Modal';
import Button from '../Button';

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
    const handleCloseClick = () => {
        if (onClose) onClose();
    };
    
    const [showProximamente, setShowProximamente] = useState(false);
    
    return (
        <>
            <div 
                className={`
                    fixed inset-0 bg-black/50 z-40 
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={handleCloseClick}
            />

            <aside className={`
                w-[280px] 
                bg-[#92ccf8] border-r border-[#7ab9ee] 
                overflow-y-auto shrink-0 flex flex-col 
                font-sans z-50
                fixed lg:fixed
                top-[70px] lg:top-[90px]
                left-0 
                bottom-0
                h-screen
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Botón cerrar alineado arriba con la barra superior */}
                <button 
                    className="absolute top-3 right-3 p-2 rounded-lg hover:bg-blue-200 transition-colors z-50 bg-white"
                    onClick={handleCloseClick}
                    aria-label="Cerrar menu"
                >
                    <X size={24} className="text-slate-600" />
                </button>

                <nav className="flex flex-col gap-2 mt-[70px] lg:mt-[90px] px-4 py-4">
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

                    <button
                        onClick={() => setShowProximamente(true)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100 w-full mt-2 shadow-sm text-sm"
                    >
                        <Lock size={20} />
                        <span>Próximamente</span>
                    </button>
                </nav>
            </aside>

            {showProximamente && (
                <Modal title="EN CONSTRUCCIÓN" onClose={() => setShowProximamente(false)}>
                    <div className="flex flex-col items-center text-center gap-4 py-2 max-w-sm mx-auto">
                        <div className="flex gap-4 mb-2">
                            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
                                <Map size={28} />
                            </div>
                            <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center border border-purple-100 shadow-sm">
                                <BrainCircuit size={28} />
                            </div>
                        </div>
                        
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                            Futuros Proyectos
                        </h3>
                        
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            Esta sección se encuentra actualmente en desarrollo. <br/><br/>
                            En el futuro, integraremos aquí un <strong className="text-gray-800">Mapa Interactivo</strong> en tiempo real de las instalaciones y el nuevo módulo de <strong className="text-purple-600">Predicciones Avanzadas con IA</strong>.
                        </p>
                        
                        <div className="w-full mt-6">
                            <Button 
                                text="Entendido, volver al menú" 
                                onClick={() => setShowProximamente(false)} 
                                variant="primary" 
                                className="w-full py-3 shadow-lg shadow-blue-100" 
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default MenuLateral;