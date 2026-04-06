import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/Button';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Filter, Search, ChevronRight, Plus } from 'lucide-react';

import mockIncidencias from '../../mock/incidencias.json';

const ESTADO_BADGE: Record<string, string> = { 
  abierta: "bg-red-50 text-red-500 border border-red-100", 
  en_revision: "bg-orange-50 text-orange-500 border border-orange-100", 
  resuelta: "bg-green-50 text-green-500 border border-green-100" 
};

const PRIORIDAD_BADGE: Record<string, string> = { 
  alta: "text-red-600 font-bold", 
  media: "text-orange-500 font-bold", 
  baja: "text-green-500 font-bold",
  critica: "text-red-800 font-black uppercase"
};

const GestionIncidencias: React.FC = () => {
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'Todas' | 'Abiertas' | 'En Revisión' | 'Resueltas'>('Todas');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const [selected, setSelected] = useState<any>(null);
  const [notaTexto, setNotaTexto] = useState("");
  const [ok, setOk] = useState("");

  const fetchIncidencias = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('incidencias').select('*').order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      setIncidencias(data);
    } else {
      // Fallback a mock data y mapear usuario_id a nombre si es necesario
      const mapped = mockIncidencias.map(i => ({
        ...i,
        operario: i.usuario_id === 'oper-1' ? 'Juan Pérez' : 
                  i.usuario_id === 'oper-5' ? 'Ana Martínez' : 
                  i.usuario_id === 'oper-2' ? 'María Ceballos' : 'Sistema'
      }));
      setIncidencias(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidencias();
  }, []);

  const stats = {
    abiertas: incidencias.filter(i => i.estado === "abierta").length,
    resueltas: incidencias.filter(i => i.estado === "resuelta").length,
    en_revision: incidencias.filter(i => i.estado === "en_revision" || i.estado === "en_proceso").length,
    total: incidencias.length
  };

  const categories = ["Equipo", "Material", "Acceso", "Zona", "Otro"];
  const getCatCount = (cat: string) => incidencias.filter(i => i.tipo === cat).length;

  const filtered = incidencias.filter(i => {
    const matchStatus = 
        filterStatus === 'Todas' ? true :
        filterStatus === 'Abiertas' ? i.estado === 'abierta' :
        filterStatus === 'En Revisión' ? (i.estado === 'en_revision' || i.estado === 'en_proceso') :
        i.estado === 'resuelta';
    
    const matchCat = filterCategory ? i.tipo === filterCategory : true;
    return matchStatus && matchCat;
  });

  const updateEstado = async (id: number, estado: string, notas: string) => {
    const { error } = await supabase.from('incidencias').update({ estado, notas }).eq('id', id);
    if (!error) {
      setIncidencias(prev => prev.map(i => i.id === id ? {...i, estado, notas} : i));
      setSelected(null);
      setOk("¡Estado actualizado!");
      setTimeout(() => setOk(""), 3000);
    }
  };

  if (loading) return <div className="p-10 text-gray-400 font-bold animate-pulse text-center">Iniciando gestión de reportes...</div>;

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Gestión de Incidencias</h2>
          <p className="text-gray-400 text-sm font-medium italic">Revisa, asigna y resuelve reportes técnicos</p>
        </div>
        <Button 
          text="Nueva Incidencia" 
          variant="primary" 
          icon={Plus} 
          className="py-2 px-5 shadow-lg shadow-blue-100"
        />
      </div>

      {ok && <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-sm font-bold animate-bounce">✓ {ok}</div>}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ["Abierta", stats.abiertas, <AlertTriangle size={20} />, "text-red-500 bg-red-50"],
          ["Resuelta", stats.resueltas, <CheckCircle size={20} />, "text-green-500 bg-green-50"],
          ["En Revisión", stats.en_revision, <Clock size={20} />, "text-orange-500 bg-orange-50"],
          ["Total mes", stats.total, <TrendingUp size={20} />, "text-blue-500 bg-blue-50"]
        ].map(([l, v, icon, cls]) => (
          <div key={l as string} className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-center shadow-sm">
            <div>
               <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">{l as string}</p>
               <p className={`text-2xl font-black ${(cls as string).split(' ')[0]}`}>{v as number}</p>
            </div>
            <div className={`p-3 rounded-xl ${(cls as string).split(' ')[1]}`}>{icon as any}</div>
          </div>
        ))}
      </div>

      {/* Filter Categories */}
      <div className="flex gap-2 py-2 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            className={`px-4 py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filterCategory === cat ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md":"bg-white text-gray-400 border-gray-100 hover:bg-gray-50"}`}
          >
            {cat} <span className={`ml-1.5 ${filterCategory === cat ? "text-blue-300":"text-blue-400"}`}>{getCatCount(cat)}</span>
          </button>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1.5 bg-gray-100/50 p-1 rounded-2xl w-fit">
        {['Todas', 'Abiertas', 'En Revisión', 'Resueltas'].map((s: any) => (
           <button 
            key={s} 
            onClick={() => setFilterStatus(s)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? "bg-white text-[#1e3a5f] shadow-sm":"text-gray-400 hover:text-gray-600"}`}
           >
             {s}
           </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>{["#","Título","Tipo","Zona","Operario","Prioridad","Estado","Fecha",""].map(h => <th key={h} className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="p-10 text-center text-gray-400 font-bold italic">No se han encontrado reportes con estos filtros.</td></tr>
              )}
              {filtered.map(i => (
                <tr key={i.id} className="hover:bg-blue-50/10 transition-colors">
                  <td className="px-6 py-4 text-[11px] font-bold text-gray-300">#{i.id}</td>
                  <td className="px-6 py-4 font-bold text-[#1e3a5f] text-[13px]">{i.titulo}</td>
                  <td className="px-6 py-4 text-gray-400 text-[11px] font-black uppercase">{i.tipo || "Otro"}</td>
                  <td className="px-6 py-4 text-gray-500 text-[12px] font-semibold">{i.zona}</td>
                  <td className="px-6 py-4 text-[#1e3a5f] text-[12px] font-bold">{i.operario || "Sistema"}</td>
                  <td className="px-6 py-4 text-[11px] uppercase tracking-wider font-black">
                     <span className={PRIORIDAD_BADGE[i.prioridad] || "text-gray-400"}>{i.prioridad}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ESTADO_BADGE[i.estado === 'en_proceso' ? 'en_revision' : i.estado] || "bg-gray-100 text-gray-500"}`}>
                       {i.estado.replace('_',' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-[10px] font-semibold whitespace-nowrap">{new Date(i.created_at || i.fecha).toLocaleDateString('es-ES')}</td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      text="Ver" 
                      onClick={() => { setSelected(i); setNotaTexto(i.notas || ""); }} 
                      variant="primary" 
                      className="px-4 py-1.5 shadow-lg shadow-blue-100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
      </div>

      {/* Modal Detail View matched to Screenshot 2 */}
      {selected && (
        <Modal title="" onClose={() => setSelected(null)}>
          <div className="p-2">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <p className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-widest">#{selected.id}</p>
                  <h3 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight">{selected.titulo}</h3>
                  <div className="flex gap-3 mt-1">
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selected.zona}</span>
                     <span className="text-[10px] text-gray-400 font-bold">•</span>
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selected.operario}</span>
                     <span className="text-[10px] text-gray-400 font-bold">•</span>
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(selected.created_at || selected.fecha).toLocaleDateString('es-ES')}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
               {[
                 ["Operario", selected.operario],
                 ["Zona", selected.zona],
                 ["Fecha", new Date(selected.created_at || selected.fecha).toLocaleDateString('es-ES')],
                 ["Prioridad", selected.prioridad]
               ].map(([l, v]) => (
                 <div key={l as string} className="bg-gray-50/50 border border-gray-100 rounded-xl p-3">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{l as string}</p>
                    <p className={`text-[11px] font-bold text-[#1e3a5f] uppercase truncate ${l==="Prioridad" && PRIORIDAD_BADGE[v as string]}`}>{v as string}</p>
                 </div>
               ))}
            </div>

            <div className="mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Descripción</p>
                <div className="bg-blue-50/20 border border-blue-50 rounded-2xl p-4 text-sm font-semibold text-slate-600 leading-relaxed italic">
                  {selected.descripcion || selected.desc}
                </div>
            </div>

            <div className="mb-8">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3">Cambiar estado:</p>
               <div className="flex gap-4">
                  {[
                    ["resuelta", "Resuelta", "success"],
                    ["abierta", "Abierta", "danger"],
                    ["en_revision", "En Revisión", "primary"]
                  ].map(([v, l, varType]) => (
                    <Button 
                      key={v} 
                      text={l as string}
                      onClick={() => updateEstado(selected.id, v as string, notaTexto)}
                      variant={varType as any}
                      className="flex-1 py-3 shadow-xl"
                    />
                  ))}
               </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Añadir comentario de resolución:</label>
                <textarea 
                  value={notaTexto} 
                  onChange={e => setNotaTexto(e.target.value)} 
                  rows={4}
                  placeholder="Escribe cómo se resolvió la incidencia..."
                  className="w-full border border-gray-100 rounded-2xl p-5 text-sm font-semibold text-slate-700 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none" 
                />
            </div>

            <Button 
              text="Guardar comentario"
              onClick={() => updateEstado(selected.id, selected.estado, notaTexto)}
              variant="primary"
              className="w-full py-4 shadow-xl shadow-blue-100"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GestionIncidencias;
