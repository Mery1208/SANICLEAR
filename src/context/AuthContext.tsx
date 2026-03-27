import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

interface Usuario {
  id: string;
  nombre: string;
  apellidos?: string;
  email: string;
  rol: 'admin' | 'operario';
}

interface AuthContextType {
  usuario: Usuario | null;
  rol: 'admin' | 'operario' | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<Usuario | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // al montar, verificar sesión activa
  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await cargarUsuario(session.user.email || '');
      }
      setCargando(false);
    };

    verificarSesion();

    // escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await cargarUsuario(session.user.email || '');
      } else {
        setUsuario(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const cargarUsuario = async (email: string) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`*, roles(nombre)`)
      .eq('email', email)
      .single();

    if (!error && data) {
      const newUser: Usuario = {
        id: data.id,
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        rol: (data.roles?.nombre as 'admin' | 'operario') || 'operario',
      };
      setUsuario(newUser);
      return newUser;
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return await cargarUsuario(email);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      rol: usuario?.rol || null,
      cargando,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export default AuthContext;
