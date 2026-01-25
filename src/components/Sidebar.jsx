import React from 'react';
import { LayoutDashboard, Users, ClipboardList, LogOut, UserCircle } from 'lucide-react';
import '../css/Dashboard.css';

export default function Sidebar({ onOpenProfile }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2> SANICLEAR</h2>
        <span className="badge-admin">Admin</span>
      </div>
      
      <nav className="sidebar-nav">
        <a href="#" className="nav-item active">
          <LayoutDashboard size={20} /> Panel Principal
        </a>
        <a href="#" className="nav-item">
          <Users size={20} /> Personal
        </a>
        <a href="#" className="nav-item">
          <ClipboardList size={20} /> Zonas y Tareas
        </a>
        
        <button onClick={onOpenProfile} className="nav-item btn-profile-link">
          <UserCircle size={20} /> Mi Perfil
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-logout">
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}