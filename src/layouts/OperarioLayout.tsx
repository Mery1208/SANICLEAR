import React, { useEffect, useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { ClipboardList, Bell, AlertCircle, User } from 'lucide-react';
import BarraSuperior from '../components/common/BarraSuperior';
import MenuLateral from '../components/common/MenuLateral';
import AppFooter from '../components/common/AppFooter';
import { useDataStore } from '../store/dataStore';

const OperarioLayout: React.FC = () => {
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

    const menuOperario = [
        { id: 'tareas', label: 'Mis Tareas', ruta: '/operario', icon: <ClipboardList size={18} /> },
        { id: 'notificaciones', label: 'Notificaciones', ruta: '/operario/notificaciones', icon: <Bell size={18} /> },
        { id: 'incidencias', label: 'Reportar Incidencia', ruta: '/operario/incidencias', icon: <AlertCircle size={18} /> },
        { id: 'perfil', label: 'Mi Perfil', ruta: '/operario/perfil', icon: <User size={18} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f4f6f9] font-inherit">
            <MenuLateral items={menuOperario} isOpen={menuOpen} onClose={closeMenu} />
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

export default OperarioLayout;
