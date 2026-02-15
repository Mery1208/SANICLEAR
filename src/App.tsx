import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css'
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardOperario from './pages/DashboardOperario'
import Login from './pages/Login'
import Landing from './pages/Landing'

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* admin */}
        <Route path="/admin" element={<DashboardAdmin />} />

        {/* operario */}
        <Route path="/operario" element={<DashboardOperario />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App