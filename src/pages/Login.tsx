import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import '../css/Login.css';
import { supabase } from '../supabase/client';
import logoImg from '../assets/img/logo.png';

interface UserRoles {
  nombre: string;
}

interface UserRow {
  nombre: string;
  roles?: UserRoles;
  [key: string]: unknown;
}

export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

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

      const typedUser = userData as UserRow;
      const nombreRol = typedUser.roles?.nombre;

      if (nombreRol === 'admin') {
        console.log('Login exitoso: Redirigiendo a Dashboard');
        navigate('/dashboard');
      } else {
        alert(`Bienvenido, ${typedUser.nombre}. El panel de Operario está en construcción.`);
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error de login:', message);
      alert('Error al acceder: Comprueba tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <img src={logoImg} alt="Saniclear" />
          </div>

          <h2 className="login-title">Acceso al Portal</h2>
          <p className="login-subtitle">Bienvenido a SANICLEAR</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="usuario@hospital.com"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="forgot-password">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <Button
              text={loading ? "Verificando..." : "Iniciar Sesión"}
              type="submit"
              variant="primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}