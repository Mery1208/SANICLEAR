import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import OperarioLayout from '../layouts/OperarioLayout';
import AdminLayout from '../layouts/AdminLayout';

// Ruta protegida
import RutaProtegida from './RutaProtegida';

// Páginas públicas
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';

// Páginas comunes
import Notificaciones from '../pages/common/Notificaciones';
import Perfil from '../pages/common/Perfil';

// Páginas operario
import MisTareas from '../pages/operario/MisTareas';
import ReportarIncidencia from '../pages/operario/ReportarIncidencia';

// Páginas admin
import Dashboard from '../pages/admin/Dashboard';
import GestionZonasUsuarios from '../pages/admin/GestionZonasUsuarios';
import GestionIncidencias from '../pages/admin/GestionIncidencias';

// Genérica En Construcción
import EnConstruccion from '../pages/EnConstruccion';

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Páginas públicas */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* Rutas operario (protegidas) */}
                <Route element={<RutaProtegida rolPermitido="operario" />}>
                    <Route element={<OperarioLayout />}>
                        <Route path="/operario" element={<MisTareas />} />
                        <Route path="/operario/notificaciones" element={<Notificaciones />} />
                        <Route path="/operario/incidencias" element={<ReportarIncidencia />} />
                        <Route path="/operario/perfil" element={<Perfil />} />
                        <Route path="/operario/*" element={<EnConstruccion />} />
                    </Route>
                </Route>

                {/* Rutas admin (protegidas) */}
                <Route element={<RutaProtegida rolPermitido="admin" />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/admin/zonas" element={<GestionZonasUsuarios />} />
                        <Route path="/admin/usuarios" element={<GestionZonasUsuarios />} />
                        <Route path="/admin/incidencias" element={<GestionIncidencias />} />
                        <Route path="/admin/notificaciones" element={<Notificaciones />} />
                        <Route path="/admin/perfil" element={<Perfil />} />
                        <Route path="/admin/*" element={<EnConstruccion />} />
                    </Route>
                </Route>

                {/* Redirigir rutas antiguas o no encontradas al inicio */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
