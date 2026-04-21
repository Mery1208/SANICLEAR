import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import { Shield, LogOut, Camera, Save, X, Eye, EyeOff } from 'lucide-react';

const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#])[A-Za-z\d@$!%*?&._\-#]{8,}$/;

const Perfil: React.FC = () => {
  const { usuario, logout, rol } = useAuth();
  const setUsuario = useAuthStore(s => s.setUsuario);
  const isAdmin = rol === 'admin';
  const navigate = useNavigate();
  
  const location = useLocation();
  const isRecoveryMode = new URLSearchParams(location.search).get('recovery') === 'true';

  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellidos: usuario?.apellidos || "",
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassActual, setShowPassActual] = useState(false);
  const [showPassNueva, setShowPassNueva] = useState(false);
  const [showPassConfirmar, setShowPassConfirmar] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const save = async () => {
    if (!usuario?.id) return;
    setLoading(true);
    setError('');

    const quiereCambiarPass = form.passwordNueva || form.passwordConfirmar;

    // Validar contrasena actual si quiere cambiarla
    if (quiereCambiarPass) {
      if (!isRecoveryMode && !form.passwordActual) {
        setError("Debes introducir tu contraseña actual para cambiarla.");
        setLoading(false);
        return;
      }

      if (!isRecoveryMode) {
        // Verificar contra Supabase Auth
        let passCorrecta = false;
        try {
          const { error: verifyError } = await supabase.auth.signInWithPassword({
            email: usuario.email,
            password: form.passwordActual,
          });
          passCorrecta = !verifyError;
        } catch (err) { console.error(err); }

        if (!passCorrecta) {
          setError("La contraseña actual no es correcta.");
          setLoading(false);
          return;
        }
      }

      // Validar formato de la nueva contrasena
      if (!PASS_REGEX.test(form.passwordNueva)) {
        setError("La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&._-#).");
        setLoading(false);
        return;
      }

      // Confirmar que coinciden
      if (form.passwordNueva !== form.passwordConfirmar) {
        setError("La nueva contraseña y su confirmación no coinciden.");
        setLoading(false);
        return;
      }
    }

    try {
      // 1. Actualizar perfil en tabla usuarios
      const { error: dbError } = await supabase
        .from('usuarios')
        .update({ nombre: form.nombre, apellidos: form.apellidos })
        .eq('id', usuario.id);

      if (dbError) throw dbError;

      // 2. Actualizar contrasena si se proporciono
      if (quiereCambiarPass) {
        const { error: authError } = await supabase.auth.updateUser({
          password: form.passwordNueva,
        });
        if (authError) throw authError;
      }

      // Actualizar store local
      setUsuario({ ...usuario, nombre: form.nombre, apellidos: form.apellidos });

      setSaved(true);
      setForm({ ...form, passwordActual: "", passwordNueva: "", passwordConfirmar: "" });
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return <p className="p-6">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Mi Cuenta</h2>
          <p className="text-gray-400 text-xs sm:text-sm font-medium italic truncate">Configura tu perfil personal y preferencias.</p>
        </div>
        <Button
          text="Cerrar Sesión"
          onClick={handleLogout}
          variant="danger"
          icon={LogOut}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 shadow-sm text-xs sm:text-sm shrink-0"
        />
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-sm font-bold animate-pulse">✓ Cambios guardados correctamente.</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-bold">✗ {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Columna Izquierda: Avatar */}
        <div className="md:col-span-1 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold relative shadow-lg shadow-blue-100 mb-3">
              {usuario.nombre?.charAt(0)}{usuario.apellidos?.charAt(0)}
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-md">
                <Camera size={10} />
              </span>
            </div>
            <h3 className="text-base font-bold text-[#1e3a5f]">{usuario.nombre} {usuario.apellidos}</h3>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">{isAdmin ? "ADMIN" : "OPERARIO"}</p>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col h-full">
            <h3 className="text-lg font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Nombre</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})}
                  className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Apellidos</label>
                <input value={form.apellidos} onChange={e => setForm({...form, apellidos:e.target.value})}
                  className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Email</label>
                <input value={usuario.email || ""} disabled
                  className="w-full border border-gray-100 rounded-2xl bg-gray-50 px-5 py-3.5 text-sm font-semibold text-gray-400 cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Turno</label>
                <input value={usuario.turno || "Mañana"} disabled
                  className="w-full border border-gray-100 rounded-2xl bg-gray-50 px-5 py-3.5 text-sm font-semibold text-gray-400 cursor-not-allowed" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#1e3a5f] mb-6 mt-8 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
              Seguridad de la Cuenta
            </h3>
          
          {isRecoveryMode && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 text-sm font-semibold mb-6 flex items-center gap-2">
              <Shield size={18} /> Estás en modo recuperación. Establece tu nueva contraseña directamente.
            </div>
          )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isRecoveryMode && (
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Contraseña Actual</label>
                <div className="relative">
                  <input type={showPassActual ? "text" : "password"} value={form.passwordActual} onChange={e => setForm({...form, passwordActual:e.target.value})}
                    placeholder="Introduce tu contraseña actual..."
                    className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 pr-12 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
                  <button type="button" onClick={() => setShowPassActual(!showPassActual)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                    {showPassActual ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Nueva Contraseña</label>
                <div className="relative">
                  <input type={showPassNueva ? "text" : "password"} value={form.passwordNueva} onChange={e => setForm({...form, passwordNueva:e.target.value})}
                    placeholder="Mín. 8 caracteres, mayús, minús, número y carácter especial"
                    className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 pr-12 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
                  <button type="button" onClick={() => setShowPassNueva(!showPassNueva)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                    {showPassNueva ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Confirmar Contraseña</label>
                <div className="relative">
                  <input type={showPassConfirmar ? "text" : "password"} value={form.passwordConfirmar} onChange={e => setForm({...form, passwordConfirmar:e.target.value})}
                    placeholder="Repite la nueva contraseña"
                    className={`w-full border rounded-2xl bg-gray-50/50 px-5 pr-12 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all ${form.passwordConfirmar && form.passwordNueva !== form.passwordConfirmar ? 'border-red-300 focus:ring-red-200' : 'border-blue-50'}`} />
                  <button type="button" onClick={() => setShowPassConfirmar(!showPassConfirmar)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                    {showPassConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.passwordConfirmar && form.passwordNueva !== form.passwordConfirmar && (
                  <p className="text-[10px] text-red-500 font-bold ml-1 mt-1">Las contraseñas no coinciden</p>
                )}
                {form.passwordConfirmar && form.passwordNueva === form.passwordConfirmar && form.passwordNueva && (
                  <p className="text-[10px] text-green-500 font-bold ml-1 mt-1">Las contraseñas coinciden</p>
                )}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 italic ml-1 mt-4">Deja los campos de contraseña vacíos si no deseas cambiarla.</p>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-auto pt-12 border-t mt-12">
              <button onClick={() => setForm({ nombre: usuario.nombre || "", apellidos: usuario.apellidos || "", passwordActual: "", passwordNueva: "", passwordConfirmar: "" })}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors uppercase tracking-wider">
                <X size={14} className="inline mr-2" />
                Restablecer
              </button>
              <Button
                text={loading ? "Guardando..." : "Guardar Cambios"}
                onClick={save}
                variant="primary"
                icon={Save}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 shadow-lg shadow-blue-100 text-sm font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
