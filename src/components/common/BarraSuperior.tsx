import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/img/logo.png';

const BarraSuperior: React.FC = () => {
    const { logout, usuario, rol } = useAuth();
    const navigate = useNavigate();

    const isSuper = rol?.toLowerCase() === 'superadmin';
    const nombreMostrar = usuario?.nombre?.trim() || (isSuper ? 'Super' : 'Usuario');
    const apellidosMostrar = usuario?.apellidos?.trim() || (isSuper ? 'Admin' : '');

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleMenuClick = () => {
        window.dispatchEvent(new CustomEvent('toggle-mobile-menu'));
    };
    
    const handleCloseClick = () => {
        window.dispatchEvent(new CustomEvent('close-mobile-menu'));
    };

    return (
        <nav className="w-full h-[70px] sm:h-[90px] flex items-center justify-between px-3 sm:px-6 bg-white border-b border-slate-200 shrink-0 font-sans overflow-hidden">
            {/* Logo y Título */}
            <div className="flex items-center gap-1 sm:gap-3 w-auto sm:w-[300px] shrink-1 sm:shrink-0">
                <button 
                    onClick={handleMenuClick}
                    className="p-1.5 sm:p-2 -ml-1 sm:-ml-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                    aria-label="Abrir menú"
                >
                    <Menu size={24} className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
                <div className="cursor-pointer shrink-0" onClick={() => navigate('/')}>
                    <img src={logoImg} alt="Saniclears" className="h-[45px] sm:h-[90px] w-auto object-contain" />
                </div>
            </div>

            {/* Perfil y Botón Salir */}
            <div className="flex items-center gap-2 sm:gap-5 justify-end shrink-0">
                {/* Burbuja de Perfil Global */}
                <div 
                    onClick={() => navigate(isSuper ? '/superadmin/perfil' : rol === 'admin' ? '/admin/perfil' : '/operario/perfil')}
                    className="flex items-center gap-2 sm:gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl sm:rounded-2xl py-1.5 sm:py-2 pl-2 sm:pl-2.5 pr-2 sm:pr-4 shadow-sm cursor-pointer transition-all max-w-[180px] sm:max-w-none"
                    title="Ir a Mi Perfil"
                >
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0 text-[10px] sm:text-sm">
                        {nombreMostrar.charAt(0).toUpperCase()}{apellidosMostrar ? apellidosMostrar.charAt(0).toUpperCase() : ''}
                    </div>
                    <div className="flex flex-col text-left">
                        <p className="text-xs sm:text-[14px] font-bold text-slate-700 leading-none truncate max-w-[70px] sm:max-w-[120px] lg:max-w-none">{nombreMostrar} {apellidosMostrar}</p>
                        <p className="text-[8px] sm:text-[10px] font-black text-blue-500 uppercase tracking-wider mt-0.5 sm:mt-1">{rol}</p>
                    </div>
                </div>

                <button
                    className="flex items-center justify-center gap-1 sm:gap-2 bg-[#e2e8f0] border-none text-slate-700 cursor-pointer text-sm sm:text-[15px] font-semibold py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl transition-all duration-200 hover:bg-slate-300"
                    onClick={handleLogout}
                >
                    <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Salir</span>
                </button>
            </div>
        </nav>
    );
};

export default BarraSuperior;
