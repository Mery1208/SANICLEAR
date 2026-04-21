import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import logoImg from '../assets/img/logo.png';

export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [recoveryMsg, setRecoveryMsg] = useState<string>('');
  const navigate = useNavigate();
  const { login, usuario, resetPassword } = useAuth();

  // Redirigir si el usuario ya está logueado
  useEffect(() => {
    if (usuario) {
      if (usuario.rol === 'superadmin') navigate('/superadmin');
      else if (usuario.rol === 'admin') navigate('/admin');
      else navigate('/operario');
    }
  }, [usuario, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      await login(trimmedEmail, password);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error de login:', message);
      alert('Error al acceder: Comprueba tu email y contraseña. \nDetalle: ' + message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email) return alert('Introduce tu email para recuperar la contraseña.');
    setLoading(true);
    try {
      await resetPassword(email);
      setRecoveryMsg('Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu contraseña.');
    } catch (error: any) {
      alert('Error al enviar el correo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <img src={logoImg} alt="Saniclears" />
          </div>

          <h2 className="login-title">{isRecovering ? 'Recuperar Contraseña' : 'Acceso al Portal'}</h2>
          <p className="login-subtitle">{isRecovering ? 'Te enviaremos un enlace de acceso' : 'Bienvenido a SANICLEARS'}</p>

          {recoveryMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-bold mb-4 text-center">
              ✓ {recoveryMsg}
            </div>
          )}

          {isRecovering ? (
            <form onSubmit={handleRecovery}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@hospital.com" disabled={loading} autoComplete="username" />
              </div>
              <Button text={loading ? "Enviando..." : "Enviar enlace"} type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading} />
              <div className="text-center mt-4">
                <button type="button" onClick={() => { setIsRecovering(false); setRecoveryMsg(''); }} className="text-sm text-gray-500 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer">
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          ) : (

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="usuario@hospital.com"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                  style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <button 
                type="button" 
                onClick={() => setIsRecovering(true)}
                style={{ background: 'transparent', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              text={loading ? "Verificando..." : "Iniciar Sesión"}
              type="submit"
              variant="primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </form>
          )}
        </div>
      </div>
    </div>
  );
}