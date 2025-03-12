// useDestinationStore.ts
import { create } from "zustand";
import type { CreateDestinationBodyType, DestinationType, UpdateDestinationBodyType } from "@/schemaValidations/admin-destination.schema";
import destinationApiRequest from "@/apiRequests/destination";

interface DestinationState {
  destinations: DestinationType[];
  loading: boolean;
  error: string | null;
  currentQuery: string;
  fetchDestination: () => Promise<void>;
  setQuery: (query: string) => void;
  createDestination: (destination: CreateDestinationBodyType) => Promise<CreateDestinationBodyType>;
  updateDestination: (id: string, destinationData: Partial<UpdateDestinationBodyType>) => Promise<DestinationType>;
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
      const response = await destinationApiRequest.getAll(query);
      set({ destinations: response.payload || [], loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
    }
  },

  createDestination: async (destinationData) => {
    set({ loading: true, error: null });
    try {
      const newDestination = await destinationApiRequest.create(destinationData);
      await get().fetchDestination();
      return newDestination.payload;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to create destination", loading: false });
      throw error;
    }
  },

  updateDestination: async (id, destinationData) => {
    set({ loading: true, error: null });
    try {
      const updatedDestination = await destinationApiRequest.update(id, destinationData);
      set((state) => ({
        destinations: state.destinations.map((dest) => (dest.id === id ? updatedDestination.payload : dest)),
        loading: false,
      }));
      return updatedDestination.payload;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update destination", loading: false });
      throw error;
    }
  },

  deleteDestination: async (id) => {
    set({ loading: true, error: null });
    try {
      await destinationApiRequest.delete(id);
      await get().fetchDestination();

    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to delete destination", loading: false });
      throw error;
    }
  },
}));
