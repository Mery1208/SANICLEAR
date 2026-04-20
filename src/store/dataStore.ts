import { create } from 'zustand';
import { supabase } from '../supabase/client';

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
    try {
      const [nRes, iRes] = await Promise.all([
        supabase.from('notificaciones').select('*', { count: 'exact', head: true }).eq('leida', false),
        supabase.from('incidencias').select('*', { count: 'exact', head: true }).eq('estado', 'abierta')
      ]);

      if (nRes.error) {
        console.warn('notificaciones table error (ignorado):', nRes.error.message);
      }
      if (iRes.error) {
        console.warn('incidencias table error (ignorado):', iRes.error.message);
      }

      set({
        notifCount: nRes.count || 0,
        incidCount: iRes.count || 0
      });
    } catch (err) {
      console.warn('Error fetching counts (ignorado):', err);
      set({ notifCount: 0, incidCount: 0 });
    }
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
