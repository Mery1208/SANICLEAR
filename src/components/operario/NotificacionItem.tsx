import React from 'react';
import { AlertTriangle, Bell, Info } from 'lucide-react';

interface NotificacionItemProps {
    titulo: string;
    descripcion: string;
    fecha: string;
    tipo: 'urgente' | 'importante' | 'informativo';
}

const iconosPorTipo = {
    urgente: AlertTriangle,
    importante: Bell,
    informativo: Info,
};

const coloresPorTipo = {
    urgente: '#dc2626',
    importante: '#ea580c',
    informativo: '#2563eb',
};

const NotificacionItem: React.FC<NotificacionItemProps> = ({ titulo, descripcion, fecha, tipo }) => {
    const Icono = iconosPorTipo[tipo];
    const color = coloresPorTipo[tipo];

    return (
        <div className="notificacion-item" style={{ borderLeftColor: color }}>
            <div className="notificacion-icono" style={{ color }}>
                <Icono size={20} />
            </div>
            <div className="notificacion-contenido">
                <h4 className="notificacion-titulo">{titulo}</h4>
                <p className="notificacion-desc">{descripcion}</p>
                <span className="notificacion-fecha">{fecha}</span>
            </div>
        </div>
    );
};

export default NotificacionItem;
