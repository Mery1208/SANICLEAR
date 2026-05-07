import React, { useState } from 'react';
import { X, Save, Edit2, Camera, User } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';


interface UserData {
  nombre: string;
  email: string;
  rol: string;
  telefono: string;
  foto: string | null;
  entidad: string;
}

interface ProfileModalProps {
  onClose: () => void;
  userRole?: string;
}

export default function ProfileModal({ onClose, userRole = "Admin" }: ProfileModalProps): React.JSX.Element {
  const { usuario } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // inicializar con datos del usuario logueado o datos por defecto
  const [userData, setUserData] = useState<UserData>({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    rol: usuario?.rol || userRole,
    telefono: '',
    foto: null,
    entidad: usuario?.entidad || ''
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    alert("Perfil actualizado correctamente");
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setUserData({ ...userData, foto: fakeUrl });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content profile-modal">
        <div className="modal-header">
          <h3 className="mb-4">Mi Perfil</h3>
          <button onClick={onClose} className="btn-close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSave}>
          {/* foto */}
          <div className="profile-header-section">
            <div className="avatar-container">
              {userData.foto ? (
                <img src={userData.foto} alt="Perfil" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder"><User size={40} /></div>
              )}

              {isEditing && (
                <label className="camera-btn">
                  <Camera size={16} />
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="profile-info-header">
              <h2 className="mb-1">{userData.nombre}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`badge-role ${userData.rol.toLowerCase()}`}>{userData.rol}</span>
                {userData.rol.toLowerCase() !== 'superadmin' && userData.entidad && (
                  <span className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    🏥 {userData.entidad}
                  </span>
                )}
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* campos del formulario */}
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={userData.nombre}
              disabled={!isEditing}
              className={`input-admin transition-colors dark:bg-white dark:disabled:bg-white dark:text-slate-900 dark:disabled:text-slate-900 ${!isEditing ? 'readonly cursor-not-allowed opacity-90' : ''}`}
              onChange={e => setUserData({ ...userData, nombre: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={userData.email}
              disabled={!isEditing}
              className={`input-admin transition-colors dark:bg-white dark:disabled:bg-white dark:text-slate-900 dark:disabled:text-slate-900 ${!isEditing ? 'readonly cursor-not-allowed opacity-90' : ''}`}
              onChange={e => setUserData({ ...userData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={userData.telefono}
              disabled={!isEditing}
              className={`input-admin transition-colors dark:bg-white dark:disabled:bg-white dark:text-slate-900 dark:disabled:text-slate-900 ${!isEditing ? 'readonly cursor-not-allowed opacity-90' : ''}`}
              onChange={e => setUserData({ ...userData, telefono: e.target.value })}
            />
          </div>

          {userData.rol.toLowerCase() !== 'superadmin' && (
            <div className="form-group">
              <label>Entidad / Hospital Asignado</label>
              <input
                type="text"
                value={userData.entidad}
                disabled
                readOnly
                className="input-admin cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 opacity-80 transition-colors"
                title="La entidad asignada no se puede modificar"
              />
            </div>
          )}

          {/* botones */}
          <div className="modal-footer">
            {!isEditing ? (
              // boton editar
              <Button
                text="Editar Perfil"
                onClick={() => setIsEditing(true)}
                icon={Edit2}
                style={{ backgroundColor: '#f59e0b', color: 'white' }}
              />
            ) : (
              <>
                <Button
                  text="Cancelar"
                  onClick={() => setIsEditing(false)}
                  variant="secondary"
                  style={{ marginRight: '10px' }}
                />
                <Button
                  text="Guardar Cambios"
                  type="submit"
                  variant="primary"
                  icon={Save}
                />
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}