import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BarraSuperior from '../components/common/BarraSuperior';
import MenuLateral from '../components/common/MenuLateral';

const menuAdmin = [
    { id: 'panel', label: 'Panel Principal', ruta: '/admin' },
    { id: 'zonas', label: 'Gestión de Zonas', ruta: '/admin/zonas' },
    { id: 'usuarios', label: 'Usuarios y Roles', ruta: '/admin/usuarios' },
    { id: 'incidencias', label: 'Incidencias', ruta: '/admin/incidencias', badge: 2 },
    { id: 'notificaciones', label: 'Notificaciones', ruta: '/admin/notificaciones' },
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
        <div className="min-h-screen bg-[#f3f4f6] font-inherit text-slate-800">
            <BarraSuperior />
            
            <MenuLateral
                items={menuAdmin}
                rutaActiva={rutaActiva}
                onItemClick={handleMenuClick}
            />
            
            <main className="pt-[70px] md:pl-[250px] min-h-screen transition-all duration-300">
                <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
