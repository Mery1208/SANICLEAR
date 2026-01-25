import React, { useState } from 'react';
import { X, Save, Edit2, Camera, User } from 'lucide-react';
import Button from './Button'; // <-- Usamos tu botón reutilizable
import '../css/Dashboard.css';

export default function ProfileModal({ onClose, userRole = "Admin" }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Simulación de datos
  const [userData, setUserData] = useState({
    nombre: 'Paco Mera',
    email: 'paco.mera@hospital.com',
    rol: userRole,
    telefono: '600 123 456',
    foto: null
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert("Perfil actualizado correctamente");
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setUserData({ ...userData, foto: fakeUrl });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content profile-modal">
        <div className="modal-header">
          <h3>Mi Perfil</h3>
          <button onClick={onClose} className="btn-close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSave}>
          {/* FOTO DE PERFIL */}
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
              <h2>{userData.nombre}</h2>
              <span className={`badge-role ${userData.rol.toLowerCase()}`}>{userData.rol}</span>
            </div>
          </div>

          <hr className="divider" />

          {/* CAMPOS */}
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              value={userData.nombre}
              disabled={!isEditing}
              className={`input-admin ${!isEditing ? 'readonly' : ''}`}
              onChange={e => setUserData({...userData, nombre: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={userData.email}
              disabled={!isEditing}
              className={`input-admin ${!isEditing ? 'readonly' : ''}`}
              onChange={e => setUserData({...userData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="tel" 
              value={userData.telefono}
              disabled={!isEditing}
              className={`input-admin ${!isEditing ? 'readonly' : ''}`}
              onChange={e => setUserData({...userData, telefono: e.target.value})}
            />
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="modal-footer">
            {!isEditing ? (
              // Botón para activar edición (Le pasamos estilo amarillo manual o creamos variante 'warning')
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