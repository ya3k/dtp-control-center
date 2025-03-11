// useDestinationStore.ts
import { create } from "zustand";
import type { Destination, UpdateDestinationBody } from "@/types/destination";

interface DestinationState {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  currentQuery: string; // Lưu query dưới dạng chuỗi đơn giản
  fetchDestination: () => Promise<void>;
  setQuery: (query: string) => void;
  createDestination: (destination: Omit<Destination, "name" | "latitude" | "longitude">) => Promise<Destination>;
  updateDestination: (id: string, destinationData: Partial<UpdateDestinationBody>) => Promise<UpdateDestinationBody>;
  deleteDestination: (id: string) => Promise<void>;
}

export const useDestinationStore = create<DestinationState>((set, get) => ({
  destinations: [],
  loading: false,
  error: null,
  currentQuery: '',

  setQuery: (query: string) => set({ currentQuery: query }),

  fetchDestination: async () => {
    const query = get().currentQuery;
    set({ loading: true, error: null });
    try {
      const response = await fetch(`https://localhost:7171/api/destination${query ? '?' + query : ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch destinations: ${response.statusText}`);
      }

      const data = await response.json();
      set({ destinations: data.value || data, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
    }
  },

  createDestination: async (destinationData) => {
    set({ loading: true, error: null });
    console.log(JSON.stringify(destinationData));
    try {
      const response = await fetch("https://localhost:7171/api/destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...destinationData,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create destination");
      }
      const newDestination: Destination = await response.json();
      await get().fetchDestination();
      return newDestination;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create destination",
        loading: false,
      });
      throw error;
    }
  },

  updateDestination: async (id, destinationData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`https://localhost:7171/api/destination/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...destinationData,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update destination");
      }
      const updatedDestination: Destination = await response.json();
      set((state) => ({
        destinations: state.destinations.map((dest) =>
          dest.id === id ? updatedDestination : dest
        ),
        loading: false,
      }));
      return updatedDestination;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update destination",
        loading: false,
      });
      throw error;
    }
  },

  deleteDestination: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`https://localhost:7171/api/destination/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete destination");
      }
      await get().fetchDestination();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete destination",
        loading: false,
      });
      throw error;
    }
  },
}));