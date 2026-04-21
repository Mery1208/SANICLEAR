import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { useAuthStore } from '../store/authStore';

export interface Usuario {
  id: string;
  nombre: string;
  apellidos?: string;
  email: string;
  rol: 'superadmin' | 'admin' | 'operario';
  turno?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  rol: 'superadmin' | 'admin' | 'operario' | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Usuario[] = [
  { id: 'superadmin-1', nombre: 'Super', apellidos: 'Admin', email: 'superadmin@saniclears.com', rol: 'superadmin' },
  { id: 'admin-1', nombre: 'Admin', apellidos: 'Saniclears', email: 'admin@saniclears.com', rol: 'admin' },
  { id: 'oper-1', nombre: 'Juan', apellidos: 'Pérez García', email: 'juan.perez@saniclears.com', rol: 'operario', turno: 'Mañana' },
  { id: 'oper-2', nombre: 'María', apellidos: 'Ceballos Mesías', email: 'maria.ceballos@saniclears.com', rol: 'operario', turno: 'Tarde' },
  { id: 'oper-3', nombre: 'Evelia', apellidos: 'Gil Paredes', email: 'evelia.gil@saniclears.com', rol: 'operario', turno: 'Noche' },
  { id: 'oper-4', nombre: 'Carlos', apellidos: 'Fernández', email: 'carlos.f@saniclears.com', rol: 'operario', turno: 'Mañana' },
  { id: 'oper-5', nombre: 'Ana', apellidos: 'Martínez', email: 'ana.martinez@saniclears.com', rol: 'operario', turno: 'Tarde' },
];

const MOCK_PASSWORDS: Record<string, string> = {
  'superadmin@saniclears.com': 'SuperAdmin1234!',
  'admin@saniclears.com': 'Admin1234!',
  'juan.perez@saniclears.com': 'Operario123!',
  'maria.ceballos@saniclears.com': 'Operario123!',
  'evelia.gil@saniclears.com': 'Operario123!',
  'carlos.f@saniclears.com': 'Operario123!',
  'ana.martinez@saniclears.com': 'Operario123!',
};

function findMockUser(email: string, password: string): Usuario | null {
  const normalizedEmail = email.trim().toLowerCase();
  if (MOCK_PASSWORDS[normalizedEmail] === password) {
    return MOCK_USERS.find(u => u.email.toLowerCase() === normalizedEmail) || null;
  }
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, setUsuario, setSession, logout: clearStore } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = useAuthStore.getState();
    if (stored.usuario) {
      setLoading(false);
      return;
    }

    // 1. Obtener sesión inicial (con manejo de errores)
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        if (session) fetchProfile(session.user.id, session.user.email!);
        else setLoading(false);
      })
      .catch(() => {
        // Si Supabase Auth no está disponible, simplemente continuar sin sesión
        setLoading(false);
      });

    // 2. Escuchar cambios
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Forzamos redirección al perfil con la etiqueta de recuperación
        window.location.href = '/perfil?recovery=true';
      }

      setSession(session);
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUsuario(null);
        clearStore();
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (!error && data) {
        setUsuario(data as Usuario);
      } else {
        // Fallback: crear perfil en tabla 'usuarios' si no existe
        const rol = email.includes('superadmin') ? 'superadmin' : email.includes('admin') ? 'admin' : 'operario';
        const nombre = rol === 'superadmin' ? 'Superadmin' : rol === 'admin' ? 'Admin' : 'Operario';

        try {
          const { data: newUser } = await supabase
            .from('usuarios')
            .upsert({ id: uid, email, nombre, rol }, { onConflict: 'id' })
            .select()
            .maybeSingle();

          if (newUser) {
            setUsuario(newUser as Usuario);
          } else {
            setUsuario({ id: uid, email, nombre, rol });
          }
        } catch {
          setUsuario({ id: uid, email, nombre, rol });
        }
      }
    } catch {
      // Si la tabla 'usuarios' no existe, usar fallback mock
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (mockUser) {
        setUsuario(mockUser);
      } else {
        const rol = email.includes('superadmin') ? 'superadmin' : email.includes('admin') ? 'admin' : 'operario';
        setUsuario({ id: uid, email, nombre: rol === 'superadmin' ? 'Superadmin' : rol === 'admin' ? 'Admin' : 'Operario', rol });
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Email y contraseña son obligatorios');
    }

    // Intentar login con Supabase Auth primero
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (!error && data.user) {
        setSession(data.session);
        await fetchProfile(data.user.id, data.user.email!);
        return data.user;
      }

      if (error) {
        console.warn('Supabase Auth error, intentando fallback mock:', error.message);
      }
    } catch (supabaseError: unknown) {
      const msg = supabaseError instanceof Error ? supabaseError.message : String(supabaseError);
      console.warn('Supabase Auth exception, intentando fallback mock:', msg);
    }

    // Fallback: autenticación mock para desarrollo
    const mockUser = findMockUser(trimmedEmail, trimmedPassword);
    if (mockUser) {
      console.log('Login exitoso con credenciales mock:', mockUser.email);
      setUsuario(mockUser);
      return { id: mockUser.id, email: mockUser.email, user_metadata: { rol: mockUser.rol } };
    }

    // Si llegamos aquí, las credenciales son incorrectas
    throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/perfil?recovery=true`,
    });
    if (error) throw error;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignorar error si no hay sesión de Supabase
    }
    clearStore();
  };

  return (
    <AuthContext.Provider value={{ usuario, rol: usuario?.rol || null, loading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export default AuthContext;
