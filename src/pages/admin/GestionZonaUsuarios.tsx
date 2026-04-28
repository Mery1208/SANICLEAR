import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../supabase/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/Button';
import { Plus, Search, X, AlertTriangle } from 'lucide-react';
import { useBusquedaStore } from '../../store/busquedaStore';

const NIVEL_BADGE: Record<string, string> = { 
  alto: "bg-red-100 text-red-700", 
  medio: "bg-yellow-100 text-yellow-700", 
  bajo: "bg-green-100 text-green-700" 
};

const ROL_BADGE: Record<string, string> = { 
  superadmin: "bg-red-100 text-red-700", 
  admin: "bg-purple-100 text-purple-700", 
  operario: "bg-blue-100 text-blue-700" 
};

type TabType = 'zonas' | 'usuarios';

const Gestion: React.FC = () => {
  const { query } = useBusquedaStore();
  const [tab, setTab] = useState<TabType>('zonas');
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState("");

  // Zonas state
  const [zonas, setZonas] = useState<any[]>([]);
  const [showZonaModal, setShowZonaModal] = useState(false);
  const [editZona, setEditZona] = useState<any>(null);
  const [zonaForm, setZonaForm] = useState({ nombre: "", tipo: "Habitación", planta: 1, metros: "", nivel: "bajo", estado: "Activo" });

  // Usuarios state
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  const [editUsuario, setEditUsuario] = useState<any>(null);
  const [usuarioForm, setUsuarioForm] = useState({ nombre: "", apellidos: "", email: "", rol: "operario", turno: "Mañana" });

  const [deleteTarget, setDeleteTarget] = useState<{ tipo: 'zona' | 'usuario', id: any, nombre: string } | null>(null);

  // Filtros por búsqueda global
  const zonasFiltradas = useMemo(() => {
    if (!query.trim()) return zonas;
    const q = query.toLowerCase();
    return zonas.filter(z =>
      z.nombre.toLowerCase().includes(q) ||
      (z.tipo && z.tipo.toLowerCase().includes(q))
    );
  }, [zonas, query]);

  const usuariosFiltrados = useMemo(() => {
    if (!query.trim()) return usuarios;
    const q = query.toLowerCase();
    return usuarios.filter(u =>
      u.nombre.toLowerCase().includes(q) ||
      (u.apellidos && u.apellidos.toLowerCase().includes(q)) ||
      u.email.toLowerCase().includes(q)
    );
  }, [usuarios, query]);

  // Fetch Zonas
  const fetchZonas = async () => {
    setLoading(true);
    try {
      const result = await supabase.from('zonas').select('*').order('nombre', { ascending: true });

      if (result?.error) throw result.error;
      setZonas(result.data || []);
    } catch (err: any) {
      console.error('Error fetching zonas:', err);
      setZonas([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const result = await supabase.from('usuarios').select('*').order('nombre', { ascending: true });

      if (result?.error) throw result.error;
      setUsuarios(result.data || []);
    } catch (err: any) {
      console.error('Error fetching usuarios:', err);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'zonas') fetchZonas();
    else fetchUsuarios();
  }, [tab]);

  // Zonas functions
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
      if (!error) {
        setZonas(prev => prev.map(z => z.id === editZona.id ? { ...zonaForm, id: editZona.id } : z));
      }
    } else {
      const { data, error } = await supabase.from('zonas').insert([zonaForm]).select();
      if (!error && data) {
        setZonas(prev => [...prev, data[0]]);
      }
    }
    setShowZonaModal(false);
    setConfirm("Zona");
    setTimeout(() => setConfirm(""), 2500);
  };

  const requestDeleteZona = (z: any) => {
    setDeleteTarget({ tipo: 'zona', id: z.id, nombre: z.nombre });
  };

  // Usuarios functions
  const openEditUsuario = (u: any) => {
    setEditUsuario(u);
    setUsuarioForm({ nombre: u.nombre, apellidos: u.apellidos || "", email: u.email, rol: u.rol, turno: u.turno || "Mañana" });
    setShowUsuarioModal(true);
  };

  const openNewUsuario = () => {
    setEditUsuario(null);
    setUsuarioForm({ nombre: "", apellidos: "", email: "", rol: "operario", turno: "Mañana" });
    setShowUsuarioModal(true);
  };

  const saveUsuario = async () => {
    if (!usuarioForm.nombre || !usuarioForm.email) return;

    const userData = {
      nombre: usuarioForm.nombre,
      apellidos: usuarioForm.apellidos,
      email: usuarioForm.email,
      rol: usuarioForm.rol,
      turno: usuarioForm.turno
    };

    if (editUsuario) {
      const { error } = await supabase.from('usuarios').update(userData).eq('id', editUsuario.id);
      if (!error) {
        setUsuarios(prev => prev.map(u => u.id === editUsuario.id ? { ...userData, id: editUsuario.id } : u));
      }
    } else {
      const { data, error } = await supabase.from('usuarios').insert([userData]).select();
      if (!error && data) {
        setUsuarios(prev => [...prev, data[0]]);
      }
    }
    setShowUsuarioModal(false);
    setConfirm("Usuario");
    setTimeout(() => setConfirm(""), 2500);
  };

  const requestDeleteUsuario = (u: any) => {
    setDeleteTarget({ tipo: 'usuario', id: u.id, nombre: `${u.nombre} ${u.apellidos || ''}`.trim() });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.tipo === 'zona') {
      await supabase.from('zonas').delete().eq('id', deleteTarget.id);
      setZonas(prev => prev.filter(z => z.id !== deleteTarget.id));
    } else {
      await supabase.from('usuarios').delete().eq('id', deleteTarget.id);
      setUsuarios(prev => prev.filter(u => u.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start">
        <div className="text-left">
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Gestión de Zonas y Usuarios</h2>
          <p className="text-gray-400 text-sm font-medium italic">
            {tab === 'zonas'
              ? query
                ? `Mostrando ${zonasFiltradas.length} de ${zonas.length} zonas`
                : `Tienes ${zonas.length} zonas registradas.`
              : query
              ? `Mostrando ${usuariosFiltrados.length} de ${usuarios.length} usuarios`
              : `Tienes ${usuarios.length} usuarios registrados.`
            }
          </p>
        </div>
        <Button
          text={tab === 'zonas' ? "Crear Zona" : "Crear Usuario"}
          onClick={tab === 'zonas' ? openNewZona : openNewUsuario}
          variant="primary"
          icon={Plus}
          className="px-4 py-2 shadow-sm"
        />
      </div>

      {confirm && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm font-semibold shadow-sm">✓ {confirm} guardado correctamente.</div>}

      {/* Tabs - Selector de Vistas */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-1 p-1 bg-white rounded-full border border-gray-200 shadow-sm">
        <button
          onClick={() => setTab('zonas')}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer ${
            tab === 'zonas' 
              ? 'bg-[#3b82f6] text-white shadow-sm' 
              : 'bg-transparent text-[#3b82f6] hover:bg-gray-50'
          }`}
        >
          Zonas
        </button>
        <button
          onClick={() => setTab('usuarios')}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer ${
            tab === 'usuarios' 
              ? 'bg-[#3b82f6] text-white shadow-sm' 
              : 'bg-transparent text-[#3b82f6] hover:bg-gray-50'
          }`}
        >
          Usuarios
        </button>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-gray-500 font-semibold mb-6">Cargando...</div>
      ) : tab === 'zonas' ? (
        // Zonas list
        <div className="flex flex-col gap-3">
          {zonasFiltradas.length === 0 && query ? (
            <div className="p-6 text-center text-gray-500 bg-white border border-dashed rounded-xl">
              No se encontraron zonas para "{query}".
            </div>
          ) : zonasFiltradas.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-white border border-dashed rounded-xl">No hay zonas.</div>
          ) : (
            zonasFiltradas.map(z => (
              <div key={z.id} className="bg-white rounded-xl border shadow-sm p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-gray-800 text-lg">{z.nombre}</p>
                  <p className="text-sm text-gray-500">Planta {z.planta} · {z.metros} m² · {z.tipo}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge cls={NIVEL_BADGE[z.nivel] || "bg-gray-100 text-gray-700"} label={`Prioridad ${z.nivel}`} />
                    <Badge cls={z.estado === 'Activo' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} label={z.estado} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button text="Editar" onClick={() => openEditZona(z)} variant="secondary" className="px-3 py-1.5" />
                  <Button text="Eliminar" onClick={() => requestDeleteZona(z)} variant="danger" className="px-3 py-1.5" />
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // Usuarios list
        <div className="flex flex-col gap-3">
          {usuariosFiltrados.length === 0 && query ? (
            <div className="p-6 text-center text-gray-500 bg-white border border-dashed rounded-xl">
              No se encontraron usuarios para "{query}".
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-white border border-dashed rounded-xl">No hay usuarios.</div>
          ) : (
            usuariosFiltrados.map(u => (
              <div key={u.id} className="bg-white rounded-xl border shadow-sm p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-gray-800 text-lg">{u.nombre} {u.apellidos}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge cls={ROL_BADGE[u.rol] || "bg-gray-100 text-gray-700"} label={u.rol === 'superadmin' ? 'Super Admin' : u.rol === 'admin' ? 'Administrador' : 'Operario'} />
                    {u.turno && <Badge cls="bg-gray-100 text-gray-700" label={u.turno} />}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button text="Editar" onClick={() => openEditUsuario(u)} variant="secondary" className="px-3 py-1.5" />
                  <Button text="Eliminar" onClick={() => requestDeleteUsuario(u)} variant="danger" className="px-3 py-1.5" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Zona Modal */}
      {showZonaModal && (
        <Modal title={editZona ? "EDITAR ZONA" : "CREAR ZONA"} onClose={() => setShowZonaModal(false)}>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre de la Zona</label>
            <input value={zonaForm.nombre} onChange={e => setZonaForm({ ...zonaForm, nombre: e.target.value })}
              placeholder="Ej: UCI - Quirófano 1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de zona</label>
              <select value={zonaForm.tipo} onChange={e => setZonaForm({ ...zonaForm, tipo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {["Quirófano", "Habitación", "UCI", "Pasillo", "Consulta", "Sala", "Baño"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Planta</label>
              <input type="number" value={zonaForm.planta} onChange={e => setZonaForm({ ...zonaForm, planta: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Metros cuadrados</label>
              <input type="number" value={zonaForm.metros} onChange={e => setZonaForm({ ...zonaForm, metros: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Prioridad / Nivel</label>
              <select value={zonaForm.nivel} onChange={e => setZonaForm({ ...zonaForm, nivel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {["alto", "medio", "bajo"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button text="Cancelar" onClick={() => setShowZonaModal(false)} variant="secondary" className="flex-1 py-2.5" />
            <Button text="Guardar" onClick={saveZona} variant="primary" className="flex-1 py-2.5 shadow-sm" />
          </div>
        </Modal>
      )}

      {/* Usuario Modal */}
      {showUsuarioModal && (
        <Modal title={editUsuario ? "EDITAR USUARIO" : "CREAR USUARIO"} onClose={() => setShowUsuarioModal(false)}>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
            <input value={usuarioForm.nombre} onChange={e => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
              placeholder="Ej: Juan"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Apellidos</label>
            <input value={usuarioForm.apellidos} onChange={e => setUsuarioForm({ ...usuarioForm, apellidos: e.target.value })}
              placeholder="Ej: Pérez García"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input value={usuarioForm.email} onChange={e => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
              placeholder="Ej: juan@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Rol</label>
              <select value={usuarioForm.rol} onChange={e => setUsuarioForm({ ...usuarioForm, rol: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="operario">Operario</option>
                <option value="admin">Administrador</option>
                <option value="superadmin">Super Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Turno</label>
              <select value={usuarioForm.turno} onChange={e => setUsuarioForm({ ...usuarioForm, turno: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button text="Cancelar" onClick={() => setShowUsuarioModal(false)} variant="secondary" className="flex-1 py-2.5" />
            <Button text="Guardar" onClick={saveUsuario} variant="primary" className="flex-1 py-2.5 shadow-sm" />
          </div>
        </Modal>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deleteTarget && (
        <Modal title="⚠️ CONFIRMAR ELIMINACIÓN" onClose={() => setDeleteTarget(null)}>
          <div className="flex flex-col items-center justify-center text-center gap-4 py-2">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">¿Estás completamente seguro?</h3>
            <p className="text-sm text-gray-500 font-medium">
              Estás a punto de eliminar {deleteTarget.tipo === 'zona' ? 'la zona' : 'el usuario'} <strong className="text-gray-800">"{deleteTarget.nombre}"</strong>.<br/>Esta acción <strong className="text-red-500">NO</strong> se puede deshacer.
            </p>
            <div className="flex gap-3 w-full mt-6">
              <Button text="No, cancelar" onClick={() => setDeleteTarget(null)} variant="secondary" className="flex-1 py-3" />
              <Button text="Sí, eliminar" onClick={confirmDelete} variant="danger" className="flex-1 py-3 shadow-lg shadow-red-100" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Gestion;