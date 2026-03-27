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
  desc?: string;
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
  const [form, setForm] = useState({ titulo:"", zona:"", operario:"", prioridad:"media", fecha:"", desc:"" });
  const [ok, setOk] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [tRes, iRes, uRes, zRes] = await Promise.all([
      supabase.from('tareas').select('id, zona, tarea, desc, asignado, estado, prioridad').neq('estado', 'completada').order('prioridad', { ascending: false }),
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
  // TODO: we need fetching today's completed for real 'hoy' stat.
  const hoy = tareas.filter(t => t.estado === "hecha" || t.estado === "completada").length; 

  const crearTarea = async () => {
    if (!form.titulo || !form.zona || !form.operario) return;

    // Obtener UUID del usuario (asumiendo formato form.operario === id)
    const userSelected = usuarios.find(u => u.id === form.operario);
    const opName = userSelected ? `${userSelected.nombre} ${userSelected.apellidos}` : form.operario;

    const insertData = {
      zona: form.zona,
      tarea: form.titulo,
      desc: form.desc,
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
      setForm({ titulo:"", zona:"", operario:"", prioridad:"media", fecha:"", desc:"" });
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

  if (loading) return <div className="p-6 text-gray-500 font-semibold">Cargando panel...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-bold text-gray-800">Panel de control</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
          + Crear Nueva Tarea
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-5">Resumen general: tareas activas, alertas e historial del sistema en tiempo real</p>

      {ok && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm font-semibold shadow-sm">✓ Tarea creada y asignada correctamente.</div>}

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          ["Tareas Pendientes", pendientes, <Clock size={20} />, "bg-yellow-50 border-yellow-200 text-yellow-700"],
          ["Alertas Críticas",  alertas,    <AlertTriangle size={20} />, "bg-red-50 border-red-200 text-red-700"],
          ["Completadas Hoy",   hoy,        <CheckCircle size={20} />,  "bg-green-50 border-green-200 text-green-700"],
          ["En Curso",          en_curso,   <RefreshCw size={20} className="animate-spin-slow" />, "bg-blue-50 border-blue-200 text-blue-700"],
        ].map(([l, v, ic, cls]) => (
          <div key={l as string} className={`bg-white rounded-xl border p-4 shadow-sm ${cls.toString().split(" ").slice(1).join(" ")}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">{l as string}</p>
                <p className={`text-3xl font-extrabold ${cls.toString().split(" ").pop()}`}>{v as number}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/50">{ic as React.ReactNode}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-xl border shadow-sm p-5">
          <div className="flex justify-between items-center mb-1">
            <p className="font-bold text-gray-700 text-sm">Incidencias por mes</p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Abiertas</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Resueltas</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-3">Últimas estadísticas simuladas</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={CHART_DATA} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="Abiertas"  fill="#3B82F6" radius={[4,4,0,0]} />
              <Bar dataKey="Resueltas" fill="#22C55E" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <p className="font-bold text-gray-700 text-sm mb-3">Actividad reciente</p>
          <div className="flex flex-col gap-2">
            {actividadReciente.map((a, i) => (
              <div key={i} className="text-xs text-gray-500 pb-2 border-b border-gray-100 last:border-0">
                <p className="text-gray-700 font-medium">{a}</p>
                <p className="text-gray-400 mt-0.5">Hace {i+1} min</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <p className="font-bold text-gray-700 text-sm">Tareas activas</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{["Zona","Tarea","Asignado a","Estado","Prioridad"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody>
            {tareas.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No hay tareas activas.</td></tr>
            )}
            {tareas.map(t => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{t.zona}</td>
                <td className="px-4 py-3 text-gray-600">{t.tarea || t.desc}</td>
                <td className="px-4 py-3 text-gray-600">{t.asignado}</td>
                <td className="px-4 py-3"><Badge cls={ESTADO_BADGE[t.estado] || "bg-gray-100 text-gray-600"} label={t.estado === "en_curso" ? "En Curso" : t.estado.charAt(0).toUpperCase()+t.estado.slice(1)} /></td>
                <td className="px-4 py-3"><div className={`w-4 h-4 rounded-sm shadow-sm ${t.prioridad==="alta" ? "bg-red-400" : t.prioridad==="media" ? "bg-yellow-400" : "bg-green-400"}`}></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create task modal */}
      {showModal && (
        <Modal title="CREAR NUEVA TAREA" onClose={() => setShowModal(false)}>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Título de la Tarea</label>
            <input value={form.titulo} onChange={e => setForm({...form, titulo:e.target.value})}
              placeholder="Ej: Limpieza UCI – Quirófano 3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Zona</label>
              <select value={form.zona} onChange={e => setForm({...form, zona:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Seleccionar zona...</option>
                {zonas.map(z => <option key={z.id} value={z.nombre}>{z.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Asignar a</label>
              <select value={form.operario} onChange={e => setForm({...form, operario:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Seleccionar operario...</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} {u.apellidos}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Prioridad</label>
              <div className="flex gap-1">
                {["alta","media","baja"].map(p => (
                  <button key={p} onClick={() => setForm({...form, prioridad:p})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors capitalize ${form.prioridad===p ? "bg-blue-600 text-white border-blue-600 shadow-sm":"border-gray-300 text-gray-600"}`}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha límite</label>
              <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción</label>
            <textarea value={form.desc} onChange={e => setForm({...form, desc:e.target.value})}
              rows={2} placeholder="Instrucciones especiales..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Cancelar</button>
            <button onClick={crearTarea} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Crear Tarea</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
