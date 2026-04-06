import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { Shield, LogOut, Camera, Save, X } from 'lucide-react';

const MOCK_PASSWORDS: Record<string, string> = {
  'admin@saniclear.com': 'Admin1234!',
  'juan.perez@saniclear.com': 'Operario123!',
  'maria.ceballos@saniclear.com': 'Operario123!',
  'evelia.gil@saniclear.com': 'Operario123!',
  'carlos.f@saniclear.com': 'Operario123!',
  'ana.martinez@saniclear.com': 'Operario123!',
};

const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#])[A-Za-z\d@$!%*?&._\-#]{8,}$/;

const Perfil: React.FC = () => {
  const { usuario, logout, rol } = useAuth();
  const setUsuario = useAuthStore(s => s.setUsuario);
  const isAdmin = rol === 'admin';
  const navigate = useNavigate();

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
      if (!form.passwordActual) {
        setError("Debes introducir tu contraseña actual para cambiarla.");
        setLoading(false);
        return;
      }

      // Verificar contra Supabase Auth
      let passCorrecta = false;
      try {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: usuario.email,
          password: form.passwordActual,
        });
        passCorrecta = !verifyError;
      } catch {
        // Si Supabase no responde, verificar contra mock
        passCorrecta = MOCK_PASSWORDS[usuario.email] === form.passwordActual;
      }

      if (!passCorrecta) {
        setError("La contraseña actual no es correcta.");
        setLoading(false);
        return;
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

        // Actualizar mock local si aplica
        if (MOCK_PASSWORDS[usuario.email]) {
          MOCK_PASSWORDS[usuario.email] = form.passwordNueva;
        }
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
      <div className="flex justify-between items-end pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Mi Cuenta</h2>
          <p className="text-gray-400 text-sm font-medium italic">Configura tu perfil personal y preferencias de seguridad.</p>
        </div>
        <Button
          text="Cerrar Sesión"
          onClick={handleLogout}
          variant="danger"
          icon={LogOut}
          className="px-6 py-2.5 shadow-sm"
        />
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-sm font-bold animate-pulse">✓ Cambios guardados correctamente.</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-bold">✗ {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Avatar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold relative shadow-lg shadow-blue-100 mb-4">
              {usuario.nombre?.charAt(0)}{usuario.apellidos?.charAt(0)}
              <span className="absolute bottom-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-md hover:scale-110 transition-transform cursor-pointer">
                <Camera size={14} />
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f]">{usuario.nombre} {usuario.apellidos}</h3>
            <p className="text-sm font-bold text-blue-400 uppercase tracking-wider">{isAdmin ? "ADMINISTRADOR" : "OPERARIO"}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Contraseña Actual</label>
                <input type="password" value={form.passwordActual} onChange={e => setForm({...form, passwordActual:e.target.value})}
                  placeholder="Introduce tu contraseña actual..."
                  className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Nueva Contraseña</label>
                <input type="password" value={form.passwordNueva} onChange={e => setForm({...form, passwordNueva:e.target.value})}
                  placeholder="Mín. 8 caracteres, mayús, minús, número y carácter especial"
                  className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Confirmar Contraseña</label>
                <input type="password" value={form.passwordConfirmar} onChange={e => setForm({...form, passwordConfirmar:e.target.value})}
                  placeholder="Repite la nueva contraseña"
                  className={`w-full border rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all ${form.passwordConfirmar && form.passwordNueva !== form.passwordConfirmar ? 'border-red-300 focus:ring-red-200' : 'border-blue-50'}`} />
                {form.passwordConfirmar && form.passwordNueva !== form.passwordConfirmar && (
                  <p className="text-[10px] text-red-500 font-bold ml-1 mt-1">Las contraseñas no coinciden</p>
                )}
                {form.passwordConfirmar && form.passwordNueva === form.passwordConfirmar && form.passwordNueva && (
                  <p className="text-[10px] text-green-500 font-bold ml-1 mt-1">Las contraseñas coinciden</p>
                )}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 italic ml-1 mt-4">Deja los campos de contraseña vacíos si no deseas cambiarla.</p>

            <div className="flex gap-4 mt-auto pt-12 border-t mt-12">
              <button onClick={() => setForm({ nombre: usuario.nombre || "", apellidos: usuario.apellidos || "", passwordActual: "", passwordNueva: "", passwordConfirmar: "" })}
                className="px-8 py-3.5 rounded-2xl text-sm font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors uppercase tracking-wider">
                <X size={14} className="inline mr-2" />
                Restablecer
              </button>
              <Button
                text={loading ? "Guardando..." : "Guardar Cambios"}
                onClick={save}
                variant="primary"
                icon={Save}
                disabled={loading}
                className="flex-1 py-3 shadow-lg shadow-blue-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
