import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RutaProtegidaProps {
    rolPermitido: 'admin' | 'operario';
}

const RutaProtegida: React.FC<RutaProtegidaProps> = ({ rolPermitido }) => {
    const { usuario, cargando } = useAuth();

    if (cargando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Cargando...</p>
            </div>
        );
    }

    // no autenticado → login
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    // rol no coincide → inicio
    if (usuario.rol !== rolPermitido) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RutaProtegida;
