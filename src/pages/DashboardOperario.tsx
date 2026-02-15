import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase/client';
import logoImg from '../assets/img/logo.png';
import '../css/DashboardOperario.css';

interface Tarea {
    id: number;
    zona: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    completada: boolean;
}

const tareasIniciales: Tarea[] = [
    { id: 1, zona: 'Habitación 204', descripcion: 'Limpieza general y baño', prioridad: 'Alta', completada: false },
    { id: 2, zona: 'UCI - Sala 3', descripcion: 'Desinfección profunda', prioridad: 'Alta', completada: false },
    { id: 3, zona: 'Pasillo B - Planta 2', descripcion: 'Limpieza de suelos y desinfección', prioridad: 'Media', completada: false },
    { id: 4, zona: 'Consulta 12', descripcion: 'Limpieza general', prioridad: 'Media', completada: false },
    { id: 5, zona: 'Sala de Espera', descripcion: 'Limpieza de mobiliario y ventanas', prioridad: 'Baja', completada: false },
];

const prioridadOrden: Record<string, number> = { Alta: 0, Media: 1, Baja: 2 };

export default function DashboardOperario(): React.JSX.Element {
    const [tareas, setTareas] = useState<Tarea[]>(tareasIniciales);
    const navigate = useNavigate();

    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = tareas.filter(t => !t.completada).length;

    const tareasOrdenadas = [...tareas].sort((a, b) => {
        if (a.completada !== b.completada) return a.completada ? 1 : -1;
        return prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
    });

    const toggleTarea = (id: number) => {
        setTareas(prev =>
            prev.map(t => t.id === id ? { ...t, completada: !t.completada } : t)
        );
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="op-layout">
            {/* Navbar */}
            <nav className="op-navbar">
                <div className="op-navbar-brand">
                    <img src={logoImg} alt="Saniclear" />
                    <span>SANICLEAR</span>
                </div>
                <button className="op-navbar-logout" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Salir</span>
                </button>
            </nav>

            {/* Contenido */}
            <main className="op-main">
                <div className="op-greeting">
                    <h1>Hola, Juan</h1>
                    <p>Tienes <strong>{pendientes}</strong> tareas pendientes</p>
                </div>

                <div className="op-counter">
                    <CheckCircle2 size={20} />
                    <span>{completadas} / {tareas.length} completadas</span>
                    <div className="op-progress-bar">
                        <div
                            className="op-progress-fill"
                            style={{ width: `${(completadas / tareas.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="op-tasks">
                    {tareasOrdenadas.map(tarea => (
                        <div
                            key={tarea.id}
                            className={`op-task-card ${tarea.completada ? 'completed' : ''}`}
                            onClick={() => toggleTarea(tarea.id)}
                        >
                            <div className="op-task-info">
                                <h3 className={tarea.completada ? 'task-done' : ''}>{tarea.zona}</h3>
                                <p className={tarea.completada ? 'task-done' : ''}>{tarea.descripcion}</p>
                                <span className={`op-priority priority-${tarea.prioridad.toLowerCase()}`}>
                                    Prioridad {tarea.prioridad}
                                </span>
                            </div>
                            <div className={`op-check ${tarea.completada ? 'checked' : ''}`}>
                                {tarea.completada && <CheckCircle2 size={28} />}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
