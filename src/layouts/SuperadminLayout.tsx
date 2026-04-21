import React, { useEffect, useState, useCallback } from 'react';
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
import AppFooter from '../components/common/AppFooter';
import { useDataStore } from '../store/dataStore';

const SuperadminLayout: React.FC = () => {
    const { fetchCounts, setupRealtime } = useDataStore();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        fetchCounts();
        const cleanup = setupRealtime();
        return cleanup;
    }, []);

    useEffect(() => {
        const handleToggle = () => setMenuOpen(prev => !prev);
        const handleClose = () => setMenuOpen(false);
        window.addEventListener('toggle-mobile-menu', handleToggle);
        window.addEventListener('close-mobile-menu', handleClose);
        return () => {
            window.removeEventListener('toggle-mobile-menu', handleToggle);
            window.removeEventListener('close-mobile-menu', handleClose);
        };
    }, []);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    const menuSuperadmin = [
        { id: 'panel', label: 'Resumen Global', ruta: '/superadmin', icon: <LayoutDashboard size={18} /> },
        { id: 'entidades', label: 'Control Entidades', ruta: '/superadmin/entidades', icon: <Users size={18} /> },
        { id: 'notificaciones', label: 'Notificaciones', ruta: '/superadmin/notificaciones', icon: <Bell size={18} /> },
        { id: 'perfil', label: 'Mi Perfil', ruta: '/superadmin/perfil', icon: <User size={18} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f4f6f9] font-inherit">
            <MenuLateral items={menuSuperadmin} isOpen={menuOpen} onClose={closeMenu} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <BarraSuperior />
                <div className="flex-1 p-3 md:p-6 lg:p-10 overflow-y-auto font-sans">
                    <Outlet />
                </div>
                <AppFooter />
            </main>
        </div>
    );
};

export default SuperadminLayout;
