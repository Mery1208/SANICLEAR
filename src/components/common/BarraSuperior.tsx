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
        <nav className="fixed top-0 left-0 w-full h-[70px] flex items-center justify-between px-6 bg-white border-b border-slate-200 z-50 shadow-sm md:px-8">
            {/* Logo y Título */}
            <div className="flex items-center gap-3 w-[250px] shrink-0">
                <img src={logoImg} alt="Saniclear" className="h-[40px] w-auto object-contain" />
                <span className="text-xl font-bold text-[#1e3a5f] tracking-wide hidden sm:block">
                    Saniclear
                </span>
            </div>

            {/* Buscador Central */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg py-2 px-4 w-full transition-colors focus-within:bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                    <Search size={18} className="text-slate-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Buscar tareas, zonas, usuarios..."
                        className="border-none outline-none text-sm text-slate-700 bg-transparent w-full font-inherit placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Botón Salir */}
            <div className="flex justify-end shrink-0">
                <button 
                    className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
            </div>
        </nav>
    );
};

export default BarraSuperior;
