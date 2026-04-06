import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/Button';
import { Plus } from 'lucide-react';

const NIVEL_BADGE: Record<string, string> = { alto:"bg-red-100 text-red-700", medio:"bg-yellow-100 text-yellow-700", bajo:"bg-green-100 text-green-700" };

const GestionZonas: React.FC = () => {
  const [zonas, setZonas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showZonaModal, setShowZonaModal] = useState(false);
  const [editZona, setEditZona] = useState<any>(null);
  const [zonaForm, setZonaForm] = useState({ nombre:"", tipo:"Habitación", planta:1, metros:"", nivel:"bajo", estado:"Activo" });
  const [confirm, setConfirm] = useState("");

  const fetchZonas = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('zonas').select('*').order('nombre', { ascending: true });
    if (!error && data) setZonas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchZonas();
  }, []);

  const openEditZona = (z: any) => {
    setEditZona(z);
    setZonaForm({...z});
    setShowZonaModal(true);
  };
  
  const openNewZona = () => {
    setEditZona(null);
    setZonaForm({ nombre:"", tipo:"Habitación", planta:1, metros:"", nivel:"bajo", estado:"Activo" });
    setShowZonaModal(true);
  };

  const saveZona = async () => {
    if (!zonaForm.nombre) return;
    
    if (editZona) {
      const { error } = await supabase.from('zonas').update(zonaForm).eq('id', editZona.id);
      if (!error) {
        setZonas(prev => prev.map(z => z.id === editZona.id ? {...zonaForm, id:editZona.id} : z));
      }
    } else {
      const { data, error } = await supabase.from('zonas').insert([zonaForm]).select();
      if (!error && data) {
        setZonas(prev => [...prev, data[0]]);
      }
    }
    setShowZonaModal(false);
    setConfirm("Zona");
    setTimeout(() => setConfirm(""), 2500);
  };

  const deleteZona = async (id: number) => {
    if(!window.confirm('¿Seguro que deseas eliminar esta zona?')) return;
    await supabase.from('zonas').delete().eq('id', id);
    setZonas(prev => prev.filter(z => z.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestión de Zonas</h2>
          <p className="text-sm text-gray-500">Tienes {zonas.length} zonas registradas.</p>
        </div>
        <Button 
          text="Crear Zona" 
          onClick={openNewZona} 
          variant="primary" 
          icon={Plus} 
          className="px-4 py-2 shadow-sm"
        />
      </div>

      {confirm && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm font-semibold shadow-sm">✓ {confirm} guardada correctamente.</div>}

      {loading ? (
        <div className="p-6 text-gray-500 font-semibold mb-6">Cargando zonas...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {zonas.length === 0 && <div className="p-6 text-center text-gray-500 bg-white border border-dashed rounded-xl">No hay zonas.</div>}
          {zonas.map(z => (
            <div key={z.id} className="bg-white rounded-xl border shadow-sm p-4 flex justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <p className="font-bold text-gray-800 text-lg">{z.nombre}</p>
                <p className="text-sm text-gray-500">Planta {z.planta} · {z.metros} m² · {z.tipo}</p>
                <div className="flex gap-2 mt-2">
                  <Badge cls={NIVEL_BADGE[z.nivel] || "bg-gray-100 text-gray-700"} label={`Prioridad ${z.nivel}`} />
                  <Badge cls={z.estado === 'Activo' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} label={z.estado} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  text="Editar" 
                  onClick={() => openEditZona(z)} 
                  variant="secondary" 
                  className="px-3 py-1.5"
                />
                <Button 
                  text="🗑" 
                  onClick={() => deleteZona(z.id)} 
                  variant="danger" 
                  className="px-2.5 py-1.5"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showZonaModal && (
        <Modal title={editZona ? "EDITAR ZONA" : "CREAR ZONA"} onClose={() => setShowZonaModal(false)}>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre de la Zona</label>
            <input value={zonaForm.nombre} onChange={e => setZonaForm({...zonaForm, nombre:e.target.value})}
              placeholder="Ej: UCI - Quirófano 1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de zona</label>
              <select value={zonaForm.tipo} onChange={e => setZonaForm({...zonaForm, tipo:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {["Quirófano","Habitación","UCI","Pasillo","Consulta","Sala","Baño"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Planta</label>
              <input type="number" value={zonaForm.planta} onChange={e => setZonaForm({...zonaForm, planta:parseInt(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Metros cuadrados</label>
              <input type="number" value={zonaForm.metros} onChange={e => setZonaForm({...zonaForm, metros:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Prioridad / Nivel</label>
              <select value={zonaForm.nivel} onChange={e => setZonaForm({...zonaForm, nivel:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {["alto","medio","bajo"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button text="Cancelar" onClick={() => setShowZonaModal(false)} variant="secondary" className="flex-1 py-2.5" />
            <Button text="Guardar" onClick={saveZona} variant="primary" className="flex-1 py-2.5 shadow-sm" />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GestionZonas;
