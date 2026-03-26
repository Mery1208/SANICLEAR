import React from 'react';
import TarjetaMetrica from '../../components/common/TarjetaMetrica';

const tareasMock = [
    { id: 1, zona: 'Quirófano 1', tarea: 'Desinfección', asignado: 'Juan Gallén', estado: 'Hecho', prioridad: 'Alta' },
    { id: 2, zona: 'Habitación 204', tarea: 'Limpieza General', asignado: 'María Ceballos', estado: 'Pendiente', prioridad: 'Alta' },
    { id: 3, zona: 'UCI - Sala 3', tarea: 'Desinfección Profunda', asignado: 'Evelio Gil', estado: 'Hecho', prioridad: 'Alta' },
    { id: 4, zona: 'Pasillo B', tarea: 'Suelos', asignado: 'Pablo Ambrosio', estado: 'En proceso', prioridad: 'Media' },
    { id: 5, zona: 'Sala de Espera', tarea: 'Limpieza General', asignado: 'Estefanía Gil', estado: 'Fabricándose', prioridad: 'Baja' },
];

const Panel: React.FC = () => {
    const pendientes = tareasMock.filter(t => t.estado === 'Pendiente').length;
    const alertas = tareasMock.filter(t => t.prioridad === 'Alta' && t.estado === 'Pendiente').length;
    const completadas = tareasMock.filter(t => t.estado === 'Hecho').length;
    const enCurso = tareasMock.filter(t => t.estado === 'En proceso' || t.estado === 'Fabricándose').length;

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Panel de control</h1>
            <p className="text-sm text-slate-500 mb-8">
                Resumen general: tareas activas, alertas e historial del sistema en tiempo real
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <TarjetaMetrica label="Tareas Pendientes" valor={pendientes} color="azul" />
                <TarjetaMetrica label="Alertas Críticas" valor={alertas} color="rojo" />
                <TarjetaMetrica label="Completadas Hoy" valor={completadas} color="verde" />
                <TarjetaMetrica label="En Curso" valor={enCurso} color="amarillo" />
            </div>

            {/* Gráfico Placeholder */}
            <div className="bg-transparent border border-slate-400 rounded-2xl p-6 mb-8 mt-4 font-inherit">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Incidencias por mes</h2>
                <p className="text-sm text-slate-500 mb-8 mt-[-20px]">Últimos 6 meses</p>
                
                {/* Simulated Chart */}
                <div className="flex items-end justify-between h-[200px] w-[80%] max-w-[600px] mx-auto pb-4 border-b border-l border-slate-300 relative">
                    <div className="flex flex-col justify-between h-full absolute -left-8 text-xs text-slate-500 pb-4">
                        <span>12</span>
                        <span>9</span>
                        <span>6</span>
                        <span>3</span>
                        <span>0</span>
                    </div>

                    <div className="flex gap-1 items-end h-full flex-1 justify-center relative">
                        <div className="w-8 bg-blue-600 h-[25%] rounded-t-sm"></div>
                        <div className="w-8 bg-green-500 h-[15%] rounded-t-sm"></div>
                        <span className="absolute -bottom-6 text-xs text-slate-500">sep</span>
                    </div>

                    <div className="flex gap-1 items-end h-full flex-1 justify-center relative">
                        <div className="w-8 bg-blue-600 h-[40%] rounded-t-sm"></div>
                        <div className="w-8 bg-green-500 h-[30%] rounded-t-sm"></div>
                        <span className="absolute -bottom-6 text-xs text-slate-500">oct</span>
                    </div>

                    <div className="flex gap-1 items-end h-full flex-1 justify-center relative">
                        <div className="w-8 bg-blue-600 h-[70%] rounded-t-sm"></div>
                        <div className="w-8 bg-green-500 h-[65%] rounded-t-sm"></div>
                        <span className="absolute -bottom-6 text-xs text-slate-500">nov</span>
                    </div>

                    <div className="flex gap-1 items-end h-full flex-1 justify-center relative">
                        <div className="w-8 bg-blue-600 h-[20%] rounded-t-sm"></div>
                        <div className="w-8 bg-green-500 h-[20%] rounded-t-sm"></div>
                        <span className="absolute -bottom-6 text-xs text-slate-500">dic</span>
                    </div>

                    <div className="flex gap-1 items-end h-full flex-1 justify-center relative">
                        <div className="w-8 bg-blue-300 h-[15%] rounded-t-sm"></div>
                        <div className="w-8 bg-green-300 h-[10%] rounded-t-sm"></div>
                        <span className="absolute -bottom-6 text-xs text-slate-500">ene</span>
                    </div>
                </div>
                <div className="flex gap-4 justify-end mt-8 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600"></div> Alertas</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500"></div> Resueltas</span>
                </div>
            </div>

            {/* Actividad Reciente */}
            <div className="bg-transparent border border-slate-400 rounded-2xl p-6 mb-8 font-inherit">
                 <h2 className="text-xl font-bold text-slate-800 mb-2">Actividad reciente</h2>
                 <p className="text-sm text-slate-500 mb-6">Últimas acciones del sistema</p>

                 <div className="flex flex-col gap-4">
                     <div>
                         <p className="text-base text-slate-800 m-0">Juan Pérez completó tarea en UCI Quirófano 3</p>
                         <span className="text-xs text-slate-400">Hace 5 min</span>
                     </div>
                     <div>
                         <p className="text-base text-slate-800 m-0">Nueva incidencia: Aspiradora averiada</p>
                         <span className="text-xs text-slate-400">Hace 12 min</span>
                     </div>
                     <div>
                         <p className="text-base text-slate-800 m-0">Notificación urgente enviada a Carlos Fernández</p>
                         <span className="text-xs text-slate-400">Hace 30 min</span>
                     </div>
                     <div>
                         <p className="text-base text-slate-800 m-0">Incidencia #3 marcada como resuelta</p>
                         <span className="text-xs text-slate-400">Hace 55 min</span>
                     </div>
                     <div>
                         <p className="text-base text-slate-800 m-0">Nuevo operario registrado: Ana Martínez</p>
                         <span className="text-xs text-slate-400">Hace 55 min</span>
                     </div>
                 </div>
            </div>

            {/* Tabla de tareas */}
            <div className="bg-transparent rounded-2xl p-6 font-inherit border border-slate-400">
                <div className="flex justify-end mb-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-sm transition-colors border-none text-sm cursor-pointer font-inherit">
                        + Crear Nueva Tarea
                    </button>
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
