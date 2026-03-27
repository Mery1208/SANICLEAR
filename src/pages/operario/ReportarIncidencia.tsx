import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { Camera } from 'lucide-react';

const ReportarIncidencia: React.FC = () => {
  const { usuario } = useAuth();
  const [form, setForm] = useState({ tipo:"", zona:"", descripcion:"", prioridad:"media", urgente:false });
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!form.tipo || !form.zona || !form.descripcion || !usuario) return;
    setLoading(true);

    const insertData = {
      titulo: `${form.tipo} - ${form.zona}`,
      tipo: form.tipo,
      zona: form.zona,
      operario: `${usuario.nombre} ${usuario.apellidos}`,
      operario_id: usuario.id,
      prioridad: form.prioridad,
      estado: "abierta",
      fecha: new Date().toISOString(),
      desc: form.descripcion,
      notas: ""
    };

    const { error } = await supabase.from('incidencias').insert([insertData]);

    setLoading(false);
    if (!error) {
      setOk(true);
      setTimeout(() => { 
        setOk(false); 
        setForm({ tipo:"", zona:"", descripcion:"", prioridad:"media", urgente:false }); 
      }, 3000);
    } else {
      console.error(error);
      alert('Error al enviar la incidencia.');
    }
  };

  const tipos = ["Equipo","Material","Acceso","Zona","Otros"];

  return (
    <div>
      <h2 className="text-xl font-bold text-red-600 mb-1">REPORTAR INCIDENCIAS</h2>
      <p className="text-gray-500 text-sm mb-5">Notifica al administrador cualquier problema, equipo averiado o situación anómala en tu zona.</p>

      {ok && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 font-semibold shadow-sm text-sm">✓ Incidencia enviada correctamente. El administrador ha sido notificado.</div>}

      <div className="bg-white rounded-xl border shadow-sm p-5 max-w-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidencia</label>
          <select value={form.tipo} onChange={e => setForm({...form, tipo:e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Seleccionar...</option>
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
          <input value={form.zona} onChange={e => setForm({...form, zona:e.target.value})}
            placeholder="Ej: UCI - Planta 2"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion:e.target.value})}
            rows={3} placeholder="Describe el problema..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
          <div className="flex gap-2">
            {["alta","media","baja"].map(p => (
              <button key={p} onClick={() => setForm({...form, prioridad:p})}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors capitalize ${form.prioridad===p ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" id="urgente" checked={form.urgente} onChange={e => setForm({...form, urgente:e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
          <label htmlFor="urgente" className="text-sm text-orange-700 font-medium">
            Marcar como URGENTE – requiere atención inmediata del supervisor
          </label>
        </div>

        <div className="mb-5 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-400 text-sm bg-gray-50 flex flex-col items-center">
          <Camera size={28} className="mb-1" />
          Haz clic o arrastra una foto aquí
        </div>

        <button onClick={handleSend} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-sm">
          {loading ? "Enviando..." : "Enviar Incidencia"}
        </button>
      </div>
    </div>
  );
};

export default ReportarIncidencia;
