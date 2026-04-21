import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Brain,
  LineChart as LineChartIcon,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { supabase } from '../../supabase/client';

interface IncidenciaRow {
  created_at?: string;
  prioridad?: string;
  zona?: string;
}

interface TareaRow {
  created_at?: string;
  estado?: string;
  asignado?: string;
  zona?: string;
}

interface ChartPoint {
  periodo: string;
  incidencias: number;
  completadas: number;
  productividad: number;
  carga: number;
}

interface ForecastCard {
  title: string;
  value: string;
  detail: string;
  tone: string;
}

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const emptyChartData = (): ChartPoint[] => {
  const now = new Date();
  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      periodo: MONTH_LABELS[date.getMonth()],
      incidencias: 0,
      completadas: 0,
      productividad: 0,
      carga: 0,
    };
  });
};

const movingAverage = (values: number[]) => {
  if (!values.length) return 0;
  if (values.length === 1) return values[0];
  const recent = values.slice(-3);
  return recent.reduce((acc, value) => acc + value, 0) / recent.length;
};

const linearProjection = (values: number[]) => {
  if (!values.length) return 0;
  if (values.length === 1) return values[0];

  const deltas: number[] = [];
  for (let i = 1; i < values.length; i += 1) {
    deltas.push(values[i] - values[i - 1]);
  }

  const avgDelta = deltas.reduce((acc, value) => acc + value, 0) / deltas.length;
  return values[values.length - 1] + avgDelta;
};

const EstadisticasSuperadmin: React.FC = () => {
  const [chartData, setChartData] = useState<ChartPoint[]>(emptyChartData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zonasMasExigidas, setZonasMasExigidas] = useState<Array<{ zona: string; total: number }>>([]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const [incidenciasRes, tareasRes] = await Promise.all([
        supabase.from('incidencias').select('created_at, prioridad, zona'),
        supabase.from('tareas').select('created_at, estado, asignado, zona'),
      ]);

      if (incidenciasRes.error) throw new Error(incidenciasRes.error.message);
      if (tareasRes.error) throw new Error(tareasRes.error.message);

      const incidencias = (incidenciasRes.data || []) as IncidenciaRow[];
      const tareas = (tareasRes.data || []) as TareaRow[];

      const now = new Date();
      const buckets = Array.from({ length: 6 }).map((_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
        return {
          key: `${date.getFullYear()}-${date.getMonth()}`,
          periodo: MONTH_LABELS[date.getMonth()],
          incidencias: 0,
          completadas: 0,
          productividad: 0,
          carga: 0,
          operarios: new Set<string>(),
        };
      });

      const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

      incidencias.forEach((item) => {
        if (!item.created_at) return;
        const date = new Date(item.created_at);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const bucket = bucketMap.get(key);
        if (!bucket) return;
        bucket.incidencias += 1;
      });

      const zoneLoad = new Map<string, number>();

      tareas.forEach((item) => {
        if (item.zona) {
          zoneLoad.set(item.zona, (zoneLoad.get(item.zona) || 0) + 1);
        }

        if (!item.created_at) return;
        const date = new Date(item.created_at);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const bucket = bucketMap.get(key);
        if (!bucket) return;

        bucket.carga += 1;
        if (item.asignado) bucket.operarios.add(item.asignado);
        if (item.estado === 'hecha' || item.estado === 'completada') {
          bucket.completadas += 1;
        }
      });

      const finalData: ChartPoint[] = buckets.map((bucket) => {
        const productivityBase = bucket.operarios.size || 1;
        const productividad = Number((bucket.completadas / productivityBase).toFixed(1));

        return {
          periodo: bucket.periodo,
          incidencias: bucket.incidencias,
          completadas: bucket.completadas,
          productividad,
          carga: bucket.carga,
        };
      });

      setChartData(finalData);
      setZonasMasExigidas(
        Array.from(zoneLoad.entries())
          .map(([zona, total]) => ({ zona, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 4)
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudieron cargar las estadísticas.';
      setError(message);
      setChartData(emptyChartData());
      setZonasMasExigidas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const forecastCards = useMemo<ForecastCard[]>(() => {
    const incidenciasSerie = chartData.map((item) => item.incidencias);
    const cargaSerie = chartData.map((item) => item.carga);
    const productividadSerie = chartData.map((item) => item.productividad);

    const nextIncidencias = Math.max(0, Math.round((movingAverage(incidenciasSerie) + linearProjection(incidenciasSerie)) / 2));
    const nextCarga = Math.max(0, Math.round((movingAverage(cargaSerie) + linearProjection(cargaSerie)) / 2));
    const nextProductividad = Math.max(
      0,
      Number(((movingAverage(productividadSerie) + linearProjection(productividadSerie)) / 2).toFixed(1))
    );

    const personalSugerido = Math.max(1, Math.ceil(nextCarga / 6));
    const saturationRisk = nextIncidencias >= 8 || nextCarga >= 20 ? 'Alta' : nextIncidencias >= 4 || nextCarga >= 12 ? 'Media' : 'Baja';

    return [
      {
        title: 'Predicción de incidencias',
        value: `${nextIncidencias} próximas`,
        detail: 'Estimación basada en tendencia reciente y media móvil de 3 periodos.',
        tone: nextIncidencias >= 8 ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50',
      },
      {
        title: 'Carga operativa prevista',
        value: `${nextCarga} tareas`,
        detail: 'Proyección del volumen esperado para el siguiente ciclo mensual.',
        tone: nextCarga >= 20 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50',
      },
      {
        title: 'Personal recomendado',
        value: `${personalSugerido} operarios`,
        detail: 'Sugerencia básica para absorber la carga prevista sin saturación.',
        tone: 'text-violet-600 bg-violet-50',
      },
      {
        title: 'Riesgo de saturación',
        value: saturationRisk,
        detail: `Productividad estimada: ${nextProductividad} tareas completadas por operario activo.`,
        tone:
          saturationRisk === 'Alta'
            ? 'text-red-600 bg-red-50'
            : saturationRisk === 'Media'
              ? 'text-amber-600 bg-amber-50'
              : 'text-emerald-600 bg-emerald-50',
      },
    ];
  }, [chartData]);

  if (loading) {
    return <div className="p-6 text-gray-500 font-semibold font-sans">Cargando estadísticas avanzadas...</div>;
  }

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">
            Estadísticas del superadmin
          </h2>
          <p className="text-gray-400 text-sm font-medium italic">
            Evolución histórica, gráficas lineales y previsiones inteligentes para anticipar carga e incidencias.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-[#1e3a5f] hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Actualizar estadísticas
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-6">
          <p className="font-bold mb-1">Error al cargar estadísticas</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {forecastCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl border border-gray-100 p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] lg:text-[10px] uppercase font-black text-gray-400 tracking-wider truncate" title={card.title}>
                  {card.title}
                </p>
                <p className={`text-xl lg:text-2xl font-black ${card.tone.split(' ')[0]}`}>{card.value.split(' ')[0]}</p>
              </div>
              <div className={`p-2 lg:p-3 rounded-lg shrink-0 ${card.tone.split(' ')[1]}`}>
                <span className={card.tone.split(' ')[0]}>
                  {card.title.includes('Predicción') ? (
                    <Brain size={20} />
                  ) : card.title.includes('Carga') ? (
                    <LineChartIcon size={20} />
                  ) : card.title.includes('Personal') ? (
                    <Users size={20} />
                  ) : (
                    <AlertTriangle size={20} />
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-6">
            Evolución de incidencias y tareas completadas
          </p>
          <ResponsiveContainer width="100%" height={300} initialDimension={{ width: 10, height: 300 }}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="periodo" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="incidencias" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Incidencias" />
              <Line type="monotone" dataKey="completadas" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Completadas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-6">
            Productividad y carga por periodo
          </p>
          <ResponsiveContainer width="100%" height={300} initialDimension={{ width: 10, height: 300 }}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="periodo" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="productividad" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Productividad" />
              <Line type="monotone" dataKey="carga" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} name="Carga" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-5">
            Zonas con mayor presión operativa
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zonasMasExigidas.length === 0 && (
              <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-500 font-medium italic">
                No hay suficientes datos de zonas para construir previsiones por área.
              </div>
            )}

            {zonasMasExigidas.map((zona) => (
              <div key={zona.zona} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm font-black text-[#1e3a5f] mb-2">{zona.zona}</p>
                <p className="text-3xl font-black text-blue-600 mb-2">{zona.total}</p>
                <p className="text-sm text-gray-500 font-medium">
                  Registros asociados. Esta zona debería vigilarse en la previsión del siguiente ciclo.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-5">
            Motor predictivo inicial
          </p>

          <div className="flex flex-col gap-4">
            {[
              'Media móvil de 3 periodos para suavizar picos.',
              'Extrapolación lineal para anticipar el siguiente ciclo.',
              'Detección temprana de saturación por incidencias + carga.',
              'Recomendación base de personal según volumen previsto.',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-sm text-gray-600 font-semibold leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasSuperadmin;
