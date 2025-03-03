import { create } from "zustand";
import type { Destination } from "@/types/destination";

interface DestinationState {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  fetchDestination: () => Promise<void>;
  createDestination: (
    destination: Omit<Destination, "id" | "createdAt" | "lastModified" | "isDeleted">
  ) => Promise<Destination>;
  updateDestination: (id: string, destinationData: Partial<Destination>) => Promise<Destination>;
  deleteDestination: (id: string) => Promise<void>;
}

export const useDestinationStore = create<DestinationState>((set, get) => ({
  destinations: [],
  loading: false,
  error: null,

  // Fetch all destinations from the backend
  fetchDestination: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "https://676bdfa5bc36a202bb860180.mockapi.io/api/v1/destinations"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch destinations");
      }
      const data = await response.json();
      set({ destinations: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch destinations",
        loading: false,
      });
      throw error;
    }
  },

  // Create a new destination using the backend API
  createDestination: async (destinationData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "https://676bdfa5bc36a202bb860180.mockapi.io/api/v1/destinations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...destinationData,
            createdAt: new Date().toISOString(),
            isDeleted: false,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create destination");
      }
      const newDestination: Destination = await response.json();
      set((state) => ({
        destinations: [...state.destinations, newDestination],
        loading: false,
      }));
      return newDestination;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create destination",
        loading: false,
      });
      throw error;
    }
  },

  // Update an existing destination using the backend API
  updateDestination: async (id, destinationData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `https://676bdfa5bc36a202bb860180.mockapi.io/api/v1/destinations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...destinationData,
            lastModified: new Date().toISOString(),
          }),
        }
      );
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

  // Delete a destination using the backend API
  deleteDestination: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `https://676bdfa5bc36a202bb860180.mockapi.io/api/v1/destinations/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete destination");
      }
      set((state) => ({
        destinations: state.destinations.filter((dest) => dest.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete destination",
        loading: false,
      });
      throw error;
    }
  },
}));
