import { create } from 'zustand';

interface BusquedaState {
  query: string;
  setQuery: (query: string) => void;
  clearQuery: () => void;
}

export const useBusquedaStore = create<BusquedaState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  clearQuery: () => set({ query: '' }),
}));
