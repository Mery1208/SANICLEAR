import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from '../supabase/client';
import logoImg from '../assets/img/logo.png';
import { useAuth } from '../context/AuthContext';


const Topbar: React.FC = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <nav className="topbar">
            <div className="topbar-brand flex items-center gap-3">
                <img src={logoImg} alt="Saniclear" className="dark:brightness-0 dark:invert transition-all" />
                {usuario?.rol !== 'superadmin' && usuario?.entidad && (
                    <div className="flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs md:text-sm font-semibold border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                        🏥 {usuario.entidad}
                    </div>
                )}
            </div>
            <button className="topbar-logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Salir</span>
            </button>
        </nav>
    );
};

export default Topbar;
