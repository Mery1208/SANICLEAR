import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Landing from './pages/Landing'

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* admin */}
        <Route path="/admin" element={<Dashboard />} />
        {/* TODO: rutas de gestion de usuarios */}

        {/* operario */}
        <Route path="/operario" element={<div style={{ padding: 20 }}>Panel Operario en construcción</div>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App