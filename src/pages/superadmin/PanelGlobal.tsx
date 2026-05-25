import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  MapPinned,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react';
import { supabase } from '../../supabase/client';
import Badge from '../../components/common/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface SummaryState {
  usuarios: number;
  zonas: number;
  tareasPendientes: number;
  tareasCurso: number;
  incidenciasAbiertas: number;
  incidenciasCriticas: number;
  notificacionesNoLeidas: number;
  admins: number;
  operarios: number;
}

interface ZonaCarga {
  zona: string;
  tareas: number;
  incidencias: number;
  estado: 'estable' | 'vigilancia' | 'critico';
}

interface ActividadItem {
  id: string;
  titulo: string;
  detalle: string;
  nivel: 'info' | 'warning' | 'critical';
}

const ESTADO_BADGE: Record<ZonaCarga['estado'], string> = {
  estable: 'bg-green-100 text-green-700',
  vigilancia: 'bg-yellow-100 text-yellow-700',
  critico: 'bg-red-100 text-red-700',
};

const initialSummary: SummaryState = {
  usuarios: 0,
  zonas: 0,
  tareasPendientes: 0,
  tareasCurso: 0,
  incidenciasAbiertas: 0,
  incidenciasCriticas: 0,
  notificacionesNoLeidas: 0,
  admins: 0,
  operarios: 0,
};

const PanelGlobal: React.FC = () => {
  const [summary, setSummary] = useState<SummaryState>(initialSummary);
  const [zonasCarga, setZonasCarga] = useState<ZonaCarga[]>([]);
  const [actividad, setActividad] = useState<ActividadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entidades, setEntidades] = useState<any[]>([]);
  const [filtroEntidad, setFiltroEntidad] = useState<string>('todas');
  const [filtroMes, setFiltroMes] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [detallesUsuarios, setDetallesUsuarios] = useState<any[]>([]);
  const [detallesIncidencias, setDetallesIncidencias] = useState<any[]>([]);
  const [detallesNotificaciones, setDetallesNotificaciones] = useState<any[]>([]);
  const [detallesTareas, setDetallesTareas] = useState<any[]>([]);

  const fetchGlobalData = async () => {
    setLoading(true);
    setError(null);

    const [year, month] = filtroMes.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString();
    const endDate = new Date(parseInt(year), parseInt(month), 1).toISOString();

    try {
      let qUsuarios = supabase.from('usuarios').select('id, nombre, apellidos, rol, email');
      let qZonas = supabase.from('zonas').select('id, nombre', { count: 'exact' });
      let qTareasActivas = supabase.from('tareas').select('id, tarea, zona, asignado, estado, prioridad').in('estado', ['pendiente', 'en_curso']);
      let qIncidenciasAbiertas = supabase.from('incidencias').select('id, titulo, zona, prioridad, estado').eq('estado', 'abierta');
      let qNotificaciones = supabase.from('notificaciones').select('id, titulo, mensaje, created_at').eq('leida', false);
      let qTareasZonas = supabase.from('tareas').select('id, zona, estado').gte('created_at', startDate).lt('created_at', endDate);
      let qIncidenciasZonas = supabase.from('incidencias').select('id, zona, prioridad, estado').gte('created_at', startDate).lt('created_at', endDate);

      if (filtroEntidad !== 'todas') {
        qUsuarios = qUsuarios.eq('entidad_id', filtroEntidad);
        qZonas = qZonas.eq('entidad_id', filtroEntidad);
        qTareasActivas = qTareasActivas.eq('entidad_id', filtroEntidad);
        qIncidenciasAbiertas = qIncidenciasAbiertas.eq('entidad_id', filtroEntidad);
        qNotificaciones = qNotificaciones.eq('entidad_id', filtroEntidad);
        qTareasZonas = qTareasZonas.eq('entidad_id', filtroEntidad);
        qIncidenciasZonas = qIncidenciasZonas.eq('entidad_id', filtroEntidad);
      }

      const [
        usuariosRes,
        zonasRes,
        tareasActivasRes,
        incidenciasAbiertasRes,
        notificacionesRes,
        tareasZonasRes,
        incidenciasZonasRes,
      ] = await Promise.all([
        qUsuarios,
        qZonas,
        qTareasActivas,
        qIncidenciasAbiertas,
        qNotificaciones,
        qTareasZonas,
        qIncidenciasZonas,
      ]);

      const responses = [
        usuariosRes,
        zonasRes,
        tareasActivasRes,
        incidenciasAbiertasRes,
        notificacionesRes,
        tareasZonasRes,
        incidenciasZonasRes,
      ];

      const firstError = responses.find((response) => response.error)?.error;
      if (firstError) {
        throw new Error(firstError.message);
      }

      const uData = usuariosRes.data || [];
      const tActivasData = tareasActivasRes.data || [];
      const iAbiertasData = incidenciasAbiertasRes.data || [];
      const nData = notificacionesRes.data || [];

      const admins = uData.filter((u: any) => u.rol === 'admin');
      const operarios = uData.filter((u: any) => u.rol === 'operario');

      const tareasPendientes = tActivasData.filter((t: any) => t.estado === 'pendiente');
      const tareasCurso = tActivasData.filter((t: any) => t.estado === 'en_curso');

      const incidenciasCriticas = iAbiertasData.filter((i: any) => i.prioridad === 'critica');

      setSummary({
        usuarios: uData.length,
        zonas: zonasRes.count || 0,
        tareasPendientes: tareasPendientes.length,
        tareasCurso: tareasCurso.length,
        incidenciasAbiertas: iAbiertasData.length,
        incidenciasCriticas: incidenciasCriticas.length,
        notificacionesNoLeidas: nData.length,
        admins: admins.length,
        operarios: operarios.length,
      });

      setDetallesUsuarios(uData);
      setDetallesIncidencias(incidenciasCriticas);
      setDetallesNotificaciones(nData);
      setDetallesTareas(tActivasData);

      const taskRows = tareasZonasRes.data || [];
      const incidRows = incidenciasZonasRes.data || [];

      const zoneMap = new Map<string, ZonaCarga>();

      taskRows.forEach((task) => {
        const zoneName = task.zona || 'Sin zona';
        if (!zoneMap.has(zoneName)) {
          zoneMap.set(zoneName, { zona: zoneName, tareas: 0, incidencias: 0, estado: 'estable' });
        }
        zoneMap.get(zoneName)!.tareas += 1;
      });

      incidRows.forEach((incidencia) => {
        const zoneName = incidencia.zona || 'Sin zona';
        if (!zoneMap.has(zoneName)) {
          zoneMap.set(zoneName, { zona: zoneName, tareas: 0, incidencias: 0, estado: 'estable' });
        }
        zoneMap.get(zoneName)!.incidencias += 1;
      });

      const zonasCalculadas = Array.from(zoneMap.values())
        .map((zona) => {
          const peso = zona.tareas + zona.incidencias * 2;
          let estado: ZonaCarga['estado'] = 'estable';

          if (peso >= 8 || zona.incidencias >= 3) estado = 'critico';
          else if (peso >= 4 || zona.incidencias >= 1) estado = 'vigilancia';

          return { ...zona, estado };
        })
        .sort((a, b) => b.incidencias + b.tareas - (a.incidencias + a.tareas))
        .slice(0, 6);

      setZonasCarga(zonasCalculadas);

      setActividad([
        {
          id: 'usuarios',
          titulo: 'Estado de la estructura',
          detalle: `${admins.length} administradores y ${operarios.length} operarios activos en el sistema.`,
          nivel: 'info',
        },
        {
          id: 'incidencias',
          titulo: 'Incidencias críticas',
          detalle: `${incidenciasCriticas.length} incidencias críticas requieren supervisión prioritaria.`,
          nivel: incidenciasCriticas.length > 0 ? 'critical' : 'info',
        },
        {
          id: 'notificaciones',
          titulo: 'Comunicaciones pendientes',
          detalle: `${nData.length} notificaciones no leídas esperan revisión.`,
          nivel: nData.length > 5 ? 'warning' : 'info',
        },
        {
          id: 'operacion',
          titulo: 'Carga operativa',
          detalle: `${tareasPendientes.length + tareasCurso.length} tareas abiertas en seguimiento global.`,
          nivel: tareasPendientes.length > 10 ? 'warning' : 'info',
        },
      ]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar el panel global.';
      setError(message);
      setZonasCarga([]);
      setActividad([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();

    const channel = supabase
      .channel('global-panel-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, () => {
        fetchGlobalData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidencias' }, () => {
        fetchGlobalData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'usuarios' }, () => {
        fetchGlobalData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notificaciones' }, () => {
        fetchGlobalData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filtroEntidad, filtroMes]);

  useEffect(() => {
    supabase.from('entidades').select('id, nombre_hospital').then(({ data }) => {
      if (data) setEntidades(data);
    });
  }, []);

  const metricCards = useMemo(
    () => [
      {
        title: 'Usuarios activos',
        value: summary.usuarios,
        helper: `${summary.admins} admins · ${summary.operarios} operarios`,
        icon: <Users size={22} />,
        accent: 'text-blue-600 bg-blue-50',
      },
      {
        title: 'Zonas monitorizadas',
        value: summary.zonas,
        helper: 'Cobertura global del hospital',
        icon: <MapPinned size={22} />,
        accent: 'text-violet-600 bg-violet-50',
      },
      {
        title: 'Carga operativa',
        value: summary.tareasPendientes + summary.tareasCurso,
        helper: `${summary.tareasPendientes} pendientes · ${summary.tareasCurso} en curso`,
        icon: <ClipboardList size={22} />,
        accent: 'text-amber-600 bg-amber-50',
      },
      {
        title: 'Alertas críticas',
        value: summary.incidenciasCriticas,
        helper: `${summary.incidenciasAbiertas} incidencias abiertas`,
        icon: <ShieldAlert size={22} />,
        accent: 'text-red-600 bg-red-50',
      },
    ],
    [summary]
  );

  if (loading) {
    return <div className="p-6 text-gray-500 font-semibold font-sans">Cargando control global...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-wrap justify-between items-start mb-2 gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-black text-[#1e3a5f] dark:text-white uppercase tracking-tight mb-1">
            Panel global del superadmin
          </h2>
          <p className="text-gray-400 text-sm font-medium italic">
            Supervisión integral del sistema, carga por zonas, alertas y equilibrio operativo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select 
              value={filtroEntidad} 
              onChange={(e) => setFiltroEntidad(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white dark:bg-[#1e3a5f] text-[#1e3a5f] dark:text-white cursor-pointer hover:border-blue-300 transition-colors shadow-sm"
            >
              <option value="todas">Global (Todas)</option>
              {entidades.map(e => <option key={e.id} value={e.id}>{e.nombre_hospital}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
          <button
            onClick={fetchGlobalData}
            title="Actualizar panel"
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-[#1e3a5f] border border-gray-200 dark:border-gray-700 text-[#1e3a5f] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm text-sm font-semibold shrink-0"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-6">
          <p className="font-bold mb-1">Error al cargar el control global</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {metricCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl border border-gray-100 p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] lg:text-[10px] uppercase font-black text-gray-400 tracking-wider truncate" title={card.title}>
                  {card.title}
                </p>
                <p className={`text-xl lg:text-2xl font-black ${card.accent.split(' ')[0]}`}>{card.value}</p>
              </div>
              <div className={`p-2 lg:p-3 rounded-lg shrink-0 ${card.accent}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-white dark:bg-transparent rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <p className="text-sm font-black text-[#1e3a5f] dark:text-white uppercase tracking-widest">
                Carga Operativa por Zona
              </p>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Tareas vs Incidencias
              </span>
            </div>
            <input
              type="month"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-100"
            />
          </div>

          <div className="h-[280px] w-full mb-2">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 10, height: 280 }}>
              <BarChart data={zonasCarga} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="zona" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="tareas" name="Tareas" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={45} />
                <Bar dataKey="incidencias" name="Incidencias" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-[10px] sm:text-xs text-gray-400 font-medium mb-8">
            * Datos de carga correspondientes a {new Date(parseInt(filtroMes.split('-')[0]), parseInt(filtroMes.split('-')[1]) - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}.
          </p>

          <div className="flex items-center justify-between mb-5 pt-6 border-t border-gray-50">
            <p className="text-sm font-black text-[#1e3a5f] dark:text-white uppercase tracking-widest">
              Desglose Detallado
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 dark:bg-[#1e3a5f]/30">
                <tr>
                  {['Zona', 'Tareas', 'Incidencias', 'Nivel'].map((header) => (
                    <th
                      key={header}
                      className="text-left px-5 py-4 text-[10px] font-black text-gray-400 dark:text-gray-200 uppercase tracking-widest"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {zonasCarga.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-gray-400 font-semibold italic">
                      No hay datos suficientes de zonas para mostrar carga global.
                    </td>
                  </tr>
                )}

                {zonasCarga.map((zona, index) => (
                  <tr key={index} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#1e3a5f] dark:text-white">{zona.zona}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-white font-semibold">{zona.tareas}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-white font-semibold">{zona.incidencias}</td>
                    <td className="px-5 py-4">
                      <Badge
                        cls={ESTADO_BADGE[zona.estado]}
                        label={zona.estado === 'critico'
                          ? 'Crítico'
                          : zona.estado === 'vigilancia'
                            ? 'Vigilancia'
                            : 'Estable'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm p-8 flex flex-col">
          <p className="text-sm font-black text-[#1e3a5f] dark:text-white uppercase tracking-widest mb-5">
            Alertas y actividad
          </p>

          <div className="flex flex-col gap-4">
            {actividad.map((item) => {
              const isExpanded = activeAlertId === item.id;
              return (
                <div 
                  key={item.id} 
                  onClick={() => setActiveAlertId(prev => prev === item.id ? null : item.id)}
                  className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 p-4 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/70 transition-all select-none text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`mt-1 p-2 rounded-xl shrink-0 ${
                          item.nivel === 'critical'
                            ? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                            : item.nivel === 'warning'
                              ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400'
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                        }`}
                      >
                        {item.nivel === 'critical' ? (
                          <AlertTriangle size={16} />
                        ) : item.nivel === 'warning' ? (
                          <Bell size={16} />
                        ) : (
                          <TrendingUp size={16} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-[#1e3a5f] dark:text-blue-200 mb-1 truncate">{item.titulo}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-semibold">{item.detalle}</p>
                      </div>
                    </div>
                    <div className="text-gray-400 dark:text-slate-500 mt-1.5 shrink-0">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-slate-700 max-h-[220px] overflow-y-auto flex flex-col gap-2 scrollbar-thin scrollbar-thumb-gray-200">
                      {item.id === 'notificaciones' && (
                        <>
                          {detallesNotificaciones.map((notif) => (
                            <div key={notif.id} className="text-left text-xs bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                              <p className="font-extrabold text-[#1e3a5f] dark:text-blue-300">{notif.titulo}</p>
                              <p className="text-gray-500 dark:text-slate-300 mt-1 font-medium">{notif.mensaje}</p>
                              <p className="text-[9px] text-gray-400 dark:text-slate-500 mt-1.5 uppercase font-bold">
                                {new Date(notif.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          ))}
                          {detallesNotificaciones.length === 0 && (
                            <p className="text-xs text-gray-400 dark:text-slate-500 italic text-center py-4 font-semibold">No hay notificaciones no leídas.</p>
                          )}
                        </>
                      )}

                      {item.id === 'incidencias' && (
                        <>
                          {detallesIncidencias.map((incid) => (
                            <div key={incid.id} className="text-left text-xs bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex justify-between items-center gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-extrabold text-red-600 dark:text-red-400 truncate">{incid.titulo}</p>
                                <p className="text-gray-500 dark:text-slate-400 text-[10px] mt-1 font-bold">
                                  Zona: <span className="text-gray-700 dark:text-slate-300">{incid.zona}</span>
                                </p>
                              </div>
                              <Badge 
                                cls="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-[9px] uppercase font-black tracking-wider px-2 py-0.5 border border-red-200/50 dark:border-red-900/50" 
                                label={incid.estado} 
                              />
                            </div>
                          ))}
                          {detallesIncidencias.length === 0 && (
                            <p className="text-xs text-gray-400 dark:text-slate-500 italic text-center py-4 font-semibold">No hay incidencias críticas activas.</p>
                          )}
                        </>
                      )}

                      {item.id === 'operacion' && (
                        <>
                          {detallesTareas.map((tarea) => (
                            <div key={tarea.id} className="text-left text-xs bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex justify-between items-center gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-extrabold text-[#1e3a5f] dark:text-blue-300 truncate">{tarea.tarea}</p>
                                <p className="text-gray-500 dark:text-slate-400 text-[10px] mt-1 font-bold leading-relaxed">
                                  Zona: <span className="text-gray-700 dark:text-slate-300">{tarea.zona}</span> · Operario: <span className="text-gray-700 dark:text-slate-300">{tarea.asignado}</span>
                                </p>
                              </div>
                              <Badge 
                                cls={tarea.estado === 'en_curso' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50' : 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-900/50'} 
                                label={tarea.estado === 'en_curso' ? 'En curso' : 'Pendiente'} 
                              />
                            </div>
                          ))}
                          {detallesTareas.length === 0 && (
                            <p className="text-xs text-gray-400 dark:text-slate-500 italic text-center py-4 font-semibold">No hay tareas activas.</p>
                          )}
                        </>
                      )}

                      {item.id === 'usuarios' && (
                        <>
                          {detallesUsuarios.map((user) => (
                            <div key={user.id} className="text-left text-xs bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex justify-between items-center gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-extrabold text-[#1e3a5f] dark:text-blue-300 truncate">{user.nombre} {user.apellidos}</p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-400 mt-1 font-bold">{user.email}</p>
                              </div>
                              <Badge 
                                cls={user.rol === 'admin' ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50'} 
                                label={user.rol.toUpperCase()} 
                              />
                            </div>
                          ))}
                          {detallesUsuarios.length === 0 && (
                            <p className="text-xs text-gray-400 dark:text-slate-500 italic text-center py-4 font-semibold">No hay usuarios registrados.</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelGlobal;
