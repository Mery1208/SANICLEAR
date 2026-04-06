import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/img/logo.png';

export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login, usuario } = useAuth();

  // Redirigir si el usuario ya está logueado
  useEffect(() => {
    if (usuario) {
      if (usuario.rol === 'admin') navigate('/admin');
      else navigate('/operario');
    }
  }, [usuario, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const user = await login(trimmedEmail, password);
      
      if (user) {
        const rol = user.user_metadata?.rol || (trimmedEmail.includes('admin') ? 'admin' : 'operario');
        if (rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/operario');
        }
      } else {
        throw new Error("No se ha podido recuperar la información del rol del usuario.");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error de login:', message);
      alert('Error al acceder: Comprueba tu email y contraseña. \nDetalle: ' + message);
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