import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, AlertTriangle, CheckCircle2, Activity, Plus } from 'lucide-react';
import { supabase } from '../supabase/client';
import logoImg from '../assets/img/logo.png';
import '../css/DashboardAdmin.css';

interface Tarea {
    id: number;
    zona: string;
    tarea: string;
    asignado: string;
    estado: 'Hecho' | 'En Curso' | 'Pendiente';
    prioridad: 'Alta' | 'Media' | 'Baja';
}

const tareasAdmin: Tarea[] = [
    { id: 1, zona: 'Quirófano 1', tarea: 'Desinfección', asignado: 'Juan P.', estado: 'Hecho', prioridad: 'Alta' },
    { id: 2, zona: 'Pasillo B', tarea: 'Suelos', asignado: 'Ana G.', estado: 'En Curso', prioridad: 'Media' },
    { id: 3, zona: 'Habitación 204', tarea: 'Limpieza general', asignado: 'Carlos M.', estado: 'Pendiente', prioridad: 'Alta' },
    { id: 4, zona: 'UCI - Sala 3', tarea: 'Desinfección profunda', asignado: 'María L.', estado: 'Hecho', prioridad: 'Alta' },
    { id: 5, zona: 'Sala de espera', tarea: 'Limpieza general', asignado: 'Pedro S.', estado: 'En Curso', prioridad: 'Baja' },
];

export default function DashboardAdmin(): React.JSX.Element {
    const [tareas] = useState<Tarea[]>(tareasAdmin);
    const navigate = useNavigate();

    const pendientes = tareas.filter(t => t.estado === 'Pendiente').length;
    const enCurso = tareas.filter(t => t.estado === 'En Curso').length;
    const completadas = tareas.filter(t => t.estado === 'Hecho').length;
    const alertas = tareas.filter(t => t.prioridad === 'Alta' && t.estado === 'Pendiente').length;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="admin-layout">
            {/* Navbar */}
            <nav className="admin-navbar">
                <div className="admin-navbar-brand">
                    <img src={logoImg} alt="Saniclear" />
                    <span>SANICLEAR</span>
                </div>
                <div className="admin-navbar-right">
                    <span className="admin-navbar-user">Hola, Admin</span>
                    <button className="admin-navbar-logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Salir</span>
                    </button>
                </div>
            </nav>

            {/* Contenido */}
            <main className="admin-main">
                {/* Stats */}
                <div className="admin-stats">
                    <div className="admin-stat-card">
                        <div className="admin-stat-info">
                            <span className="admin-stat-label">Tareas Pendientes</span>
                            <span className="admin-stat-number text-primary">{pendientes}</span>
                        </div>
                        <Clock size={28} className="admin-stat-icon icon-primary" />
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-info">
                            <span className="admin-stat-label">Alertas Críticas</span>
                            <span className="admin-stat-number text-warning">{alertas}</span>
                        </div>
                        <AlertTriangle size={28} className="admin-stat-icon icon-warning" />
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-info">
                            <span className="admin-stat-label">Completadas Hoy</span>
                            <span className="admin-stat-number text-success">{completadas}</span>
                        </div>
                        <CheckCircle2 size={28} className="admin-stat-icon icon-success" />
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-info">
                            <span className="admin-stat-label">En Curso</span>
                            <span className="admin-stat-number text-info">{enCurso}</span>
                        </div>
                        <Activity size={28} className="admin-stat-icon icon-info" />
                    </div>
                </div>

                {/* Tabla */}
                <div className="admin-panel">
                    <div className="admin-panel-header">
                        <h2>Panel de Control de Zonas</h2>
                        <button className="admin-btn-new">
                            <Plus size={18} />
                            Nueva Tarea
                        </button>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Zona</th>
                                    <th>Tarea</th>
                                    <th>Asignado a</th>
                                    <th>Estado</th>
                                    <th>Prioridad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tareas.map(tarea => (
                                    <tr key={tarea.id}>
                                        <td className="td-zona">{tarea.zona}</td>
                                        <td>{tarea.tarea}</td>
                                        <td>{tarea.asignado}</td>
                                        <td>
                                            <span className={`admin-badge estado-${tarea.estado.toLowerCase().replace(' ', '-')}`}>
                                                {tarea.estado === 'Hecho' && <CheckCircle2 size={14} />}
                                                {tarea.estado === 'En Curso' && <Clock size={14} />}
                                                {tarea.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`admin-priority priority-${tarea.prioridad.toLowerCase()}`}>
                                                {tarea.prioridad}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
