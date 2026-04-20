import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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

    return (
        <nav className="w-full h-[90px] flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0 font-sans">
            {/* Logo y Título */}
            <div className="flex items-center gap-3 w-[300px] shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                <img src={logoImg} alt="Saniclear" className="h-[90px] w-auto object-contain" />
            </div>

            {/* Perfil y Botón Salir */}
            <div className="flex items-center gap-5 justify-end shrink-0">
                {/* Burbuja de Perfil Global */}
                <div 
                    onClick={() => navigate(isSuper ? '/superadmin/perfil' : rol === 'admin' ? '/admin/perfil' : '/operario/perfil')}
                    className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl py-1.5 pl-2.5 pr-4 shadow-sm cursor-pointer transition-all"
                    title="Ir a Mi Perfil"
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0 text-sm">
                        {nombreMostrar.charAt(0).toUpperCase()}{apellidosMostrar ? apellidosMostrar.charAt(0).toUpperCase() : ''}
                    </div>
                    <div className="flex flex-col text-left">
                        <p className="text-[14px] font-bold text-slate-700 leading-none truncate max-w-[120px] sm:max-w-none">{nombreMostrar} {apellidosMostrar}</p>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider mt-1">{rol}</p>
                    </div>
                </div>

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
