import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    AlertCircle,
    Bell,
    User,
    Map
} from 'lucide-react';
import BarraSuperior from '../components/common/BarraSuperior';
import MenuLateral from '../components/common/MenuLateral';
import { useDataStore } from '../store/dataStore';

const SuperadminLayout: React.FC = () => {
    const { fetchCounts, setupRealtime } = useDataStore();

    useEffect(() => {
        fetchCounts();
        const cleanup = setupRealtime();
        return cleanup;
    }, []);

    const menuSuperadmin = [
        { id: 'panel', label: 'Resumen Global', ruta: '/superadmin', icon: <LayoutDashboard size={18} /> },
        { id: 'entidades', label: 'Control Entidades', ruta: '/superadmin/entidades', icon: <Users size={18} /> },
        { id: 'notificaciones', label: 'Notificaciones', ruta: '/superadmin/notificaciones', icon: <Bell size={18} /> },
        { id: 'perfil', label: 'Mi Perfil', ruta: '/superadmin/perfil', icon: <User size={18} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f4f6f9] font-inherit overflow-hidden">
            <BarraSuperior />
            <div className="flex flex-1 overflow-hidden">
                <MenuLateral items={menuSuperadmin} />
                <main className="flex-1 p-6 md:p-10 overflow-y-auto font-sans">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperadminLayout;
