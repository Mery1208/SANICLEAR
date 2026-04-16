import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ClipboardList, Bell, AlertCircle, User } from 'lucide-react';
import BarraSuperior from '../components/common/BarraSuperior';
import MenuLateral from '../components/common/MenuLateral';
import { useDataStore } from '../store/dataStore';

const OperarioLayout: React.FC = () => {
    const { fetchCounts, setupRealtime } = useDataStore();

    useEffect(() => {
        fetchCounts();
        const cleanup = setupRealtime();
        return cleanup;
    }, []);

    const menuOperario = [
        { id: 'tareas', label: 'Mis Tareas', ruta: '/operario', icon: <ClipboardList size={18} /> },
        { id: 'notificaciones', label: 'Notificaciones', ruta: '/operario/notificaciones', icon: <Bell size={18} /> },
        { id: 'incidencias', label: 'Reportar Incidencia', ruta: '/operario/incidencias', icon: <AlertCircle size={18} />, disabled: true },
        { id: 'perfil', label: 'Mi Perfil', ruta: '/operario/perfil', icon: <User size={18} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f4f6f9] font-inherit overflow-hidden">
            <BarraSuperior />
            <div className="flex flex-1 overflow-hidden">
                <MenuLateral items={menuOperario} />
                <main className="flex-1 p-6 md:p-10 overflow-y-auto font-sans">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default OperarioLayout;
