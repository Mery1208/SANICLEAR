import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  RefreshCw,
  Plus,
  MapPin,
  Activity,
  ShieldCheck,
  Edit2,
  Trash2,
  Save,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../../supabase/client';
import Button from '../../components/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

interface Entidad {
  id: string;
  nombre_hospital: string;
  codigo: string;
  ciudad: string;
  plan_tipo: string;
  activa: boolean;
  max_usuarios: number;
}

const PanelControlEntidades: React.FC = () => {
  const navigate = useNavigate();
  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado del Modal
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Entidad | null>(null);
  const [form, setForm] = useState<Partial<Entidad>>({});
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, nombre: string } | null>(null);

  const fetchEntidades = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('entidades')
        .select('id, nombre_hospital, codigo, ciudad, plan_tipo, activa, max_usuarios')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      setEntidades((data || []) as Entidad[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudieron cargar las entidades.';
      setError(message);
      setEntidades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntidades();
  }, []);

  const handleGuardar = async () => {
    if (!form.nombre_hospital || !form.codigo) return;
    
    if (editando) {
      const { error } = await supabase.from('entidades').update(form).eq('id', editando.id);
      if (!error) setEntidades(prev => prev.map(e => e.id === editando.id ? { ...e, ...form } as Entidad : e));
    } else {
      const { data, error } = await supabase.from('entidades').insert([form]).select();
      if (!error && data) setEntidades(prev => [data[0] as Entidad, ...prev]);
    }
    setShowModal(false);
  };

  const handleEliminar = (id: string, nombre: string) => {
    setDeleteTarget({ id, nombre });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from('entidades').delete().eq('id', deleteTarget.id);
    if (!error) {
      setEntidades(prev => prev.filter(e => e.id !== deleteTarget.id));
    } else {
      alert('Error al eliminar: ' + error.message);
    }
    setDeleteTarget(null);
  };

  const abrirModal = (ent?: Entidad) => {
    setEditando(ent || null);
    setForm(ent ? { ...ent } : { nombre_hospital: '', codigo: '', ciudad: '', plan_tipo: 'basic', activa: true, max_usuarios: 50 });
    setShowModal(true);
  };

  const filteredEntidades = useMemo(() => {
    if (!searchTerm.trim()) return entidades;
    const q = searchTerm.toLowerCase();
    return entidades.filter(
      (e) =>
        e.nombre_hospital.toLowerCase().includes(q) ||
        e.codigo.toLowerCase().includes(q) ||
        (e.ciudad && e.ciudad.toLowerCase().includes(q))
    );
  }, [entidades, searchTerm]);

return (
    <div className="font-sans w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 w-full">
        <div className="text-left w-full md:w-auto">
          <h2 className="text-xl sm:text-2xl font-black text-[#1e3a5f] uppercase tracking-tight">
            Control entidades
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm font-medium italic">
            Listado maestro.
          </p>
        </div>
          
        <div className="flex flex-row items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all w-32 md:w-48"
            />
          </div>
          <button
            onClick={fetchEntidades}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Actualizar"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => abrirModal()}
            className="flex items-center justify-center gap-1 py-2 px-4 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer border-none bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus size={16} />
            <span>Nueva Entidad</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-6">
          <p className="font-bold mb-1">Error al cargar las entidades</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-gray-400 font-bold animate-pulse">
          Cargando entidades...
        </div>
      ) : filteredEntidades.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay entidades</h3>
          <p className="text-gray-500">No se ha encontrado ningún hospital o clínica con esos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredEntidades.map((entidad) => (
            <div key={entidad.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col group">
              <div className="flex justify-between items-start mb-5 gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-lg font-black text-[#1e3a5f] leading-tight truncate max-w-[140px] sm:max-w-[200px]">{entidad.nombre_hospital}</h3>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">{entidad.codigo}</p>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 shrink-0">
                  <button onClick={() => abrirModal(entidad)} className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-colors" title="Editar">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleEliminar(entidad.id, entidad.nombre_hospital)} className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-colors" title="Eliminar">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-6 bg-gray-50/50 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <MapPin size={14} /> Ubicación
                  </span>
                  <span className="text-sm font-semibold text-gray-700">{entidad.ciudad || 'No especificada'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 mt-auto">
                <Badge 
                  cls={entidad.activa ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'} 
                  label={entidad.activa ? 'Activa' : 'Inactiva'} 
                />
                <Badge 
                  cls={
                    entidad.plan_tipo === 'premium' ? 'bg-purple-50 text-purple-600 border-purple-200' : 
                    entidad.plan_tipo === 'basic' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                    'bg-gray-100 text-gray-500 border-gray-200'
                  } 
                  label={`Plan ${entidad.plan_tipo}`} 
                />
              </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-gray-50">
                <Button
                  text="Controlar"
                  variant="primary"
                  icon={ShieldCheck}
                  className="flex-1 py-2.5 shadow-sm shadow-blue-100"
                  onClick={() => navigate(`/superadmin/entidades/${entidad.id}`)}
                />
                <Button
                  text="Métricas"
                  variant="secondary"
                  icon={Activity}
                  className="flex-1 py-2.5"
                  onClick={() => navigate(`/superadmin/entidades/${entidad.id}/estadisticas`)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear/Editar Entidad */}
      {showModal && (
        <Modal title={editando ? "EDITAR ENTIDAD" : "NUEVA ENTIDAD"} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Hospital</label>
              <input value={form.nombre_hospital || ''} onChange={e => setForm({...form, nombre_hospital: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Ej: Hospital Central" />
            </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Código</label>
                <input value={form.codigo || ''} onChange={e => setForm({...form, codigo: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Ej: HC-01" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ciudad</label>
                <input value={form.ciudad || ''} onChange={e => setForm({...form, ciudad: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Ej: Madrid" />
              </div>
            </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plan</label>
                <select value={form.plan_tipo || 'basic'} onChange={e => setForm({...form, plan_tipo: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white">
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                <select value={form.activa ? 'true' : 'false'} onChange={e => setForm({...form, activa: e.target.value === 'true'})} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white">
                  <option value="true">Activa</option>
                  <option value="false">Inactiva</option>
                </select>
              </div>
            </div>
          </div>
          <Button text={editando ? "Guardar Cambios" : "Crear Entidad"} onClick={handleGuardar} variant="primary" icon={Save} className="w-full py-3" />
        </Modal>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deleteTarget && (
        <Modal title="⚠️ CONFIRMAR ELIMINACIÓN" onClose={() => setDeleteTarget(null)}>
          <div className="flex flex-col items-center justify-center text-center gap-4 py-2">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">¿Estás completamente seguro?</h3>
            <p className="text-sm text-gray-500 font-medium">
              Estás a punto de eliminar permanentemente la entidad <strong className="text-gray-800">"{deleteTarget.nombre}"</strong> y todos sus datos asociados.<br/><br/>Esta acción <strong className="text-red-500">NO</strong> se puede deshacer.
            </p>
            <div className="flex gap-3 w-full mt-6">
              <Button text="No, cancelar" onClick={() => setDeleteTarget(null)} variant="secondary" className="flex-1 py-3" />
              <Button text="Sí, eliminar entidad" onClick={confirmDelete} variant="danger" className="flex-1 py-3 shadow-lg shadow-red-100" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PanelControlEntidades;
