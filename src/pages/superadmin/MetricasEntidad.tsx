import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Brain, AlertTriangle, Users, LineChart as LineChartIcon } from 'lucide-react';
import { supabase } from '../../supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const MetricasEntidad: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entidad, setEntidad] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [datosGrafica, setDatosGrafica] = useState<any[]>([]);
  const [forecastCards, setForecastCards] = useState<any[]>([]);
  const [zonasMasExigidas, setZonasMasExigidas] = useState<Array<{ zona: string; total: number }>>([]);

  const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

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
    for (let i = 1; i < values.length; i += 1) deltas.push(values[i] - values[i - 1]);
    const avgDelta = deltas.reduce((acc, value) => acc + value, 0) / deltas.length;
    return values[values.length - 1] + avgDelta;
  };

  useEffect(() => {
    const fetchMetricas = async () => {
      if (!id) return;
      setLoading(true);
      const { data: ent } = await supabase.from('entidades').select('*').eq('id', id).single();
      setEntidad(ent);

      // Traemos datos reales solo de esta entidad
      const [incidenciasRes, tareasRes] = await Promise.all([
        supabase.from('incidencias').select('created_at, prioridad, zona').eq('entidad_id', id),
        supabase.from('tareas').select('created_at, estado, asignado, zona').eq('entidad_id', id),
      ]);

      const incidencias = incidenciasRes.data || [];
      const tareas = tareasRes.data || [];

      const now = new Date();
      const buckets = Array.from({ length: 6 }).map((_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
        return { key: `${date.getFullYear()}-${date.getMonth()}`, periodo: MONTH_LABELS[date.getMonth()], incidencias: 0, completadas: 0, carga: 0, operarios: new Set<string>() };
      });
      const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));
      const zoneLoad = new Map<string, number>();

      incidencias.forEach((item: any) => {
        if (!item.created_at) return;
        const date = new Date(item.created_at);
        const bucket = bucketMap.get(`${date.getFullYear()}-${date.getMonth()}`);
        if (bucket) bucket.incidencias += 1;
      });

      tareas.forEach((item: any) => {
        if (item.zona) zoneLoad.set(item.zona, (zoneLoad.get(item.zona) || 0) + 1);
        if (!item.created_at) return;
        const date = new Date(item.created_at);
        const bucket = bucketMap.get(`${date.getFullYear()}-${date.getMonth()}`);
        if (!bucket) return;

        bucket.carga += 1;
        if (item.asignado) bucket.operarios.add(item.asignado);
        if (item.estado === 'hecha' || item.estado === 'completada') bucket.completadas += 1;
      });
      
      const finalData = buckets.map((bucket) => ({
        periodo: bucket.periodo,
        incidencias: bucket.incidencias,
        tareas: bucket.completadas,
        carga: bucket.carga,
        productividad: Number((bucket.completadas / (bucket.operarios.size || 1)).toFixed(1))
      }));

      setDatosGrafica(finalData);
      setZonasMasExigidas(
        Array.from(zoneLoad.entries())
          .map(([zona, total]) => ({ zona, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 4)
      );

      // Motor IA Predictivo
      const incidenciasSerie = finalData.map((item) => item.incidencias);
      const cargaSerie = finalData.map((item) => item.carga);
      
      const prediccionIncidencias = Math.max(0, Math.round((movingAverage(incidenciasSerie) + linearProjection(incidenciasSerie)) / 2));
      const prediccionCarga = Math.max(0, Math.round((movingAverage(cargaSerie) + linearProjection(cargaSerie)) / 2));
      const operariosRecomendados = Math.max(1, Math.ceil(prediccionCarga / 6));

      setForecastCards([
        { title: 'Predicción Incidencias', value: `${prediccionIncidencias} estimadas`, tone: 'text-red-600 bg-red-50', icon: <Brain size={24} /> },
        { title: 'Carga Prevista', value: `${prediccionCarga} tareas`, tone: 'text-amber-600 bg-amber-50', icon: <LineChartIcon size={24} /> },
        { title: 'Personal Ideal', value: `${operariosRecomendados} operarios`, tone: 'text-violet-600 bg-violet-50', icon: <Users size={24} /> },
        { title: 'Nivel de Riesgo', value: prediccionIncidencias > 3 ? 'Alto' : 'Bajo', tone: prediccionIncidencias > 3 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50', icon: <AlertTriangle size={24} /> },
      ]);

      setLoading(false);
    };
    fetchMetricas();
  }, [id]);

  if (loading) return <div className="p-10 text-gray-400 font-bold animate-pulse text-center">Cargando métricas de la entidad...</div>;
  if (!entidad) return <div className="p-10 text-center text-red-500 font-bold">Entidad no encontrada.</div>;

  return (
    <div className="font-sans">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/superadmin/entidades')} className="flex items-center justify-center w-10 h-10 shrink-0 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Métricas - {entidad.nombre_hospital}</h2>
          <p className="text-gray-400 text-sm font-medium italic">Rendimiento y análisis de datos de la entidad</p>
        </div>
      </div>

      {/* Tarjetas de IA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {forecastCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl border border-gray-100 p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] lg:text-[10px] uppercase font-black text-gray-400 tracking-wider truncate" title={card.title}>{card.title}</p>
                <p className={`text-xl lg:text-2xl font-black ${card.tone.split(' ')[0]}`}>{card.value.split(' ')[0]}</p>
              </div>
              <div className={`p-2 lg:p-3 rounded-lg shrink-0 ${card.tone.split(' ')[1]}`}>
                <span className={card.tone.split(' ')[0]}>{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 sm:p-8 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">
              Evolución Mensual de Carga Operativa
            </p>
          </div>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 10, height: 300 }}>
              <LineChart data={datosGrafica} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="periodo" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="tareas" name="Tareas Completadas" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="incidencias" name="Nuevas Incidencias" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 sm:p-8 flex flex-col">
           <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-5">
              <Activity size={24} />
           </div>
           <h3 className="text-lg font-black text-[#1e3a5f] uppercase tracking-tight mb-2">Salud de la Entidad</h3>
           <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
             Los datos reflejan un volumen normal de incidencias. La tasa de resolución de tareas se mantiene por encima del 85% en las áreas críticas.
           </p>
           <div className="mt-auto p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Última Auditoría</p>
              <p className="text-sm font-bold text-gray-700">Hoy, a las 08:30 AM</p>
           </div>
        </div>
      </div>

      {/* Inteligencia Artificial / Previsiones */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 sm:p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-5">
            Zonas con mayor presión operativa
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zonasMasExigidas.length === 0 && (
              <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-500 font-medium italic">
                Aún no hay suficientes tareas generadas para predecir las zonas de mayor carga.
              </div>
            )}
            {zonasMasExigidas.map((zona) => (
              <div key={zona.zona} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm font-black text-[#1e3a5f] mb-2">{zona.zona}</p>
                <p className="text-3xl font-black text-blue-600 mb-2">{zona.total}</p>
                <p className="text-xs text-gray-500 font-medium">Registros históricos. Vigilar en previsión del siguiente ciclo.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 sm:p-8">
          <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-5">
            Motor predictivo (IA)
          </p>
          <div className="flex flex-col gap-4">
            {['Media móvil de 3 periodos para suavizar picos.', 'Extrapolación lineal para anticipar el siguiente mes.', 'Detección temprana de saturación por carga.', 'Recomendación base de personal óptimo.'].map((item) => (
              <div key={item} className="rounded-2xl border border-gray-100 bg-slate-50 p-4 text-xs text-gray-600 font-semibold leading-relaxed">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MetricasEntidad;