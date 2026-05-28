import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, AlertTriangle, CheckCircle, RefreshCw, PlusCircle, History, Search, X, Plus } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/Button';
import { useBusquedaStore } from '../../store/busquedaStore';
import { useAuth } from '../../context/AuthContext';

interface Tarea {
  id: number;
  zona: string;
  tarea?: string;
  descripcion?: string;
  asignado: string;
  estado: string;
  prioridad: string;
  created_at?: string;
  updated_at?: string;
}

interface Incidencia {
  id: number;
  prioridad: string;
  estado: string;
  created_at?: string;
  titulo?: string;
}


const ESTADO_BADGE: Record<string, string> = { 
  hecha:"bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400", 
  completada:"bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400", 
  pendiente:"bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400", 
  en_curso:"bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400" 
};

const PRIORIDAD_BADGE: Record<string, string> = { 
  alta: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400", 
  media: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400", 
  baja: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400" 
};


const Dashboard: React.FC = () => {
  const { query } = useBusquedaStore();
  const { usuario: currentUser } = useAuth();
  const isAdmin = currentUser?.rol === 'admin';
  const entidadId = currentUser?.entidad_id;

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [zonas, setZonas] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo:"", zona:"", operario:"", prioridad:"media", fecha:"", descripcion:"" });
  const [ok, setOk] = useState(false);

  // Filtros tabla
  const [filtroAsignado, setFiltroAsignado] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas');
  const [filtroZona, setFiltroZona] = useState<string>('todas');

  // Filtro grafica
  const [filtroMes, setFiltroMes] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // Timeout de 10 segundos para no quedar cargando eternamente
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: Supabase no responde')), 10000)
    );

    try {
      // Construir queries filtrando por entidad si es admin
      let tareasQ = supabase.from('tareas').select('id, zona, tarea, descripcion, asignado, estado, prioridad, created_at, updated_at').order('created_at', { ascending: false }).limit(500);
      let incidenciasQ = supabase.from('incidencias').select('id, prioridad, estado, created_at, titulo, zona');
      let usuariosQ = supabase.from('usuarios').select('id, nombre, apellidos').eq('rol', 'operario');
      let zonasQ = supabase.from('zonas').select('id, nombre');

      if (isAdmin && entidadId) {
        tareasQ = tareasQ.eq('entidad_id', entidadId);
        incidenciasQ = incidenciasQ.eq('entidad_id', entidadId);
        usuariosQ = usuariosQ.eq('entidad_id', entidadId);
        zonasQ = zonasQ.eq('entidad_id', entidadId);
      }

      const dataPromise = Promise.all([tareasQ, incidenciasQ, usuariosQ, zonasQ]);

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

    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidencias' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entidadId, isAdmin]);

  // Filtrar tareas por búsqueda y filtros
  const tareasFiltradas = useMemo(() => {
    let result = tareas;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(t =>
        t.zona.toLowerCase().includes(q) ||
        (t.tarea && t.tarea.toLowerCase().includes(q)) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(q)) ||
        t.asignado.toLowerCase().includes(q)
      );
    }
    if (filtroAsignado !== 'todos') result = result.filter(t => t.asignado === filtroAsignado);
    if (filtroEstado !== 'todos') result = result.filter(t => t.estado === filtroEstado);
    if (filtroPrioridad !== 'todas') result = result.filter(t => t.prioridad === filtroPrioridad);
    if (filtroZona !== 'todas') result = result.filter(t => t.zona === filtroZona);
    // Ordenar: No completadas primero, y dentro de eso, por prioridad (crítica/alta > media > baja). Completadas al final.
    result.sort((a, b) => {
      const aFinished = (a.estado === 'hecha' || a.estado === 'completada') ? 1 : 0;
      const bFinished = (b.estado === 'hecha' || b.estado === 'completada') ? 1 : 0;
      
      if (aFinished !== bFinished) return aFinished - bFinished;
      
      const pWeight: Record<string, number> = { 'critica': 1, 'alta': 2, 'media': 3, 'baja': 4 };
      const wA = pWeight[a.prioridad?.toLowerCase()] || 5;
      const wB = pWeight[b.prioridad?.toLowerCase()] || 5;
      
      if (wA !== wB) return wA - wB;
      
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    return result;
  }, [tareas, query, filtroAsignado, filtroEstado, filtroPrioridad, filtroZona]);

  // Calcular CHART_DATA basado en incidencias por zona para el mes seleccionado
  const chartData = useMemo(() => {
    const [year, month] = filtroMes.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 1);

    const zoneMap = new Map<string, { zona: string; Abiertas: number; Resueltas: number }>();
    
    // Inicializar con las zonas existentes para que aparezcan en la gráfica aunque estén a 0
    zonas.forEach(z => {
      zoneMap.set(z.nombre, { zona: z.nombre, Abiertas: 0, Resueltas: 0 });
    });

    incidencias.forEach((i: any) => {
      if (!i.created_at) return;
      const d = new Date(i.created_at);
      if (d >= startDate && d < endDate) {
        const zoneName = i.zona || 'Sin zona';
        if (!zoneMap.has(zoneName)) {
           zoneMap.set(zoneName, { zona: zoneName, Abiertas: 0, Resueltas: 0 });
        }
        if (i.estado === 'resuelta') {
          zoneMap.get(zoneName)!.Resueltas++;
        } else {
          zoneMap.get(zoneName)!.Abiertas++;
        }
      }
    });
    
    return Array.from(zoneMap.values());
  }, [incidencias, filtroMes, zonas]);

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
      ...(isAdmin && entidadId ? { entidad_id: entidadId } : {}),
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

  const actividadRecienteReal = useMemo(() => {
    const activities: any[] = [];
    
    tareas.forEach((t: any) => {
      if (t.updated_at) {
        activities.push({
          date: new Date(t.updated_at),
          text: `${t.asignado.split(' ')[0]} cambió estado de tarea a ${t.estado} en ${t.zona}`,
        });
      } else if (t.created_at) {
        activities.push({
          date: new Date(t.created_at),
          text: `Nueva tarea en ${t.zona} asignada a ${t.asignado.split(' ')[0]}`,
        });
      }
    });

    incidencias.forEach((i: any) => {
      if (i.created_at) {
        activities.push({
          date: new Date(i.created_at),
          text: `Incidencia ${i.prioridad} registrada: ${i.titulo || 'Sin título'}`,
        });
      }
    });

    activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    return activities.slice(0, 5);
  }, [tareas, incidencias]);

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
      <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-black text-[#1e3a5f] dark:text-white uppercase tracking-tight mb-4">Panel de Control</h2>
          <p className="text-gray-400 text-sm font-medium italic">Resumen general y estado del sistema en tiempo real</p>
          {(zonas.length === 0 || usuarios.length === 0) && (
            <p className="text-amber-600 dark:text-amber-400 text-sm font-semibold bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-lg inline-block mt-2">
              ⚠️ Datos mínimos no configurados. Ve a <strong>Gestión Zonas y Usuarios</strong> para añadir zonas y operarios.
            </p>
          )}
        </div>
        <Button
          text="Nueva Tarea"
          icon={Plus}
          onClick={() => {
            if (zonas.length === 0 || usuarios.length === 0) {
              alert('Primero debes crear al menos una zona y un operario en "Gestión Zonas y Usuarios"');
              return;
            }
            setShowModal(true);
          }}
          disabled={zonas.length === 0 || usuarios.length === 0}
          variant="primary"
          className="shadow-lg shadow-blue-100 shrink-0"
        />
      </div>

      {ok && <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-2xl p-4 mb-6 text-sm font-bold animate-pulse">✓ Tarea creada correctamente.</div>}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
        {[
          { label: "Tareas Pend.", value: pendientes, icon: <Clock size={20} />, textCls: "text-yellow-600 dark:text-yellow-300", bgCls: "bg-yellow-50 dark:bg-yellow-500/30" },
          { label: "Alertas", value: alertas, icon: <AlertTriangle size={20} />, textCls: "text-red-600 dark:text-red-300", bgCls: "bg-red-50 dark:bg-red-500/30" },
          { label: "Tareas Hechas", value: hoy, icon: <CheckCircle size={20} />, textCls: "text-green-600 dark:text-green-300", bgCls: "bg-green-50 dark:bg-green-500/30" },
          { label: "Tareas En Curso", value: en_curso, icon: <RefreshCw size={20} />, textCls: "text-blue-600 dark:text-blue-300", bgCls: "bg-blue-50 dark:bg-blue-500/30" },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-[#1e3a5f]/40 rounded-xl border border-gray-100 dark:border-gray-800 p-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest">{item.label}</p>
                <p className={`text-xl font-bold mt-1 ${item.textCls}`}>{item.value}</p>
              </div>
              <div className={`flex-shrink-0 p-2.5 rounded-lg ${item.bgCls} ${item.textCls}`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-transparent rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm p-5 sm:p-8">
          <div className="flex flex-col items-center justify-center mb-8 gap-3">
            <p className="text-sm font-black text-[#1e3a5f] dark:text-white uppercase tracking-widest text-center">Incidencias por Zona</p>
            <input
              type="month"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50 dark:bg-slate-800 dark:text-white text-center shadow-sm cursor-pointer"
            />
          </div>
          {chartData.length === 0 ? (
             <div className="h-[240px] flex items-center justify-center text-gray-400 font-semibold text-sm border-2 border-dashed border-gray-100 rounded-2xl">
               Aún no hay datos históricos de incidencias
             </div>
          ) : (
            <div className="mt-8">
              <ResponsiveContainer width="100%" height={240} initialDimension={{ width: 10, height: 240 }}>
                <BarChart data={chartData} barSize={20} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="zona" tick={{ fontSize: 11, fontWeight:600, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontWeight:600, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="Abiertas"  fill="#3B82F6" radius={[6,6,0,0]} />
              <Bar dataKey="Resueltas" fill="#10B981" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-transparent rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm p-5 sm:p-8">
          <p className="text-sm font-black text-[#1e3a5f] dark:text-white uppercase tracking-widest mb-10">Actividad reciente</p>
          <div className="flex flex-col gap-6 mt-8">
            {actividadRecienteReal.length === 0 ? (
               <div className="text-sm text-gray-400 font-semibold italic">Aún no hay actividad.</div>
            ) : (
              actividadRecienteReal.map((a, i) => {
                const diffMins = Math.floor((new Date().getTime() - a.date.getTime()) / 60000);
                const timeText = diffMins < 1 ? "Justo ahora" : diffMins < 60 ? `Hace ${diffMins} min` : diffMins < 1440 ? `Hace ${Math.floor(diffMins/60)} h` : `Hace ${Math.floor(diffMins/1440)} d`;
                return (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-1.5 h-auto bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-400 rounded-full transition-colors"></div>
                    <div>
                      <p className="text-xs text-gray-700 dark:text-gray-200 font-bold leading-relaxed">{a.text}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1 uppercase">{timeText}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

        <div className="bg-white dark:bg-transparent rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30 dark:bg-transparent">
            <div className="flex items-center gap-3">
              <p className="text-sm font-black text-[#1e3a5f] dark:text-white uppercase tracking-widest">Historial de Tareas</p>
              <button onClick={fetchData} className="text-blue-500 hover:text-blue-600 transition-colors bg-blue-50 p-1.5 rounded-lg">
                <RefreshCw size={14} />
              </button>
            </div>
            
            <div className="flex flex-wrap justify-end md:ml-auto gap-2 w-full md:w-auto">
              <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white dark:bg-slate-800 dark:text-white flex-1 md:flex-none">
                <option value="todos">Cualquier Estado</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_curso">En Curso</option>
                <option value="completada">Completada</option>
              </select>
              <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white dark:bg-slate-800 dark:text-white flex-1 md:flex-none">
                <option value="todas">Cualquier Prioridad</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              <select value={filtroZona} onChange={e => setFiltroZona(e.target.value)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white dark:bg-slate-800 dark:text-white flex-1 md:flex-none">
                <option value="todas">Cualquier Zona</option>
                {Array.from(new Set(tareas.map(t => t.zona))).sort().map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              <select value={filtroAsignado} onChange={e => setFiltroAsignado(e.target.value)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white dark:bg-slate-800 dark:text-white flex-1 md:flex-none">
                <option value="todos">Cualquier Asignado</option>
                {Array.from(new Set(tareas.map(t => t.asignado))).sort().map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
            <table className="w-full">
<thead className="bg-gray-50/50 dark:bg-gray-800/30">
               <tr>{["Zona","Tarea","Asignado","Estado","Prioridad","Acción"].map(h => <th key={h} className="text-left px-5 sm:px-8 py-4 text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest">{h}</th>)}</tr>
               </thead>
               <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
{(query ? tareasFiltradas : tareas).length === 0 && (
                   <tr><td colSpan={6} className="p-10 text-center text-gray-400 dark:text-gray-500 font-bold italic">
                     {query ? `No se encontraron tareas para "${query}"` : "No hay historial de tareas en este momento."}
                   </td></tr>
                 )}
                {(query ? tareasFiltradas : tareas).map(t => (
<tr key={t.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                   <td className="px-5 sm:px-8 py-4 sm:py-5 font-bold text-[#1e3a5f] dark:text-white text-base">{t.zona}</td>
                   <td className="px-5 sm:px-8 py-4 sm:py-5 text-gray-700 dark:text-white text-sm font-semibold min-w-[200px]">{t.tarea || t.descripcion}</td>
                   <td className="px-5 sm:px-8 py-4 sm:py-5 text-[#1e3a5f] dark:text-white text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                       <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-black">
                         {t.asignado.split(' ').map(n => n[0]).join('')}
                       </div>
                       {t.asignado}
                     </td>
                   <td className="px-5 sm:px-8 py-4 sm:py-5">
                       <Badge cls={ESTADO_BADGE[t.estado] || "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"} label={t.estado === "en_curso" ? "En Curso" : t.estado.charAt(0).toUpperCase()+t.estado.slice(1)} />
                   </td>
                   <td className="px-5 sm:px-8 py-4 sm:py-5">
                       <Badge cls={PRIORIDAD_BADGE[t.prioridad] || "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"} label={t.prioridad.charAt(0).toUpperCase()+t.prioridad.slice(1)} />
                   </td>
                  <td className="px-5 sm:px-8 py-4 sm:py-5 text-right">
                      {t.estado !== 'completada' && (
                        <button
                          onClick={async () => {
                            const { error } = await supabase.from('tareas').update({ estado: 'completada' }).eq('id', t.id);
                            if (!error) {
                              setTareas(prev => prev.map(ta => ta.id === t.id ? { ...ta, estado: 'completada' } : ta));
                            } else {
                              alert('Error al completar la tarea');
                            }
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-wider px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-green-100 transition-all active:scale-95"
                        >
                          Hecho
                        </button>
                      )}
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
                      className="w-full border border-blue-50 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#1e293b] px-4 py-2.5 sm:py-3 text-sm font-semibold text-[#1e3a5f] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zona</label>
                    <select value={form.zona} onChange={e => setForm({...form, zona:e.target.value})}
                      className="w-full border border-blue-50 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#1e293b] px-4 py-2.5 sm:py-3 text-sm font-semibold text-[#1e3a5f] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                      <option value="">Seleccionar...</option>
                      {zonas.map(z => <option key={z.id} value={z.nombre}>{z.nombre}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operario</label>
                    <select value={form.operario} onChange={e => setForm({...form, operario:e.target.value})}
                      className="w-full border border-blue-50 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#1e293b] px-4 py-2.5 sm:py-3 text-sm font-semibold text-[#1e3a5f] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                      <option value="">Seleccionar...</option>
                      {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} {u.apellidos}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prioridad</label>
                      <div className="flex flex-row gap-2 sm:gap-3">
                        {["alta","media","baja"].map(p => (
                          <button key={p} onClick={() => setForm({...form, prioridad:p})}
                            className={`flex-1 py-2.5 sm:py-3 text-xs font-black uppercase tracking-widest rounded-2xl border transition-all ${form.prioridad===p ? "bg-[#1e3a5f] dark:bg-blue-600 text-white border-[#1e3a5f] dark:border-blue-600 shadow-lg shadow-blue-900/10" : "border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
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
                      className="w-full border border-blue-50 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#1e293b] px-4 py-2.5 sm:py-3 text-sm font-semibold text-[#1e3a5f] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4">
              <button onClick={() => setShowModal(false)} className="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0">Cancelar</button>
              <button onClick={crearTarea} disabled={!form.titulo || !form.zona || !form.operario}
                className="flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:not(:disabled):bg-blue-700 hover:not(:disabled):shadow-blue-200">
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
            