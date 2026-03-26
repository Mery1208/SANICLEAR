import React from 'react';
import '../../css/badgets.css';

type BadgeTipo = 'alta' | 'media' | 'baja' | 'abierta' | 'revision' | 'resuelta' | 'hecho' | 'en-curso' | 'pendiente';

interface BadgeProps {
    texto: string;
    tipo: BadgeTipo;
}

const Badge: React.FC<BadgeProps> = ({ texto, tipo }) => {
    return (
        <span className={`badge badge-${tipo}`}>
            {texto}
        </span>
    );
};

export default Badge;
