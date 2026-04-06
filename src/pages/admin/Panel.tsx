import React, { useState, useEffect } from 'react';
import TarjetaMetrica from '../../components/common/TarjetaMetrica';
import Button from '../../components/Button';
import { Plus, Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const tareasMock = [
    { id: 1, zona: 'Quirófano 1', tarea: 'Desinfección', asignado: 'Juan Gallén', estado: 'Hecho', prioridad: 'Alta' },
    { id: 2, zona: 'Habitación 204', tarea: 'Limpieza General', asignado: 'María Ceballos', estado: 'Pendiente', prioridad: 'Alta' },
    { id: 3, zona: 'UCI - Sala 3', tarea: 'Desinfección Profunda', asignado: 'Evelio Gil', estado: 'Hecho', prioridad: 'Alta' },
    { id: 4, zona: 'Pasillo B', tarea: 'Suelos', asignado: 'Pablo Ambrosio', estado: 'En proceso', prioridad: 'Media' },
    { id: 5, zona: 'Sala de Espera', tarea: 'Limpieza General', asignado: 'Estefanía Gil', estado: 'Fabricándose', prioridad: 'Baja' },
];

import mockIncidencias from '../../mock/incidencias.json';
import mockNotificaciones from '../../mock/notificaciones.json';

const Panel: React.FC = () => {
    const [stats, setStats] = useState({
        pendientes: tareasMock.filter(t => t.estado === 'Pendiente').length,
        alertas: mockIncidencias.filter(i => i.prioridad === 'alta' || i.prioridad === 'critica').length,
        completadas: tareasMock.filter(t => t.estado === 'Hecho').length,
        enCurso: tareasMock.filter(t => t.estado === 'En proceso' || t.estado === 'Fabricándose').length,
    });

    const [chartData, setChartData] = useState([
        { mes: 'sep', alertas: 4, resueltas: 2 },
        { mes: 'oct', alertas: 6, resueltas: 5 },
        { mes: 'nov', alertas: 10, resueltas: 9 },
        { mes: 'dic', alertas: 3, resueltas: 3 },
        { mes: 'ene', alertas: 5, resueltas: 4 },
        { mes: 'feb', alertas: 8, resueltas: 2 },
    ]);

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Panel de control</h1>
            <p className="text-sm text-slate-500 mb-8 font-semibold italic">
                Información en tiempo real: hoy se han completado {stats.completadas} tareas
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <TarjetaMetrica label="Tareas Pendientes" valor={stats.pendientes} color="azul" />
                <TarjetaMetrica label="Alertas Críticas" valor={stats.alertas} color="rojo" />
                <TarjetaMetrica label="Completadas Hoy" valor={stats.completadas} color="verde" />
                <TarjetaMetrica label="En Curso" valor={stats.enCurso} color="amarillo" />
            </div>

            {/* Gráfico Dinámico Placeholder */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 shadow-sm font-inherit transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight">Incidencias por mes</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Comparativa semestral del sistema</p>
                    </div>
                </div>
                
                {/* Dynamic Chart Implementation */}
                <div className="flex items-end justify-between h-[200px] w-full max-w-[800px] mx-auto pb-4 border-b border-l border-slate-100 relative pr-4">
                    <div className="flex flex-col justify-between h-full absolute -left-8 text-[10px] font-bold text-gray-300 pb-4">
                        <span>12</span>
                        <span>8</span>
                        <span>4</span>
                        <span>0</span>
                    </div>

                    {chartData.map((d, i) => (
                        <div key={i} className="flex gap-1.5 items-end h-full flex-1 justify-center relative group">
                            <div 
                                className="w-4 bg-blue-600 rounded-t-lg transition-all duration-700 ease-out hover:brightness-110" 
                                style={{ height: `${(d.alertas / 12) * 100}%` }}
                                title={`Alertas: ${d.alertas}`}
                            ></div>
                            <div 
                                className="w-4 bg-emerald-400 rounded-t-lg transition-all duration-700 ease-out hover:brightness-110" 
                                style={{ height: `${(d.resueltas / 12) * 100}%` }}
                                title={`Resueltas: ${d.resueltas}`}
                            ></div>
                            <span className="absolute -bottom-7 text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.mes}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-6 justify-center mt-12">
                    <span className="flex items-center gap-2 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-lg shadow-blue-100"></div> Alertas
                    </span>
                    <span className="flex items-center gap-2 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-100"></div> Resueltas
                    </span>
                </div>
            </div>

            {/* Actividad Reciente Dinámica */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 shadow-sm font-inherit transition-all hover:shadow-md">
                 <h2 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight mb-2">Actividad reciente</h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Cronología de acciones en tiempo real</p>

                 <div className="flex flex-col gap-6">
                     {[
                         { text: "Juan Pérez completó tarea en UCI Quirófano 3", time: "Hace 5 min", icon: <CheckCircle size={14} className="text-emerald-500" />, bg: "bg-emerald-50" },
                         { text: "Nueva incidencia: Aspiradora averiada - Ana Martínez", time: "Hace 12 min", icon: <AlertTriangle size={14} className="text-amber-500" />, bg: "bg-amber-50" },
                         { text: "Notificación urgente enviada por Admin", time: "Hace 30 min", icon: <Bell size={14} className="text-blue-500" />, bg: "bg-blue-50" },
                         { text: "Incidencia #3 marcada como resuelta", time: "Hace 55 min", icon: <CheckCircle size={14} className="text-emerald-500" />, bg: "bg-emerald-50" },
                         { text: "Nuevo operario registrado: Ana Martínez", time: "Hace 1h", icon: <Plus size={14} className="text-blue-500" />, bg: "bg-blue-50" },
                     ].map((act, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-default">
                            <div className={`p-3 rounded-2xl ${act.bg} border border-white shadow-sm group-hover:scale-110 transition-transform`}>
                                {act.icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 m-0">{act.text}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Clock size={10} className="text-slate-300" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{act.time}</span>
                                </div>
                            </div>
                        </div>
                     ))}
                 </div>
            </div>

            {/* Tabla de tareas */}
            <div className="bg-transparent rounded-2xl p-6 font-inherit border border-slate-400">
                <div className="flex justify-end mb-4">
                    <Button 
                        text="Crear Nueva Tarea" 
                        variant="primary" 
                        icon={Plus} 
                        className="py-2 px-4 shadow-sm"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-300">
                                <th className="py-4 px-4 text-slate-800 font-bold text-lg">Zona</th>
                                <th className="py-4 px-4 text-slate-800 font-bold text-lg text-center">Tarea</th>
                                <th className="py-4 px-4 text-slate-800 font-bold text-lg text-center">Asignado a</th>
                                <th className="py-4 px-4 text-slate-800 font-bold text-lg text-center">Estado</th>
                                <th className="py-4 px-4 text-slate-800 font-bold text-lg text-center">Prioridad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tareasMock.map(t => {
                                let badgeColor = 'bg-slate-500 text-white';
                                if (t.estado === 'Hecho') badgeColor = 'bg-green-500 text-white';
                                if (t.estado === 'En proceso' || t.estado === 'Fabricándose') badgeColor = 'bg-yellow-100 text-yellow-600 border border-yellow-400';
                                
                                let badgePrioridad = 'bg-blue-100 text-blue-500';
                                if (t.prioridad === 'Alta') badgePrioridad = 'bg-red-200 text-red-500';
                                if (t.prioridad === 'Media') badgePrioridad = 'bg-orange-100 text-orange-500';

                                return (
                                    <tr key={t.id} className="border-b border-slate-300 hover:bg-slate-200 transition-colors">
                                        <td className="py-4 px-4 font-semibold text-slate-800">{t.zona}</td>
                                        <td className="py-4 px-4 text-slate-600 text-center">{t.tarea}</td>
                                        <td className="py-4 px-4 text-slate-600 text-center">{t.asignado}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`inline-flex items-center justify-center py-1 px-4 rounded-full text-sm font-semibold ${badgeColor}`}>
                                                {t.estado === 'Hecho' && <span className="mr-1">✓</span>}
                                                {t.estado === 'En proceso' || t.estado === 'Fabricándose' ? (
                                                   <><span className="mr-1">⏱</span> {t.estado}</>
                                                ) : t.estado}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`inline-flex items-center justify-center py-1 px-4 rounded-xl text-sm font-semibold ${badgePrioridad}`}>
                                                {t.prioridad}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default Panel;
