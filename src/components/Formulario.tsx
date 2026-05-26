import React, { useState } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import Button from './Button';
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault()
  setLoading(true)
  try {
    const { data, error } = await supabase.functions.invoke('crear-usuario', {
      body: {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        rol: formData.rol,
        turno: 'Mañana',
        entidad_id: null
      }
    })

    if (error || data?.error) throw new Error(data?.error || error?.message)

    alert('¡Trabajador registrado correctamente!')
    onClose()
  } catch (error: unknown) {
    alert('Error al registrar: ' + (error instanceof Error ? error.message : 'Error desconocido'))
  } finally {
    setLoading(false)
  }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="mb-4">Nuevo Trabajador</h3>
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
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mín. 8 caracteres, mayús, minús, número y símbolo"
                  className="input-admin"
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#]).{8,}$"
                  title="Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                  style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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