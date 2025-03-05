import { create } from "zustand";
import type { Destination } from "@/types/destination";

interface DestinationState {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  fetchDestination: () => Promise<void>;
  createDestination: (
    destination: Omit<Destination, "id" | "createdAt" | "lastModified">
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
      const response = await fetch("https://localhost:7171/api/destination");
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

  // Create a new destination
  createDestination: async (destinationData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("https://localhost:7171/api/destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...destinationData,
          createdAt: new Date().toISOString(),
          createdBy: "tao",
          isDeleted: false,
        }),
      });
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

  // Update an existing destination
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
          lastModified: new Date().toISOString(),
          lastModifiedBy: "tao",
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

  // Delete a destination
  deleteDestination: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`https://localhost:7171/api/destination/${id}`, {
        method: "DELETE",
      });
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
