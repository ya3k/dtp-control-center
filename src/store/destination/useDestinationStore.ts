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
  createDestination: (destination: CreateDestinationBodyType) => Promise<void>;
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
      console.log("API Response:", response.payload); // Debugging
      set({ destinations: response.payload?.value || [], loading: false });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
    }
  },

  createDestination: async (destinationData) => {
    set({ loading: true, error: null });
    try {
      await destinationApiRequest.create(destinationData);
      await get().fetchDestination();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to create destination", loading: false });
      throw error;
    }
  },

  updateDestination: async (id, destinationData) => {
    set({ loading: true, error: null });
    try {
      const updatedDestination = await destinationApiRequest.update(id, {
        name: destinationData.name || '',
        latitude: destinationData.latitude || '',
        longitude: destinationData.longitude || '',
      });
      await get().fetchDestination();
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
