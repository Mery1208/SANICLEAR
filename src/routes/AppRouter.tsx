import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import OperarioLayout from '../layouts/OperarioLayout';
import AdminLayout from '../layouts/AdminLayout';
import SuperadminLayout from '../layouts/SuperadminLayout';

// Ruta protegida
import RutaProtegida from './RutaProtegida';

// Páginas públicas
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import PoliticaPrivacidad from '../pages/public/PoliticaPrivacidad';
import Terminos from '../pages/public/Terminos';
import Seguridad from '../pages/public/Seguridad';
import Cookies from '../pages/public/Cookies';

// Páginas admin
import Dashboard from '../pages/admin/Dashboard';
import GestionZonaUsuarios from '../pages/admin/GestionZonaUsuarios';
import GestionIncidencias from '../pages/admin/GestionIncidencias';

// Páginas operario
import MisTareas from '../pages/operario/MisTareas';
import ReportarIncidencia from '../pages/operario/ReportarIncidencia';
import Perfil from '../pages/common/Perfil';
import Notificaciones from '../pages/common/Notificaciones';

// Páginas superadmin
import PanelControlEntidades from '../pages/superadmin/PanelControlEntidades';
import PanelGlobal from '../pages/superadmin/PanelGlobal';
import ControlEntidad from '../pages/superadmin/ControlEntidad';
import MetricasEntidad from '../pages/superadmin/MetricasEntidad';

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
                    <Route path="/privacidad" element={<PoliticaPrivacidad />} />
                    <Route path="/terminos" element={<Terminos />} />
                    <Route path="/seguridad" element={<Seguridad />} />
                    <Route path="/cookies" element={<Cookies />} />
                </Route>

                {/* Rutas operario (protegidas) */}
                <Route element={<RutaProtegida rolPermitido="operario" />}>
                    <Route element={<OperarioLayout />}>
                        <Route path="/operario" element={<MisTareas />} />
                        <Route path="/operario/incidencias" element={<ReportarIncidencia />} />
                        <Route path="/operario/notificaciones" element={<Notificaciones />} />
                        <Route path="/operario/perfil" element={<Perfil />} />
                        <Route path="/operario/*" element={<EnConstruccion />} />
                    </Route>
                </Route>

                {/* Rutas admin (protegidas) */}
                <Route element={<RutaProtegida rolPermitido="admin" />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/admin/zonas" element={<GestionZonaUsuarios />} />
                        <Route path="/admin/incidencias" element={<GestionIncidencias />} />
                        <Route path="/admin/notificaciones" element={<Notificaciones />} />
                        <Route path="/admin/perfil" element={<Perfil />} />
                        <Route path="/admin/*" element={<EnConstruccion />} />
                    </Route>
                </Route>

                {/* Rutas superadmin (protegidas) */}
                <Route element={<RutaProtegida rolPermitido="superadmin" />}>
                    <Route element={<SuperadminLayout />}>
                        <Route path="/superadmin" element={<PanelGlobal />} />
                        <Route path="/superadmin/entidades" element={<PanelControlEntidades />} />
                        <Route path="/superadmin/entidades/:id" element={<ControlEntidad />} />
                        <Route path="/superadmin/entidades/:id/estadisticas" element={<MetricasEntidad />} />
                        <Route path="/superadmin/notificaciones" element={<Notificaciones />} />
                        <Route path="/superadmin/perfil" element={<Perfil />} />
                        <Route path="/superadmin/*" element={<EnConstruccion />} />
                    </Route>
                </Route>

                {/* Redirigir rutas antiguas o no encontradas al inicio */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;