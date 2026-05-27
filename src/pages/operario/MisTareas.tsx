import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, ClipboardList, TrendingUp, Filter, Search, ChevronRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/Button';
import { useBusquedaStore } from '../../store/busquedaStore';

interface Tarea {
  id: number;
  zona: string;
  tarea?: string;
  descripcion?: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_curso' | 'completada' | 'hecha';
  asignado?: string | null;
}

const PRIORIDAD_BADGE: Record<string, string> = { alta: "bg-red-100 text-red-700", media: "bg-yellow-100 text-yellow-700", baja: "bg-green-100 text-green-700" };
const PRIORIDAD_LABEL: Record<string, string> = { alta: "Alta", media: "Media", baja: "Baja" };

const MisTareas: React.FC = () => {
  const { usuario } = useAuth();
  const { query, clearQuery } = useBusquedaStore();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const fetchTareas = async () => {
    if (!usuario) return;
    setLoading(true);
    setError(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: Supabase no responde')), 10000)
    );

    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const startOfToday = hoy.toISOString();

      const dataPromise = supabase
        .from('tareas')
        .select('*')
        .gte('created_at', startOfToday)
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
      (t.descripcion && t.descripcion.toLowerCase().includes(q))
    );
  }, [tareas, query]);

  const alta = tareasFiltradas.filter(t => t.prioridad === "alta" && (t.estado === "pendiente" || t.estado === "en_curso")).length;
  const completadas = tareasFiltradas.filter(t => t.estado === "completada" || t.estado === "hecha").length;
  const pendientes = tareasFiltradas.filter(t => t.estado === "pendiente" || t.estado === "en_curso").length;
  const total = tareasFiltradas.length;

  const completar = async (id: number) => {
    // Optimistic update
    setTareas(prev => prev.map(t => t.id === id ? { ...t, estado: "completada" } : t));

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

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10; // Máximo 10 por página

  // Tareas ordenadas primero
  const sortedTasks = useMemo(() => {
    return [...tareasFiltradas].sort((a, b) => {
      const ord: Record<string, number> = { alta: 0, media: 1, baja: 2 };
      const aComp = a.estado === "completada";
      const bComp = b.estado === "completada";
      if (aComp && !bComp) return 1;
      if (!aComp && bComp) return -1;
      return (ord[a.prioridad] ?? 3) - (ord[b.prioridad] ?? 3);
    });
  }, [tareasFiltradas]);

  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const currentTasks = sortedTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  // Reiniciar página si cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl p-6 mb-6 transition-colors">
          <h3 className="font-bold mb-2 text-lg">Error al cargar tareas</h3>
          <p className="text-sm mb-4">{error}</p>
          <div className="flex gap-3">
            <button onClick={handleRetry} className="px-4 py-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
              <RefreshCw size={16} />
              Reintentar
            </button>
            {error.includes('Tabla') && (
              <a href="SUPABASE_SETUP.md" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 rounded-lg text-sm font-semibold transition-colors">
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
        <div className={`rounded-2xl p-8 text-center transition-colors ${query ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-300' : 'bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300'}`}>
          {query ? <Search size={48} className="mx-auto mb-4 text-blue-400 dark:text-blue-500" /> : <CheckCircle size={48} className="mx-auto mb-4 text-gray-400 dark:text-slate-500" />}
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
              <button onClick={clearQuery} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                <Search size={16} />
                Limpiar búsqueda
              </button>
            )}
            {!query && (
              <button onClick={handleRetry} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
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
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex flex-wrap justify-between items-start mb-1 gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-black text-[#1e3a5f] dark:text-blue-400 uppercase tracking-tight transition-colors mb-2 sm:mb-4">Mis Tareas</h2>
          <p className="text-gray-400 dark:text-slate-400 text-sm font-medium italic mb-4 transition-colors">
            {query ? `Filtrando por: "${query}"` : "Tareas asignadas en tu turno, ordenadas por prioridad. Márcalas al completarlas."}
          </p>
        </div>
        {query && (
          <button onClick={clearQuery} className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
            <Search size={16} />
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Counters */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-10 flex-wrap">
        {[
          ["Prioridad Alta", alta, "bg-red-300 text-red-950 border-red-500 shadow-md shadow-red-500/20 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700"],
          ["Completadas", completadas, "bg-green-300 text-green-950 border-green-500 shadow-md shadow-green-500/20 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700"],
          ["Pendientes", pendientes, "bg-orange-300 text-orange-950 border-orange-500 shadow-md shadow-orange-500/20 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700"]
        ].map(([l, v, cls]) => (
          <div key={l as string} className={`border-2 rounded-xl px-3 sm:px-8 py-2 sm:py-5 flex flex-col items-center gap-1 min-w-[100px] sm:min-w-[140px] transition-colors ${cls}`}>
            <span className="font-black text-2xl sm:text-4xl drop-shadow-sm">{v as number}</span>
            <span className="text-[10px] sm:text-sm font-bold uppercase tracking-wider text-center leading-tight drop-shadow-sm">{l as string}</span>
          </div>
        ))}
      </div>

      {/* Task list - Grid & Pagination */}
      <div className="flex flex-col gap-10">
        {['alta', 'media', 'baja', 'completada'].map(grupo => {
          let groupTasks: Tarea[] = [];
          let title = "";
          let titleColor = "";
          let borderColor = "";
          let IconComponent = ClipboardList;
          let groupBg = "";

          if (grupo === 'completada') {
            groupTasks = currentTasks.filter(t => t.estado === 'completada' || t.estado === 'hecha');
            title = "Tareas Completadas";
            titleColor = "text-green-950 dark:text-green-400";
            groupBg = "bg-green-300 border-2 border-green-500 dark:bg-green-900/50 dark:border-green-700";
            IconComponent = CheckCircle;
          } else {
            groupTasks = currentTasks.filter(t => t.prioridad === grupo && t.estado !== 'completada' && t.estado !== 'hecha');
            title = `Prioridad ${grupo.charAt(0).toUpperCase() + grupo.slice(1)}`;
            if (grupo === 'alta') {
              titleColor = "text-red-950 dark:text-red-400";
              groupBg = "bg-red-300 border-2 border-red-500 dark:bg-red-900/50 dark:border-red-700";
              IconComponent = AlertCircle;
            } else if (grupo === 'media') {
              titleColor = "text-orange-950 dark:text-orange-400";
              groupBg = "bg-orange-300 border-2 border-orange-500 dark:bg-orange-900/50 dark:border-orange-700";
              IconComponent = Clock;
            } else {
              titleColor = "text-emerald-950 dark:text-emerald-400";
              groupBg = "bg-emerald-300 border-2 border-emerald-500 dark:bg-emerald-900/50 dark:border-emerald-700";
            }
          }

          if (groupTasks.length === 0) return null;

          return (
            <div key={grupo} className={`flex flex-col gap-6 p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800/50 ${groupBg} transition-colors`}>
              <h3 className={`text-2xl font-black flex items-center gap-2 uppercase tracking-tight ${titleColor}`}>
                <IconComponent size={28} strokeWidth={2.5} />
                {title}
              </h3>

              <div className="grid-tareas">
                {groupTasks.map(t => {
                  const isCompleted = t.estado === "completada" || t.estado === "hecha";
                  const isExpanded = expandedIds.includes(t.id);

                  return (
                    <div key={t.id} className={`flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-1 overflow-hidden transition-all duration-300 ${isCompleted ? "opacity-70 grayscale-[30%]" : ""}`}>


                      {/* Card Body */}
                      <div className="p-6 sm:p-8 flex flex-col items-center text-center flex-1">
                        <h3 className={`font-black text-xl mb-2 break-words w-full transition-colors ${isCompleted ? "line-through text-green-700 dark:text-green-500" : "text-[#7e22ce] dark:text-purple-400"}`}>
                          {t.zona}
                        </h3>
                        <p className={`text-sm font-bold mb-4 break-words w-full transition-colors ${isCompleted ? "text-green-600/70" : "text-gray-800 dark:text-slate-200"}`}>
                          {t.tarea}
                        </p>

                        {t.descripcion && (
                          <div className="w-full mb-4">
                            <button
                              onClick={() => toggleExpand(t.id)}
                              className="mx-auto flex items-center gap-1 text-[10px] font-black text-gray-400 hover:text-purple-500 transition-colors uppercase tracking-widest"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              {isExpanded ? "Ocultar info" : "Más info"}
                            </button>

                            {isExpanded && (
                              <p className={`mt-3 text-xs font-medium leading-relaxed transition-colors ${isCompleted ? "text-green-600/80" : "text-gray-500 dark:text-slate-400"}`}>
                                {t.descripcion}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-auto pt-4 w-full flex justify-center">
                          {!isCompleted ? (
                            <button
                              onClick={() => completar(t.id)}
                              className="bg-[#a3e635] hover:bg-[#84cc16] text-white font-black uppercase tracking-wider px-6 py-3 rounded-xl text-sm shadow-lg shadow-[#a3e635]/40 transition-all active:scale-95 flex items-center gap-2"
                            >
                              Completar <ChevronRight size={16} />
                            </button>
                          ) : (
                            <span className="text-green-500 font-bold text-sm flex items-center gap-1.5 py-3">
                              <CheckCircle size={18} />
                              Completada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-purple-600 hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <div className="flex flex-wrap justify-center gap-2 max-w-[70vw] sm:max-w-none">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full text-sm font-black transition-all shadow-sm ${currentPage === i + 1 ? 'bg-purple-600 text-white shadow-purple-500/30' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-purple-600'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-purple-600 hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="mt-8 flex justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-2 border border-green-200 dark:border-green-800/50 text-center text-green-700 dark:text-green-400 font-bold shadow-sm inline-block text-sm transition-colors">
          <span className="text-lg">{completadas}</span>
          <span className="mx-1">/</span>
          <span>{total}</span>
          <span className="text-xs ml-1 uppercase">Completadas</span>
        </div>
      </div>
    </div>
  );
};

export default MisTareas;
