import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MapPinned, ClipboardList, AlertTriangle, Clock, RefreshCw, CheckCircle, UserCog, Edit2, Trash2, Plus } from 'lucide-react';
import { supabase } from '../../supabase/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/Button';

const ControlEntidad: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entidad, setEntidad] = useState<any>(null);
  const [counts, setCounts] = useState({ usuarios: 0, zonas: 0, tareas: 0, incidencias: 0 });
  const [tareasActivas, setTareasActivas] = useState<any[]>([]);
  const [incidenciasActivas, setIncidenciasActivas] = useState<any[]>([]);
  const [notificacionesEntidad, setNotificacionesEntidad] = useState<any[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [zonasList, setZonasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para edición de usuario
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({ nombre: '', apellidos: '', email: '', rol: 'operario', turno: 'Mañana' });
  const [actionMessage, setActionMessage] = useState("");

  // Estados CRUD Tareas
  const [showTareaModal, setShowTareaModal] = useState(false);
  const [editTarea, setEditTarea] = useState<any>(null);
  const [tareaForm, setTareaForm] = useState({ zona: '', tarea: '', descripcion: '', asignado: '', asignado_id: '', estado: 'pendiente', prioridad: 'media' });

  // Estados CRUD Incidencias
  const [showIncidModal, setShowIncidModal] = useState(false);
  const [editIncid, setEditIncid] = useState<any>(null);
  const [incidForm, setIncidForm] = useState({ titulo: '', zona: '', descripcion: '', prioridad: 'media', estado: 'abierta' });

  // Estados CRUD Notificaciones
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [editNotif, setEditNotif] = useState<any>(null);
  const [notifForm, setNotifForm] = useState({ titulo: '', mensaje: '', tipo: 'informativa', dest: 'todos' });
  
  const [deleteTarget, setDeleteTarget] = useState<{ tipo: 'usuario' | 'tarea' | 'incidencia' | 'notificacion', id: any, nombre: string } | null>(null);

  useEffect(() => {
    const fetchDetalles = async () => {
      if (!id) return;
      setLoading(true);
      
      const { data: ent } = await supabase.from('entidades').select('*').eq('id', id).single();
      setEntidad(ent);

      // Obtenemos todos los datos y listas operativas de la entidad en un solo bloque
      const [u, z, t, i, tareasData, personalData, incidData, notifData, zonasData] = await Promise.all([
        supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('entidad_id', id),
        supabase.from('zonas').select('*', { count: 'exact', head: true }).eq('entidad_id', id),
        supabase.from('tareas').select('*', { count: 'exact', head: true }).eq('entidad_id', id),
        supabase.from('incidencias').select('*', { count: 'exact', head: true }).eq('entidad_id', id),
        supabase.from('tareas').select('id, zona, tarea, descripcion, asignado, estado, prioridad').eq('entidad_id', id).neq('estado', 'completada').order('prioridad', { ascending: false }),
        supabase.from('usuarios').select('id, nombre, apellidos, email, rol, turno').eq('entidad_id', id).order('rol', { ascending: true }),
        supabase.from('incidencias').select('id, titulo, zona, estado, prioridad, operario, descripcion').eq('entidad_id', id).neq('estado', 'resuelta').order('prioridad', { ascending: false }),
        supabase.from('notificaciones').select('*').or(`entidad_id.eq.${id},entidad_id.is.null`).order('fecha', { ascending: false }),
        supabase.from('zonas').select('id, nombre').eq('entidad_id', id)
      ]);

      setCounts({
        usuarios: u.count || 0,
        zonas: z.count || 0,
        tareas: t.count || 0,
        incidencias: i.count || 0
      });
      setTareasActivas(tareasData.data || []);
      setPersonal(personalData.data || []);
      setIncidenciasActivas(incidData.data || []);
      setNotificacionesEntidad(notifData.data || []);
      setZonasList(zonasData.data || []);
      setLoading(false);
    };
    fetchDetalles();
  }, [id]);

  const ESTADO_BADGE: Record<string, string> = { 
    hecha:"bg-green-100 text-green-700", 
    completada:"bg-green-100 text-green-700", 
    pendiente:"bg-yellow-100 text-yellow-700", 
    en_curso:"bg-blue-100 text-blue-700" 
  };
  
  const PRIORIDAD_BADGE: Record<string, string> = { 
    alta: "bg-red-100 text-red-700", 
    media: "bg-yellow-100 text-yellow-700", 
    baja: "bg-green-100 text-green-700" 
  };

  const handleOpenEditUser = (u?: any) => {
    setEditUser(u || null);
    setUserForm(u ? { nombre: u.nombre || '', apellidos: u.apellidos || '', email: u.email || '', rol: u.rol || 'operario', turno: u.turno || 'Mañana' } : { nombre: '', apellidos: '', email: '', rol: 'operario', turno: 'Mañana' });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    const dataToSave = { ...userForm, entidad_id: id };
    if (editUser) {
      const { error } = await supabase.from('usuarios').update(dataToSave).eq('id', editUser.id);
      if (!error) {
        setPersonal(prev => prev.map(p => p.id === editUser.id ? { ...p, ...dataToSave } : p));
        setActionMessage("Usuario actualizado correctamente.");
      } else { alert('Error actualizando usuario: ' + error.message); return; }
    } else {
      if (!userForm.nombre || !userForm.email) return alert('Nombre y email son obligatorios');
      const { data, error } = await supabase.from('usuarios').insert([dataToSave]).select();
      if (!error && data) {
        setPersonal(prev => [data[0], ...prev]);
        setCounts(prev => ({...prev, usuarios: prev.usuarios + 1}));
        setActionMessage("Usuario creado correctamente.");
      } else { alert('Error al crear usuario: ' + error.message); return; }
    }
    setShowUserModal(false);
    setTimeout(() => setActionMessage(""), 3000);
  };

  const handleDeleteUser = (idU: string, nombre: string) => {
    setDeleteTarget({ tipo: 'usuario', id: idU, nombre });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { tipo, id } = deleteTarget;
    
    if (tipo === 'usuario') {
      const { error } = await supabase.from('usuarios').delete().eq('id', id);
      if (!error) {
        setPersonal(prev => prev.filter(x => x.id !== id));
        setCounts(prev => ({...prev, usuarios: Math.max(0, prev.usuarios - 1)}));
        setActionMessage("Usuario eliminado correctamente.");
      }
    } else if (tipo === 'tarea') {
      const { error } = await supabase.from('tareas').delete().eq('id', id);
      if (!error) {
        setTareasActivas(prev => prev.filter(x => x.id !== id));
        setCounts(prev => ({...prev, tareas: Math.max(0, prev.tareas - 1)}));
        setActionMessage("Tarea eliminada correctamente.");
      }
    } else if (tipo === 'incidencia') {
      const { error } = await supabase.from('incidencias').delete().eq('id', id);
      if (!error) {
        setIncidenciasActivas(prev => prev.filter(x => x.id !== id));
        setCounts(prev => ({...prev, incidencias: Math.max(0, prev.incidencias - 1)}));
        setActionMessage("Incidencia eliminada correctamente.");
      }
    } else if (tipo === 'notificacion') {
      const { error } = await supabase.from('notificaciones').delete().eq('id', id);
      if (!error) {
        setNotificacionesEntidad(prev => prev.filter(x => x.id !== id));
        setActionMessage("Notificación eliminada correctamente.");
      }
    }
    
    setDeleteTarget(null);
    setTimeout(() => setActionMessage(""), 3000);
  };

  // Súper-acciones operativas
  const handleCompletarTarea = async (tareaId: string) => {
    const { error } = await supabase.from('tareas').update({ estado: 'completada' }).eq('id', tareaId);
    if (!error) {
      setTareasActivas(prev => prev.filter(t => t.id !== tareaId));
      setCounts(prev => ({ ...prev, tareas: Math.max(0, prev.tareas - 1) }));
      setActionMessage("Tarea completada remotamente con éxito.");
      setTimeout(() => setActionMessage(""), 3000);
    }
  };

  const handleResolverIncidencia = async (incidId: string) => {
    const { error } = await supabase.from('incidencias').update({ estado: 'resuelta' }).eq('id', incidId);
    if (!error) {
      setIncidenciasActivas(prev => prev.filter(i => i.id !== incidId));
      setCounts(prev => ({ ...prev, incidencias: Math.max(0, prev.incidencias - 1) }));
      setActionMessage("Incidencia marcada como resuelta.");
      setTimeout(() => setActionMessage(""), 3000);
    }
  };

  // --- CRUD TAREAS ---
  const openTarea = (t?: any) => {
    setEditTarea(t || null);
    setTareaForm(t ? { ...t } : { zona: '', tarea: '', descripcion: '', asignado: '', asignado_id: '', estado: 'pendiente', prioridad: 'media' });
    setShowTareaModal(true);
  };
  const saveTarea = async () => {
    const dataToSave = { ...tareaForm, entidad_id: id };
    if (editTarea) {
      const { error } = await supabase.from('tareas').update(dataToSave).eq('id', editTarea.id);
      if (!error) {
        setTareasActivas(prev => prev.map(x => x.id === editTarea.id ? { ...x, ...dataToSave } : x));
        setActionMessage("Tarea actualizada correctamente.");
      }
    } else {
      const { data, error } = await supabase.from('tareas').insert([dataToSave]).select();
      if (!error && data) {
        setTareasActivas(prev => [data[0], ...prev]);
        setCounts(prev => ({...prev, tareas: prev.tareas + 1}));
        setActionMessage("Tarea creada correctamente.");
      }
    }
    setShowTareaModal(false);
    setTimeout(() => setActionMessage(""), 3000);
  };
  const deleteTarea = (idT: string, nombre: string) => {
    setDeleteTarget({ tipo: 'tarea', id: idT, nombre });
  };

  // --- CRUD INCIDENCIAS ---
  const openIncid = (i?: any) => {
    setEditIncid(i || null);
    setIncidForm(i ? { ...i } : { titulo: '', zona: '', descripcion: '', prioridad: 'media', estado: 'abierta' });
    setShowIncidModal(true);
  };
  const saveIncid = async () => {
    const dataToSave = { ...incidForm, entidad_id: id, tipo: editIncid?.tipo || 'Otro', operario: editIncid?.operario || 'Sistema' };
    if (editIncid) {
      const { error } = await supabase.from('incidencias').update(dataToSave).eq('id', editIncid.id);
      if (!error) {
        setIncidenciasActivas(prev => prev.map(x => x.id === editIncid.id ? { ...x, ...dataToSave } : x));
        setActionMessage("Incidencia actualizada correctamente.");
      }
    } else {
      const { data, error } = await supabase.from('incidencias').insert([dataToSave]).select();
      if (!error && data) {
        setIncidenciasActivas(prev => [data[0], ...prev]);
        setCounts(prev => ({...prev, incidencias: prev.incidencias + 1}));
        setActionMessage("Incidencia reportada correctamente.");
      }
    }
    setShowIncidModal(false);
    setTimeout(() => setActionMessage(""), 3000);
  };
  const deleteIncid = (idI: string, nombre: string) => {
    setDeleteTarget({ tipo: 'incidencia', id: idI, nombre });
  };

  // --- CRUD NOTIFICACIONES ---
  const openNotif = (n?: any) => {
    setEditNotif(n || null);
    setNotifForm(n ? { ...n } : { titulo: '', mensaje: n?.mensaje || n?.msg || '', tipo: 'informativa', dest: 'todos' });
    setShowNotifModal(true);
  };
  const saveNotif = async () => {
    const dataToSave = { ...notifForm, entidad_id: id };
    if (editNotif) {
      const { error } = await supabase.from('notificaciones').update(dataToSave).eq('id', editNotif.id);
      if (!error) setNotificacionesEntidad(prev => prev.map(x => x.id === editNotif.id ? { ...x, ...dataToSave } : x));
    } else {
      const { data, error } = await supabase.from('notificaciones').insert([dataToSave]).select();
      if (!error && data) setNotificacionesEntidad(prev => [data[0], ...prev]);
    }
    setShowNotifModal(false);
  };
  const deleteNotif = (idN: string, nombre: string) => {
    setDeleteTarget({ tipo: 'notificacion', id: idN, nombre });
  };

  if (loading) return <div className="p-10 text-gray-400 font-bold animate-pulse text-center">Cargando panel de control...</div>;
  if (!entidad) return <div className="p-10 text-center text-red-500 font-bold">Entidad no encontrada.</div>;

  return (
    <div className="font-sans">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button onClick={() => navigate('/superadmin/entidades')} className="flex items-center justify-center w-10 h-10 shrink-0 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Panel de Control: {entidad.nombre_hospital}</h2>
          <p className="text-gray-400 text-sm font-medium italic">Gestión maestra con permisos extendidos · {entidad.codigo}</p>
        </div>
      </div>
      
      {actionMessage && <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-6 text-sm font-bold animate-pulse">✓ {actionMessage}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { title: 'Usuarios', value: counts.usuarios, icon: <Users size={24} />, accent: 'text-blue-600 bg-blue-50' },
          { title: 'Zonas', value: counts.zonas, icon: <MapPinned size={24} />, accent: 'text-violet-600 bg-violet-50' },
          { title: 'Tareas Activas', value: counts.tareas, icon: <Clock size={24} />, accent: 'text-amber-600 bg-amber-50' },
          { title: 'Incidencias', value: counts.incidencias, icon: <AlertTriangle size={24} />, accent: 'text-red-600 bg-red-50' },
        ].map((card) => (
          <div key={card.title} className="bg-white rounded-xl border border-gray-100 p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] lg:text-[10px] uppercase font-black text-gray-400 tracking-wider truncate" title={card.title}>{card.title}</p>
                <p className={`text-xl lg:text-2xl font-black ${card.accent.split(' ')[0]}`}>{card.value}</p>
              </div>
              <div className={`p-2 lg:p-3 rounded-lg shrink-0 ${card.accent.split(' ')[1]}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Tareas de la entidad */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">Tareas Activas del Centro</p>
            <button onClick={() => openTarea()} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Añadir Tarea"><Plus size={18} /></button>
          </div>
          <div className="overflow-x-auto flex-1 max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>{["Zona","Asignado","Estado","Acción"].map(h => <th key={h} className="text-left px-4 sm:px-6 py-3 sm:py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tareasActivas.length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-gray-400 font-bold italic">No hay tareas pendientes.</td></tr>)}
                {tareasActivas.map((t: any) => (
                  <tr key={t.id} className="hover:bg-blue-50/20">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-[#1e3a5f] text-xs whitespace-nowrap">{t.zona}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#1e3a5f] text-xs font-bold whitespace-nowrap">{t.asignado}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <Badge cls={ESTADO_BADGE[t.estado] || "bg-gray-100"} label={t.estado} />
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 flex gap-2">
                      <button onClick={() => handleCompletarTarea(t.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Completar"><CheckCircle size={16} /></button>
                      <button onClick={() => openTarea(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 size={16} /></button>
                      <button onClick={() => deleteTarea(t.id, t.tarea || t.descripcion || 'Tarea')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Incidencias de la entidad */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">Incidencias Abiertas</p>
            <button onClick={() => openIncid()} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Añadir Incidencia"><Plus size={18} /></button>
          </div>
          <div className="overflow-x-auto flex-1 max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>{["Título","Zona","Prioridad","Acción"].map(h => <th key={h} className="text-left px-4 sm:px-6 py-3 sm:py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {incidenciasActivas.length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-gray-400 font-bold italic">No hay incidencias críticas ni abiertas.</td></tr>)}
                {incidenciasActivas.map((i: any) => (
                  <tr key={i.id} className="hover:bg-red-50/20">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-[#1e3a5f] text-xs min-w-[150px]">{i.titulo}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-xs font-semibold whitespace-nowrap">{i.zona}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <Badge cls={PRIORIDAD_BADGE[i.prioridad] || "bg-gray-100"} label={i.prioridad} />
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 flex gap-2">
                      <button onClick={() => handleResolverIncidencia(i.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Resolver"><CheckCircle size={16} /></button>
                      <button onClick={() => openIncid(i)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 size={16} /></button>
                      <button onClick={() => deleteIncid(i.id, i.titulo)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Administradores y Personal */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">Personal del Centro</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded-lg hidden sm:inline-block">Control Total</span>
              <button onClick={() => handleOpenEditUser()} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Añadir Personal"><Plus size={18} /></button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>{["Nombre","Rol","Acción"].map(h => <th key={h} className="text-left px-4 sm:px-6 py-3 sm:py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {personal.length === 0 && (<tr><td colSpan={3} className="p-8 text-center text-gray-400 font-bold italic">No hay personal asignado.</td></tr>)}
                {personal.map((u: any) => (
                  <tr key={u.id} className="hover:bg-blue-50/20">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <p className="font-bold text-[#1e3a5f] text-sm truncate max-w-[150px]">{u.nombre} {u.apellidos}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[150px]">{u.email}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      {u.rol === 'admin' ? (
                        <Badge cls="bg-purple-100 text-purple-700" label="Administrador" />
                      ) : (
                        <Badge cls="bg-gray-100 text-gray-600" label="Operario" />
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 flex gap-2">
                      <button onClick={() => handleOpenEditUser(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteUser(u.id, `${u.nombre} ${u.apellidos}`)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Últimas Notificaciones */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">Últimas Notificaciones</p>
            <button onClick={() => openNotif()} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Añadir Notificación"><Plus size={18} /></button>
          </div>
          <div className="overflow-x-auto flex-1 max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                    <tr>{["Título","Tipo","Emisor","Destino","Acción"].map(h => <th key={h} className="text-left px-4 sm:px-6 py-3 sm:py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notificacionesEntidad.length === 0 && (<tr><td colSpan={5} className="p-8 text-center text-gray-400 font-bold italic">No hay notificaciones recientes.</td></tr>)}
                {notificacionesEntidad.map((n: any) => (
                  <tr key={n.id} className="hover:bg-blue-50/20">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-[#1e3a5f] text-xs min-w-[150px]">{n.titulo}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <Badge cls={n.tipo === 'urgente' ? 'bg-red-100 text-red-700' : n.tipo === 'importante' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'} label={n.tipo} />
                    </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-xs font-semibold whitespace-nowrap">{n.usuarios ? `${n.usuarios.nombre} ${n.usuarios.apellidos || ''}` : 'Sistema'}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-xs font-semibold whitespace-nowrap">{n.dest}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 flex gap-2">
                    {n.entidad_id ? (
                       <>
                         <button onClick={() => openNotif(n)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 size={16} /></button>
                         <button onClick={() => deleteNotif(n.id, n.titulo)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                       </>
                    ) : (
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Global</span>
                    )}
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal CRUD Usuario */}
      {showUserModal && (
        <Modal title={editUser ? `EDITAR: ${editUser.nombre} ${editUser.apellidos}` : "NUEVO USUARIO"} onClose={() => setShowUserModal(false)}>
          <div className="flex flex-col gap-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                <input value={userForm.nombre} onChange={e => setUserForm({...userForm, nombre: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" placeholder="Nombre" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apellidos</label>
                <input value={userForm.apellidos} onChange={e => setUserForm({...userForm, apellidos: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" placeholder="Apellidos" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" placeholder="usuario@gmail.com" />
            </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rol en la Entidad</label>
                <select value={userForm.rol} onChange={e => setUserForm({...userForm, rol: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="operario">Operario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Turno</label>
                <select value={userForm.turno} onChange={e => setUserForm({...userForm, turno: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="Mañana">Mañana</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noche">Noche</option>
                </select>
              </div>
            </div>
          </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button text="Cancelar" variant="secondary" onClick={() => setShowUserModal(false)} className="flex-1 py-3" />
            <Button text={editUser ? "Guardar Cambios" : "Crear Usuario"} variant="primary" onClick={handleSaveUser} className="flex-1 py-3 shadow-lg shadow-blue-100" />
          </div>
        </Modal>
      )}

      {/* Modal CRUD Tarea */}
      {showTareaModal && (
        <Modal title={editTarea ? "EDITAR TAREA" : "NUEVA TAREA"} onClose={() => setShowTareaModal(false)}>
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
              <input value={tareaForm.tarea} onChange={e => setTareaForm({...tareaForm, tarea: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" placeholder="Ej: Limpiar Quirófano 2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
              <input value={tareaForm.descripcion} onChange={e => setTareaForm({...tareaForm, descripcion: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" placeholder="Detalles de la tarea..." />
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zona</label>
                <select value={tareaForm.zona} onChange={e => setTareaForm({...tareaForm, zona: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="">Selecciona Zona...</option>
                  {zonasList.map(z => <option key={z.id} value={z.nombre}>{z.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Asignado a</label>
                <select value={tareaForm.asignado_id} onChange={e => {
                   const u = personal.find(p => p.id === e.target.value);
                   setTareaForm({...tareaForm, asignado: u ? `${u.nombre} ${u.apellidos}` : '', asignado_id: e.target.value});
                }} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="">Sin Asignar</option>
                  {personal.filter(p => p.rol === 'operario').map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellidos}</option>)}
                </select>
              </div>
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                <select value={tareaForm.estado} onChange={e => setTareaForm({...tareaForm, estado: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="pendiente">Pendiente</option>
                  <option value="en_curso">En Curso</option>
                  <option value="completada">Completada</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prioridad</label>
                <select value={tareaForm.prioridad} onChange={e => setTareaForm({...tareaForm, prioridad: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>
          </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button text="Cancelar" variant="secondary" onClick={() => setShowTareaModal(false)} className="flex-1 py-3" />
            <Button text="Guardar Tarea" variant="primary" onClick={saveTarea} className="flex-1 py-3 shadow-lg shadow-blue-100" />
          </div>
        </Modal>
      )}

      {/* Modal CRUD Incidencia */}
      {showIncidModal && (
        <Modal title={editIncid ? "EDITAR INCIDENCIA" : "NUEVA INCIDENCIA"} onClose={() => setShowIncidModal(false)}>
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
              <input value={incidForm.titulo} onChange={e => setIncidForm({...incidForm, titulo: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" placeholder="Ej: Fuga de agua" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
              <input value={incidForm.descripcion} onChange={e => setIncidForm({...incidForm, descripcion: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" placeholder="Detalles de la incidencia..." />
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zona</label>
                <select value={incidForm.zona} onChange={e => setIncidForm({...incidForm, zona: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="">Selecciona Zona...</option>
                  {zonasList.map(z => <option key={z.id} value={z.nombre}>{z.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                <select value={incidForm.estado} onChange={e => setIncidForm({...incidForm, estado: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="abierta">Abierta</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="resuelta">Resuelta</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prioridad</label>
              <select value={incidForm.prioridad} onChange={e => setIncidForm({...incidForm, prioridad: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button text="Cancelar" variant="secondary" onClick={() => setShowIncidModal(false)} className="flex-1 py-3" />
            <Button text="Guardar Incidencia" variant="primary" onClick={saveIncid} className="flex-1 py-3 shadow-lg shadow-blue-100" />
          </div>
        </Modal>
      )}

      {/* Modal CRUD Notificación */}
      {showNotifModal && (
        <Modal title={editNotif ? "EDITAR NOTIFICACIÓN" : "NUEVA NOTIFICACIÓN"} onClose={() => setShowNotifModal(false)}>
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
              <input value={notifForm.titulo} onChange={e => setNotifForm({...notifForm, titulo: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" placeholder="Ej: Cambio de turno" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mensaje</label>
              <textarea value={notifForm.mensaje} onChange={e => setNotifForm({...notifForm, mensaje: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white resize-none" rows={3} placeholder="Escribe el mensaje..."></textarea>
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                <select value={notifForm.tipo} onChange={e => setNotifForm({...notifForm, tipo: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="informativa">Informativa</option>
                  <option value="importante">Importante</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destinatarios</label>
                <select value={notifForm.dest} onChange={e => setNotifForm({...notifForm, dest: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option value="todos">Todos</option>
                  <option value="turno_mañana">Turno Mañana</option>
                  <option value="turno_tarde">Turno Tarde</option>
                  <option value="turno_noche">Turno Noche</option>
                </select>
              </div>
            </div>
          </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-6">
            <Button text="Cancelar" variant="secondary" onClick={() => setShowNotifModal(false)} className="flex-1 py-3" />
            <Button text="Guardar Notificación" variant="primary" onClick={saveNotif} className="flex-1 py-3 shadow-lg shadow-blue-100" />
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
              Estás a punto de eliminar {deleteTarget.tipo === 'usuario' ? 'el usuario' : deleteTarget.tipo === 'tarea' ? 'la tarea' : deleteTarget.tipo === 'incidencia' ? 'la incidencia' : 'la notificación'} <strong className="text-gray-800">"{deleteTarget.nombre}"</strong>.<br/>Esta acción <strong className="text-red-500">NO</strong> se puede deshacer.
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
export default ControlEntidad;