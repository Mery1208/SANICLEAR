import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/img/logo.png';

const BarraSuperior: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="w-full h-[80px] flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0">
            {/* Logo y Título */}
            <div className="flex items-center gap-3 w-[220px] shrink-0">
                <img src={logoImg} alt="Saniclear" className="h-[35px] w-auto object-contain" />
                <span className="text-xl font-bold text-[#1e3a5f] tracking-wide">
                    Saniclear
                </span>
            </div>

            {/* Buscador Central */}
            <div className="flex-1 flex justify-center px-4">
                <div className="flex items-center gap-2 bg-[#f0f2f5] rounded-xl py-2.5 px-4 w-full max-w-[500px]">
                    <Search size={18} className="text-slate-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Buscar secciones..."
                        className="border-none outline-none text-[15px] text-slate-700 bg-transparent w-full font-inherit placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Botón Salir */}
            <div className="flex justify-end shrink-0 w-[150px]">
                <button 
                    className="flex items-center justify-center gap-2 bg-[#e2e8f0] border-none text-slate-700 cursor-pointer text-[15px] font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 hover:bg-slate-300" 
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    <span>Salir</span>
                </button>
            </div>
        </nav>
    );
};

export default BarraSuperior;
