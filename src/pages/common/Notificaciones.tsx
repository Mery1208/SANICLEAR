import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { Bell, AlertTriangle, Info, ShieldAlert, CheckCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

// Import mock
const mockNotificaciones = [
  { id: 1, titulo: "SIMULACRO INCENDIO", msg: "Mañana a las 10h.", tipo: "urgente", dest: "todos", leida: false, fecha: new Date().toISOString() },
  { id: 2, titulo: "Mantenimiento", msg: "Ascensor B fuera de servicio.", tipo: "importante", dest: "todos", leida: false, fecha: new Date().toISOString() }
];

interface Notificacion {
  id: number;
  titulo: string;
  msg: string;
  tipo: 'urgente' | 'importante' | 'informativa';
  dest: string;
  leida: boolean;
  fecha: string;
}

const TIPO_BADGE: Record<string, string> = { 
  urgente: "bg-red-100 text-red-700", 
  importante: "bg-orange-100 text-orange-700", 
  informativa: "bg-blue-100 text-blue-700" 
};

const tipoIcon: Record<string, React.ReactNode> = { 
  urgente: <ShieldAlert size={16} className="text-red-500" />, 
  importante: <Bell size={16} className="text-orange-500" />, 
  informativa: <CheckCircle size={16} className="text-blue-500" /> 
};

const Notificaciones: React.FC = () => {
  const { usuario, rol } = useAuth();
  const isAdmin = rol === 'admin';
  const [notif, setNotif] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const noLeidas = notif.filter(n => !n.leida).length;
  const urgentes  = notif.filter(n => n.tipo === "urgente").length;
  const importantes = notif.filter(n => n.tipo === "importante").length;
  const informativas = notif.filter(n => n.tipo === "informativa").length;
  
  // Admin form
  const [showForm, setShowForm] = useState(false);
  const [newNotif, setNewNotif] = useState({ tipo:"informativa", dest:"todos", titulo:"", mensaje:"" });
  const [ok, setOk] = useState(false);

  const fetchNotificaciones = async () => {
    setLoading(true);
    let query = supabase.from('notificaciones').select('*').order('fecha', { ascending: false });
    
    // Si no es admin, quizás solo ve las suyas y las de 'todos'
    if (!isAdmin) {
      // Simplificado: traemos las relevantes
      // asumiendo dest es 'todos' o su email/nombre
      query = query.or(`dest.eq.todos,dest.eq.${usuario?.nombre} ${usuario?.apellidos}`);
    }

    const { data, error } = await query;
    if (data && data.length > 0) {
      setNotif(data as Notificacion[]);
    } else {
      setNotif(mockNotificaciones as any[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotificaciones();
  }, [isAdmin, usuario]);

  const marcarLeida = async (id: number) => {
    // Si ya está leida, ignoramos
    const n = notif.find(x => x.id === id);
    if (n?.leida) return;

    // Actualizar locamente para UI rapida
    setNotif(prev => prev.map(n => n.id === id ? {...n, leida:true} : n));
    // Actualizar en DB
    await supabase.from('notificaciones').update({ leida: true }).eq('id', id);
  };

  const marcarTodas = async () => {
    setNotif(prev => prev.map(n => ({...n, leida:true})));
    // Depende del schema, actualizar todas puede requerir query masiva
    const ids = notif.filter(n => !n.leida).map(n => n.id);
    if (ids.length > 0) {
      await supabase.from('notificaciones').update({ leida: true }).in('id', ids);
    }
  };

  const sendNotif = async () => {
    if (!newNotif.titulo || !newNotif.mensaje) return;
    
    const insertData = {
      titulo: newNotif.titulo,
      msg: newNotif.mensaje,
      tipo: newNotif.tipo,
      dest: newNotif.dest,
      leida: false,
      fecha: new Date().toISOString()
    };

    const { data, error } = await supabase.from('notificaciones').insert([insertData]).select();
    if (!error && data) {
      setNotif(prev => [data[0] as Notificacion, ...prev]);
      setShowForm(false);
      setNewNotif({ tipo:"informativa", dest:"todos", titulo:"", mensaje:"" });
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } else {
      console.error(error);
    }
  };

  if (loading) return <div className="text-gray-500 p-6 font-semibold">Cargando notificaciones...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">NOTIFICACIONES</h2>
          <p className="text-sm text-gray-500">{noLeidas > 0 ? `Tienes ${noLeidas} notificaciones sin leer.` : "Todo al día."}</p>
        </div>
        <div className="flex gap-2">
          {noLeidas > 0 && <button onClick={marcarTodas} className="text-xs text-blue-600 hover:underline">Marcar todas como leídas</button>}
          {isAdmin && <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">+ Crear Notificación</button>}
        </div>
      </div>

      {ok && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm font-semibold">✓ Notificación enviada correctamente.</div>}

      {/* Counters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="border border-red-200 bg-red-50 rounded-lg px-4 py-2 flex items-center gap-2 text-red-700 text-sm"><span className="font-bold">{urgentes}</span> Urgentes</div>
        <div className="border border-orange-200 bg-orange-50 rounded-lg px-4 py-2 flex items-center gap-2 text-orange-700 text-sm"><span className="font-bold">{importantes}</span> Importantes</div>
        <div className="border border-blue-200 bg-blue-50 rounded-lg px-4 py-2 flex items-center gap-2 text-blue-700 text-sm"><span className="font-bold">{informativas}</span> Informativas</div>
      </div>

      {/* Admin table view */}
      {isAdmin ? (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Título","Destinatario","Fecha","Tipo"].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {notif.length === 0 && (
                 <tr><td colSpan={4} className="p-4 text-center text-gray-500">No hay notificaciones.</td></tr>
              )}
              {notif.map(n => (
                <tr key={n.id} className="border-b last:border-0 hover:bg-gray-50 cursor-pointer" onClick={() => marcarLeida(n.id)}>
                  <td className={`px-4 py-3 font-medium text-gray-800 ${!n.leida ? "font-bold" : ""}`}>{n.titulo}</td>
                  <td className="px-4 py-3 text-gray-500">{n.dest}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(n.fecha).toLocaleString('es-ES')}</td>
                  <td className="px-4 py-3">
                    <Badge cls={TIPO_BADGE[n.tipo]} label={n.tipo.charAt(0).toUpperCase()+n.tipo.slice(1)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notif.length === 0 && (
             <div className="p-6 text-center text-gray-500 bg-white rounded-xl border border-dashed">No tienes notificaciones recientes.</div>
          )}
          {notif.map(n => (
            <div key={n.id} onClick={() => marcarLeida(n.id)} className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-shadow ${!n.leida ? "border-l-4 border-l-blue-500" : ""}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-gray-800 text-sm">{tipoIcon[n.tipo]} {n.titulo}</span>
                {!n.leida && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>}
              </div>
              <p className="text-gray-500 text-xs mb-2">{n.msg}</p>
              <p className="text-gray-400 text-xs">{new Date(n.fecha).toLocaleString('es-ES')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create notification modal */}
      {showForm && (
        <Modal title="CREAR NOTIFICACIÓN" onClose={() => setShowForm(false)}>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo</label>
            <div className="flex gap-2">
              {["urgente","importante","informativa"].map(t => (
                <button key={t} onClick={() => setNewNotif({...newNotif, tipo:t})}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border capitalize transition-colors ${newNotif.tipo===t ? "bg-blue-600 text-white border-blue-600":"border-gray-300 text-gray-600"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Destinatarios</label>
            <div className="flex gap-2">
              {["todos","turno_mañana","turno_tarde"].map(d => (
                <button key={d} onClick={() => setNewNotif({...newNotif, dest:d})}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${newNotif.dest===d ? "bg-blue-600 text-white border-blue-600":"border-gray-300 text-gray-600"}`}>
                  {d === "todos" ? "Todos los Operarios" : d === "turno_mañana" ? "Turno Mañana" : "Turno Tarde"}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Título</label>
            <input value={newNotif.titulo} onChange={e => setNewNotif({...newNotif, titulo:e.target.value})}
              placeholder="Ej: Cambio de protocolo en UCI"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Mensaje</label>
            <textarea value={newNotif.mensaje} onChange={e => setNewNotif({...newNotif, mensaje:e.target.value})}
              rows={3} placeholder="Escribe el mensaje..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">Cancelar</button>
            <button onClick={sendNotif} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700">Enviar Notificación</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Notificaciones;
