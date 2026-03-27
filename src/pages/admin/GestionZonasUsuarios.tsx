import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Trash2, Edit, Plus, Users, MapPin, User, Mail, Lock, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabase/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

// Import mocks
import mockZonas from '../../mock/zonas.json';
import mockUsuarios from '../../mock/usuarios.json';

const GestionZonasUsuarios: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'zonas' | 'usuarios'>(location.pathname.includes('usuarios') ? 'usuarios' : 'zonas');
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState("");

  // Zonas State
  const [zonas, setZonas] = useState<any[]>([]);
  const [showZonaModal, setShowZonaModal] = useState(false);
  const [editZona, setEditZona] = useState<any>(null);
  const [zonaForm, setZonaForm] = useState({ nombre: "", tipo: "Habitación", planta: 1, metros: "", nivel: "bajo", estado: "Activo" });

  // Usuarios State
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  const [editUsuario, setEditUsuario] = useState<any>(null);
  const [usrForm, setUsrForm] = useState({ nombre: "", apellidos: "", email: "", password: "", turno: "Mañana" });

  const fetchData = async () => {
    setLoading(true);
    const [zRes, uRes] = await Promise.all([
      supabase.from('zonas').select('*').order('nombre', { ascending: true }),
      supabase.from('usuarios').select('*').order('nombre', { ascending: true })
    ]);
    
    setZonas(zRes.data && zRes.data.length > 0 ? zRes.data : mockZonas);
    setUsuarios(uRes.data && uRes.data.length > 0 ? uRes.data : mockUsuarios);
    
    setLoading(false);
  };

  useEffect(() => {
    setActiveTab(location.pathname.includes('usuarios') ? 'usuarios' : 'zonas');
  }, [location.pathname]);

  useEffect(() => {
    fetchData();
  }, []);

  // --- ZONAS LOGIC ---
  const openEditZona = (z: any) => {
    setEditZona(z);
    setZonaForm({ ...z });
    setShowZonaModal(true);
  };

  const openNewZona = () => {
    setEditZona(null);
    setZonaForm({ nombre: "", tipo: "Habitación", planta: 1, metros: "", nivel: "bajo", estado: "Activo" });
    setShowZonaModal(true);
  };

  const saveZona = async () => {
    if (!zonaForm.nombre) return;
    if (editZona) {
      const { error } = await supabase.from('zonas').update(zonaForm).eq('id', editZona.id);
      if (!error) setZonas(prev => prev.map(z => z.id === editZona.id ? { ...zonaForm, id: editZona.id } : z));
    } else {
      const { data, error } = await supabase.from('zonas').insert([zonaForm]).select();
      if (!error && data) setZonas(prev => [...prev, data[0]]);
    }
    setShowZonaModal(false);
    setConfirm("Zona");
    setTimeout(() => setConfirm(""), 2500);
  };

  const deleteZona = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta zona?')) return;
    await supabase.from('zonas').delete().eq('id', id);
    setZonas(prev => prev.filter(z => z.id !== id));
  };

  // --- USUARIOS LOGIC ---
  const openEditUsr = (u: any) => {
    setEditUsuario(u);
    setUsrForm({ ...u, password: "" });
    setShowUsuarioModal(true);
  };

  const openNewUsr = () => {
    setEditUsuario(null);
    setUsrForm({ nombre: "", apellidos: "", email: "", password: "", turno: "Mañana" });
    setShowUsuarioModal(true);
  };

  const saveUsr = async () => {
    if (!usrForm.nombre || !usrForm.email) return;
    if (editUsuario) {
      const { password, ...updateData } = usrForm;
      const { error } = await supabase.from('usuarios').update(updateData).eq('id', editUsuario.id);
      if (!error) setUsuarios(prev => prev.map(u => u.id === editUsuario.id ? { ...u, ...updateData } : u));
    } else {
      const insertData = { ...usrForm, rol: "operario" };
      delete (insertData as any).password;
      const { data, error } = await supabase.from('usuarios').insert([insertData]).select();
      if (!error && data) setUsuarios(prev => [...prev, data[0]]);
    }
    setShowUsuarioModal(false);
    setConfirm("Usuario");
    setTimeout(() => setConfirm(""), 2500);
  };

  const deleteUsr = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    await supabase.from('usuarios').delete().eq('id', id);
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-blue-600">Gestión de {activeTab === 'zonas' ? 'Zonas' : 'Usuarios'}</h2>
          <p className="text-sm text-gray-500">
            {activeTab === 'zonas' ? `Tienes ${zonas.length} zonas registradas.` : `Gestión total para ${usuarios.length} operarios activos.`}
          </p>
        </div>
        <button
          onClick={activeTab === 'zonas' ? openNewZona : openNewUsr}
          className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors"
        >
          {activeTab === 'zonas' ? '+ Crear Zona' : '+ Crear Usuario'}
        </button>
      </div>

      {confirm && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm font-semibold">✓ {confirm} guardado correctamente.</div>}

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('zonas')}
          className={`px-8 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${activeTab === 'zonas' ? 'bg-blue-400 text-white border-blue-400' : 'bg-white text-blue-400 border-blue-400'}`}
        >
          Zonas
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-8 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${activeTab === 'usuarios' ? 'bg-blue-400 text-white border-blue-400' : 'bg-white text-blue-400 border-blue-400'}`}
        >
          Usuarios
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-gray-500 font-semibold">Cargando...</div>
      ) : activeTab === 'zonas' ? (
        /* Zonas View - Card Based */
        <div className="flex flex-col gap-4">
          {zonas.length === 0 && <div className="p-10 text-center text-gray-500 bg-white border border-dashed rounded-3xl">No hay zonas.</div>}
          {zonas.map(z => (
            <div key={z.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <div>
                <p className="font-bold text-[#1e3a5f] text-lg">{z.nombre}</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Planta: {z.planta}</p>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">Metros: {z.metros}m²</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditZona(z)}
                  className="flex-1 bg-[#f0f7ff] text-[#1b84e7] hover:bg-blue-100 py-2.5 rounded-xl text-sm font-bold transition-colors text-center"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteZona(z.id)}
                  className="bg-red-50 text-red-500 hover:bg-red-100 p-2.5 rounded-xl transition-colors shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Usuarios View - Card Based (matched to Zonas) as requested */
        <div className="flex flex-col gap-4">
          {usuarios.length === 0 && <div className="p-10 text-center text-gray-500 bg-white border border-dashed rounded-3xl">No hay usuarios.</div>}
          {usuarios.map(u => (
            <div key={u.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[#1e3a5f] text-lg">{u.nombre} {u.apellidos}</p>
                  <p className="text-xs text-blue-400 font-semibold mt-1">{u.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">{u.rol || "Operario"}</span>
                    <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-bold uppercase">Turno {u.turno || "Mañana"}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditUsr(u)} 
                  className="flex-1 bg-[#f0f7ff] text-[#1b84e7] hover:bg-blue-100 py-2.5 rounded-xl text-sm font-bold transition-colors text-center"
                >
                  Modificar datos
                </button>
                <button 
                  onClick={() => deleteUsr(u.id)} 
                  className="bg-red-50 text-red-500 hover:bg-red-100 p-2.5 rounded-xl transition-colors shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showZonaModal && (
        <Modal title={editZona ? "Editar Zona" : "Crear Zona"} onClose={() => setShowZonaModal(false)}>
          <div className="flex flex-col gap-4">
            <input value={zonaForm.nombre} onChange={e => setZonaForm({ ...zonaForm, nombre: e.target.value })} placeholder="Nombre de la Zona" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-blue-400" />
            <div className="grid grid-cols-2 gap-4">
              <select value={zonaForm.tipo} onChange={e => setZonaForm({ ...zonaForm, tipo: e.target.value })} className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white">
                {["Quirófano", "Habitación", "UCI", "Pasillo", "Consulta", "Sala"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" value={zonaForm.planta} onChange={e => setZonaForm({ ...zonaForm, planta: parseInt(e.target.value) || 0 })} placeholder="Planta" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <input value={zonaForm.metros} onChange={e => setZonaForm({ ...zonaForm, metros: e.target.value })} placeholder="Metros cuadrados..." className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-blue-400" />
            <div className="flex gap-4 mt-2">
              <button onClick={() => setShowZonaModal(false)} className="flex-1 bg-gray-200 text-gray-500 py-3 rounded-xl text-sm font-bold">Cancelar</button>
              <button onClick={saveZona} className="flex-1 bg-blue-400 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-100">Guardar</button>
            </div>
          </div>
        </Modal>
      )}

      {showUsuarioModal && (
        <Modal title={editUsuario ? "Editar Usuario" : "Crear Usuario"} onClose={() => setShowUsuarioModal(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input value={usrForm.nombre} onChange={e => setUsrForm({ ...usrForm, nombre: e.target.value })} placeholder="Nombre" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-blue-400" />
              <input value={usrForm.apellidos} onChange={e => setUsrForm({ ...usrForm, apellidos: e.target.value })} placeholder="Apellidos" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <input value={usrForm.email} onChange={e => setUsrForm({ ...usrForm, email: e.target.value })} placeholder="Email" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-blue-400" />
            {!editUsuario && <input type="password" value={usrForm.password} onChange={e => setUsrForm({ ...usrForm, password: e.target.value })} placeholder="Contraseña" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-blue-400" />}
            <select value={usrForm.turno} onChange={e => setUsrForm({ ...usrForm, turno: e.target.value })} className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white">
              {["Mañana", "Tarde", "Noche"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex gap-4 mt-2">
              <button onClick={() => setShowUsuarioModal(false)} className="flex-1 bg-gray-200 text-gray-500 py-3 rounded-xl text-sm font-bold">Cancelar</button>
              <button onClick={saveUsr} className="flex-1 bg-blue-400 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-100">Guardar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GestionZonasUsuarios;
