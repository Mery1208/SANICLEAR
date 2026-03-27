import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Perfil: React.FC = () => {
  const { usuario, logout, rol } = useAuth();
  const isAdmin = rol === 'admin';
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    nombre: usuario?.nombre || "", 
    apellidos: usuario?.apellidos || "", 
    password: "" 
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

    try {
      // 1. Update user profile in custom table
      const { error: dbError } = await supabase
        .from('usuarios')
        .update({ nombre: form.nombre, apellidos: form.apellidos })
        .eq('id', usuario.id);
        
      if (dbError) throw dbError;

      // 2. Update password if provided
      if (form.password) {
        const { error: authError } = await supabase.auth.updateUser({
          password: form.password
        });
        if (authError) throw authError;
      }

      setSaved(true);
      setForm({...form, password: ''});
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return <p className="p-6">Cargando...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Mi Perfil</h2>
          <p className="text-gray-500 text-sm">Gestiona tu información personal y configuración</p>
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
          CERRAR SESIÓN
        </button>
      </div>

      {saved && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm font-semibold">✓ Cambios guardados correctamente. Recuerda que si cambiaste datos, deberás relogear para verlos actualizados en todos lados.</div>}
      {error && <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-3 mb-4 text-sm font-semibold">✗ {error}</div>}

      <div className="bg-white rounded-xl border shadow-sm p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xl font-bold relative">
            {usuario.nombre?.charAt(0)}{usuario.apellidos?.charAt(0)}
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-sm">📷</span>
          </div>
          <div>
            <p className="font-bold text-gray-800">{usuario.nombre} {usuario.apellidos}</p>
            <p className="text-sm text-gray-500">{isAdmin ? "Administrador" : "Operario"} · {usuario.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Apellidos</label>
            <input value={form.apellidos} onChange={e => setForm({...form, apellidos:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Email <span className="text-gray-400 font-normal">(No modificable desde aquí)</span></label>
          <input value={usuario.email} disabled
            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nueva Contraseña</label>
          <input type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})}
            placeholder="Dejar en blanco para no cambiar"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setForm({ nombre: usuario.nombre || "", apellidos: usuario.apellidos || "", password:"" })}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Cancelar</button>
          <button onClick={save} disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
