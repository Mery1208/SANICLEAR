import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BarraSuperior from '../components/common/BarraSuperior';
import MenuLateral from '../components/common/MenuLateral';

const menuOperario = [
    { id: 'tareas', label: 'Mis Tareas', ruta: '/operario' },
    { id: 'notificaciones', label: 'Notificaciones', ruta: '/operario/notificaciones', badge: 3 },
    { id: 'incidencias', label: 'Reportar Incidencia', ruta: '/operario/incidencias/reportar' },
    { id: 'perfil', label: 'Mi Perfil', ruta: '/operario/perfil' },
];

const OperarioLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const rutaActiva = location.pathname;

    const handleMenuClick = (ruta: string) => {
        navigate(ruta);
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-inherit text-slate-800">
            <BarraSuperior />
            
            <MenuLateral
                items={menuOperario}
                rutaActiva={rutaActiva}
                onItemClick={handleMenuClick}
            />
            
            {/* Contenido principal desplazado por el nav fijo y sidebar fijo */}
            <main className="pt-[70px] md:pl-[250px] min-h-screen transition-all duration-300">
                <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default OperarioLayout;
