import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BarraSuperior from '../components/common/BarraSuperior';
import MenuLateral from '../components/common/MenuLateral';

const menuOperario = [
    { id: 'tareas', label: 'Mis Tareas', ruta: '/operario' },
    { id: 'notificaciones', label: 'Notificaciones', ruta: '/operario/notificaciones', badge: 3 },
    { id: 'incidencias', label: 'Reportar Incidencia', ruta: '/operario/incidencias' },
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
        <div className="min-h-screen flex flex-col bg-[#f4f6f9] font-inherit overflow-hidden">
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
    );
};

export default OperarioLayout;
