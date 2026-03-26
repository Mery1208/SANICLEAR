import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from '../supabase/client';
import logoImg from '../assets/img/logo.png';


const Topbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <nav className="topbar">
            <div className="topbar-brand">
                <img src={logoImg} alt="Saniclear" />
            </div>
            <button className="topbar-logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Salir</span>
            </button>
        </nav>
    );
};

export default Topbar;
