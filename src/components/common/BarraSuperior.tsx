import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/img/logo.png';
import ThemeToggle from '../../components/ThemeToggle';

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
        <nav className="w-full h-[56px] sm:h-[64px] md:h-[72px] flex items-center justify-between px-1 sm:px-3 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 font-sans overflow-hidden transition-colors">
            {/* Logo y Título */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 w-auto shrink-0">
                <button 
                    onClick={handleMenuClick}
                    className="p-1 sm:p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                    aria-label="Abrir menú"
                >
                    <Menu size={20} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                <div className="cursor-pointer shrink-0 max-w-[70px] sm:max-w-[100px] md:max-w-[130px]" onClick={() => navigate('/')}>
                    <img src={logoImg} alt="Saniclears" className="w-auto max-h-[42px] sm:max-h-[52px] md:max-h-[56px] object-contain dark:brightness-0 dark:invert transition-all" />
                </div>
            </div>

             {/* Perfil y Botón Salir */}
             <div className="flex items-center gap-1 sm:gap-2 md:gap-4 justify-end shrink-0">
                  {/* Burbuja de Perfil Global */}
                  <div 
                      onClick={() => navigate(isSuper ? '/superadmin/perfil' : rol === 'admin' ? '/admin/perfil' : '/operario/perfil')}
                      className="flex items-center gap-1 sm:gap-2 md:gap-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl md:rounded-2xl py-1 pl-1.5 sm:py-1.5 sm:pl-2 md:py-2 md:pl-2.5 pr-1 sm:pr-2 md:pr-4 shadow-sm cursor-pointer transition-all shrink-0 max-w-[140px] sm:max-w-[180px] md:max-w-none"
                      title="Ir a Mi Perfil"
                  >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0 text-[8px] sm:text-[9px] md:text-sm flex-shrink-0 overflow-hidden">
                          {usuario?.avatar_url ? (
                              <img src={usuario.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                              <>{nombreMostrar.charAt(0).toUpperCase()}{apellidosMostrar ? apellidosMostrar.charAt(0).toUpperCase() : ''}</>
                          )}
                      </div>
                       <div className="flex flex-col text-left min-w-0">
                           <p className="text-[9px] sm:text-[10px] md:text-sm font-bold text-slate-700 dark:text-slate-200 leading-none truncate">{nombreMostrar} {apellidosMostrar}</p>
                           <p className="text-[6px] sm:text-[7px] md:text-[8px] font-black text-blue-500 uppercase tracking-wider mt-0.5 truncate">{rol}</p>
                           {usuario?.entidades?.nombre_hospital && (
                             <p className="text-[6px] sm:text-[7px] md:text-[8px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                               {usuario.entidades.nombre_hospital}
                             </p>
                           )}
                       </div>
                  </div>
                  <ThemeToggle />
                  <button
                      className="flex items-center justify-center gap-1 bg-[#e2e8f0] dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 cursor-pointer text-[10px] sm:text-xs md:text-[15px] font-semibold py-1.5 px-1.5 sm:py-2 sm:px-2.5 md:py-2.5 md:px-4 rounded-lg transition-all duration-200 hover:bg-slate-300 dark:hover:bg-slate-700 shrink-0"
                      onClick={handleLogout}
                  >
                      <LogOut size={13} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" />
                      <span className="hidden sm:inline whitespace-nowrap">Salir</span>
                  </button>
              </div>
        </nav>
    );
};

export default BarraSuperior;
