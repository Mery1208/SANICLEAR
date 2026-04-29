import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../supabase/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/Button';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Plus, CheckCircle2 } from 'lucide-react';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ tipo:"", zona:"", descripcion:"", prioridad:"media", urgente:false });
  const [operarios, setOperarios] = useState<any[]>([]);

  const fetchIncidencias = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('incidencias')
      .select(`
        id,
        titulo,
        zona,
        tipo,
        prioridad,
        estado,
        descripcion,
        created_at,
        usuario_id,
        usuarios (nombre, apellidos)
      `)
      .order('created_at', { ascending: false });

    // Ahora entra si no hay error y data existe, ¡incluso si data.length es 0 (BD vacía)!
    if (!error && data) {
      const mapped = (data as any[]).map(i => ({
        ...i,
        operario: i.usuarios ? `${i.usuarios.nombre} ${i.usuarios.apellidos}` : 'Sin asignar'
      }));
      setIncidencias(mapped);
    } else if (error) {
      console.error('Error cargando incidencias desde Supabase:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidencias();
    fetchOperarios();
  }, []);

  const fetchOperarios = async () => {
    const { data } = await supabase.from('usuarios').select('id, nombre, apellidos').eq('rol', 'operario');
    if (data) setOperarios(data);
  };

  const stats = {
    abiertas: incidencias.filter(i => i.estado === "abierta").length,
    resueltas: incidencias.filter(i => i.estado === "resuelta").length,
    en_revision: incidencias.filter(i => i.estado === "en_revision" || i.estado === "en_proceso").length,
    total: incidencias.length
  };

  const categories = ["Equipo", "Material", "Acceso", "Zona", "Otro"];
  const getCatCount = (cat: string) => incidencias.filter(i => i.tipo === cat).length;

  const filteredIncidencias = useMemo(() => {
    return incidencias.filter(i => {
      const matchStatus =
          filterStatus === 'Todas' ? true :
          filterStatus === 'Abiertas' ? i.estado === 'abierta' :
          filterStatus === 'En Revisión' ? (i.estado === 'en_revision' || i.estado === 'en_proceso') :
          i.estado === 'resuelta';

      const matchCat = filterCategory ? i.tipo === filterCategory : true;
      return matchStatus && matchCat;
    });
  }, [incidencias, filterStatus, filterCategory]);

  const updateEstado = async (id: number, estado: string, notas: string) => {
    const { error } = await supabase.from('incidencias').update({ estado, notas }).eq('id', id);
    if (!error) {
      setIncidencias(prev => prev.map(i => i.id === id ? {...i, estado, notas} : i));
      setSelected(null);
      setOk("¡Estado actualizado!");
      setTimeout(() => setOk(""), 3000);
    }
  };

  const handleCreateIncidencia = async () => {
    if (!createForm.tipo || !createForm.zona || !createForm.descripcion) return;
    setLoading(true);

    const insertData = {
      titulo: `${createForm.tipo} - ${createForm.zona}`,
      tipo: createForm.tipo,
      zona: createForm.zona,
      prioridad: createForm.urgente ? "critica" : createForm.prioridad,
      estado: "abierta",
      descripcion: createForm.descripcion,
      usuario_id: null,
      operario: "Sin asignar"
    };

    const { error } = await supabase.from('incidencias').insert([insertData]);

    setLoading(false);
    if (!error) {
      setShowCreateModal(false);
      setOk("¡Incidencia creada!");
      fetchIncidencias();
      setCreateForm({ tipo:"", zona:"", descripcion:"", prioridad:"media", urgente:false });
      setTimeout(() => setOk(""), 3000);
    } else {
      console.error(error);
      alert('Error al crear la incidencia');
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
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          icon={Plus}
          className="py-1.5 px-3 text-xs sm:py-2 sm:px-5 shadow-lg shadow-blue-100"
        />
      </div>

      {ok && <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-sm font-bold animate-bounce">✓ {ok}</div>}

       {/* Stats row */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
         {[
           ["Abiertas",  stats.abiertas,    <AlertTriangle size={16} />, "text-red-600 bg-red-50"],
           ["Resueltas", stats.resueltas,   <CheckCircle size={16} />,   "text-green-600 bg-green-50"],
           ["En Rev.",   stats.en_revision, <Clock size={16} />,         "text-orange-600 bg-orange-50"],
           ["Total",     stats.total,       <TrendingUp size={16} />,    "text-blue-600 bg-blue-50"]
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
             className={`px-3 py-1.5 text-[8px] sm:px-4 sm:py-2 sm:text-[9px] md:px-6 md:py-2 md:text-[10px] rounded-xl font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === s ? "bg-white text-[#1e3a5f] shadow-sm":"text-gray-400 hover:text-gray-600"}`}
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
               {filteredIncidencias.length === 0 && (
                 <tr><td colSpan={9} className="p-10 text-center text-gray-400 font-bold italic">No se han encontrado reportes con estos filtros.</td></tr>
               )}
               {filteredIncidencias.map(i => (
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
                   <td className="px-2 sm:px-6 py-2 sm:py-4 text-right">
                     <Button 
                       text="Ver" 
                       onClick={() => { setSelected(i); setNotaTexto(i.notas || ""); }} 
                       variant="primary" 
                       className="px-2 py-1 text-[10px] sm:px-4 sm:py-1.5 shadow-lg shadow-blue-100"
                     />
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
      </div>

       {/* Modal Crear Incidencia */}
       {showCreateModal && (
         <Modal title="NUEVA INCIDENCIA" onClose={() => setShowCreateModal(false)}>
           <div className="flex flex-col gap-5 max-w-3xl w-full">
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Incidencia</label>
               <select value={createForm.tipo} onChange={e => setCreateForm({...createForm, tipo:e.target.value})}
                 className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-bold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                 <option value="">Seleccionar...</option>
                 {["Equipo","Material","Acceso","Zona","Otro"].map(t => <option key={t} value={t}>{t}</option>)}
               </select>
             </div>

             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zona</label>
               <input value={createForm.zona} onChange={e => setCreateForm({...createForm, zona:e.target.value})}
                 placeholder="Ej: UCI - Planta 2"
                 className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-bold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
             </div>

             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
               <textarea value={createForm.descripcion} onChange={e => setCreateForm({...createForm, descripcion:e.target.value})}
                 rows={5} placeholder="Describe el problema..."
                 className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-5 py-3.5 text-sm font-bold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
             </div>

             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prioridad</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {["baja","media","alta","critica"].map(p => (
                    <button key={p} type="button"
                      onClick={() => !createForm.urgente && setCreateForm({...createForm, prioridad: p})}
                      disabled={createForm.urgente}
                      className={`px-2 py-2 text-[10px] sm:px-3 sm:py-2.5 sm:text-[10px] rounded-lg sm:rounded-xl border font-black uppercase tracking-wider transition-all ${createForm.urgente && p === 'critica' ? 'bg-red-100 text-red-800 border-red-300 ring-2 ring-red-200' : createForm.prioridad === p ? 'bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-100' : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:bg-gray-100'} ${createForm.urgente && p !== 'critica' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
               {createForm.urgente && <p className="text-[10px] text-red-600 font-bold ml-1 mt-1">Prioridad fijada a Crítica</p>}
             </div>

             <div className="flex flex-col gap-3">
               <div className="flex items-center gap-3 bg-red-50/30 p-3 rounded-2xl cursor-pointer hover:bg-red-50/50 transition-colors"
                 onClick={() => setCreateForm({...createForm, urgente: !createForm.urgente, prioridad: !createForm.urgente ? 'critica' : createForm.prioridad})}>
                 <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${createForm.urgente ? "bg-red-500 border-red-500" : "border-red-200"}`}>
                   {createForm.urgente && <CheckCircle2 size={12} className="text-white" />}
                 </div>
                 <label className="text-xs text-red-700 font-black uppercase tracking-wider cursor-pointer">Marcar como URGENTE</label>
               </div>
             </div>

           <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-2">
             <button onClick={() => setShowCreateModal(false)} className="px-3 py-3 text-xs sm:px-6 sm:py-3 font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-colors shrink-0">Cancelar</button>
               <button onClick={handleCreateIncidencia} disabled={loading || !createForm.tipo || !createForm.zona || !createForm.descripcion}
               className="flex-1 bg-blue-500 text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                 {loading ? "Creando..." : "Crear Incidencia"}
               </button>
             </div>
           </div>
         </Modal>
       )}

       {/* Modal Detail View matched to Screenshot 2 */}
       {selected && (
         <Modal title={selected.titulo} onClose={() => setSelected(null)}>
           <div className="p-2 max-w-3xl w-full">
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

             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                  ["Operario", selected.operario],
                  ["Zona", selected.zona],
                  ["Fecha", new Date(selected.created_at || selected.fecha).toLocaleDateString('es-ES')],
                  ["Prioridad", selected.prioridad]
                ].map(([l, v]) => (
                  <div key={l as string} className="bg-gray-50/50 border border-gray-100 rounded-xl p-3">
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{l as string}</p>
                     <p className={`text-[11px] font-bold text-[#1e3a5f] truncate ${l==="Prioridad" && PRIORIDAD_BADGE[v as string]}`}>{v as string}</p>
              </div>
                ))}
             </div>

             <div className="mb-8">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Descripción</p>
                 <div className="bg-blue-50/20 border border-blue-50 rounded-2xl p-5 text-sm font-semibold text-slate-600 leading-relaxed italic break-words">
                   {selected.descripcion || selected.desc}
                 </div>
             </div>

             {selected.foto_url && (
               <div className="mb-8">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Foto Adjunta</p>
                 <img src={selected.foto_url} alt="Incidencia" className="rounded-2xl max-h-64 object-cover border border-gray-100 shadow-sm" />
               </div>
             )}

             <div className="mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3">Cambiar estado:</p>
                 <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    {[
                      ["resuelta", "Resuelta", "success"],
                      ["abierta", "Abierta", "danger"],
                      ["en_revision", "En Rev.", "primary"]
                    ].map(([v, l, varType]) => (
                      <Button 
                        key={v} 
                        text={l as string}
                        onClick={() => updateEstado(selected.id, v as string, notaTexto)}
                        variant={varType as any}
                        className="flex-1 py-2 text-xs sm:py-3 sm:text-sm shadow-xl"
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
               className="w-full py-2 text-xs sm:py-4 sm:text-sm shadow-xl shadow-blue-100"
             />
           </div>
         </Modal>
       )}
    </div>
  );
};

export default GestionIncidencias;
