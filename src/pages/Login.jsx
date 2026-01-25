import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos para poder redirigir
import Navbar from '../components/Navbar';
import Button from '../components/Button'; 
import '../css/Login.css';
import { supabase } from '../supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Para evitar doble clic mientras carga
  const navigate = useNavigate(); // Hook para navegar entre páginas

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Activamos estado de carga

    try {
      // 1. AUTENTICACIÓN: Comprobamos email y contraseña en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // 2. CONSULTA DE DATOS: Buscamos al usuario y pedimos el NOMBRE del rol
      // Fíjate en la sintaxis: `roles ( nombre )` hace la unión con la otra tabla
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select(`
          *,
          roles (
            nombre
          )
        `)
        .eq('email', email)
        .single();

      if (userError) throw userError;

      // 3. VERIFICACIÓN DE ROL
      // Ahora el rol no es un texto directo, viene dentro del objeto 'roles'
      const nombreRol = userData.roles?.nombre;

      if (nombreRol === 'admin') {
        console.log('Login exitoso: Redirigiendo a Dashboard');
        navigate('/dashboard'); // <-- Te lleva al panel de admin
      } else {
        alert(`Bienvenido, ${userData.nombre}. El panel de Operario está en construcción.`);
      }

    } catch (error) {
      console.error('Error de login:', error.message);
      alert('Error al acceder: Comprueba tu email y contraseña.');
    } finally {
      setLoading(false); // Desactivamos carga pase lo que pase
    }
  };

  return (
    <div className="login-container">
      
      <div style={{position:'absolute', top:0, width:'100%'}}>
        <Navbar/>
      </div>

      <div className="login-card">
        <h2 className="login-title">Acceso al Portal</h2>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@hospital.com"
              disabled={loading} // Bloqueamos si está cargando
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <Button 
            text={loading ? "Verificando..." : "Iniciar Sesión"} 
            type="submit" 
            variant="primary" 
            style={{ width: '100%', opacity: loading ? 0.7 : 1 }} 
          />
        </form>
      </div>
    </div>
  );
}