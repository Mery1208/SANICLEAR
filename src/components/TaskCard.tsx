import React from 'react';
import { CheckCircle2 } from 'lucide-react';


interface TaskCardProps {
    zona: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    completada: boolean;
    onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ zona, descripcion, prioridad, completada, onClick }) => {
    return (
        <div
            className={`tcard ${completada ? 'tcard-completed' : ''}`}
            onClick={onClick}
        >
            <div className="tcard-info">
                <h3 className={completada ? 'tcard-done' : ''}>{zona}</h3>
                <p className={completada ? 'tcard-done' : ''}>{descripcion}</p>
                <span className={`tcard-priority tcard-priority-${prioridad.toLowerCase()}`}>
                    Prioridad {prioridad}
                </span>
            </div>
            <div className={`tcard-check ${completada ? 'tcard-checked' : ''}`}>
                {completada && <CheckCircle2 size={28} />}
            </div>
        </div>
    );
};

export default TaskCard;
