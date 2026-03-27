import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const GestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  const [editUsuario, setEditUsuario] = useState<any>(null);
  const [usrForm, setUsrForm] = useState({ nombre:"", apellidos:"", email:"", password:"", turno:"Mañana" });
  const [confirm, setConfirm] = useState("");

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('usuarios').select('*').order('nombre', { ascending: true });
    if (!error && data) setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const openEditUsr = (u: any) => {
    setEditUsuario(u);
    setUsrForm({...u, password:""});
    setShowUsuarioModal(true);
  };
  
  const openNewUsr = () => {
    setEditUsuario(null);
    setUsrForm({ nombre:"", apellidos:"", email:"", password:"", turno:"Mañana" });
    setShowUsuarioModal(true);
  };

  const saveUsr = async () => {
    if (!usrForm.nombre || !usrForm.email) return;

    // Nota: La creación real de credenciales requiere Supabase Auth Admin API (Server-side)
    // Aquí actualizamos la tabla 'usuarios' pública o de perfiles.
    
    if (editUsuario) {
      const { password, ...updateData } = usrForm;
      const { error } = await supabase.from('usuarios').update(updateData).eq('id', editUsuario.id);
      if (!error) {
        setUsuarios(prev => prev.map(u => u.id === editUsuario.id ? {...u, ...updateData} : u));
      }
    } else {
      // Intento de signup visual (puede loggear al usuario si no se hace server-side, 
      // pero para el MVP guardamos en la tabla de usuarios simulando el registro)
      const insertData = {
        nombre: usrForm.nombre,
        apellidos: usrForm.apellidos,
        email: usrForm.email,
        turno: usrForm.turno,
        rol: "operario"
      };
      const { data, error } = await supabase.from('usuarios').insert([insertData]).select();
      if (!error && data) {
        setUsuarios(prev => [...prev, data[0]]);
      } else {
        alert("Recuerda: Si falla RLS, necesitas Auth Admin o un trigger en Supabase para crear usuarios.");
      }
    }

    setShowUsuarioModal(false);
    setConfirm("Usuario");
    setTimeout(() => setConfirm(""), 2500);
  };

  const deleteUsr = async (id: string) => {
    if(!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    await supabase.from('usuarios').delete().eq('id', id);
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <p className="text-sm text-gray-500">Tienes {usuarios.length} usuarios registrados.</p>
        </div>
        <button onClick={openNewUsr} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
          + Crear Usuario
        </button>
      </div>

      {confirm && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm font-semibold shadow-sm">✓ {confirm} guardado correctamente.</div>}

      {loading ? (
        <div className="p-6 text-gray-500 font-semibold mb-6">Cargando usuarios...</div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{["Nombre","Email","Rol","Turno","Acciones"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody>
              {usuarios.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No hay usuarios</td></tr>}
              {usuarios.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.nombre} {u.apellidos}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3"><Badge cls={u.rol === 'admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"} label={u.rol || "operario"} /></td>
                  <td className="px-4 py-3 text-gray-600">{u.turno || "No asignado"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEditUsr(u)} className="border border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white transition-colors">Modificar</button>
                      <button onClick={() => deleteUsr(u.id)} className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUsuarioModal && (
        <Modal title={editUsuario ? "EDITAR USUARIO" : "CREAR USUARIO"} onClose={() => setShowUsuarioModal(false)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
              <input value={usrForm.nombre} onChange={e => setUsrForm({...usrForm, nombre:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Apellidos</label>
              <input value={usrForm.apellidos} onChange={e => setUsrForm({...usrForm, apellidos:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input value={usrForm.email} onChange={e => setUsrForm({...usrForm, email:e.target.value})} disabled={!!editUsuario}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${editUsuario ? 'bg-gray-100 text-gray-500' : ''}`} />
          </div>
          {!editUsuario && (
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña</label>
              <input type="password" value={usrForm.password} onChange={e => setUsrForm({...usrForm, password:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          )}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Turno</label>
            <select value={usrForm.turno} onChange={e => setUsrForm({...usrForm, turno:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option>Mañana</option><option>Tarde</option><option>Noche</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowUsuarioModal(false)} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Cancelar</button>
            <button onClick={saveUsr} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GestionUsuarios;
