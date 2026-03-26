import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';


interface Tarea {
    id: number;
    zona: string;
    tarea: string;
    asignado: string;
    estado: 'Hecho' | 'En Curso' | 'Pendiente';
    prioridad: 'Alta' | 'Media' | 'Baja';
}

interface TaskTableProps {
    tareas: Tarea[];
    title?: string;
}

const TaskTable: React.FC<TaskTableProps> = ({ tareas, title = 'Panel de Control de Zonas' }) => {
    return (
        <div className="task-table-panel">
            <h2 className="task-table-title">{title}</h2>
            <div className="task-table-wrapper">
                <table className="task-table">
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
                                    <span className={`tt-badge tt-estado-${tarea.estado.toLowerCase().replace(' ', '-')}`}>
                                        {tarea.estado === 'Hecho' && <CheckCircle2 size={14} />}
                                        {tarea.estado === 'En Curso' && <Clock size={14} />}
                                        {tarea.estado}
                                    </span>
                                </td>
                                <td>
                                    <span className={`tt-priority tt-priority-${tarea.prioridad.toLowerCase()}`}>
                                        {tarea.prioridad}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskTable;
