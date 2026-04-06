import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, AlertTriangle, CheckCircle, RefreshCw, PlusCircle, History } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

// Import mock data for testing
import mockZonas from '../../mock/zonas.json';
import mockUsuarios from '../../mock/usuarios.json';
import mockTareas from '../../mock/tareas.json';
import mockIncidencias from '../../mock/incidencias.json';
import mockChartData from '../../mock/chartData.json';

interface Tarea {
  id: number;
  zona: string;
  tarea?: string;
  descripcion?: string;
  asignado: string;
  estado: string;
  prioridad: string;
}

interface Incidencia {
  id: number;
  prioridad: string;
  estado: string;
}

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

// Datos demo para el chart mientras se recolectan reales
const CHART_DATA = [
  { mes:"Nov", Abiertas:4, Resueltas:3 },
  { mes:"Dic", Abiertas:7, Resueltas:5 },
  { mes:"Ene", Abiertas:5, Resueltas:6 },
  { mes:"Feb", Abiertas:8, Resueltas:7 },
  { mes:"Mar", Abiertas:3, Resueltas:2 },
];

const Dashboard: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [zonas, setZonas] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo:"", zona:"", operario:"", prioridad:"media", fecha:"", descripcion:"" });
  const [ok, setOk] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [tRes, iRes, uRes, zRes] = await Promise.all([
      supabase.from('tareas').select('id, zona, tarea, descripcion, asignado, estado, prioridad').neq('estado', 'completada').order('prioridad', { ascending: false }),
      supabase.from('incidencias').select('id, prioridad, estado'),
      supabase.from('usuarios').select('id, nombre, apellidos').eq('rol', 'operario'),
      supabase.from('zonas').select('id, nombre')
    ]);

    // Usar datos reales si existen, sino usar mock para demo
    setTareas(tRes.data && tRes.data.length > 0 ? (tRes.data as Tarea[]) : (mockTareas as any[]));
    setIncidencias(iRes.data && iRes.data.length > 0 ? (iRes.data as Incidencia[]) : (mockIncidencias as any[]));
    setUsuarios(uRes.data && uRes.data.length > 0 ? (uRes.data || []) : mockUsuarios);
    setZonas(zRes.data && zRes.data.length > 0 ? (zRes.data || []) : mockZonas);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendientes = tareas.filter(t => t.estado === "pendiente").length;
  const alertas = incidencias.filter(i => i.prioridad === "alta" && i.estado !== "resuelta").length;
  const en_curso = tareas.filter(t => t.estado === "en_curso").length;
  const hoy = tareas.filter(t => t.estado === "hecha" || t.estado === "completada").length; 

  const crearTarea = async () => {
    if (!form.titulo || !form.zona || !form.operario) return;

    const userSelected = usuarios.find(u => u.id === form.operario);
    const opName = userSelected ? `${userSelected.nombre} ${userSelected.apellidos}` : form.operario;

    const insertData = {
      zona: form.zona,
      tarea: form.titulo,
      descripcion: form.descripcion,
      asignado: opName,
      asignado_id: form.operario,
      estado: "pendiente",
      prioridad: form.prioridad,
    };

    const { data, error } = await supabase.from('tareas').insert([insertData]).select();
    
    if (!error && data) {
      setTareas(prev => [...prev, data[0] as Tarea]);
      setShowModal(false);
      setOk(true);
      setForm({ titulo:"", zona:"", operario:"", prioridad:"media", fecha:"", descripcion:"" });
      setTimeout(() => setOk(false), 3000);
    } else {
      console.error(error);
      alert('Error guardando la tarea');
    }
  };

  const actividadReciente = [
    "Juan Pérez completó tarea en UCI Quirófano 3",
    "Nueva incidencia: Aspiradora averiada",
    "Notificación urgente enviada a Carlos Fernández",
    "Nuevo operario registrado: Ana Martínez",
  ];

  if (loading) return <div className="p-6 text-gray-500 font-semibold font-sans">Cargando panel...</div>;

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight">Panel de control</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-100">
          + Crear Nueva Tarea
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-8 font-medium italic">Resumen general y estado del sistema en tiempo real</p>

      {ok && <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-6 text-sm font-bold animate-pulse">✓ Tarea creada correctamente.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          ["Tareas Pendientes", pendientes, <Clock size={22} />, "text-yellow-600 bg-yellow-50"],
          ["Alertas Críticas",  alertas,    <AlertTriangle size={22} />, "text-red-600 bg-red-50"],
          ["Completadas Hoy",   hoy,        <CheckCircle size={22} />,  "text-green-600 bg-green-50"],
          ["En Curso",          en_curso,   <RefreshCw size={22} className="animate-spin-slow" />, "text-blue-600 bg-blue-50"],
        ].map(([l, v, ic, cls]) => (
          <div key={l as string} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">{l as string}</p>
                <p className={`text-4xl font-black ${(cls as string).split(' ')[0]}`}>{v as number}</p>
              </div>
              <div className={`p-4 rounded-2xl ${(cls as string).split(' ')[1]}`}>
                {ic as React.ReactNode}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-6">Incidencias por mes</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={CHART_DATA} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fontWeight:600, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontWeight:600, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="Abiertas"  fill="#3B82F6" radius={[6,6,0,0]} />
              <Bar dataKey="Resueltas" fill="#10B981" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-6">Actividad reciente</p>
          <div className="flex flex-col gap-5">
            {actividadReciente.map((a, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-1.5 h-auto bg-gray-100 group-hover:bg-blue-400 rounded-full transition-colors"></div>
                <div>
                  <p className="text-xs text-gray-700 font-bold leading-relaxed">{a}</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1 uppercase">Hace {i+1} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">Tareas activas</p>
          <button onClick={fetchData} className="text-blue-500 hover:text-blue-600 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>{["Zona","Tarea","Asignado","Estado","Prioridad"].map(h => <th key={h} className="text-left px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tareas.length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-bold italic">No hay tareas activas en este momento.</td></tr>
              )}
              {tareas.map(t => (
                <tr key={t.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-5 font-bold text-[#1e3a5f] text-sm">{t.zona}</td>
                  <td className="px-8 py-5 text-gray-500 text-sm font-medium">{t.tarea || t.descripcion}</td>
                  <td className="px-8 py-5 text-[#1e3a5f] text-sm font-bold flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px]">
                      {t.asignado.split(' ').map(n => n[0]).join('')}
                    </div>
                    {t.asignado}
                  </td>
                  <td className="px-8 py-5">
                    <Badge cls={ESTADO_BADGE[t.estado] || "bg-gray-100 text-gray-600"} label={t.estado === "en_curso" ? "En Curso" : t.estado.charAt(0).toUpperCase()+t.estado.slice(1)} />
                  </td>
                  <td className="px-8 py-5">
                    <Badge cls={PRIORIDAD_BADGE[t.prioridad] || "bg-gray-100 text-gray-600"} label={t.prioridad.charAt(0).toUpperCase()+t.prioridad.slice(1)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="NUEVA TAREA" onClose={() => setShowModal(false)}>
           {/* Form content matched to new style */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título de la Tarea</label>
              <input value={form.titulo} onChange={e => setForm({...form, titulo:e.target.value})}
                placeholder="Ej: Limpieza profunda UCI Quirófano"
                className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion:e.target.value})}
                  rows={2} placeholder="Instrucciones especiales..."
                  className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zona</label>
                <select value={form.zona} onChange={e => setForm({...form, zona:e.target.value})}
                  className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                  <option value="">Seleccionar...</option>
                  {zonas.map(z => <option key={z.id} value={z.nombre}>{z.nombre}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operario</label>
                <select value={form.operario} onChange={e => setForm({...form, operario:e.target.value})}
                  className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                  <option value="">Seleccionar...</option>
                  {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} {u.apellidos}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prioridad</label>
                <div className="flex gap-4">
                  {["alta","media","baja"].map(p => (
                    <button key={p} onClick={() => setForm({...form, prioridad:p})}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl border transition-all ${form.prioridad===p ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-lg shadow-blue-900/10":"border-gray-100 bg-gray-50/50 text-gray-400 hover:bg-gray-100"}`}>
                      {p}
                    </button>
                  ))}
                </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={() => setShowModal(false)} className="px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-colors">Cancelar</button>
              <button onClick={crearTarea} className="flex-1 bg-blue-500 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-100 transition-all active:scale-[0.98]">Asignar Tarea</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
