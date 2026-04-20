import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';
import { Bell, ShieldAlert, CheckCircle, Plus, Search } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/Button';

interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: 'urgente' | 'importante' | 'informativa';
  dest: string;
  leida: boolean;
  fecha: string;
  entidad_id?: string;
  entidades?: { nombre_hospital: string };
  usuario_id?: string;
  usuarios?: { nombre: string; apellidos: string };
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
  const isSuperadmin = rol === 'superadmin';
  const isAdmin = rol === 'admin' || isSuperadmin; // Superadmin hereda poderes de admin
  const [notif, setNotif] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [entidades, setEntidades] = useState<any[]>([]);
  const [filtroEntidad, setFiltroEntidad] = useState<string>('todas');

  // Stats
  const noLeidas = notif.filter(n => !n.leida).length;
  const urgentes  = notif.filter(n => n.tipo === "urgente").length;
  const importantes = notif.filter(n => n.tipo === "importante").length;
  const informativas = notif.filter(n => n.tipo === "informativa").length;
  
  // Admin form
  const [showForm, setShowForm] = useState(false);
  const [newNotif, setNewNotif] = useState({ tipo:"informativa", dest:"todos", titulo:"", mensaje:"", entidad_id: "todas" });
  const [ok, setOk] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotificaciones = async () => {
    setLoading(true);
    // Pedimos solo * para evitar errores 400 de Foreign Keys en Supabase
    let query = supabase.from('notificaciones').select('*').order('fecha', { ascending: false });
    
    if (isSuperadmin && filtroEntidad !== 'todas') {
      query = query.eq('entidad_id', filtroEntidad);
    } else if (!isAdmin) {
      query = query.or(`dest.eq.todos,dest.eq.${usuario?.nombre} ${usuario?.apellidos}`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error cargando notificaciones:", error.message);
    }
    setNotif((data || []) as Notificacion[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotificaciones();
  }, [isAdmin, isSuperadmin, usuario, filtroEntidad]);

  useEffect(() => {
    if (isSuperadmin) {
      supabase.from('entidades').select('id, nombre_hospital').then(({data}) => {
        if (data) setEntidades(data);
      });
    }
  }, [isSuperadmin]);

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
      mensaje: newNotif.mensaje,
      tipo: newNotif.tipo,
      dest: newNotif.dest,
      leida: false,
      fecha: new Date().toISOString(),
      entidad_id: isSuperadmin && newNotif.entidad_id !== 'todas' ? newNotif.entidad_id : null,
      usuario_id: usuario?.id
    };

    const { data, error } = await supabase.from('notificaciones').insert([insertData]).select();
    if (!error && data) {
      setNotif(prev => [data[0] as Notificacion, ...prev]);
      setShowForm(false);
      setNewNotif({ tipo:"informativa", dest:"todos", titulo:"", mensaje:"", entidad_id: "todas" });
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } else {
      console.error(error);
    }
  };

  const filteredNotif = notif.filter(n => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const hospitalName = entidades.find(e => e.id === n.entidad_id)?.nombre_hospital || 'Global';
    return n.titulo.toLowerCase().includes(s) ||
           hospitalName.toLowerCase().includes(s);
  });

  if (loading) return <div className="text-gray-500 p-6 font-semibold animate-pulse">Cargando notificaciones...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">Notificaciones</h2>
          <p className="text-gray-400 text-sm font-medium italic">{noLeidas > 0 ? `Tienes ${noLeidas} notificaciones sin leer.` : "Todo al día."}</p>
        </div>
        <div className="flex gap-4 items-center">
          {isAdmin && (
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título o emisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white w-64"
              />
            </div>
          )}
          {isSuperadmin && (
            <select 
              value={filtroEntidad} 
              onChange={(e) => setFiltroEntidad(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="todas">Global (Todas)</option>
              {entidades.map(e => <option key={e.id} value={e.id}>{e.nombre_hospital}</option>)}
            </select>
          )}
          {noLeidas > 0 && <button onClick={marcarTodas} className="text-xs text-blue-600 hover:underline font-bold">Marcar todas como leídas</button>}
          {isAdmin && (
            <Button 
              text="Crear Notificación" 
              onClick={() => setShowForm(true)} 
              variant="primary" 
              icon={Plus} 
              className="py-2 px-4 shadow-sm"
            />
          )}
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Título</th>
                {isSuperadmin && <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Entidad</th>}
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Emisor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Destinatario</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotif.length === 0 && (
                <tr><td colSpan={isSuperadmin ? 6 : 5} className="p-8 text-center text-gray-400 italic">No hay notificaciones que coincidan.</td></tr>
              )}
              {filteredNotif.map(n => (
                <tr key={n.id} className="border-b last:border-0 hover:bg-gray-50 cursor-pointer" onClick={() => marcarLeida(n.id)}>
                  <td className={`px-4 py-3 font-medium text-gray-800 ${!n.leida ? "font-bold" : ""}`}>{n.titulo}</td>
                  {isSuperadmin && (
                    <td className="px-4 py-3 text-gray-500 text-xs">{entidades.find(e => e.id === n.entidad_id)?.nombre_hospital || 'Global'}</td>
                  )}
                  <td className="px-4 py-3 text-gray-500 text-xs font-semibold">{n.usuarios ? `${n.usuarios.nombre} ${n.usuarios.apellidos || ''}` : 'Sistema'}</td>
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
          {filteredNotif.length === 0 && (
             <div className="p-6 text-center text-gray-500 bg-white rounded-xl border border-dashed">No tienes notificaciones recientes.</div>
          )}
          {filteredNotif.map(n => (
            <div key={n.id} onClick={() => marcarLeida(n.id)} className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-shadow ${!n.leida ? "border-l-4 border-l-blue-500" : ""}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-gray-800 text-sm">{tipoIcon[n.tipo]} {n.titulo}</span>
                {!n.leida && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>}
              </div>
              <p className="text-gray-500 text-xs mb-2">{n.mensaje}</p>
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
          {isSuperadmin && (
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Entidad Destino</label>
              <select value={newNotif.entidad_id} onChange={e => setNewNotif({...newNotif, entidad_id: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                <option value="todas">Todas (Aviso Global)</option>
                {entidades.map(e => <option key={e.id} value={e.id}>{e.nombre_hospital}</option>)}
              </select>
            </div>
          )}
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
          <div className="flex gap-4 mt-2">
            <Button text="Cancelar" onClick={() => setShowForm(false)} variant="secondary" className="flex-1 py-3" />
            <Button text="Enviar Notificación" onClick={sendNotif} variant="primary" className="flex-1 py-3 shadow-lg shadow-blue-100" />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Notificaciones;
