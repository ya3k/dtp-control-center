import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useLoadingScreenStore = create<LoadingState>((set) => ({
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));


