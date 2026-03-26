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

// Páginas operario
import Tareas from '../pages/operario/Tareas';

// Páginas admin
import Panel from '../pages/admin/Panel';

// Generica En Construccion
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
                        <Route path="/operario" element={<Tareas />} />
                        <Route path="/operario/*" element={<EnConstruccion />} />
                    </Route>
                </Route>

                {/* Rutas admin (protegidas) */}
                <Route element={<RutaProtegida rolPermitido="admin" />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<Panel />} />
                        <Route path="/admin/*" element={<EnConstruccion />} />
                    </Route>
                </Route>

                {/* Redirigir rutas antiguas */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
