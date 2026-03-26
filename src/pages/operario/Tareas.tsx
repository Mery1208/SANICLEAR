import React, { useState } from 'react';
import TarjetaMetrica from '../../components/common/TarjetaMetrica';
import TarjetaTarea from '../../components/operario/TarjetaTarea';
import ContadorTareas from '../../components/operario/ContadorTareas';

interface Tarea {
    id: number;
    zona: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    completada: boolean;
}

const tareasIniciales: Tarea[] = [
    { id: 1, zona: 'Habitación 204', descripcion: 'Limpieza general y baño', prioridad: 'Alta', completada: false },
    { id: 2, zona: 'UCI - Sala 3', descripcion: 'Desinfección profunda completa', prioridad: 'Media', completada: false },
    { id: 3, zona: 'Consulta Externa 5', descripcion: 'Limpieza general', prioridad: 'Baja', completada: false },
    { id: 4, zona: 'Pasillo B - Planta 2', descripcion: 'Limpieza de suelos y desinfección', prioridad: 'Alta', completada: false },
    { id: 5, zona: 'Sala de Espera', descripcion: 'Limpieza de mobiliario y ventanas', prioridad: 'Media', completada: false },
];

const prioridadOrden: Record<string, number> = { Alta: 0, Media: 1, Baja: 2 };

const Tareas: React.FC = () => {
    const [tareas, setTareas] = useState<Tarea[]>(tareasIniciales);

    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = tareas.filter(t => !t.completada).length;
    const altaPrioridad = tareas.filter(t => t.prioridad === 'Alta' && !t.completada).length;

    // Ordered: Pending first (sorted by priority Alta -> Baja), then Completed at the bottom
    const tareasOrdenadas = [...tareas].sort((a, b) => {
        if (a.completada !== b.completada) return a.completada ? 1 : -1;
        return prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
    });

    const toggleTarea = (id: number) => {
        setTareas(prev =>
            prev.map(t => t.id === id ? { ...t, completada: !t.completada } : t)
        );
    };

    return (
        <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Mis Tareas Asignadas</h1>
                <p className="text-slate-500 font-medium">
                    Aquí encontrarás las tareas de tu turno ordenadas por prioridad. Al completar una tarea se marcará en verde y bajará al final de la lista.
                </p>
            </div>

            {/* Tarjetas métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <TarjetaMetrica label="Alta Prioridad" valor={altaPrioridad} color="rojo" />
                <TarjetaMetrica label="Pendientes" valor={pendientes} color="azul" />
                <TarjetaMetrica label="Completadas" valor={completadas} color="verde" />
            </div>

            {/* Lista de tareas */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[#1e3a5f] mb-2 border-b border-slate-100 pb-3">Listado de Tareas</h2>
                <div className="flex flex-col gap-3">
                    {tareasOrdenadas.map(tarea => (
                        <TarjetaTarea
                            key={tarea.id}
                            zona={tarea.zona}
                            descripcion={tarea.descripcion}
                            prioridad={tarea.prioridad}
                            completada={tarea.completada}
                            onCompletar={() => toggleTarea(tarea.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Contador Inferior */}
            <ContadorTareas completadas={completadas} total={tareas.length} />
        </div>
    );
};

export default Tareas;
