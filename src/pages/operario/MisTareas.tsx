import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, ClipboardList, TrendingUp, Filter, Search, ChevronRight, RefreshCw } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/Button';
import { useBusquedaStore } from '../../store/busquedaStore';

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
  const { query, clearQuery } = useBusquedaStore();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTareas = async () => {
    if (!usuario) return;
    setLoading(true);
    setError(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: Supabase no responde')), 10000)
    );

    try {
      const dataPromise = supabase
        .from('tareas')
        .select('*')
        .or(`asignado.ilike.%${usuario.nombre}%,asignado_id.eq.${usuario.id}`);

      const result = await Promise.race([dataPromise, timeoutPromise]) as any;

      if (result?.error) {
        const errMsg = result.error?.message || result.message || String(result.error);
        if (errMsg.includes('relation') || errMsg.includes('does not exist')) {
          throw new Error('Tabla tareas no existe en Supabase. Ejecuta el schema SQL.');
        }
        throw new Error(errMsg);
      }

      setTareas((result.data || []) as Tarea[]);
    } catch (err: any) {
      console.error('Error fetching tareas:', err);
      if (err.message.includes('Timeout')) {
        setError('Conexión con Supabase timeout.');
      } else {
        setError(err.message || 'Error al cargar tareas.');
      }
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      fetchTareas();
    }
  }, [usuario]);

  // Filtrar por búsqueda global
  const tareasFiltradas = useMemo(() => {
    if (!query.trim()) return tareas;
    const q = query.toLowerCase();
    return tareas.filter(t =>
      t.zona.toLowerCase().includes(q) ||
      (t.tarea && t.tarea.toLowerCase().includes(q)) ||
      (t.desc && t.desc.toLowerCase().includes(q))
    );
  }, [tareas, query]);

  const alta = tareasFiltradas.filter(t => t.prioridad === "alta" && (t.estado === "pendiente" || t.estado === "en_curso")).length;
  const completadas = tareasFiltradas.filter(t => t.estado === "completada" || t.estado === "hecha").length;
  const pendientes = tareasFiltradas.filter(t => t.estado === "pendiente" || t.estado === "en_curso").length;
  const total = tareasFiltradas.length;

  const completar = async (id: number) => {
    // Optimistic update
    setTareas(prev => prev.map(t => t.id === id ? {...t, estado:"completada"} : t));

    try {
      const { error } = await supabase.from('tareas').update({ estado: 'completada' }).eq('id', id);
      if (error) {
        console.error('Error completando tarea:', error);
        alert(`Error: ${error.message}`);
        fetchTareas(); // Revertir con recarga
      }
    } catch (err: any) {
      console.error('Error completando tarea:', err);
      alert(`Error: ${err.message || 'Verifica conexión con Supabase'}`);
      fetchTareas();
    }
  };

  const handleRetry = () => {
    fetchTareas();
  };

  if (loading) {
    return (
      <div className="p-6 font-sans">
        <div className="flex flex-col items-center justify-center gap-4">
          <RefreshCw size={32} className="animate-spin text-blue-500" />
          <p className="text-gray-500 font-semibold">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 font-sans">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-2 text-lg">Error al cargar tareas</h3>
          <p className="text-sm mb-4">{error}</p>
          <div className="flex gap-3">
            <button onClick={handleRetry} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
              <RefreshCw size={16} />
              Reintentar
            </button>
            {error.includes('Tabla') && (
              <a href="SUPABASE_SETUP.md" target="_blank" rel="noopener noreferrer"
                 className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-semibold transition-colors">
                Ver guía de configuración
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (tareasFiltradas.length === 0) {
    return (
      <div className="p-6 font-sans">
        <div className={`rounded-2xl p-8 text-center ${query ? 'bg-blue-50 border border-blue-200 text-blue-800' : 'bg-gray-50 border border-gray-200 text-gray-700'}`}>
          {query ? <Search size={48} className="mx-auto mb-4 text-blue-400" /> : <CheckCircle size={48} className="mx-auto mb-4 text-gray-400" />}
          <h3 className="font-bold mb-2 text-xl">
            {query ? `No se encontraron tareas para "${query}"` : "No tienes tareas asignadas"}
          </h3>
          <p className="text-sm mb-4 max-w-md mx-auto">
            {query
              ? "Prueba con otro término de búsqueda o limpia el filtro"
              : "El supervisor te asignará tareas cuando haya zonas y tareas creadas en el sistema."}
          </p>
          <div className="flex gap-3 justify-center">
            {query && (
              <button onClick={clearQuery} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-semibold flex items-center gap-2">
                <Search size={16} />
                Limpiar búsqueda
              </button>
            )}
            {!query && (
              <button onClick={handleRetry} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold flex items-center gap-2">
                <RefreshCw size={16} />
                Actualizar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Mis Tareas</h2>
          <p className="text-gray-400 text-sm font-medium italic mb-4">
            {query ? `Filtrando por: "${query}"` : "Tareas asignadas en tu turno, ordenadas por prioridad. Márcalas al completarlas."}
          </p>
        </div>
        {query && (
          <button onClick={clearQuery} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
            <Search size={16} />
            Limpiar filtro
          </button>
        )}
      </div>

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
        {[...tareasFiltradas].sort((a,b) => {
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
