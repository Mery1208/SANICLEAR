import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BarraSuperior from '../components/common/BarraSuperior';
import MenuLateral from '../components/common/MenuLateral';

const menuAdmin = [
    { id: 'panel', label: 'Panel Principal', ruta: '/admin' },
    { id: 'zonas_usuarios', label: 'Zonas y Usuarios', ruta: '/admin/zonas' },
    { id: 'incidencias', label: 'Incidencias', ruta: '/admin/incidencias', badge: 3 },
    { id: 'notificaciones', label: 'Notificaciones', ruta: '/admin/notificaciones', badge: 3 },
    { id: 'perfil', label: 'Mi Perfil', ruta: '/admin/perfil' },
];

const AdminLayout: React.FC = () => {
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
                    items={menuAdmin}
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

export default AdminLayout;
