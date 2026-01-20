import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Landing from './pages/Landing.jsx'

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
