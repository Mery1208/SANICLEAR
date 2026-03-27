import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const ESTADO_BADGE: Record<string, string> = { 
  hecha:"bg-green-100 text-green-700", 
  pendiente:"bg-yellow-100 text-yellow-700", 
  en_curso:"bg-blue-100 text-blue-700", 
  abierta:"bg-red-100 text-red-700", 
  en_revision:"bg-orange-100 text-orange-700", 
  resuelta:"bg-green-100 text-green-700" 
};

const PRIORIDAD_BADGE: Record<string, string> = { 
  alta:"bg-red-100 text-red-700", 
  media:"bg-yellow-100 text-yellow-700", 
  baja:"bg-green-100 text-green-700" 
};

const GestionIncidencias: React.FC = () => {
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<any>(null);
  const [notaTexto, setNotaTexto] = useState("");
  const [ok, setOk] = useState("");

  const fetchIncidencias = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('incidencias').select('*').order('fecha', { ascending: false });
    if (!error && data) setIncidencias(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidencias();
  }, []);

  const abiertas    = incidencias.filter(i => i.estado === "abierta").length;
  const resueltas   = incidencias.filter(i => i.estado === "resuelta").length;
  const en_revision = incidencias.filter(i => i.estado === "en_revision").length;
  const total       = incidencias.length;

  const updateEstado = async (id: number, estado: string, notas: string) => {
    const { error } = await supabase.from('incidencias').update({ estado, notas }).eq('id', id);
    if (!error) {
      setIncidencias(prev => prev.map(i => i.id === id ? {...i, estado, notas} : i));
      setSelected(null);
      setOk("estado");
      setTimeout(() => setOk(""), 2500);
    } else {
      console.error(error);
      alert('Error updating status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestión de Incidencias</h2>
          <p className="text-sm text-gray-500">Revisa, asigna y resuelve reportes. Filtra por tipo o estado.</p>
        </div>
      </div>

      {ok && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm font-semibold shadow-sm">
        ✓ Estado actualizado correctamente.
      </div>}

      {/* Counters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          ["Abierta", abiertas, "bg-red-50 border-red-200 text-red-700"],
          ["Resuelta", resueltas, "bg-green-50 border-green-200 text-green-700"],
          ["En Revisión", en_revision, "bg-orange-50 border-orange-200 text-orange-700"],
          ["Total", total, "bg-blue-50 border-blue-200 text-blue-700"]
        ].map(([l,v,cls]) => (
          <div key={l as string} className={`border rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm ${cls}`}>
            <span className="font-bold text-xl">{v as number}</span>
            <span className="text-sm font-medium">{l as string}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="p-6 text-gray-500 font-semibold mb-6">Cargando incidencias...</div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{["#","Título","Tipo","Zona","Operario","Prioridad","Estado","Fecha",""].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody>
              {incidencias.length === 0 && <tr><td colSpan={9} className="p-4 text-center text-gray-500">No hay incidencias reportadas.</td></tr>}
              {incidencias.map(i => (
                <tr key={i.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs text-left">#{i.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 text-left">{i.titulo}</td>
                  <td className="px-4 py-3 text-gray-600 text-left">{i.tipo}</td>
                  <td className="px-4 py-3 text-gray-600 text-left">{i.zona}</td>
                  <td className="px-4 py-3 text-gray-600 text-left">{i.operario}</td>
                  <td className="px-4 py-3 text-left"><Badge cls={PRIORIDAD_BADGE[i.prioridad] || "bg-gray-100 text-gray-700"} label={(i.prioridad || "media").charAt(0).toUpperCase()+(i.prioridad || "media").slice(1)} /></td>
                  <td className="px-4 py-3 text-left"><Badge cls={ESTADO_BADGE[i.estado] || "bg-gray-100 text-gray-700"} label={(i.estado || "abierta").replace("_"," ")} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs text-left">{new Date(i.fecha).toLocaleString('es-ES')}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setSelected(i); setNotaTexto(i.notas || ""); }} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Modal title="VER INCIDENCIA" onClose={() => setSelected(null)}>
          <div className="flex gap-4 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div><p className="text-xs text-gray-400 uppercase font-semibold">Operario</p><p className="text-sm font-semibold text-gray-800">{selected.operario}</p></div>
            <div><p className="text-xs text-gray-400 uppercase font-semibold">Zona</p><p className="text-sm font-semibold text-gray-800">{selected.zona}</p></div>
            <div><p className="text-xs text-gray-400 uppercase font-semibold">Prioridad</p><Badge cls={PRIORIDAD_BADGE[selected.prioridad] || "bg-gray-100 text-gray-700"} label={selected.prioridad} /></div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-semibold mb-1 uppercase">Descripción</p>
            <p className="text-sm text-gray-700 bg-white border rounded-lg p-3">{selected.desc}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Cambiar estado rápido:</p>
            <div className="flex gap-2">
              {[["resuelta","Resolver","bg-green-500 hover:bg-green-600"],["abierta","Re-abrir","bg-red-500 hover:bg-red-600"],["en_revision","En Revisión","bg-orange-500 hover:bg-orange-600"]].map(([v, l, bg]) => (
                <button key={v} onClick={() => updateEstado(selected.id, v, notaTexto)}
                  className={`flex-1 ${bg} text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-sm`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase">Comentarios / Notas (Visible por admin y operario)</p>
            <textarea value={notaTexto} onChange={e => setNotaTexto(e.target.value)} rows={3}
              placeholder="Escribe cómo se resolvió la incidencia..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <button onClick={() => updateEstado(selected.id, selected.estado, notaTexto)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            Guardar cambios
          </button>
        </Modal>
      )}
    </div>
  );
};

export default GestionIncidencias;
