import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, ClipboardList, TrendingUp, Filter, Search, ChevronRight } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/Button';

// Import mock
import mockTareas from '../../mock/tareas.json';

interface Tarea {
  id: number;
  zona: string;
  tarea?: string;
  desc?: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_curso' | 'completada' | 'hecha';
  asignado?: string | null;
}

const PRIORIDAD_BADGE: Record<string, string> = { alta:"bg-red-100 text-red-700", media:"bg-yellow-100 text-yellow-700", baja:"bg-green-100 text-green-700" };
const PRIORIDAD_LABEL: Record<string, string> = { alta:"Prioridad Alta", media:"Prioridad Media", baja:"Prioridad Baja" };

const MisTareas: React.FC = () => {
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTareas = async () => {
    if (!usuario) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .or(`asignado.ilike.%${usuario.nombre}%,asignado_id.eq.${usuario.id}`);

      if (!error && data && data.length > 0) {
        setTareas(data as Tarea[]);
        setLoading(false);
        return;
      }
    } catch {
      // Tabla no existe o error de conexión, usar mock
    }

    setTareas(mockTareas as any[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTareas();
  }, [usuario]);

  const alta = tareas.filter(t => t.prioridad === "alta" && (t.estado === "pendiente" || t.estado === "en_curso")).length;
  const completadas = tareas.filter(t => t.estado === "completada" || t.estado === "hecha").length;
  const pendientes = tareas.filter(t => t.estado === "pendiente" || t.estado === "en_curso").length;
  const total = tareas.length;

  const completar = async (id: number) => {
    // Actualizar optimista UI
    setTareas(prev => prev.map(t => t.id === id ? {...t, estado:"completada"} : t));
    
    // Actualizar DB (ignorar error si la tabla no existe)
    try {
      await supabase.from('tareas').update({ estado: 'completada' }).eq('id', id);
    } catch {
      // Ignorar error, la UI ya se actualizó
    }
  };

  if (loading) return <div className="text-gray-500 font-semibold p-6">Cargando tareas...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight mb-1">Mis Tareas</h2>
      <p className="text-gray-400 text-sm font-medium italic mb-4">Tareas asignadas en tu turno, ordenadas por prioridad. Márcalas al completarlas.</p>

      {/* Counters */}
      <div className="flex justify-center gap-5 mb-6">
        {[
          ["Alta Prioridad", alta, "bg-red-50 text-red-700 border-red-200"],
          ["Completadas", completadas, "bg-green-50 text-green-700 border-green-200"],
          ["Pendientes", pendientes, "bg-yellow-50 text-yellow-700 border-yellow-200"]
        ].map(([l, v, cls]) => (
          <div key={l as string} className={`border rounded-2xl px-8 py-5 flex flex-col items-center gap-1 min-w-[160px] ${cls}`}>
            <span className="font-black text-3xl">{v as number}</span>
            <span className="text-xs font-bold uppercase tracking-wide">{l as string}</span>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-3">
        {tareas.length === 0 && (
          <div className="p-6 text-center text-gray-500 bg-white rounded-xl border border-dashed">No tienes tareas asignadas actualmente.</div>
        )}
        {[...tareas].sort((a,b) => {
          const ord: Record<string, number> = {alta:0, media:1, baja:2};
          const aComp = a.estado === "completada" || a.estado === "hecha";
          const bComp = b.estado === "completada" || b.estado === "hecha";
          if (aComp && !bComp) return 1;
          if (!aComp && bComp) return -1;
          return (ord[a.prioridad] ?? 3) - (ord[b.prioridad] ?? 3);
        }).map(t => {
          const isCompleted = t.estado === "completada" || t.estado === "hecha";
          return (
            <div key={t.id} className={`bg-white rounded-xl border p-4 flex justify-between items-center shadow-sm ${isCompleted ? "opacity-60" : ""}`}>
              <div>
                <p className={`font-semibold ${isCompleted ? "line-through decoration-green-500 decoration-2 text-green-700" : "text-gray-800"}`}>{t.zona}</p>
                <p className={`text-sm mb-1 ${isCompleted ? "line-through decoration-green-400 text-green-600" : "text-gray-500"}`}>{t.desc || t.tarea}</p>
                <Badge cls={PRIORIDAD_BADGE[t.prioridad] || "bg-gray-100 text-gray-700"} label={PRIORIDAD_LABEL[t.prioridad] || t.prioridad} />
              </div>
              {!isCompleted ? (
                    <Button 
                      text="Hecho" 
                      onClick={() => completar(t.id)} 
                      variant="success" 
                      icon={CheckCircle} 
                      className="px-4 py-2 ml-3 shrink-0 shadow-sm"
                    />
              ) : (
                <span className="text-green-600 font-semibold text-sm ml-3 shrink-0 flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Completada</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-6 flex justify-center">
        <div className="bg-white rounded-2xl px-10 py-4 border border-green-200 text-center text-green-700 font-bold shadow-sm inline-block">
          {completadas} / {total} Completadas
        </div>
      </div>
    </div>
  );
};

export default MisTareas;
