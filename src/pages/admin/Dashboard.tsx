import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, AlertTriangle, CheckCircle, RefreshCw, PlusCircle, History, Search, X } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useBusquedaStore } from '../../store/busquedaStore';

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


const Dashboard: React.FC = () => {
  const { query } = useBusquedaStore();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [zonas, setZonas] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo:"", zona:"", operario:"", prioridad:"media", fecha:"", descripcion:"" });
  const [ok, setOk] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // Timeout de 10 segundos para no quedar cargando eternamente
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: Supabase no responde')), 10000)
    );

    try {
      const dataPromise = Promise.all([
        supabase.from('tareas').select('id, zona, tarea, descripcion, asignado, estado, prioridad').neq('estado', 'completada').order('prioridad', { ascending: false }),
        supabase.from('incidencias').select('id, prioridad, estado, created_at'),
        supabase.from('usuarios').select('id, nombre, apellidos').eq('rol', 'operario'),
        supabase.from('zonas').select('id, nombre')
      ]);

      const [tRes, iRes, uRes, zRes] = await Promise.race([dataPromise, timeoutPromise]) as any;

      // Verificar errores de Supabase
      if (tRes.error) throw new Error(`Tabla tareas: ${tRes.error.message}`);
      if (iRes.error) throw new Error(`Tabla incidencias: ${iRes.error.message}`);
      if (uRes.error) throw new Error(`Tabla usuarios: ${uRes.error.message}`);
      if (zRes.error) throw new Error(`Tabla zonas: ${zRes.error.message}`);

      setTareas((tRes.data || []) as Tarea[]);
      setIncidencias((iRes.data || []) as Incidencia[]);
      setUsuarios(uRes.data || []);
      setZonas(zRes.data || []);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      if (err.message.includes('Timeout')) {
        setError('Conexión con Supabase timeout. Verifica que la base de datos esté disponible.');
      } else if (err.message.includes('relation') || err.message.includes('does not exist')) {
        setError(`Tabla no configurada en Supabase. Ejecuta el schema SQL. Detalle: ${err.message}`);
      } else {
        setError(err.message || 'Error al cargar datos de Supabase.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar tareas por búsqueda
  const tareasFiltradas = useMemo(() => {
    if (!query.trim()) return tareas;
    const q = query.toLowerCase();
    return tareas.filter(t =>
      t.zona.toLowerCase().includes(q) ||
      (t.tarea && t.tarea.toLowerCase().includes(q)) ||
      (t.descripcion && t.descripcion.toLowerCase().includes(q)) ||
      t.asignado.toLowerCase().includes(q)
    );
  }, [tareas, query]);

  // Calcular CHART_DATA real basado en incidencias de Supabase
  const chartData = useMemo(() => {
    if (incidencias.length === 0) return [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const now = new Date();
    
    // Pre-cargamos siempre los últimos 6 meses (para que la gráfica no se vea vacía)
    const last6Months = Array.from({ length: 6 }).map((_, index) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, mes: months[d.getMonth()], Abiertas: 0, Resueltas: 0 };
    });

    const bucketMap = new Map(last6Months.map(b => [b.key, b]));
    
    incidencias.forEach((i: any) => {
      if (!i.created_at) return;
      const d = new Date(i.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = bucketMap.get(key);

      // Solo sumamos si la incidencia pertenece a uno de esos últimos 6 meses
      if (bucket) {
        if (i.estado === 'resuelta') bucket.Resueltas++;
        else bucket.Abiertas++;
      }
    });
    
    return last6Months;
  }, [incidencias]);

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
      alert(`Error guardando la tarea: ${error?.message || 'Verifica conexión con Supabase'}`);
    }
  };

  const actividadReciente = [
    "Juan Pérez completó tarea en UCI Quirófano 3",
    "Nueva incidencia: Aspiradora averiada",
    "Notificación urgente enviada a Carlos Fernández",
    "Nuevo operario registrado: Ana Martínez",
  ];

  if (loading) return <div className="p-6 text-gray-500 font-semibold font-sans">Cargando panel...</div>;

  if (error) {
    return (
      <div className="p-6 font-sans">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-2">Error al cargar datos</h3>
          <p className="text-sm mb-4">{error}</p>
          <div className="flex gap-3">
            <button onClick={fetchData} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-semibold transition-colors">
              Reintentar
            </button>
            <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer"
               className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-semibold transition-colors">
              Ver documentation Supabase
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start">
        <div className="text-left">
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Panel de Control</h2>
          <p className="text-gray-400 text-sm font-medium italic">Resumen general y estado del sistema en tiempo real</p>
      {(zonas.length === 0 || usuarios.length === 0) && (
            <p className="text-amber-600 text-sm font-semibold bg-amber-50 px-3 py-2 rounded-lg inline-block mt-2">
              ⚠️ Datos mínimos no configurados. Ve a <strong>Gestión Zonas y Usuarios</strong> para añadir zonas y operarios.
            </p>
          )}
        </div>
        <button
          onClick={() => {
            if (zonas.length === 0 || usuarios.length === 0) {
              alert('Primero debes crear al menos una zona y un operario en "Gestión Zonas y Usuarios"');
              return;
            }
            setShowModal(true);
          }}
          disabled={zonas.length === 0 || usuarios.length === 0}
          className={`${zonas.length === 0 || usuarios.length === 0
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          } shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-100`}
        >
          + Nueva Tarea
        </button>
      </div>

      {ok && <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-6 text-sm font-bold animate-pulse">✓ Tarea creada correctamente.</div>}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        {[
          ["Pendientes", pendientes, <Clock size={16} />, "text-yellow-600 bg-yellow-50"],
          ["Alertas",     alertas,    <AlertTriangle size={16} />, "text-red-600 bg-red-50"],
          ["Hechas",      hoy,       <CheckCircle size={16} />,  "text-green-600 bg-green-50"],
          ["En Curso",    en_curso,   <RefreshCw size={16} />, "text-blue-600 bg-blue-50"],
        ].map(([l, v, ic, cls]) => (
          <div key={l as string} className="bg-white rounded-lg border border-gray-50 p-2 lg:p-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">{l as string}</p>
                <p className={`text-lg font-bold ${(cls as string).split(' ')[0]}`}>{v as number}</p>
              </div>
              <div className={`flex-shrink-0 p-2 rounded-lg ${(cls as string).split(' ')[1]}`}>
                {ic as React.ReactNode}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 sm:p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-6">Incidencias por mes</p>
          {chartData.length === 0 ? (
             <div className="h-[240px] flex items-center justify-center text-gray-400 font-semibold text-sm border-2 border-dashed border-gray-100 rounded-2xl">
               Aún no hay datos históricos de incidencias
             </div>
          ) : (
            <ResponsiveContainer width="100%" height={240} initialDimension={{ width: 10, height: 240 }}>
              <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fontWeight:600, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontWeight:600, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="Abiertas"  fill="#3B82F6" radius={[6,6,0,0]} />
              <Bar dataKey="Resueltas" fill="#10B981" radius={[6,6,0,0]} />
            </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 sm:p-8">
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
        <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">Tareas activas</p>
          <button onClick={fetchData} className="text-blue-500 hover:text-blue-600 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
            <tr>{["Zona","Tarea","Asignado","Estado","Prioridad"].map(h => <th key={h} className="text-left px-5 sm:px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(query ? tareasFiltradas : tareas).length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-bold italic">
                  {query ? `No se encontraron tareas para "${query}"` : "No hay tareas activas en este momento."}
                </td></tr>
              )}
              {(query ? tareasFiltradas : tareas).map(t => (
                <tr key={t.id} className="hover:bg-blue-50/20 transition-colors group">
                <td className="px-5 sm:px-8 py-4 sm:py-5 font-bold text-[#1e3a5f] text-sm">{t.zona}</td>
                <td className="px-5 sm:px-8 py-4 sm:py-5 text-gray-500 text-sm font-medium min-w-[150px]">{t.tarea || t.descripcion}</td>
                <td className="px-5 sm:px-8 py-4 sm:py-5 text-[#1e3a5f] text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px]">
                      {t.asignado.split(' ').map(n => n[0]).join('')}
                    </div>
                    {t.asignado}
                  </td>
                <td className="px-5 sm:px-8 py-4 sm:py-5">
                    <Badge cls={ESTADO_BADGE[t.estado] || "bg-gray-100 text-gray-600"} label={t.estado === "en_curso" ? "En Curso" : t.estado.charAt(0).toUpperCase()+t.estado.slice(1)} />
                  </td>
                <td className="px-5 sm:px-8 py-4 sm:py-5">
                    <Badge cls={PRIORIDAD_BADGE[t.prioridad] || "bg-gray-100 text-gray-600"} label={t.prioridad.charAt(0).toUpperCase()+t.prioridad.slice(1)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="NUEVA TAREA" onClose={() => setShowModal(false)} maxWidth="max-w-2xl">
          <div className="flex flex-col gap-4 sm:gap-5">
            {zonas.length === 0 || usuarios.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-sm font-semibold">
                ⚠️ No puedes crear tareas hasta que al menos exista:
                <ul className="list-disc ml-5 mt-2">
                  {zonas.length === 0 && <li>Una zona (en Gestión Zonas)</li>}
                  {usuarios.length === 0 && <li>Un operario (en Gestión Usuarios)</li>}
                </ul>
                <button onClick={() => setShowModal(false)} className="mt-3 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título de la Tarea</label>
                    <input value={form.titulo} onChange={e => setForm({...form, titulo:e.target.value})}
                      placeholder="Ej: Limpieza profunda UCI"
                      className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-4 py-2.5 sm:py-3 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zona</label>
                    <select value={form.zona} onChange={e => setForm({...form, zona:e.target.value})}
                      className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-4 py-2.5 sm:py-3 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                      <option value="">Seleccionar...</option>
                      {zonas.map(z => <option key={z.id} value={z.nombre}>{z.nombre}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operario</label>
                    <select value={form.operario} onChange={e => setForm({...form, operario:e.target.value})}
                      className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-4 py-2.5 sm:py-3 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                      <option value="">Seleccionar...</option>
                      {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} {u.apellidos}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prioridad</label>
                      <div className="flex flex-row gap-2 sm:gap-3">
                        {["alta","media","baja"].map(p => (
                          <button key={p} onClick={() => setForm({...form, prioridad:p})}
                            className={`flex-1 py-2.5 sm:py-3 text-xs font-black uppercase tracking-widest rounded-2xl border transition-all ${form.prioridad===p ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-lg shadow-blue-900/10":"border-gray-100 bg-gray-50/50 text-gray-400 hover:bg-gray-100"}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
                    <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion:e.target.value})}
                      rows={2} placeholder="Instrucciones especiales..."
                      className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-4 py-2.5 sm:py-3 text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4">
              <button onClick={() => setShowModal(false)} className="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-colors shrink-0">Cancelar</button>
              <button onClick={crearTarea} disabled={!form.titulo || !form.zona || !form.operario}
                className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] ${!form.titulo || !form.zona || !form.operario ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-100'}`}>
                Asignar Tarea
              </button>
            </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
