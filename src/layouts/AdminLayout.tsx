import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Map, AlertCircle, Bell, User } from 'lucide-react';
import BarraSuperior from '../components/common/BarraSuperior';
import MenuLateral from '../components/common/MenuLateral';
import { useDataStore } from '../store/dataStore';

const AdminLayout: React.FC = () => {
    const { fetchCounts, setupRealtime } = useDataStore();

    useEffect(() => {
        fetchCounts();
        const cleanup = setupRealtime();
        return cleanup;
    }, []);

    const menuAdmin = [
        { id: 'panel', label: 'Panel Principal', ruta: '/admin', icon: <LayoutDashboard size={18} /> },
        { id: 'zonas', label: 'Gestión Zonas y Usuarios', ruta: '/admin/zonas', icon: <Map size={18} /> },
        { id: 'notificaciones', label: 'Notificaciones', ruta: '/admin/notificaciones', icon: <Bell size={18} /> },
        { id: 'incidencias', label: 'Incidencias', ruta: '/admin/incidencias', icon: <AlertCircle size={18} />, disabled: true },
        { id: 'perfil', label: 'Mi Perfil', ruta: '/admin/perfil', icon: <User size={18} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f4f6f9] font-inherit overflow-hidden">
            <BarraSuperior />
            <div className="flex flex-1 overflow-hidden">
                <MenuLateral items={menuAdmin} />
                <main className="flex-1 p-6 md:p-10 overflow-y-auto font-sans">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
