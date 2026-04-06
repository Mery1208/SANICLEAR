import { create } from 'zustand';
import { supabase } from '../supabase/client';
import mockNotif from '../mock/notificaciones.json';
import mockIncid from '../mock/incidencias.json';

interface DataState {
  notifCount: number;
  incidCount: number;
  setNotifCount: (count: number) => void;
  setIncidCount: (count: number) => void;
  fetchCounts: () => Promise<void>;
  setupRealtime: () => () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  notifCount: 0,
  incidCount: 0,
  
  setNotifCount: (notifCount) => set({ notifCount }),
  setIncidCount: (incidCount) => set({ incidCount }),

  fetchCounts: async () => {
    // Calculamos counts de mocks como fallback
    const mockNotifCount = (mockNotif as any[]).filter((n: any) => !n.leida).length;
    const mockIncidCount = (mockIncid as any[]).filter((i: any) => i.estado === 'abierta').length;

    // Contar notificaciones no leídas
    const { count: nRef, error: nErr } = await supabase
      .from('notificaciones')
      .select('*', { count: 'exact', head: true })
      .eq('leida', false);
    
    // Contar incidencias abiertas
    const { count: iRef, error: iErr } = await supabase
      .from('incidencias')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'abierta');

    set({ 
      notifCount: (!nErr && nRef !== null && nRef > 0) ? nRef : mockNotifCount,
      incidCount: (!iErr && iRef !== null && iRef > 0) ? iRef : mockIncidCount
    });
  },

  setupRealtime: () => {
    const notifChannel = supabase
      .channel('notif-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notificaciones' }, () => {
        get().fetchCounts();
      })
      .subscribe();

    const incidChannel = supabase
      .channel('incid-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidencias' }, () => {
        get().fetchCounts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notifChannel);
      supabase.removeChannel(incidChannel);
    };
  }
}));
