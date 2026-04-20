import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Usuario {
  id: string;
  nombre: string;
  apellidos?: string;
  email: string;
  rol: 'superadmin' | 'admin' | 'operario';
  turno?: string;
}

interface AuthState {
  usuario: Usuario | null;
  session: any | null;
  setUsuario: (usuario: Usuario | null) => void;
  setSession: (session: any | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      session: null,
      setUsuario: (usuario) => set({ usuario }),
      setSession: (session) => set({ session }),
      logout: () => set({ usuario: null, session: null }),
    }),
    {
      name: 'saniclear-auth-storage', // nombre de la clave en localStorage
    }
  )
);
