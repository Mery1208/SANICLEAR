import React from 'react';
import { Search } from 'lucide-react';

interface CampoBusquedaProps {
    placeholder?: string;
    valor: string;
    onChange: (valor: string) => void;
}

const CampoBusqueda: React.FC<CampoBusquedaProps> = ({ placeholder = 'Buscar...', valor, onChange }) => {
    return (
        <div className="barra-superior-busqueda">
            <Search size={16} className="busqueda-icono" />
            <input
                type="text"
                placeholder={placeholder}
                value={valor}
                onChange={e => onChange(e.target.value)}
                className="busqueda-input"
            />
        </div>
    );
};

export default CampoBusqueda;
