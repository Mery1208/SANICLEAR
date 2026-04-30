import React from 'react';
import { LayoutDashboard, Users, ClipboardList, LogOut, UserCircle } from 'lucide-react';


interface SidebarProps {
  onOpenProfile: () => void;
}

export default function Sidebar({ onOpenProfile }: SidebarProps): React.JSX.Element {
  return (
    <aside className="sidebar dark:bg-slate-900 transition-colors">
      <div className="sidebar-header dark:border-slate-800">
        <h2 className="dark:text-white transition-colors"> SANICLEAR</h2>
        <span className="badge-admin">Admin</span>
      </div>

      <nav className="sidebar-nav">
        <a href="#" className="nav-item active dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
          <LayoutDashboard size={20} /> Panel Principal
        </a>
        <a href="#" className="nav-item dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
          <Users size={20} /> Personal
        </a>
        <a href="#" className="nav-item dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
          <ClipboardList size={20} /> Zonas y Tareas
        </a>

        <button onClick={onOpenProfile} className="nav-item btn-profile-link dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
          <UserCircle size={20} /> Mi Perfil
        </button>
      </nav>

      <div className="sidebar-footer dark:border-slate-800">
        <button className="btn-logout dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}