import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import Button from './Button';
import '../css/Dashboard.css';
import { supabase } from '../supabase/client';

interface FormData {
  nombre: string;
  email: string;
  rol: 'operario' | 'admin';
  password: string;
}

interface FormularioProps {
  onClose: () => void;
}

export default function Formulario({ onClose }: FormularioProps): React.JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    rol: 'operario',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      // primero creo el usuario en auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre

          }
        }
      });

      if (authError) throw authError;

      // si eligió admin, toca cambiarle el rol porque por defecto es operario
      if (formData.rol === 'admin' && authData.user) {

        // busco el id del rol admin
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id_rol')
          .eq('nombre', 'admin')
          .single();

        if (!roleError && roleData) {
          // le cambio el rol al usuario nuevo
          await supabase
            .from('usuarios')
            .update({ id_rol: roleData.id_rol })
            .eq('id_usuario', authData.user.id);
        }
      }

      alert("¡Trabajador registrado correctamente en el sistema!");
      onClose();

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error("Error registrando:", message);
      alert("Error al registrar: " + message);
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
              onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ana@hospital.com"
              className="input-admin"
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rol</label>
              <select
                className="input-admin"
                value={formData.rol}
                onChange={e => setFormData({ ...formData, rol: e.target.value as 'operario' | 'admin' })}
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
                onChange={e => setFormData({ ...formData, password: e.target.value })}
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