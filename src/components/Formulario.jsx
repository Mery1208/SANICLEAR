import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import Button from './Button'; 
import '../css/Dashboard.css';
import { supabase } from '../supabase/client'; // Importamos el cliente

export default function Formulario({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'operario', // Valor por defecto del select
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. CREAR USUARIO EN AUTH
      // Enviamos el 'nombre' en los metadatos para que el Trigger SQL lo capture
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre
            // No enviamos el rol aquí porque el trigger SQL lo fuerza a 'operario' por seguridad inicial
          }
        }
      });

      if (authError) throw authError;

      // 2. ACTUALIZAR ROL (Solo si se eligió 'admin')
      // Como el trigger crea al usuario como 'operario' por defecto, 
      // si elegimos 'admin', tenemos que actualizarlo manualmente ahora.
      if (formData.rol === 'admin' && authData.user) {
        
        // A) Buscamos cuál es el ID del rol 'admin'
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id_rol')
          .eq('nombre', 'admin')
          .single();

        if (!roleError && roleData) {
          // B) Actualizamos al usuario recién creado
          await supabase
            .from('usuarios')
            .update({ id_rol: roleData.id_rol })
            .eq('id_usuario', authData.user.id);
        }
      }

      alert("¡Trabajador registrado correctamente en el sistema!");
      onClose(); // Cerramos el modal

    } catch (error) {
      console.error("Error registrando:", error.message);
      alert("Error al registrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nuevo Trabajador</h3>
          <button onClick={onClose} className="btn-close"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              placeholder="Ej: Ana García" 
              className="input-admin"
              onChange={e => setFormData({...formData, nombre: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ana@hospital.com" 
              className="input-admin"
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rol</label>
              <select 
                className="input-admin"
                value={formData.rol}
                onChange={e => setFormData({...formData, rol: e.target.value})}
              >
                <option value="operario">Operario Limpieza</option>
                <option value="admin">Supervisor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contraseña Temp.</label>
              <input 
                type="password" 
                placeholder="******" 
                className="input-admin"
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button 
              text="Cancelar" 
              onClick={onClose} 
              variant="secondary" 
              style={{ marginRight: '10px' }}
              disabled={loading}
            />
            <Button 
              text={loading ? "Guardando..." : "Guardar Ficha"} 
              type="submit" 
              variant="primary" 
              icon={Save} 
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}