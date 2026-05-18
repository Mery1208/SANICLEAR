import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import { Shield, LogOut, Camera, Save, Eye, EyeOff, Upload, Trash2 } from 'lucide-react';

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
  const [entidadNombre, setEntidadNombre] = useState<string>('');

  useEffect(() => {
    if (!usuario?.entidad_id) return;
    supabase
      .from('entidades')
      .select('nombre_hospital')
      .eq('id', usuario.entidad_id)
      .single()
      .then(({ data }) => {
        if (data) setEntidadNombre(data.nombre_hospital);
      });
  }, [usuario?.entidad_id]);
  const [showPassActual, setShowPassActual] = useState(false);
  const [showPassNueva, setShowPassNueva] = useState(false);
  const [showPassConfirmar, setShowPassConfirmar] = useState(false);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>((usuario as any)?.avatar_url || null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // ─── Avatar ──────────────────────────────────────────────────────────────────

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuario?.id) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5 MB.');
      return;
    }

    // Mostrar preview inmediato
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    setAvatarUploading(true);
    setError('');

    try {
      const ext = file.name.split('.').pop();
      const filePath = `${usuario.id}/avatar.${ext}`;

      // Subir al bucket avatars (upsert para sobrescribir si ya existe)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      const publicUrlWithBust = `${publicUrl}?t=${Date.now()}`;

      // Guardar en tabla usuarios
      const { error: dbError } = await supabase
        .from('usuarios')
        .update({ avatar_url: publicUrl })
        .eq('id', usuario.id);

      if (dbError) throw dbError;

      // Actualizar estado local
      setAvatarUrl(publicUrlWithBust);
      setAvatarPreview(null);
      setUsuario({ ...usuario, avatar_url: publicUrl } as any);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError('Error subiendo la foto: ' + (err.message || 'desconocido'));
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!usuario?.id) return;
    setAvatarUploading(true);
    try {
      // Listar y eliminar archivos del usuario en el bucket
      const { data: files } = await supabase.storage
        .from('avatars')
        .list(usuario.id);

      if (files && files.length > 0) {
        const paths = files.map(f => `${usuario.id}/${f.name}`);
        await supabase.storage.from('avatars').remove(paths);
      }

      // Limpiar en DB
      await supabase.from('usuarios').update({ avatar_url: null }).eq('id', usuario.id);

      setAvatarUrl(null);
      setAvatarPreview(null);
      setUsuario({ ...usuario, avatar_url: null } as any);
    } catch (err: any) {
      setError('Error eliminando la foto: ' + err.message);
    } finally {
      setAvatarUploading(false);
    }
  };

  // ─── Guardar perfil ───────────────────────────────────────────────────────────

  const save = async () => {
    if (!usuario?.id) return;
    setLoading(true);
    setError('');

    const quiereCambiarPass = form.passwordNueva || form.passwordConfirmar;

    if (quiereCambiarPass) {
      if (!isRecoveryMode && !form.passwordActual) {
        setError("Debes introducir tu contraseña actual para cambiarla.");
        setLoading(false);
        return;
      }

      if (!isRecoveryMode) {
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

      if (!PASS_REGEX.test(form.passwordNueva)) {
        setError("La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&._-#).");
        setLoading(false);
        return;
      }

      if (form.passwordNueva !== form.passwordConfirmar) {
        setError("La nueva contraseña y su confirmación no coinciden.");
        setLoading(false);
        return;
      }
    }

    try {
      const { error: dbError } = await supabase
        .from('usuarios')
        .update({ nombre: form.nombre, apellidos: form.apellidos })
        .eq('id', usuario.id);

      if (dbError) throw dbError;

      if (quiereCambiarPass) {
        const { error: authError } = await supabase.auth.updateUser({ password: form.passwordNueva });
        if (authError) throw authError;
      }

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

  const displayAvatar = avatarPreview || avatarUrl;
  const initials = `${usuario.nombre?.charAt(0) || ''}${usuario.apellidos?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start w-full gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight mb-1">Mi Cuenta</h2>
          <p className="text-gray-400 text-sm font-medium italic">Configura tu perfil y preferencias de seguridad.</p>
        </div>
        <Button
          text="Cerrar Sesión"
          onClick={handleLogout}
          variant="danger"
          icon={LogOut}
          className="py-1.5 px-3 sm:py-2 sm:px-4 text-[10px] sm:text-xs shadow-sm shrink-0"
        />
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-sm font-bold animate-pulse">
          ✓ Cambios guardados correctamente.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-bold">
          ✗ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

        {/* ── Columna Avatar ── */}
        <div className="md:col-span-1 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center flex flex-col items-center">

            {/* Avatar (clic para cambiar) */}
            <div
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-blue-100 cursor-pointer border-4 border-white ring-2 ring-blue-100 hover:ring-blue-400 transition-all relative mb-2"
              onClick={handleAvatarClick}
              title="Cambiar foto de perfil"
            >
              {displayAvatar ? (
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {initials}
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Input oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />

            {/* Nombre y rol */}
            <h3 className="text-xl font-black text-[#1e3a5f]">{usuario.nombre} {usuario.apellidos}</h3>
            <p className="text-sm font-bold text-blue-500 uppercase tracking-wider mt-1">
              {rol === 'superadmin' ? 'SUPERADMIN' : isAdmin ? 'ADMINISTRADOR' : 'OPERARIO'}
            </p>

            {/* Acciones de foto */}
            <div className="flex justify-center gap-2 mt-4 w-full">
              <button
                onClick={handleAvatarClick}
                disabled={avatarUploading}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors disabled:opacity-50"
              >
                <Upload size={14} />
                {displayAvatar ? 'Cambiar foto' : 'Subir foto'}
              </button>

              {/* Botón eliminar (papelera) */}
              {(avatarUrl || (usuario as any)?.avatar_url) && !avatarPreview && (
                <button
                  onClick={handleRemoveAvatar}
                  disabled={avatarUploading}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition-colors disabled:opacity-50"
                  title="Eliminar foto"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <p className="text-[10px] text-gray-400 mt-2">PNG, JPG, WEBP · Máx. 5 MB</p>
          </div>
        </div>

        {/* Columna Formulario */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col h-full">

            <h3 className="text-lg font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Nombre</label>
                <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="perfil-input-editable w-full border border-gray-200 rounded-2xl bg-white shadow-sm px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Apellidos</label>
                <input value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })}
                  className="perfil-input-editable w-full border border-gray-200 rounded-2xl bg-white shadow-sm px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Email</label>
                <input value={usuario.email || ""} disabled
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-100 dark:bg-transparent px-5 py-3.5 text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-not-allowed" />
              </div>
              {entidadNombre && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">
                    Centro / Entidad
                  </label>
                  <input
                    value={entidadNombre}
                    disabled
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-100 dark:bg-transparent px-5 py-3.5 text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Turno</label>
                <input value={usuario.turno || "Mañana"} disabled
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-100 dark:bg-transparent px-5 py-3.5 text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-not-allowed" />
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
                    <input type={showPassActual ? "text" : "password"} value={form.passwordActual}
                      onChange={e => setForm({ ...form, passwordActual: e.target.value })}
                      placeholder="Introduce tu contraseña actual..."
                      className="perfil-input-editable w-full border border-gray-200 rounded-2xl bg-white shadow-sm px-5 pr-12 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                    <button type="button" onClick={() => setShowPassActual(!showPassActual)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                      {showPassActual ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Nueva Contraseña</label>
                <div className="relative">
                  <input type={showPassNueva ? "text" : "password"} value={form.passwordNueva}
                    onChange={e => setForm({ ...form, passwordNueva: e.target.value })}
                    placeholder="Mín. 8 caracteres, mayús, minús, número y símbolo"
                    className="perfil-input-editable w-full border border-gray-200 rounded-2xl bg-white shadow-sm px-5 pr-12 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  <button type="button" onClick={() => setShowPassNueva(!showPassNueva)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                    {showPassNueva ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Confirmar Contraseña</label>
                <div className="relative">
                  <input type={showPassConfirmar ? "text" : "password"} value={form.passwordConfirmar}
                    onChange={e => setForm({ ...form, passwordConfirmar: e.target.value })}
                    placeholder="Repite la nueva contraseña"
                    className={`perfil-input-editable w-full border rounded-2xl bg-white shadow-sm px-5 pr-12 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${form.passwordConfirmar && form.passwordNueva !== form.passwordConfirmar ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`} />
                  <button type="button" onClick={() => setShowPassConfirmar(!showPassConfirmar)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                    {showPassConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.passwordConfirmar && form.passwordNueva !== form.passwordConfirmar && (
                  <p className="text-[10px] text-red-500 font-bold ml-1 mt-1">Las contraseñas no coinciden</p>
                )}
                {form.passwordConfirmar && form.passwordNueva === form.passwordConfirmar && form.passwordNueva && (
                  <p className="text-[10px] text-green-500 font-bold ml-1 mt-1">Las contraseñas coinciden ✓</p>
                )}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 italic ml-1 mt-4">Deja los campos de contraseña vacíos si no deseas cambiarla.</p>

            <div className="flex flex-row justify-center gap-3 mt-8">
              <button
                onClick={() => setForm({ nombre: usuario.nombre || "", apellidos: usuario.apellidos || "", passwordActual: "", passwordNueva: "", passwordConfirmar: "" })}
                className="!px-4 !py-2 !text-[10px] sm:!px-8 sm:!py-3 sm:!text-sm font-bold uppercase tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors shrink-0"
              >
                Restablecer
              </button>
              <Button
                text={loading ? "Guardando..." : "Guardar Cambios"}
                onClick={save}
                variant="primary"
                icon={Save}
                disabled={loading}
                className="!px-4 !py-2 !text-[10px] sm:!px-8 sm:!py-3 sm:!text-sm shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;