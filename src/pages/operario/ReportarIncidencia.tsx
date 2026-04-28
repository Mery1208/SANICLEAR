import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, MapPin, Clipboard, Send, CheckCircle, ArrowLeft, X, CheckCircle2, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const PRIORIDADES = [
  { value: "baja", label: "Baja", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  { value: "media", label: "Media", color: "text-orange-500", bg: "bg-orange-50 border-orange-200" },
  { value: "alta", label: "Alta", color: "text-red-500", bg: "bg-red-50 border-red-200" },
  { value: "critica", label: "Crítica", color: "text-red-800", bg: "bg-red-100 border-red-300" },
];

const ReportarIncidencia: React.FC = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ tipo:"", zona:"", descripcion:"", prioridad:"media", urgente:false });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5 MB');
        return;
      }
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFoto = () => {
    setFoto(null);
    setFotoPreview(null);
  };

  const handleSend = async () => {
    if (!form.tipo || !form.zona || !form.descripcion || !usuario) return;
    setLoading(true);

    let fotoUrl: string | null = null;

    // Subir foto si existe
    if (foto) {
      const fileExt = foto.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `incidencias/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(filePath, foto);

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(filePath);
        fotoUrl = urlData.publicUrl;
      }
    }

    const insertData = {
      titulo: `${form.tipo} - ${form.zona}`,
      tipo: form.tipo,
      zona: form.zona,
      operario: `${usuario.nombre} ${usuario.apellidos}`,
      usuario_id: usuario.id,
      prioridad: form.urgente ? "critica" : form.prioridad,
      estado: "abierta",
      descripcion: form.descripcion,
      foto_url: fotoUrl,
    };

    const { error } = await supabase.from('incidencias').insert([insertData]);

    setLoading(false);
    if (!error) {
      setOk(true);
      setTimeout(() => { 
        setOk(false); 
        setForm({ tipo:"", zona:"", descripcion:"", prioridad:"media", urgente:false });
        setFoto(null);
        setFotoPreview(null);
      }, 4000);
    } else {
      console.error(error);
      alert('Error al enviar la incidencia.');
    }
  };

  const tipos = ["Equipo","Material","Acceso","Zona","Otros"];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 font-sans">
          <div className="flex justify-between items-center mb-2">
             <div>
                <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Gestión de Incidencias</h2>
                <p className="text-gray-400 text-sm font-medium italic">Reporta cualquier anomalía en tiempo real</p>
             </div>
             <button onClick={() => navigate('/operario')} className="text-gray-300 hover:text-gray-500 transition-colors">
                <X size={28} strokeWidth={1.5} />
             </button>
          </div>

      {ok && (
        <div className="fixed inset-0 bg-[#1e3a5f]/20 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] p-10 flex flex-col items-center gap-4 text-center shadow-2xl border border-white">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                 <CheckCircle2 size={40} />
              </div>
              <div>
                 <h4 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight">¡Enviado con éxito!</h4>
                 <p className="text-sm text-gray-400 font-semibold mt-1">El supervisor ha sido notificado</p>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 max-w-4xl mx-auto">
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Incidencia</label>
               <select value={form.tipo} onChange={e => setForm({...form, tipo:e.target.value})}
                 className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-6 py-4 text-sm font-bold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all appearance-none cursor-pointer">
                 <option value="">Seleccionar...</option>
                 {tipos.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zona</label>
               <input value={form.zona} onChange={e => setForm({...form, zona:e.target.value})}
                 placeholder="Ej: UCI - Planta 2"
                 className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-6 py-4 text-sm font-bold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
               <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion:e.target.value})}
                 rows={6} placeholder="Describe el problema..."
                 className="w-full border border-blue-50 rounded-2xl bg-gray-50/50 px-6 py-4 text-sm font-bold text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-none" />
            </div>

             <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prioridad</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2">
                   {PRIORIDADES.map(p => (
                     <button key={p.value} type="button"
                       onClick={() => !form.urgente && setForm({...form, prioridad: p.value})}
                       disabled={form.urgente}
                       className={`px-3 py-2 text-xs sm:px-3 sm:py-2 sm:text-xs rounded-lg sm:rounded-xl border font-bold uppercase tracking-wider transition-all ${form.urgente && p.value === 'critica' ? `${p.bg} ${p.color} ring-2 ring-red-200` : form.prioridad === p.value ? `${p.bg} ${p.color} ring-2 ring-blue-100` : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:bg-gray-100'} ${form.urgente && p.value !== 'critica' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                       {p.label}
                     </button>
                   ))}
                </div>
                {form.urgente && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1">Prioridad fijada a Crítica por marcado como urgente</p>}
             </div>

            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-3 bg-red-50/30 p-4 rounded-2xl cursor-pointer hover:bg-red-50/50 transition-colors" onClick={() => setForm({...form, urgente: !form.urgente, prioridad: !form.urgente ? 'critica' : form.prioridad})}>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.urgente ? "bg-red-500 border-red-500 shadow-lg shadow-red-200" : "border-red-200"}`}>
                     {form.urgente && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <label className="text-xs text-red-700 font-black uppercase tracking-wider cursor-pointer">Marcar como URGENTE</label>
               </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adjuntar Foto</label>
               {fotoPreview ? (
                 <div className="relative rounded-2xl overflow-hidden border border-blue-50 bg-gray-50/50">
                   <img src={fotoPreview} alt="Vista previa" className="w-full max-h-64 object-cover" />
                   <button type="button" onClick={removeFoto}
                     className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg">
                     <Trash2 size={16} />
                   </button>
                   <p className="text-[10px] text-gray-400 font-semibold px-4 py-2 truncate">{foto?.name}</p>
                 </div>
               ) : (
                 <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-blue-100 rounded-2xl p-8 cursor-pointer hover:bg-blue-50/20 hover:border-blue-200 transition-all">
                   <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400">
                     <Upload size={24} />
                   </div>
                   <div className="text-center">
                     <p className="text-xs font-bold text-[#1e3a5f]">Haz clic para subir una imagen</p>
                     <p className="text-[10px] text-gray-400 font-semibold mt-1">PNG, JPG o WEBP · Máx. 5 MB</p>
                   </div>
                   <input type="file" accept="image/*" capture="environment" onChange={handleFotoChange} className="hidden" />
                 </label>
               )}
            </div>

            <Button 
              onClick={handleSend}
              text={loading ? "Enviando..." : "Enviar Incidencia"} 
              type="submit" 
              variant="primary" 
              icon={Send} 
              disabled={loading || !form.tipo || !form.zona || !form.descripcion}
              className="w-full py-3.5 shadow-lg shadow-blue-100"
            />
        </div>
      </div>

    </div>
  );
};

export default ReportarIncidencia;
