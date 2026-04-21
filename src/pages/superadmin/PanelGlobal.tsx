import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
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

  const fetchGlobalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        usuariosRes,
        zonasRes,
        tareasPendientesRes,
        tareasCursoRes,
        incidenciasAbiertasRes,
        incidenciasCriticasRes,
        notificacionesRes,
        adminsRes,
        operariosRes,
        tareasZonasRes,
        incidenciasZonasRes,
      ] = await Promise.all([
        supabase.from('usuarios').select('*', { count: 'exact', head: true }),
        supabase.from('zonas').select('*', { count: 'exact', head: true }),
        supabase.from('tareas').select('id, zona', { count: 'exact' }).eq('estado', 'pendiente'),
        supabase.from('tareas').select('id, zona', { count: 'exact' }).eq('estado', 'en_curso'),
        supabase.from('incidencias').select('id, zona, prioridad', { count: 'exact' }).eq('estado', 'abierta'),
        supabase.from('incidencias').select('id, zona, prioridad', { count: 'exact' }).eq('prioridad', 'critica'),
        supabase.from('notificaciones').select('*', { count: 'exact', head: true }).eq('leida', false),
        supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('rol', 'admin'),
        supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('rol', 'operario'),
        supabase.from('tareas').select('id, zona, estado'),
        supabase.from('incidencias').select('id, zona, prioridad, estado'),
      ]);

      const responses = [
        usuariosRes,
        zonasRes,
        tareasPendientesRes,
        tareasCursoRes,
        incidenciasAbiertasRes,
        incidenciasCriticasRes,
        notificacionesRes,
        adminsRes,
        operariosRes,
        tareasZonasRes,
        incidenciasZonasRes,
      ];

      const firstError = responses.find((response) => response.error)?.error;
      if (firstError) {
        throw new Error(firstError.message);
      }

      setSummary({
        usuarios: usuariosRes.count || 0,
        zonas: zonasRes.count || 0,
        tareasPendientes: tareasPendientesRes.count || 0,
        tareasCurso: tareasCursoRes.count || 0,
        incidenciasAbiertas: incidenciasAbiertasRes.count || 0,
        incidenciasCriticas: incidenciasCriticasRes.count || 0,
        notificacionesNoLeidas: notificacionesRes.count || 0,
        admins: adminsRes.count || 0,
        operarios: operariosRes.count || 0,
      });

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
          detalle: `${adminsRes.count || 0} administradores y ${operariosRes.count || 0} operarios activos en el sistema.`,
          nivel: 'info',
        },
        {
          id: 'incidencias',
          titulo: 'Incidencias críticas',
          detalle: `${incidenciasCriticasRes.count || 0} incidencias críticas requieren supervisión prioritaria.`,
          nivel: (incidenciasCriticasRes.count || 0) > 0 ? 'critical' : 'info',
        },
        {
          id: 'notificaciones',
          titulo: 'Comunicaciones pendientes',
          detalle: `${notificacionesRes.count || 0} notificaciones no leídas esperan revisión.`,
          nivel: (notificacionesRes.count || 0) > 5 ? 'warning' : 'info',
        },
        {
          id: 'operacion',
          titulo: 'Carga operativa',
          detalle: `${(tareasPendientesRes.count || 0) + (tareasCursoRes.count || 0)} tareas abiertas en seguimiento global.`,
          nivel: (tareasPendientesRes.count || 0) > 10 ? 'warning' : 'info',
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
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">
            Panel global del superadmin
          </h2>
          <p className="text-gray-400 text-sm font-medium italic">
            Supervisión integral del sistema, carga por zonas, alertas y equilibrio operativo.
          </p>
        </div>

        <button
          onClick={fetchGlobalData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-[#1e3a5f] hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Actualizar panel
        </button>
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
              <div className={`p-2 lg:p-3 rounded-lg shrink-0 ${card.accent.split(' ')[1]}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">
              Carga Operativa por Zona
            </p>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Tareas vs Incidencias
            </span>
          </div>

          <div className="h-[280px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 10, height: 280 }}>
              <BarChart data={zonasCarga} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="zona" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="tareas" name="Tareas" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={45} />
                <Bar dataKey="incidencias" name="Incidencias" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mb-5 pt-6 border-t border-gray-50">
            <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">
              Desglose Detallado
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  {['Zona', 'Tareas', 'Incidencias', 'Nivel'].map((header) => (
                    <th
                      key={header}
                      className="text-left px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {zonasCarga.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-gray-400 font-semibold italic">
                      No hay datos suficientes de zonas para mostrar carga global.
                    </td>
                  </tr>
                )}

                {zonasCarga.map((zona) => (
                  <tr key={zona.zona} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#1e3a5f]">{zona.zona}</td>
                    <td className="px-5 py-4 text-gray-600 font-semibold">{zona.tareas}</td>
                    <td className="px-5 py-4 text-gray-600 font-semibold">{zona.incidencias}</td>
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

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-5">
            Alertas y actividad
          </p>

          <div className="flex flex-col gap-4">
            {actividad.map((item) => (
              <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 p-2 rounded-xl ${
                      item.nivel === 'critical'
                        ? 'bg-red-100 text-red-600'
                        : item.nivel === 'warning'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-blue-100 text-blue-600'
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
                  <div>
                    <p className="text-sm font-black text-[#1e3a5f] mb-1">{item.titulo}</p>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.detalle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Gobierno del sistema',
            text: 'El superadmin puede decidir escalados, redefinir prioridades y coordinar políticas globales.',
          },
          {
            title: 'Capacidad y saturación',
            text: 'Cruza tareas pendientes, incidencias abiertas y volumen por zonas para anticipar cuellos de botella.',
          },
          {
            title: 'Trazabilidad ejecutiva',
            text: 'Mantén una visión centralizada para tomar decisiones de alto nivel sobre operación y estructura.',
          },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-black text-[#1e3a5f] mb-3">{item.title}</p>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelGlobal;
