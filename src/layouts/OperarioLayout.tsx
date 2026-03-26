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
        <div className="flex items-center justify-center min-h-screen bg-slate-200 p-4 font-inherit">
            <div className="w-[98vw] max-w-[1400px] h-[95vh] bg-[#f4f6f9] border border-slate-300 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
                <BarraSuperior />
                <div className="flex flex-1 overflow-hidden">
                    <MenuLateral
                        items={menuOperario}
                        rutaActiva={rutaActiva}
                        onItemClick={handleMenuClick}
                    />
                    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default OperarioLayout;
